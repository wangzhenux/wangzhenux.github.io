import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import IdeasList from '../../src/components/data/IdeasList.astro';

test('IdeasList marks selected items and badges them', async () => {
  const c = await AstroContainer.create();
  const items = [
    { num: '01', text: 'Choose region when naming account' },
    { num: '03', text: 'One-pager between Ahoy and Dashboard', selected: true, badge: 'Tested' },
  ];
  const html = await c.renderToString(IdeasList, { props: { items } });
  expect(html).toContain('class="ideas-list"');
  expect((html.match(/class="[^"]*selected/g) || []).length).toBe(1);
  expect(html).toContain('Tested');
});
