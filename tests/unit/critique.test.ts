import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Critique from '../../src/components/showcase/Critique.astro';

const rows = [
  {
    label: 'Critique 01 · One-pager region selection',
    heading: '"Default Region" implied billing, not data residency',
    fix: 'Re-titled the screen and added a region-specific popover.',
    image: { src: '/critique1.png', alt: 'one-pager critique' },
  },
  {
    label: 'Critique 02 · Post-config modal',
    heading: 'Informative modal felt overwhelming',
    fix: 'Removed the default-region setting and added a numbered title.',
    image: { src: '/critique2.png', alt: 'modal critique' },
  },
];

test('Critique renders one .critique row per item with text + fix', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Critique, { props: { rows } });
  expect((html.match(/class="critique"/g) || []).length).toBe(2);
  expect(html).toContain('Critique 01 · One-pager region selection');
  expect(html).toMatch(/<h4[^>]*>&quot;Default Region&quot; implied billing/);
  expect(html).toContain('region-specific popover');
});

test('Critique image wrappers carry data-zoomable for the lightbox', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Critique, { props: { rows } });
  expect((html.match(/data-zoomable/g) || []).length).toBe(2);
  expect(html).toContain('/critique1.png');
  expect(html).toContain('/critique2.png');
});
