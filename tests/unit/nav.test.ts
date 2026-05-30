import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Nav from '../../src/components/chrome/Nav.astro';

test('Nav renders name + three links inside a <nav>', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Nav);
  expect(html).toMatch(/<nav[\s>]/);
  expect(html).toContain('Zhen Wang');
  for (const label of ['Work', 'Writing', 'About']) expect(html).toContain(label);
});

test('Nav marks the active link with aria-current', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Nav, { props: { currentPath: '/about' } });
  expect(html).toMatch(/aria-current="page"/);
});
