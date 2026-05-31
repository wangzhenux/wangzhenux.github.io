import { test, expect } from '@playwright/test';

// §10.1 keyboard accessibility across pages.

test('home: first Tab reaches the skip link, activating it moves focus into #main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toHaveText(/skip to content/i);

  // Activating the skip link moves focus into the main content region.
  await page.keyboard.press('Enter');
  const focusedId = await page.evaluate(() => document.activeElement?.id ?? '');
  expect(focusedId).toBe('main');
});

test('case page: skip link works and TOC buttons are reachable by keyboard', async ({ page, viewport }) => {
  await page.goto('/work/twilio');

  // Skip link is the first stop and lands focus in #main.
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => document.activeElement?.id ?? '')).toBe('main');

  // TOC buttons are real <button>s and focusable. (Sidebar is desktop-only;
  // on narrow viewports the same buttons live in the progress-bar drawer.)
  const onDesktop = (viewport?.width ?? 0) >= 1024;
  if (onDesktop) {
    const firstToc = page.locator('.toc .toc-item').first();
    await firstToc.focus();
    await expect(firstToc).toBeFocused();
  } else {
    // Open the drawer, then focus a drawer TOC button.
    await page.locator('.progress-tag').click();
    const firstDrawer = page.locator('.toc-item--drawer').first();
    await firstDrawer.focus();
    await expect(firstDrawer).toBeFocused();
  }
});

test('lightbox traps focus and Esc returns focus to the trigger', async ({ page }) => {
  await page.goto('/work/twilio');

  // Open the lightbox from the keyboard via a zoomable trigger. Only leaf
  // wrappers are made interactive (the island adds role=button + tabindex),
  // so target one of those.
  const trigger = page.locator('[data-zoomable][role="button"]').first();
  await trigger.focus();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Enter');

  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  // Focus moves to the close button on open.
  await expect(page.locator('.lightbox-close')).toBeFocused();

  // Tab is trapped inside the dialog: focus stays within the dialog subtree.
  await page.keyboard.press('Tab');
  const stillInside = await page.evaluate(() => {
    const dlg = document.querySelector('dialog.lightbox');
    return !!dlg && dlg.contains(document.activeElement);
  });
  expect(stillInside).toBe(true);

  // Esc closes and returns focus to the trigger.
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  const restored = await page.evaluate(() => {
    const dlg = document.querySelector('dialog.lightbox');
    const active = document.activeElement;
    // Active element is the zoomable trigger (or inside it), not the dialog.
    return !!active && active.closest('[data-zoomable]') !== null && (!dlg || !dlg.contains(active));
  });
  expect(restored).toBe(true);
});
