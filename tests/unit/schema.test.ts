import { expect, test } from 'vitest';
import { caseSchema } from '../../src/content.config';

const SECTIONS = [{ id: 's01', num: '01', label: 'The problem' }];

test('requires title/deck/slug/year/role/cover/order/featured/sections', () => {
  expect(() => caseSchema.parse({})).toThrow();
});
test('accepts a minimal valid case', () => {
  const ok = caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: { gradient: 'linear-gradient(#000,#111)' },
    order: 1, featured: true, sections: SECTIONS,
  });
  expect(ok.title).toBe('T');
  expect(ok.archive).toBe(false); // defaults to false
});
test('optional fields pass through', () => {
  const ok = caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: { image: '/x.png' }, order: 1, featured: false, sections: SECTIONS,
    company: 'Twilio', span: '~3.5 months', status: 'shipped', archive: true,
    outcome: { metric: '+179%', context: 'impressions' },
  });
  expect(ok.outcome?.metric).toBe('+179%');
  expect(ok.archive).toBe(true);
});
test('cover requires gradient OR image', () => {
  expect(() => caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: {}, order: 1, featured: false, sections: SECTIONS,
  })).toThrow();
});
