import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('off-screen gallery: renders, filters, zooms, and has no axe issues', async ({ page }) => {
  await page.goto('/off-screen');

  // All the pieces are present (6 ink · 4 creatures · 15 places).
  const tiles = page.locator('.tile');
  await expect(tiles).toHaveCount(25);

  // Category filter narrows the wall and keeps the chip state in sync.
  // (exact: true — "All" is otherwise a substring of the "mallard" tile's label.)
  await page.getByRole('button', { name: 'Ink', exact: true }).click();
  await expect(page.locator('.tile:visible')).toHaveCount(6);
  await page.getByRole('button', { name: 'Creatures', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Creatures', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.tile:visible')).toHaveCount(4);
  await page.getByRole('button', { name: 'Places', exact: true }).click();
  await expect(page.locator('.tile:visible')).toHaveCount(15);
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('.tile:visible')).toHaveCount(25);

  // Clicking a tile opens the lightbox; Esc closes it.
  await page.locator('.tile').first().click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
