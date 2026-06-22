import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home shows featured + writing + (optional) selected, no axe issues', async ({ page }) => {
  await page.goto('/');

  // Hero + featured case are always present (the UnitPulse platform case is the
  // spotlight — lowest `order`). Assert the hero headline specifically rather
  // than a bare `h1` so a reused dev server on :4321 can't trip strict mode with
  // transient duplicate h1s.
  await expect(page.locator('.home-hero-h1')).toBeVisible();
  await expect(page.locator('.featured')).toBeVisible();
  await expect(page.locator('.featured-cover')).toHaveAttribute('href', '/work/unitpulse-platform');

  // Writing section renders (graceful even when the Medium feed is empty).
  await expect(page.locator('.writing')).toBeVisible();

  // Selected grid is conditionally rendered: when present it must contain
  // cards (it auto-populates as Phase 8 adds more featured cases). With only
  // Twilio present the grid is absent — that is the graceful empty state.
  const grid = page.locator('.selected-grid');
  if (await grid.count()) {
    await expect(page.locator('.selected-grid .case-card')).not.toHaveCount(0);
  }

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), null, 2)).toEqual([]);
});
