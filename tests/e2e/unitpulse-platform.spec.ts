import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-platform flagship: collapsed modules, disclosure works, no axe violations', async ({ page }) => {
  await page.goto('/work/unitpulse-platform');
  await expect(page.locator('.hero-title')).toContainText('From Three Products');

  // Act 3 modules are collapsed by default.
  const modules = page.locator('details.expand');
  await expect(modules).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    expect(await modules.nth(i).evaluate((d: HTMLDetailsElement) => d.open)).toBe(false);
  }

  // Expanding the first module reveals its body.
  await modules.first().locator('summary').click();
  expect(await modules.first().evaluate((d: HTMLDetailsElement) => d.open)).toBe(true);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
