import { calculateReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  it('calculates 1 min for short text', () => {
    const text = 'This is a short post with fewer than 200 words.';
    expect(calculateReadingTime(text)).toBe('1 min read');
  });

  it('calculates correctly for 400 words', () => {
    const text = 'word '.repeat(400);
    expect(calculateReadingTime(text)).toBe('2 min read');
  });

  it('rounds up partial minutes', () => {
    const text = 'word '.repeat(201);
    expect(calculateReadingTime(text)).toBe('2 min read');
  });
});