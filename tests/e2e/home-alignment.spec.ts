import { test, expect } from '@playwright/test';

// FIX 1 — deterministic guard for the shared content frame.
//
// Every homepage region routes its content through the shared Container
// primitive (max-content + margin-inline auto + padding-inline pad-page-x),
// so the leftmost text in each region must share ONE left content edge.
//
// Reference edge: the nav name. We assert (within a 2px tolerance) that the
// hero eyebrow + h1, the Selected-work heading, the Writing heading, the
// Archive title, and the footer name all line up with it.
//
// The Featured *overlay* title is intentionally inset further (it lives inside
// the cover-image composition with its own padding), so we exclude that text —
// but we DO assert the Featured section's own cover left edge aligns with nav,
// since the cover sits in the same outer frame as every other section.

const DESKTOP = { width: 1440, height: 900 };

async function leftEdge(locatorFirst: import('@playwright/test').Locator): Promise<number> {
  const box = await locatorFirst.boundingBox();
  if (!box) throw new Error('element has no bounding box (not visible?)');
  return Math.round(box.x);
}

test.describe('homepage horizontal alignment', () => {
  test.use({ viewport: DESKTOP });

  test('homepage sections share one left content edge', async ({ page }) => {
    await page.setViewportSize(DESKTOP);
    await page.goto('/');

    const leftOf = (sel: string) => leftEdge(page.locator(sel).first());

    const nav = await leftOf('.nav-name');

    const edges: Record<string, number> = {
      heroEyebrow: await leftOf('.home-hero-eyebrow'),
      heroH1: await leftOf('.home-hero-h1'),
      writing: await leftOf('.writing-header h2, .writing-title, .writing h2'),
      archive: await leftOf('.archive-title'),
      footer: await leftOf('.footer-name'),
      // Featured: the cover frame edge (NOT the inset overlay title).
      featuredCover: await leftOf('.featured-cover'),
    };

    // Selected work is conditionally rendered (only when >0 selected cases).
    const selectedHeading = page.locator('.selected-header h2, .selected-title, .selected h2');
    if (await selectedHeading.count()) {
      edges.selected = await leftEdge(selectedHeading.first());
    }

    for (const [name, value] of Object.entries(edges)) {
      expect(
        Math.abs(value - nav),
        `${name} (${value}px) should align with nav (${nav}px)`,
      ).toBeLessThanOrEqual(2);
    }
  });
});
