import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Competitor from '../../src/components/data/Competitor.astro';

test('Competitor shows strength and gap', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Competitor, {
    props: { name: 'Plivo', strength: 'Guided tour', gap: 'No region framing' },
  });
  expect(html).toContain('Plivo');
  expect(html.toLowerCase()).toContain('strength');
  expect(html.toLowerCase()).toContain('gap');
  expect(html).toContain('Guided tour');
  expect(html).toContain('No region framing');
});

test('Competitor applies logoColor to the wordmark', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Competitor, {
    props: { name: 'Plivo', strength: 's', gap: 'g', logoColor: '#43A047' },
  });
  expect(html).toContain('#43A047');
});
