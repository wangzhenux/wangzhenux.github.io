import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('about page: résumé download present, no axe issues', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('link', { name: /download/i })).toHaveAttribute(
    'href',
    /Resume\.pdf/
  );
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
