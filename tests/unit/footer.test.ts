import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Footer from '../../src/components/chrome/Footer.astro';

test('Footer has name, year, and three socials', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Footer);
  expect(html).toMatch(/<footer/);
  expect(html).toContain('Zhen Wang');
  for (const s of ['Email', 'LinkedIn', 'Instagram']) expect(html).toContain(s);
});
