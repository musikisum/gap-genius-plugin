import GapGeniusUtils from './gap-genius-utils.js';
import { describe, expect, it } from 'vitest';

describe('gap-genius-utils', () => {

  describe('createNewReplacementObjects', () => {
    const testCases = [{ text: 'This is a text with (twice)(one) anchor (elements)([Hello](anchor) (text)!)!',
      expected: [
        { expression: 'twice', list: 'one' },
        { expression: 'elements', list: '[Hello](anchor) (text)!' }
      ] }, { text: 'This is a text with (twice)(one, two) anchor (elements)((test))!',
      expected: [
        { expression: 'twice', list: 'one, two' },
        { expression: 'elements', list: '(test)' }
      ] }, { text: 'This is a [text](https://kaiser-ulrich.de) with (twice)(one/two) anchor (elements)((test))!',
      expected: [
        { expression: 'twice', list: 'one/two' },
        { expression: 'elements', list: '(test)' }
      ] },
    { text: 'This is a text with (skjsaksjfsfk)(one, two, three) anchor (!?=7635)(one; two; three)!',
      expected: [
        { expression: 'skjsaksjfsfk', list: 'one, two, three' },
        { expression: '!?=7635', list: 'one; two; three' }
      ] },
    { text: 'This is a text with ((test))(one) (((blub))) anchor.',
      expected: [
        { expression: '(test)', list: 'one' }
      ] },
    { text: 'This is a text with ([Hello](anchor))(one) anchor test.',
      expected: [
        { expression: '[Hello](anchor)', list: 'one' }
      ] }
    ];
  
    testCases.forEach((testCase, index) => {
      it(`should correctly extract matches for test case ${index + 1}`, () => {
        const matches = GapGeniusUtils.findAllExpressions(testCase.text);    
        expect(matches).toEqual(testCase.expected);
      });
    });
  });

  describe('updateText', () => {
    it('should update text correctly in gap mode', () => {
      const text = 'This is a test (Akkord)(Akkord, option1, option2).';
      const replacements = GapGeniusUtils.createNewReplacementObjects(text, false);
      const updated = GapGeniusUtils.updateText(text, replacements, false);
      expect(updated).toBe('This is a test (Akkord)(option1; option2).');
    });

    it('should update text correctly in footnote mode', () => {
      const text = 'This is a test (Akkord)(option1, option2).';
      const replacements = GapGeniusUtils.createNewReplacementObjects(text, true);
      const updated = GapGeniusUtils.updateText(text, replacements, true);
      expect(updated).toBe('This is a test (Akkord)(option1, option2).');
    });
  });

  describe('createListFromInputLine', () => {
    it('should return an array if the input is empty', () => {
      const result = GapGeniusUtils.createListFromInputLine('', 'expression', false);
      expect(result).toEqual([]);
    });

    it('should return an empty array if the input is empty', () => {
      const result = GapGeniusUtils.createListFromInputLine('', 'expression', true);
      expect(result).toEqual([]);
    });

    it('should return an array with three items', () => {
      const result = GapGeniusUtils.createListFromInputLine('Hallo, Welt!, Hello, World!', 'hello', false);
      expect(result).toEqual(['Hallo', 'Welt!', 'World!']);
    });

    it('should return an array width a single element in footnote mode', () => {
      const result = GapGeniusUtils.createListFromInputLine('Hallo, Welt!, Hello, World!', 'hallo', true);
      expect(result).toEqual(['Hallo, Welt!, Hello, World!']);
    });

    it('should split the input into multiple options in gap game mode, excluding the expression', () => {
      const result = GapGeniusUtils.createListFromInputLine('option1, option2; option3, Akkord', 'akkord', false);
      expect(result).toEqual(['option1', 'option2', 'option3']);
    });
  });

  describe('createInputfromList', () => {
    it('should return an empty string if the list is empty', () => {
      const result = GapGeniusUtils.createInputfromList('Akkord', [], false);
      expect(result).toBe('');
    });

    it('should return a joined string for gap mode excluding the expression', () => {
      const result = GapGeniusUtils.createInputfromList('Akkord', ['Akkord', 'option1', 'option2'], false);
      expect(result).toBe('option1; option2');
    });

    it('should return a joined string for footnote mode (without filtering)', () => {
      const result = GapGeniusUtils.createInputfromList('Akkord', ['Akkord', 'option1', 'option2'], true);
      expect(result).toBe('Akkord option1 option2');
    });
  });

  describe('createFootnoteReplacements', () => {
    it('should update the replacement object list to contain only one element', () => {
      const replacements = [
        { index: 0, expression: '[Akkord](link)', list: ['[Akkord](https://link.de)', 'option1', 'option2'] }
      ];
      const updated = GapGeniusUtils.createFootnoteReplacements(replacements);
      expect(updated[0].list.length).toBe(1);
      expect(updated[0].list[0]).toBe('[Akkord](https://link.de); option1; option2');
    });
  });

  describe('createGapGameReplacements', () => {
    it('should update the list for gap game mode', () => {
      const replacements = [
        { index: 0, expression: 'Akkord', list: ['Akkord; option1; Akkord; option2'] },
        { index: 1, expression: 'Klang', list: ['sound; noise'] },
        { index: 2, expression: 'Akkord', list: ['Akkord'] }
      ];
      const updated = GapGeniusUtils.createGapGameReplacements(replacements);

      expect(updated[0].list).toEqual(['option1; option2']);
      expect(updated[1].list).toEqual(['sound; noise']);
      expect(updated[2].list).toEqual([]);
    });
  });
});