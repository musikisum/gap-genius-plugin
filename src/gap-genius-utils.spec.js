import GapGeniusUtils from './gap-genius-utils.js';
import { describe, expect, it } from 'vitest';

describe('gap-genius-utils', () => {

  describe('createNewReplacementObjects', () => {
    const testCases = [
      { text: 'This is a text with (twice)(one) anchor (elements)([Hello](anchor) (text)!)!',
        expected: [
          { index: 0, expression: 'twice', gaptext: 'one', list: ['one'] },
          { index: 1, expression: 'elements', gaptext: '[Hello](anchor) (text)!', list: ['[Hello](anchor) (text)!'] }
        ] }, { text: 'This is a text with (twice)(one, two) anchor (elements)((test))!',
        expected: [
          { index: 0, expression: 'twice', gaptext: 'one, two', list: ['one, two'] },
          { index: 1, expression: 'elements', gaptext: '(test)', list: ['(test)'] }
        ] }, { text: 'This is a [text](https://kaiser-ulrich.de) with (twice)(one/two) anchor (elements)((test))!',
        expected: [
          { index: 0, expression: 'twice', gaptext: 'one/two', list: ['one/two'] },
          { index: 1, expression: 'elements', gaptext: '(test)', list: ['(test)'] }
        ] }, { text: 'This is a text with (skjsaksjfsfk)(one, two, three) anchor (!?=7635)(one; two; three)!',
        expected: [
          { index: 0, expression: 'skjsaksjfsfk', gaptext: 'one, two, three', list: ['one', 'two', 'three'] },
          { index: 1, expression: '!?=7635', gaptext: 'one; two; three', list: ['one', 'two', 'three'] }
        ] }, { text: 'This is a text with ((test))(one) (((blub))) anchor.',
        expected: [
          { index: 0, expression: '(test)', gaptext: 'one', list: ['one'] }
        ] }, { text: 'This is a text with ([Hello](anchor))(one, two) anchor test.',
        expected: [
          { index: 0, expression: '[Hello](anchor)', gaptext: 'one, two', list: ['one', 'two'] }
        ] }
    ];
  
    testCases.forEach((testCase, index) => {
      const footnoteValue = index < 3;
      if (footnoteValue) {
        it(`should correctly extract matches for test case ${index + 1}`, () => {
          const matches = GapGeniusUtils.createNewReplacementObjects(testCase.text, footnoteValue);    
          expect(matches).toEqual(testCase.expected);
        });        
      } else {
        it(`should correctly extract matches for test case ${index + 1}`, () => {
          const matches = GapGeniusUtils.createNewReplacementObjects(testCase.text, footnoteValue);    
          expect(matches).toEqual(testCase.expected);
        });
      }
    });
  });

  describe('updateText', () => {
    it('should update text correctly in gap mode', () => {
      const text = 'This is a test (Akkord)(Akkord, option1, option2).';
      const inputLine = 'option1; option2';
      const list = GapGeniusUtils.createListFromInputLine(inputLine, 'Akkord', false);
      const replacements = [
        {
          index: 0,
          expression: 'Akkord',
          gaptext: inputLine,
          list
        }
      ];
      const updated = GapGeniusUtils.updateText(text, replacements, false);
      expect(updated).toBe('This is a test (Akkord)(option1; option2).');
    });

    it('should update text correctly in footnote mode', () => {
      const text = 'This is a test (Akkord)(option1, option2).';
      const replacements = GapGeniusUtils.createNewReplacementObjects(text, true);
      const inputLine = 'Akkord, option1, option2';
      replacements[0].gaptext = inputLine;
      replacements[0].list = GapGeniusUtils.createListFromInputLine(inputLine, replacements[0].expression, true);
      const updated = GapGeniusUtils.updateText(text, replacements, true);
      expect(updated).toBe('This is a test (Akkord)(Akkord, option1, option2).');
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

});
