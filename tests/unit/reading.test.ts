import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import SectionH from '../../src/components/reading/SectionH.astro';
import Pullquote from '../../src/components/reading/Pullquote.astro';

test('SectionH renders h2 by default, h3 with small variant', async () => {
  const c = await AstroContainer.create();
  const h2 = await c.renderToString(SectionH, { slots: { default: 'The problem' } });
  expect(h2).toMatch(/<h2[^>]*class="section-h"/);
  const h3 = await c.renderToString(SectionH, { props: { small: true }, slots: { default: 'Key findings' } });
  expect(h3).toMatch(/<h3[^>]*class="section-h section-h--small"/);
});

test('Pullquote is a blockquote', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Pullquote, { slots: { default: 'A quote' } });
  expect(html).toMatch(/<blockquote[^>]*class="pullquote"/);
});
