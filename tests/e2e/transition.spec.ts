import { test, expect } from '@playwright/test';

test('Work and Writing navigation plays the curtain in both directions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Writing', exact: true }).click();
  await expect(page.locator('#case-curtain')).toHaveClass(/is-sweeping/, { timeout: 2000 });
  await expect(page.locator('.case-curtain-thesis')).toContainText('work in between');
  await expect(page).toHaveURL(/\/writing\/?$/, { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
  await expect(page.getByRole('heading', { name: 'Writing', exact: true })).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page.locator('#case-curtain')).toHaveClass(/is-sweeping/, { timeout: 2000 });
  await expect(page.locator('.case-curtain-thesis')).toContainText('Meaningful');
  await expect(page).toHaveURL(url => url.pathname === '/', { timeout: 6000 });
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
  await expect(page.getByRole('heading', { name: "Hello, I'm Zhen." })).toBeVisible();
});

test('Work and Writing remain reachable without a curtain for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Writing', exact: true }).click();
  await expect(page).toHaveURL(/\/writing\/?$/);
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/);
  await expect(page.locator('#case-curtain')).toBeHidden();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(url => url.pathname === '/');
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/);
  await expect(page.locator('#case-curtain')).toBeHidden();
});

// The thesis curtain intercepts case-link clicks and delays the swap; verify it
// still completes the navigation (and doesn't trap the user on the homepage).
test('thesis curtain still navigates into the case', async ({ page }) => {
  await page.goto('/');
  await page.locator('.fcard').click();
  await expect(page).toHaveURL(/\/work\/unitpulse-platform\/?$/, { timeout: 6000 });
  // curtain resets (no leftover covering class) once it has lifted
  await expect(page.locator('#case-curtain')).not.toHaveClass(/is-/, { timeout: 4000 });
});

// The same curtain plays on the way back, so the round trip is consistent.
test('curtain also plays on case -> home and lands home', async ({ page }) => {
  await page.goto('/work/unitpulse-site');
  await page.locator('a.back').click();
  await expect(page).toHaveURL(url => url.pathname === '/', { timeout: 6000 });
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
