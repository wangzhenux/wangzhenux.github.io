import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ResearchStats from '../../src/components/data/ResearchStats.astro';

test('ResearchStats exposes --cols', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ResearchStats, { props: { cols: 2 }, slots: { default: '<div>x</div>' } });
  expect(html).toContain('--cols: 2');
});
