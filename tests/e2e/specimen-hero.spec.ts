import { test, expect } from '@playwright/test';

test('full film is deferred until the watch button opens it', async ({ page }) => {
  const fullRequests: string[] = [];
  page.on('request', request => {
    if (request.url().endsWith('/video/zhen-wang-one-line.mp4')) fullRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('[data-specimen-hero]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('[data-play-film]')).toBeVisible();
  await expect(page.locator('.film-full')).not.toHaveAttribute('src', /.+/);
  expect(fullRequests).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('theater plays, traps focus, and restores the scrolled position on Escape', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-specimen-hero]')).toHaveAttribute('data-ready', 'true');
  await page.evaluate(() => window.scrollTo({ top: 160, behavior: 'instant' }));
  const trigger = page.locator('[data-play-film]');
  await trigger.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close film' })).toBeFocused();
  await expect.poll(() => page.locator('.film-full').evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('dialog')!.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(2);
  expect(await page.locator('.film-full').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('with reduced motion the film remains playable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-specimen-hero]')).toHaveAttribute('data-ready', 'true');
  await page.locator('[data-play-film]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close film' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('the first case title sits in the first desktop screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Desktop fold check (1440x900).');
  await page.goto('/');
  const bottom = await page.locator('.fcard-title').evaluate(el => el.getBoundingClientRect().bottom);
  expect(bottom).toBeLessThanOrEqual(900);
});

test('film ending offers a path to selected work', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-play-film]').click();
  const video = page.locator('.film-full');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThanOrEqual(2);
  await video.evaluate((v: HTMLVideoElement) => { v.currentTime = v.duration - 0.1; });
  await page.getByRole('button', { name: 'Explore selected work' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.fcard')).toBeInViewport();
  await expect(page.locator('#selected-work')).toBeFocused();
});
