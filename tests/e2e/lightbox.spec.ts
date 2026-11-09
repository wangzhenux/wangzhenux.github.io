import { test, expect } from '@playwright/test';

test('lightbox opens on an image the zoom enlarges and closes on Esc', async ({ page }) => {
  // The gallery's small tiles open bigger at both test sizes.
  await page.goto('/off-screen/');
  await page.locator('[data-zoom="on"] img').first().click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.lightbox-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('opening and closing with the mouse draws no focus ring', async ({ page }) => {
  // The ring is for keyboard users. Safari would draw it after a click or tap
  // on both the close button and the image if the island did not move focus
  // again with the ring hidden. Only WebKit can fail those 2 no-ring checks:
  // Chromium, which CI runs, draws no ring there either way.
  await page.goto('/off-screen/');
  const trigger = page.locator('[data-zoomable][role="button"]').first();
  await trigger.locator('img').click();
  const close = page.locator('.lightbox-close');
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS('outline-style', 'none');
  // Switching to the keyboard brings the ring back.
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS('outline-style', 'solid');
  await close.click();
  await expect(page.locator('dialog.lightbox')).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveCSS('outline-style', 'none');
});

test('a tall capture the carousel crops still offers zoom, to show it whole', async ({ page }) => {
  await page.goto('/work/unitpulse-site/');
  const tall = page.locator('.bk-shot--tall').first();
  await expect(tall).toHaveAttribute('data-zoom', 'on');
  await expect(tall).toHaveAttribute('role', 'button');
});

test('art drawn for the dark band opens on that band color on a large screen', async ({ page }) => {
  // On a 2560x1440 window this dark-band wireframe opens about 1.7x bigger.
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.goto('/work/pool-my-ride/');
  const img = page.locator('img[src$="medium_fi.png"]');
  await expect(page.locator('[data-zoom]', { has: img })).toHaveAttribute('data-zoom', 'on');
  await img.click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('data-dark-art', '');
  const colors = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.background = 'var(--stage-bg-dark)';
    document.body.append(probe);
    const band = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const zoomed = getComputedStyle(document.querySelector('.lightbox-fig img')!).backgroundColor;
    return { band, zoomed };
  });
  expect(colors.zoomed).toBe(colors.band);
});

test('zoom is offered only when it shows the image bigger', async ({ page }) => {
  await page.goto('/work/unitpulse-platform/');
  const img = page.locator('img[src$="platform-nav.png"]');
  const trigger = page.locator('[data-zoom]', { has: img });
  const dialog = page.locator('dialog.lightbox');

  // At the test sizes this full-width image would open about as big as it
  // already is, so it stays a plain image: no button, no lightbox.
  await expect(trigger).toHaveAttribute('data-zoom', 'off');
  await expect(trigger).not.toHaveAttribute('role', 'button');
  await img.click();
  await expect(dialog).toBeHidden();

  // On a large monitor it opens about 1.7x bigger, so zoom is offered.
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect(trigger).toHaveAttribute('data-zoom', 'on');
  await expect(trigger).toHaveAttribute('role', 'button');
  // So does the timeline diagram above it.
  const timeline = page.locator('[data-zoom]', { has: page.locator('img[src$="timeline.svg"]') });
  await expect(timeline).toHaveAttribute('data-zoom', 'on');
  await img.click();
  await expect(dialog).toBeVisible();

  // Its transparent background gets the light band color behind it, so the
  // dark labels stay readable on the dark backdrop.
  const colors = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.style.background = 'var(--bg-secondary)';
    document.body.append(probe);
    const band = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const zoomed = getComputedStyle(document.querySelector('.lightbox-fig img')!).backgroundColor;
    return { band, zoomed };
  });
  expect(colors.zoomed).toBe(colors.band);

  // Shrinking the window while the lightbox is open keeps the trigger a button,
  // so Esc still returns focus to it. The timeline, which the lightbox was not
  // opened from, turns back into a plain image at once.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(timeline).toHaveAttribute('data-zoom', 'off');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  // Once focus moves on, the trigger turns back into a plain image right away,
  // with no second resize. Read it once: a late image load could also turn it
  // off while a retrying check waits.
  await page.keyboard.press('Tab');
  expect(await trigger.getAttribute('data-zoom')).toBe('off');
  await expect(trigger).not.toHaveAttribute('role', 'button');
  await expect(trigger).not.toBeFocused();
});
