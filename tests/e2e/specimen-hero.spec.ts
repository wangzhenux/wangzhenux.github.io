import { test, expect } from '@playwright/test';

test('full film is deferred; mobile keeps a static poster', async ({ page }, testInfo) => {
  const fullRequests: string[] = [];
  page.on('request', request => {
    if (request.url().endsWith('/video/zhen-wang-specimen.mp4')) fullRequests.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('[data-specimen-hero]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.film-poster')).toBeVisible();
  await expect(page.locator('.film-full')).not.toHaveAttribute('src', /.+/);
  expect(fullRequests).toEqual([]);
  if (testInfo.project.name === 'mobile') {
    await expect(page.locator('.film-teaser')).not.toHaveAttribute('src', /.+/);
    await expect(page.getByRole('button', { name: 'Pause preview' })).toBeHidden();
  }
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
  expect(await page.locator('.film-teaser').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.querySelector('dialog')!.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(2);
  expect(await page.locator('.film-full').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('reduced motion keeps the poster still and the film remains playable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-specimen-hero]')).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.film-teaser')).not.toHaveAttribute('src', /.+/);
  await expect(page.getByRole('button', { name: 'Pause preview' })).toBeHidden();
  expect(await page.locator('.film-shell').evaluate(el => getComputedStyle(el).transform)).toBe('none');
  await page.locator('[data-play-film]').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close film' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('overlay pause and resume stay independent from opening the film', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'Mobile uses a static poster.');
  await page.goto('/');
  await page.getByRole('button', { name: 'Pause preview', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Resume preview', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('.film-full')).not.toHaveAttribute('src', /.+/);
  await page.locator('.writing').scrollIntoViewIfNeeded();
  await page.locator('.film-frame').scrollIntoViewIfNeeded();
  expect(await page.locator('.film-teaser').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.getByRole('button', { name: 'Resume preview', exact: true }).press('Enter');
  await expect.poll(() => page.locator('.film-teaser').evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('link', { name: 'Play my story — 1 minute 16 seconds' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
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
