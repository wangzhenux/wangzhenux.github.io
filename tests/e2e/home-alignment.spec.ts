import { test, expect } from '@playwright/test';

// Deterministic guard for the shared content frame.
//
// Every homepage BODY region (hero + the case sections) routes its content
// through the shared Container primitive (max-content + margin-inline auto +
// padding-inline pad-page-x), so the leftmost text in each must share ONE
// left content edge.
//
// The top nav and footer are INTENTIONALLY full-width (content near the
// gutters, not constrained to the centered frame), so they are deliberately
// EXCLUDED from this alignment assertion.
//
// Reference edge: the hero h1 (the first body content in the shared frame).
// We assert (within a 2px tolerance) that the hero facts, the Writing heading,
// the Archive title, and the Featured cover edge all line up with it. The
// Featured *overlay* title is intentionally inset further (it lives inside the
// cover composition with its own padding), so we exclude that text but DO
// assert the cover edge.

const DESKTOP = { width: 1440, height: 900 };

async function leftEdge(locatorFirst: import('@playwright/test').Locator): Promise<number> {
  const box = await locatorFirst.boundingBox();
  if (!box) throw new Error('element has no bounding box (not visible?)');
  return Math.round(box.x);
}

test.describe('homepage horizontal alignment', () => {
  test.use({ viewport: DESKTOP });

  test('homepage body sections share one left content edge', async ({ page }) => {
    await page.goto('/');

    const leftOf = (sel: string) => leftEdge(page.locator(sel).first());

    // Reference: the hero h1 (first body content in the shared frame).
    const ref = await leftOf('.home-hero-h1');

    const edges: Record<string, number> = {
      heroFacts: await leftOf('.home-hero-facts p'),
      writing: await leftOf('.writing-header h2, .writing-title, .writing h2'),
      archive: await leftOf('.archive-title'),
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
        Math.abs(value - ref),
        `${name} (${value}px) should align with the hero content edge (${ref}px)`,
      ).toBeLessThanOrEqual(2);
    }
  });
});
