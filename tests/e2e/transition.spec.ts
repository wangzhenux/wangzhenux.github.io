import { test, expect } from '@playwright/test';

// The thesis curtain intercepts case-link clicks and delays the swap; verify it
// still completes the navigation (and doesn't trap the user on the homepage).
test('thesis curtain still navigates into the case', async ({ page }) => {
  await page.goto('/');
  await page.locator('.featured-cover').click();
  await expect(page).toHaveURL(/\/work\/up-insight\/?$/, { timeout: 6000 });
  // curtain resets (no leftover covering class) once it has lifted
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});

// The same curtain plays on the way back, so the round trip is consistent.
test('curtain also plays on case -> home and lands home', async ({ page }) => {
  await page.goto('/work/up-insight');
  await page.locator('a.back').click();
  await expect(page).toHaveURL(/:4321\/?$/, { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});
