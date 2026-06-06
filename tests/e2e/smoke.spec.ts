import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads and has no axe violations', async ({ page }) => {
  await page.goto('/');
  // Target the hero headline specifically. A bare `h1` locator can trip strict
  // mode if a stale dev server is reused on :4321 (HMR + view transitions can
  // momentarily carry duplicate headings); the page's real H1 is the hero.
  await expect(page.locator('.home-hero-h1')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations, JSON.stringify(results.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })), null, 2)).toEqual([]);
});
