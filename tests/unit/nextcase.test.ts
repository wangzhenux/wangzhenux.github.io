import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import NextCase from '../../src/components/showcase/NextCase.astro';

test('NextCase renders an anchor to href with title and deck', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(NextCase, {
    props: {
      href: '/work/example-case',
      title: 'Making integration health legible',
      deck: 'A status dashboard for a system nobody could see.',
    },
  });
  expect(html).toContain('class="next-case"');
  expect(html).toMatch(/<a[^>]*href="\/work\/example-case"/);
  expect(html).toContain('Making integration health legible');
  expect(html).toContain('A status dashboard for a system nobody could see.');
});
