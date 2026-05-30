import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Dual from '../../src/components/data/Dual.astro';
import DualCol from '../../src/components/data/DualCol.astro';

test('Dual wraps two columns in a grid', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Dual, {
    slots: { default: '<div>a</div><div>b</div>' },
  });
  expect(html).toContain('class="dual"');
  expect(html).toContain('<div>a</div>');
});

test('DualCol has h4 heading and hairline-separated dual-item rows', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(DualCol, {
    props: { heading: 'Findings' },
    slots: {
      default:
        '<div class="dual-item"><div class="head">Row one</div><div class="det">Detail</div></div>',
    },
  });
  expect(html).toContain('class="dual-col"');
  expect(html).toMatch(/<h4[^>]*>Findings/);
  expect(html).toContain('class="dual-item"');
});
