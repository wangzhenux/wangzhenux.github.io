import { test, expect } from '@playwright/test';

// Guard for the full-bleed image showcase:
//  1. The band spans (essentially) the full viewport width — design artifacts
//     are shown large, not confined to the narrow reading column.
//  2. The image fits at its natural aspect ratio and is never cropped.
//
// Tolerance: at >=1080px the vertical scrollbar makes 50vw differ from the
// centered-frame width by ~half a scrollbar (~8px), a cosmetically invisible
// asymmetry on the dotted grid; below 1080 it's exact. We allow 16px.

const TOL = 16;

async function box(page: import('@playwright/test').Page, sel: string) {
  const b = await page.locator(sel).first().boundingBox();
  if (!b) throw new Error(`${sel} not visible`);
  return b;
}

for (const width of [1440, 1000]) {
  test(`image showcase spans the viewport and image keeps aspect @ ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/twilio');

    const band = await box(page, '.image-showcase');
    expect(Math.abs(band.x), `band left (${band.x})`).toBeLessThanOrEqual(TOL);
    expect(Math.abs(width - (band.x + band.width)), `band right gap`).toBeLessThanOrEqual(TOL);

    // Image is not cropped: rendered aspect ratio matches the natural one.
    const img = page.locator('.image-showcase img').first();
    const ar = await img.evaluate((el: HTMLImageElement) => ({
      rendered: el.getBoundingClientRect().width / el.getBoundingClientRect().height,
      natural: el.naturalWidth / el.naturalHeight,
    }));
    expect(Math.abs(ar.rendered - ar.natural), 'aspect ratio preserved').toBeLessThan(0.05);

    // No horizontal page scroll introduced by the full-bleed band.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 2,
    );
    expect(overflow, 'no horizontal scroll').toBe(false);
  });
}
