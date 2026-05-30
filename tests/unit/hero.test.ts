import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import MetaStrip from '../../src/components/hero/MetaStrip.astro';
import Cover from '../../src/components/hero/Cover.astro';

test('MetaStrip auto-fits N fields as a <dl>', async () => {
  const c = await AstroContainer.create();
  const fields = [
    { label: 'Role', value: 'Senior PD' },
    { label: 'Span', value: '~3.5 months' },
  ];
  const html = await c.renderToString(MetaStrip, { props: { fields } });
  expect((html.match(/<dt/g) || []).length).toBe(2);
  expect(html).toContain('Role');
  expect(html).toContain('~3.5 months');
  expect(html).toContain('--meta-cols: 2');
});

test('Cover applies the per-case gradient via --case-cover', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Cover, {
    props: { caseCover: 'linear-gradient(135deg, #F22F46, #6B1F2E)', alt: 'cover' },
  });
  expect(html).toContain('--case-cover');
});
