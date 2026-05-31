import { test, expect } from '@playwright/test';

test('lightbox opens on showcase image and closes on Esc', async ({ page }) => {
  await page.goto('/work/twilio');
  await page.locator('[data-zoomable] img').first().click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.lightbox-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
