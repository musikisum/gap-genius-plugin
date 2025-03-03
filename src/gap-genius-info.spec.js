import joi from 'joi';
import GapGeniusInfo from './gap-genius-info.js';
import { beforeEach, describe, expect, it } from 'vitest';
import GithubFlavoredMarkdown from '@educandu/educandu/common/github-flavored-markdown.js';

describe('gap-genius-info', () => {
  let sut;

  beforeEach(() => {
    sut = new GapGeniusInfo(new GithubFlavoredMarkdown());
  });

  describe('redactContent', () => {
    it('redacts room-media resources from different rooms', () => {
      const result = sut.redactContent({
        text: '![Some image](cdn://room-media/63cHjt3BAhGnNxzJGrTsN1/some-image.png)'
      }, 'rebhjf4MLq7yjeoCnYfn7E');
      expect(result).toStrictEqual({
        text: '![Some image]()'
      });
    });

    it('leaves room-media resources from the same room intact', () => {
      const result = sut.redactContent({
        text: '![Some image](cdn://room-media/63cHjt3BAhGnNxzJGrTsN1/some-image.png)'
      }, '63cHjt3BAhGnNxzJGrTsN1');
      expect(result).toStrictEqual({
        text: '![Some image](cdn://room-media/63cHjt3BAhGnNxzJGrTsN1/some-image.png)'
      });
    });

    it('leaves non room-media resources intact', () => {
      const result = sut.redactContent({
        text: '![Some image](cdn://media-library/JgTaqob5vqosBiHsZZoh1/some-image.png)'
      }, 'rebhjf4MLq7yjeoCnYfn7E');
      expect(result).toStrictEqual({
        text: '![Some image](cdn://media-library/JgTaqob5vqosBiHsZZoh1/some-image.png)'
      });
    });
  });

  describe('getCdnResources', () => {
    it('returns media-library and room-media CDN resources from the text', () => {
      const result = sut.getCdnResources({
        text: [
          '![Some image](cdn://media-library/JgTaqob5vqosBiHsZZoh1/some-image.png)',
          '![Some image](cdn://room-media/63cHjt3BAhGnNxzJGrTsN1/some-image.png)',
          '![Some image](https://external-domain.org/some-image.png)'
        ].join('\n')
      });
      expect(result).toStrictEqual([
        'cdn://media-library/JgTaqob5vqosBiHsZZoh1/some-image.png',
        'cdn://room-media/63cHjt3BAhGnNxzJGrTsN1/some-image.png'
      ]);
    });
  });

  describe('GapGeniusInfo - validateContent', () => {

    beforeEach(() => {
      sut = new GapGeniusInfo(new GithubFlavoredMarkdown());
    });
  
    it('should validate correct content without throwing an error', () => {
      const validContent = {
        width: 60,
        text: 'Example text',
        cacheText: '',
        footnotes: false,
        showExample: false,
        showFillIns: false,
        replacements: [{ index: 0, expression: 'Akkord', list: ['dur', 'moll'] }]
      };
  
      expect(() => sut.validateContent(validContent)).not.toThrow();
    });
  
    it('should throw an error if list is not an array', () => {
      const invalidContent = {
        width: 60,
        text: 'Example text',
        cacheText: '(test)()',
        footnotes: false,
        showExample: false,
        showFillIns: true,
        replacements: [{ index: 0, expression: 'Akkord', list: 3 }]
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  
    it('should throw an error if text and cacheText are missing', () => {
      const invalidContent = {
        width: 60,
        text: null,
        footnotes: false,
        showExample: false,
        showFillIns: false,
        replacements: [{ index: 0, expression: 'Akkord', list: ['dur', 'moll'] }]
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  });
});
