import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('writing index resolves and has no axe issues', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.locator('h1')).toContainText('Writing');
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
