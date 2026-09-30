import { test, expect } from '@playwright/test';

test('homepage navigation follows scroll direction and stays reachable by keyboard', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect(nav).toHaveAttribute('data-ready', 'true');
  const mainTop = () => page.locator('#main').evaluate(el => el.getBoundingClientRect().top + scrollY);
  const initialTop = await mainTop();
  const navTop = () => nav.evaluate(el => el.getBoundingClientRect().top);
  const navBottom = () => nav.evaluate(el => el.getBoundingClientRect().bottom);

  await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }));
  await expect.poll(navBottom).toBeLessThanOrEqual(1);
  await page.evaluate(() => scrollTo({ top: 396, behavior: 'instant' }));
  await expect(nav).toHaveClass(/is-hidden/);
  await page.evaluate(() => scrollTo({ top: 376, behavior: 'instant' }));
  await expect.poll(navTop).toBe(0);
  expect(await mainTop()).toBe(initialTop);

  await page.evaluate(() => scrollTo({ top: 500, behavior: 'instant' }));
  await expect.poll(navBottom).toBeLessThanOrEqual(1);
  await nav.getByRole('link', { name: 'About', exact: true }).focus();
  await expect.poll(navTop).toBe(0);
  await expect(nav.getByRole('link', { name: 'About', exact: true })).toBeFocused();

  await page.locator('#main').focus();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(nav).not.toHaveClass(/is-hidden/);
  await expect.poll(navTop).toBe(0);
});

test('scroll navigation initializes after a page transition and respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Work', exact: true }).click();
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect(nav).toHaveAttribute('data-ready', 'true');
  await page.locator('#main').focus();
  await page.evaluate(() => scrollTo({ top: 400, behavior: 'instant' }));
  await expect.poll(() => nav.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1);
  expect(await nav.evaluate(el => parseFloat(getComputedStyle(el).transitionDuration))).toBeLessThanOrEqual(0.001);
  await page.evaluate(() => scrollTo({ top: 360, behavior: 'instant' }));
  await expect.poll(() => nav.evaluate(el => el.getBoundingClientRect().top)).toBe(0);
});
