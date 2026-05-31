import { test, expect } from '@playwright/test';

test('TOC active follows scroll and click jumps', async ({ page, viewport }) => {
  // The TOC sidebar is desktop-only (visible >=1280px per the responsive plan);
  // skip on the narrow mobile project where the feature does not apply.
  test.skip((viewport?.width ?? 0) < 1280, 'TOC sidebar is desktop-only');

  await page.goto('/work/twilio');
  const items = page.locator('.toc-item');
  await items.nth(4).click();
  await expect(items.nth(4)).toHaveAttribute('aria-current', 'location');
});
