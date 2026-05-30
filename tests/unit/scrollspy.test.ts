import { expect, test } from 'vitest';
import { pickActive } from '../../src/islands/toc-scrollspy';

test('pickActive returns the id with the highest ratio', () => {
  expect(pickActive([
    { id: 's01', ratio: 0.1 },
    { id: 's02', ratio: 0.6 },
    { id: 's03', ratio: 0.3 },
  ])).toBe('s02');
});

test('pickActive returns null when all ratios are zero', () => {
  expect(pickActive([{ id: 's01', ratio: 0 }])).toBe(null);
});
