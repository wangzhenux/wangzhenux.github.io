import { test, expect, type Page } from '@playwright/test';

async function videoEvents(page: Page) {
  return page.evaluate(() => {
    const data = (window as Window & { dataLayer?: ArrayLike<unknown>[] }).dataLayer ?? [];
    return data.map(entry => Array.from(entry))
      .filter(entry => entry[0] === 'event' && String(entry[1]).startsWith('video_'))
      .map(entry => ({ name: entry[1] as string, params: entry[2] as Record<string, unknown> }));
  });
}

test.beforeEach(async ({ page }) => {
  // Keep the real gtag queue but never send test traffic to Google Analytics.
  await page.route('https://www.googletagmanager.com/gtag/js**', route => route.fulfill({ body: '' }));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
});

for (const [selector, source] of [['.film-frame', 'preview'], ['[data-play-film]', 'watch_button']]) {
  test(`film ${source}: distinguish opens from starts and ignore pause/resume`, async ({ page }) => {
    expect(await videoEvents(page)).toEqual([]);
    await page.locator(selector).click();
    await expect.poll(async () => (await videoEvents(page)).map(event => event.name))
      .toEqual(['video_open', 'video_start']);
    const events = await videoEvents(page);
    expect(events[0].params.video_source).toBe(source);
    expect(events[1].params.video_title).toBe('Zhen Wang — 10 years in 76 seconds');
    expect(events[1].params.video_duration).toBeGreaterThan(70);

    await page.locator('.film-full').evaluate(async (video: HTMLVideoElement) => {
      video.pause();
      await video.play();
    });
    await page.getByRole('button', { name: 'Close film' }).click();
    expect((await videoEvents(page)).filter(event => event.name === 'video_start')).toHaveLength(1);
    await page.locator(selector).click();
    await expect.poll(async () => (await videoEvents(page)).filter(event => event.name === 'video_start').length).toBe(2);
  });
}

test('real playback records each milestone and completion once; replay starts a new viewing', async ({ page }) => {
  await page.locator('[data-play-film]').click();
  await expect.poll(async () => (await videoEvents(page)).some(event => event.name === 'video_start')).toBe(true);
  await page.locator('.film-full').evaluate((video: HTMLVideoElement) => { video.playbackRate = 16; });
  await expect(page.getByRole('button', { name: 'Watch again' })).toBeVisible({ timeout: 20000 });
  const events = await videoEvents(page);
  expect(events.filter(event => event.name === 'video_progress').map(event => event.params.video_percent))
    .toEqual([10, 25, 50, 75]);
  expect(events.filter(event => event.name === 'video_complete')).toHaveLength(1);
  expect(events.at(-1)?.params.video_percent).toBe(100);
  await page.getByRole('button', { name: 'Watch again' }).click();
  await expect.poll(async () => (await videoEvents(page)).filter(event => event.name === 'video_start').length).toBe(2);
  expect((await videoEvents(page)).filter(event => event.name === 'video_start').at(-1)?.params.video_source).toBe('replay');
});

test('seeking forward does not invent missed viewing milestones', async ({ page }) => {
  await page.locator('[data-play-film]').click();
  await expect.poll(async () => (await videoEvents(page)).some(event => event.name === 'video_start')).toBe(true);
  await page.locator('.film-full').evaluate((video: HTMLVideoElement) => {
    video.playbackRate = 16;
    video.currentTime = video.duration * 0.9;
  });
  await expect(page.getByRole('button', { name: 'Watch again' })).toBeVisible();
  const events = await videoEvents(page);
  expect(events.filter(event => event.name === 'video_progress')).toEqual([]);
  expect(events.filter(event => event.name === 'video_complete')).toHaveLength(1);
});

test('the film still plays when analytics is unavailable', async ({ page }) => {
  await page.evaluate(() => { delete (window as Window & { gtag?: unknown }).gtag; });
  await page.locator('[data-play-film]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(() => page.locator('.film-full').evaluate((video: HTMLVideoElement) => video.currentTime)).toBeGreaterThan(0);
});
