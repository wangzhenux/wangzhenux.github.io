import { test, expect } from '@playwright/test';

// The thesis curtain intercepts case-link clicks and delays the swap; verify it
// still completes the navigation (and doesn't trap the user on the homepage).
test('thesis curtain still navigates into the case', async ({ page }) => {
  await page.goto('/');
  await page.locator('.featured-cover').click();
  await expect(page).toHaveURL(/\/work\/unitpulse-platform\/?$/, { timeout: 6000 });
  // curtain resets (no leftover covering class) once it has lifted
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});

// The same curtain plays on the way back, so the round trip is consistent.
test('curtain also plays on case -> home and lands home', async ({ page }) => {
  await page.goto('/work/unitpulse-site');
  await page.locator('a.back').click();
  await expect(page).toHaveURL(/:4321\/?$/, { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});

// Entering About plays the same thesis curtain as a case study, so the way in
// is consistent with the work pages — it sweeps up with the About tagline, then
// lands on /about and lifts.
test('curtain plays when entering About and shows its tagline', async ({ page }) => {
  await page.goto('/');
  await page.locator('nav.nav a[href="/about"]').click();
  await expect(page.locator('#case-curtain')).toHaveClass(/is-sweeping/, { timeout: 2000 });
  await expect(page.locator('.case-curtain-thesis')).toContainText('calligrapher', { timeout: 2000 });
  await expect(page).toHaveURL(/\/about\/?$/, { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});

// The Off-screen gallery is a standalone page that gets the same entry curtain.
test('curtain plays when entering Off-screen and shows its tagline', async ({ page }) => {
  await page.goto('/');
  await page.locator('nav.nav a[href="/off-screen"]').click();
  await expect(page.locator('#case-curtain')).toHaveClass(/is-sweeping/, { timeout: 2000 });
  await expect(page.locator('.case-curtain-thesis')).toContainText('balances out the screens', { timeout: 2000 });
  await expect(page).toHaveURL(/\/off-screen\/?$/, { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});
