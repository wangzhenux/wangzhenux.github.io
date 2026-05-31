import { test, expect } from '@playwright/test';

// §9.1 Step 3: the sidebar TOC is desktop-only (>=1024px); below that the top
// progress bar takes over. These assertions drive viewport size directly so the
// test is meaningful regardless of which Playwright project runs it.

test('below 1024px: sidebar TOC hidden, progress bar visible', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/work/twilio');
  await expect(page.locator('.toc')).toBeHidden();
  await expect(page.locator('.progress-bar')).toBeVisible();
});

test('at 1440px: sidebar TOC visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/twilio');
  await expect(page.locator('.toc')).toBeVisible();
  await expect(page.locator('.progress-bar')).toBeHidden();
});

test('mobile drawer: tapping the progress tag toggles the TOC list', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/work/twilio');
  const tag = page.locator('.progress-tag');
  const drawer = page.locator('#toc-drawer');
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).toBeHidden();
  await tag.click();
  await expect(tag).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toBeVisible();
  // A drawer item navigates and collapses the drawer.
  await page.locator('.toc-item--drawer').nth(2).click();
  await expect(drawer).toBeHidden();
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
});
