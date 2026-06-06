import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Critique from '../../src/components/showcase/Critique.astro';

const rows = [
  {
    label: 'Critique 01 · One-pager region selection',
    heading: '"Default Region" implied billing, not data residency',
    changes: ['Re-titled the screen', 'Added a region-specific popover'],
    image: { src: '/critique1.png', alt: 'one-pager critique' },
  },
  {
    label: 'Critique 02 · Post-config modal',
    heading: 'Informative modal felt overwhelming',
    changes: ['Removed the default-region setting', 'Added a numbered title'],
    image: { src: '/critique2.png', alt: 'modal critique' },
  },
];

test('Critique renders one .critique row per item with a changes list', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Critique, { props: { rows } });
  expect((html.match(/class="critique"/g) || []).length).toBe(2);
  expect(html).toContain('Critique 01 · One-pager region selection');
  expect(html).toMatch(/<h4[^>]*>&quot;Default Region&quot; implied billing/);
  // Changes render as bulleted list items.
  expect((html.match(/<ul class="critique-changes"/g) || []).length).toBe(2);
  expect(html).toContain('Re-titled the screen');
  expect(html).toContain('Added a region-specific popover');
});

test('Critique image wrappers carry data-zoomable for the lightbox', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Critique, { props: { rows } });
  expect((html.match(/data-zoomable/g) || []).length).toBe(2);
  expect(html).toContain('/critique1.png');
  expect(html).toContain('/critique2.png');
});
