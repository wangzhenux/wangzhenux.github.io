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

test('case page: skip link works and the progress-bar section nav is keyboard-operable', async ({ page }) => {
  // Reduced motion: instant scroll + no bar slide-in transition (§7).
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/twilio');

  // Skip link is the first stop and lands focus in #main. The browser moves focus
  // a task after the fragment navigation, so poll rather than one-shot-read the
  // active element — the Tab below must start from #main, not the skip link.
  await page.keyboard.press('Tab');
  await expect(page.locator('a.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => document.activeElement?.id ?? '')).toBe('main');

  // The progress bar is the section nav at all widths (§9.1); it slides in once
  // the hero is scrolled past. Scrolling does not move focus, so #main is still
  // the tab origin.
  await page.locator('#s02').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.progress-bar')).toHaveClass(/is-visible/);

  // The progress tag is the first tab stop inside #main, and the drawer is a
  // keyboard-operable disclosure: Enter opens it, Tab reaches the real <button>
  // section items, Esc closes it and returns focus to the tag.
  await page.keyboard.press('Tab');
  const tag = page.locator('.progress-tag');
  await expect(tag).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(tag).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#toc-drawer')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.locator('.toc-item--drawer').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#toc-drawer')).toBeHidden();
  await expect(tag).toBeFocused();
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
