import { describe, expect, it } from 'vitest';
import wordsRaw from '~/assets/words.txt?raw';

describe('word list', () => {
  it('contains 1,442 unique lowercase five-letter words', () => {
    const words = wordsRaw.trim().split(/\r?\n/);

    expect(words).toHaveLength(1442);
    expect(new Set(words).size).toBe(words.length);
    expect(words.every(word => /^[a-z]{5}$/.test(word))).toBe(true);
  });
});
