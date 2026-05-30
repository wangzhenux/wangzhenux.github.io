import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Outcome from '../../src/components/showcase/Outcome.astro';

test('Outcome shows the metric in .outcome-num and supporting text', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Outcome, {
    props: { metric: '+179%', heading: 'Impressions climbed' },
    slots: { default: 'on the regional Buy-a-Number page, 3 months after Phase 1.' },
  });
  expect(html).toMatch(/class="outcome-num"[^>]*>\+179%/);
  expect(html).toContain('class="outcome-text"');
  expect(html).toContain('Impressions climbed');
  expect(html).toContain('Buy-a-Number');
});
