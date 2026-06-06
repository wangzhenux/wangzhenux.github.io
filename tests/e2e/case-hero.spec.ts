import { test, expect } from '@playwright/test';

// The case-study hero: text is contained in the shared content frame (same
// x-padding as the homepage / back link / body — never touching the edges),
// while the cover image bleeds full-width.

async function leftOf(page: import('@playwright/test').Page, sel: string) {
  const b = await page.locator(sel).first().boundingBox();
  if (!b) throw new Error(`${sel} not visible`);
  return b;
}

test('case hero: text is gutter-inset and aligned with the body; cover is full-bleed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/twilio');

  const eyebrow = await leftOf(page, '.hero-eyebrow');
  const bodyText = await leftOf(page, '.body .lede, .body .body-text, .body p');
  const cover = await leftOf(page, '.hero-cover');

  // Text is inset (not touching the left edge) and aligned with the body column.
  expect(eyebrow.x, 'hero text inset from edge').toBeGreaterThan(24);
  expect(Math.abs(eyebrow.x - bodyText.x), 'hero text aligns with body').toBeLessThanOrEqual(2);

  // Cover bleeds wider than the text frame (toward the viewport edges).
  expect(cover.x, 'cover starts left of the text gutter').toBeLessThan(eyebrow.x);
  expect(cover.width, 'cover is wider than the text frame').toBeGreaterThan(eyebrow.width);
});
