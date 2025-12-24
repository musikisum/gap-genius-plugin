import Updater from './update-vaidation.js';
import { describe, expect, it } from 'vitest';

describe('sanitizeReplacements', () => {
  it('returns an empty array if input is not an array', () => {
    expect(Updater.sanitizeContent({ replacements: null }).replacements).toEqual([]);
    expect(Updater.sanitizeContent({ replacements: 'string' }).replacements).toEqual([]);
    expect(Updater.sanitizeContent({ replacements: 123 }).replacements).toEqual([]);
  });

  it('filters out invalid replacements and keeps valid ones', () => {
    const input = [
      { index: 1, expression: 'valid', gaptext: 'gap', list: ['a', 'b'] },
      { index: 'not a number', expression: 'invalid' },
      { index: 2, expression: 123, gaptext: null, list: ['valid'] },
    ];
    
    const expectedOutput = [
      { index: 1, expression: 'valid', gaptext: 'gap', list: ['a', 'b'] },
      { index: 2, expression: '', gaptext: '', list: ['valid'] },
    ];    
    expect(Updater.sanitizeContent({ replacements: input }).replacements).toEqual(expectedOutput);
  });
});

describe('sanitizeContent', () => {
  it('returns default plugin content if input is invalid', () => {
    expect(Updater.sanitizeContent(null)).toEqual(Updater.sanitizeContent({}));
    expect(Updater.sanitizeContent(123)).toEqual(Updater.sanitizeContent({}));
    expect(Updater.sanitizeContent('string')).toEqual(Updater.sanitizeContent({}));
  });

  it('merges valid input and falls back to default values where necessary', () => {
    const input = {
      width: 80,
      text: 'Hello',
      cacheText: 'Cached',
      footnotes: true,
      showExample: true,
      showFillIns: false,
      replacements: [{ index: 5, expression: 'test' }],
      extraProperty: 'should be ignored'
    };
    const expectedOutput = {
      width: 80,
      text: 'Hello',
      cacheText: 'Cached',
      footnotes: true,
      showExample: true,
      showFillIns: false,
      replacements: [{ index: 5, expression: 'test', gaptext: '', list: [] }]
    };

    expect(Updater.sanitizeContent(input)).toEqual(expectedOutput);
  });
});
