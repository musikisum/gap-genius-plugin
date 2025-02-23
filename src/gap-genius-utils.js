// Text for exemplification, hwo does the plugin work 
const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definition ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen, Gehör) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(zwei, drei) Töne als Akkord hören, (drei)(drei, vier) Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden, widersprüchlich), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (C)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten, andere Meinungen, Unwissenheit) anzukämpfen?';

// Example object for example mode
const exampleResults = ['Akord', 'Klang', 'Gehör', 'zwei', 'drei', 'Klang', 'falsch', 'c-Dur Akord', 'c', 'Blödheit'];

// Regex to match the marks on an expression with synonyms or a footnote 
// const regex = /\((?<expression>[^()]+)\)\((?<list>[^()]*)\)/g; | without mardown links
const regex = /\((?<expression>[^()]+)\)\((?<list>[^()]*?(?:\[[^\]]+\]\([^)]+\))?[^()]*)\)/g;

// Replace the default text in footnote mode for empty inputs
const _getRegexReplaceFootnoteDefaultText = translation => {
  return new RegExp(`(?:;\\s*)?\\d+\\.\\s*${translation}\\s*`, 'g');
};

// Replace expressions in footnode mode
const _getRegexReplaceExpressionText = exp => {
  return new RegExp(`^${exp}(\\s*;\\s*)?`);
};

// Create an replacement object with index, espression and list properties from text 
const createNewReplacementObjects = (text, footnotes) => {
  let index = 0;
  const obj = [];
  for (const match of text.matchAll(regex)) {
    const expression = match.groups.expression;
    let list;
    if (!footnotes) {
      list = match.groups.list.split(/[,;]\s*/).filter(item => item !== ''); 
      if (list[0] !== expression) {
        list.unshift(expression);
      }
      list = [...new Set(list)];
    } else {
      list = [match.groups.list];
    }
    obj.push({ index, expression, list });
    index += 1;
  };
  return obj;
};

// Update lists in replacements for footnote mode 
const createFootnoteReplacements = (replacements, footenoteErrorText) => {
  return replacements.map(obj => {
    let tempValue = obj.list.join('; ');
    tempValue = tempValue.replace(_getRegexReplaceExpressionText(obj.expression), '');
    if (tempValue.length === 0) {
      tempValue = `${obj.index + 1}. ${footenoteErrorText}`;
    }
    obj.list[0] = tempValue;
    obj.list.length = 1; 
    return obj;
  });
};

// Update lists in replacements for game mode
const createGapGameReplacements = (replacements, footenoteErrorText) => {
  return replacements.map(obj => {
    if (!obj.list.length) {
      return obj;
    }
    let valueIndex0 = obj.list[0];
    valueIndex0 = valueIndex0.replace(_getRegexReplaceFootnoteDefaultText(footenoteErrorText), '');
    const newList = valueIndex0
      .split(/[,;]\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    if (newList[0]?.toLowerCase() !== obj.expression.toLowerCase()) {
      newList.unshift(obj.expression);
    }
    return { ...obj, list: newList };
  });
};

// Create text for the input copmponent
const createInputfromList = (index, exp, list, footnotes, footenoteErrorText) => {
  const footnoteDefaultValue = `${index + 1}. ${footenoteErrorText}`;
  if (list.length === 0) {
    return footnotes ? footnoteDefaultValue : exp;
  } 
  if (footnotes) {
    if (list.length === 1) {
      return list[0] === exp ? footnoteDefaultValue : list[0];
    } 
    return list[0] === exp ? list.slice(1).join(' ') : list.join(' ');  
  } 
  let inputLine = [...new Set(list)].join('; ');
  inputLine = inputLine.replace(_getRegexReplaceFootnoteDefaultText(footenoteErrorText));
  return inputLine;
};

// Update text from replacements
function updateText(text, replacements, hasFootnotes) {
  let matchIndex = 0;
  return text.replace(regex, (match, expression) => {
    const replacementObj = replacements[matchIndex];
    matchIndex += 1;
    if (replacementObj && replacementObj.expression === expression) {
      const inputValue = hasFootnotes ? replacementObj.list[0] : replacementObj.list.join('; ');
      if (hasFootnotes) {
        return `(${expression})(${inputValue})`;
      } // !footnotes
      return inputValue.startsWith(expression) ? `(${expression})(${inputValue})` : `(${expression})(${expression}; ${inputValue})`;
    }
    return match;
  });
};

// Update replacements after change of input field
const createListFromInputLine = (inputLine, expression, footnotes) => {
  if (!inputLine) {
    return [];
  }
  if (footnotes) {
    return [inputLine];
  }
  const resultForGaps = inputLine
    .split(/\s*[;,]\s*/)
    .map(word => word.trim())
    .filter(word => word.length > 0);
  if (resultForGaps[0].toLowerCase() !== expression.toLowerCase()) {
    resultForGaps.unshift(expression);
  }
  return resultForGaps;   
};

const GapGeniusUtils = {
  regex,
  exampleText,
  exampleResults,
  updateText,
  createNewReplacementObjects,
  createListFromInputLine,
  createInputfromList,
  createFootnoteReplacements,
  createGapGameReplacements
};

export default GapGeniusUtils;

