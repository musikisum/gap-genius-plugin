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
        text: 'Example text',
        width: 50,
        isEval: true,
        replacements: { 1: ['replacement1'] }
      };
  
      expect(() => sut.validateContent(validContent)).not.toThrow();
    });
  
    it('should throw an error if width is out of bounds', () => {
      const invalidContent = {
        text: 'Example text',
        width: 150, // Invalid width
        isEval: true,
        replacements: { 1: ['replacement1'] }
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  
    it('should throw an error if text is missing', () => {
      const invalidContent = {
        width: 50,
        isEval: true,
        replacements: { 1: ['replacement1'] }
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  
    it('should throw an error if indices contain a non-number', () => {
      const invalidContent = {
        text: 'Example text',
        width: 50,
        isEval: true,
        replacements: { 1: ['replacement1'] }
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  
    it('should throw an error if replacements keys are not numeric strings', () => {
      const invalidContent = {
        text: 'Example text',
        width: 50,
        isEval: true,
        replacements: { notANumber: ['replacement1'] }
      };
  
      expect(() => sut.validateContent(invalidContent)).toThrow(joi.ValidationError);
    });
  });
});
