import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Reflection from '../../src/components/showcase/Reflection.astro';
import ReflectionCard from '../../src/components/showcase/ReflectionCard.astro';

test('Reflection wraps cards in a two-column grid', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Reflection, { slots: { default: '<div>card</div>' } });
  expect(html).toContain('class="reflection"');
  expect(html).toContain('card');
});

test('ReflectionCard has label, h3 heading and body', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ReflectionCard, {
    props: { label: 'What I learned', heading: 'Ship the smallest honest thing' },
    slots: { default: 'A phased rollout let us validate before committing.' },
  });
  expect(html).toContain('class="reflection-card"');
  expect(html).toContain('What I learned');
  expect(html).toMatch(/<h3[^>]*>Ship the smallest honest thing/);
  expect(html).toContain('phased rollout');
});
