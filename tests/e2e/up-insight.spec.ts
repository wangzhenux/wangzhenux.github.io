import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('up-insight case has no axe violations', async ({ page }) => {
  await page.goto('/work/up-insight');
  await expect(page.locator('.hero-title, h1').first()).toBeVisible();
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
