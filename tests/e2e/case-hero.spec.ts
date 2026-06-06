import { test, expect } from '@playwright/test';

// The case-study hero is fully contained in the shared content frame: the
// text, the cover, and the meta all share the same x-padding as the homepage /
// back link / body (never touching the edges). The cover keeps a left/right
// gutter and rounded corners (not full-bleed).

async function boxOf(page: import('@playwright/test').Page, sel: string) {
  const b = await page.locator(sel).first().boundingBox();
  if (!b) throw new Error(`${sel} not visible`);
  return b;
}

test('case hero: text + cover are contained, aligned with the body, cover rounded', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/twilio');

  const eyebrow = await boxOf(page, '.hero-eyebrow');
  const bodyText = await boxOf(page, '.body .lede, .body .body-text, .body p');
  const cover = await boxOf(page, '.hero .cover');

  // Text is inset (not touching the edge) and aligned with the body column.
  expect(eyebrow.x, 'hero text inset from edge').toBeGreaterThan(24);
  expect(Math.abs(eyebrow.x - bodyText.x), 'hero text aligns with body').toBeLessThanOrEqual(2);

  // Cover is contained in the same frame (shares the left gutter) and not full-bleed.
  expect(Math.abs(cover.x - eyebrow.x), 'cover shares the hero gutter').toBeLessThanOrEqual(2);
  expect(cover.x, 'cover keeps a left gutter').toBeGreaterThan(24);

  // Cover has rounded corners.
  const radius = await page
    .locator('.hero .cover')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
  expect(radius, 'cover is rounded').toBeGreaterThan(0);
});
