// Text for exemplification, hwo does the plugin work 
const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definition ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen, Gehör) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(zwei, drei) Töne als Akkord hören, (drei)(drei, vier) Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden, widersprüchlich), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (C)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten, andere Meinungen, Unwissenheit) anzukämpfen?';

// Example object for example mode
const exampleResults = ['Akord', 'Klang', 'Gehör', 'zwei', 'drei', 'Klang', 'falsch', 'c-Dur Akord', 'c', 'Blödheit'];

// Regex to match the marks on an expression with synonyms or a footnote 
// const regex = /\((?<expression>[^()]+)\)\((?<list>(?:[^()]+|\([^()]*\))*)\)/g;
const regex = /\((?<expression>(?:[^()]+|\([^()]*\))+)\)\((?<list>(?:[^()]+|\([^()]*\))*)\)/g;

// Create an replacement object with index, espression and list properties from text 
const createNewReplacementObjects = text => {
  const matches = [...text.matchAll(regex)];
  return matches.map((match, index) => {
    const expression = match.groups.expression;
    let list = match.groups.list
      .split(/[,;]\s*/)
      .filter(item => item && item !== expression);
    list = [...new Set(list)];
    return { index, expression, list };
  });
};

// Update lists in replacements for footnote mode 
const createFootnoteReplacements = replacements => {
  return replacements.map(obj => {
    obj.list[0] = obj.list.join('; ');
    obj.list.length = 1;
    return obj;
  });
};

// Regex helper function
function _escapeRegExp(expression) {
  return expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update lists in replacements for game mode
const createGapGameReplacements = replacements => {
  return replacements.map(obj => {
    if (!obj.list.length) {
      return obj;
    }
    const escapedExpression = _escapeRegExp(obj.expression);
    const tokenRegex = new RegExp(`(?:^|[;]\\s*)${escapedExpression}(?=\\s*(?:[;]|$))`, 'g');
    let cleaned = obj.list[0].replace(tokenRegex, '');
    cleaned = cleaned.replace(/^[;]\s*|[;]\s*$/g, '').trim();
    const newList = cleaned
      .split(/[;]\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
      
    return { ...obj, list: [...new Set(newList)] };
  });
};

// Create text for the input copmponent
const createInputfromList = (expression, list, footnotes) => {
  if (list.length === 0) {
    return '';
  } 
  const tempValue = [...new Set(list)].filter(item => item !== expression).join('; ');
  return footnotes ? list.join(' ') : tempValue;
};

// Update text from replacements
function updateText(text, replacements, footnotes) {
  let matchIndex = 0;
  return text.replace(regex, (match, expression) => {
    const replacementObj = replacements[matchIndex];
    matchIndex += 1;
    if (replacementObj && replacementObj.expression === expression) {
      const inputValue = footnotes ? replacementObj.list[0] : replacementObj.list.join('; ');
      return `(${expression})(${inputValue ? inputValue : ''})`;
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
    .filter(word => word.length > 0)
    .filter(word => word.toLowerCase() !== expression.toLowerCase());
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

