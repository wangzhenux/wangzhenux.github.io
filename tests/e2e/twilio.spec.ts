import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('twilio case has no axe violations', async ({ page }) => {
  await page.goto('/work/twilio');
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
