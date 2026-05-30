import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Phase from '../../src/components/data/Phase.astro';

test('Phase renders number, title and meta dl', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Phase, {
    props: { num: '01', label: 'Phase 1 · Shipped', title: 'Ahoy', meta: [{ k: 'Audience', v: 'New customers' }] },
    slots: { default: '<p>desc</p>' },
  });
  expect(html).toContain('01');
  expect(html).toContain('Ahoy');
  expect(html).toMatch(/<dl[^>]*class="phase-meta"/);
  expect(html).toContain('Audience');
});
