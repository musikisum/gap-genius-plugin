// Text for exemplification, hwo does the plugin work 
const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definition ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(drei) Töne als Akkord hören, (drei)(vier) Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden, widersprüchlich), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (c)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten, andere Meinungen, Unwissenheit) anzukämpfen?';

// Example object for example mode
const exampleResults = ['Akord', 'Klang', 'Gehör', 'zwei', 'drei', 'Klang', 'falsch', 'c-Dur Akord', 'c', 'Blödheit'];

// Find all matches (expression)(list)
function findAllExpressions(text) {
  const matches = [];
  let searchIndex = 0;

  while (searchIndex < text.length) {
    const splitIndex = text.indexOf(')(', searchIndex);
    if (splitIndex === -1) {
      break; // no result
    }
    let leftIndex = splitIndex - 1;
    let rightIndex = splitIndex + 2;
    // Search (-sign on the left for an expression
    let openParens = 0;
    while (leftIndex >= 0) {
      if (text[leftIndex] === ')') {
        openParens += 1;
      } else if (text[leftIndex] === '(') {
        if (openParens > 0) {
          openParens -= 1; 
        } else {
          break; // match the (-sign of an expression
        }
      }
      leftIndex -= 1;
    }
    // Search )-sign on the right for the list
    let closeParens = 0;
    while (rightIndex < text.length) {
      if (text[rightIndex] === '(') {
        closeParens += 1; // Eine offene Klammer -> Zukünftige geschlossene ignorieren
      } else if (text[rightIndex] === ')') {
        if (closeParens > 0) {
          closeParens -= 1; // Diese ")" gehört zu einer inneren Klammer und wird ignoriert
        } else {
          break; // Dies ist die schließende Klammer von `list`
        }
      }
      rightIndex += 1;
    }
    // Save expression and list
    if (leftIndex >= 0 && rightIndex < text.length) {
      const expression = text.slice(leftIndex + 1, splitIndex);
      const list = text.slice(splitIndex + 2, rightIndex);
      matches.push({ expression, list });
    }
    //set new searchIndex for the next )(-match
    searchIndex = rightIndex + 1;
  }

  return matches;
}

// Create an replacement object with index, espression and list properties from text 
const createNewReplacementObjects = (text, footnotes) => {
  const matches = findAllExpressions(text);
  return matches.map((match, index) => {
    const expression = match.expression;
    let list;
    if (footnotes) {
      list = [match.list];
    } else {
      list = match.list
        .split(/[,;]\s*/)
        .filter(item => item && item !== expression);
      list = [...new Set(list)];
    }    
    return { index, expression, list };
  });
};

// Update lists in replacements for footnote mode 
const createFootnoteReplacements = replacements => {
  return replacements.map(obj => {
    if (!obj.list.length) {
      return obj;
    };
    const newList = [obj.list.join('; ')];
    return { ...obj, list: newList };
  });
};

function _escapeRegExp(expression) {
  return expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Update lists in replacements for game mode
const createGapGameReplacements = replacements => {
  return replacements.map(obj => {
    if (!obj.list.length || !obj.list[0]) {
      return obj;
    }
    const escapedExpression = _escapeRegExp(obj.expression);
    const tokenRegex = new RegExp(`(?:^|;\\s*)${escapedExpression}(?=\\s*[;]|$)`, 'g');
    // Remove expression from list
    const cleanedList = obj.list
      .map(item => item.replace(tokenRegex, '').trim())
      .map(item => item.replace(/^;\s*|;\s*$/g, ''))
      .filter(Boolean);
    return { ...obj, list: [...new Set(cleanedList)] };
  });
};

// Update text from replacements
function updateText(text, replacements, footnotes) {
  let updatedText = text;
  let matchIndex = 0;
  const matches = findAllExpressions(text);
  for (const match of matches) {
    const { expression, list } = match;
    const replacementObj = replacements[matchIndex];
    matchIndex += 1;
    if (replacementObj && replacementObj.expression === expression) {
      const inputValue = footnotes ? replacementObj.list[0] : replacementObj.list.join('; ');
      const replacementText = `(${expression})(${inputValue ? inputValue : ''})`;
      const originalMatch = `(${expression})(${list})`;
      updatedText = updatedText.replace(originalMatch, replacementText);
    }
  }
  return updatedText;
}

// Create text for the input copmponent
const createInputfromList = (expression, list, footnotes) => {
  if (!list || list.length === 0) {
    return '';
  }
  const tempList = footnotes ? [...list] : [...new Set(list)].filter(item => item !== expression);
  return footnotes ? tempList.join(' ') : tempList.join('; ');
};

// Update replacements after change of input field
const createListFromInputLine = (inputLine, expression, footnotes) => {
  if (!inputLine) {
    return [];
  }
  if (footnotes) {
    return [inputLine];
  }
  return inputLine
    .split(/\s*[;,]\s*/)
    .map(word => word.trim())
    .filter(word => word.length > 0 && word.toLowerCase() !== expression.toLowerCase());
};

const createClippedLabelText = text => {
  if (text.length > 14) {
    return `${text.substring(0, 14)} ...`;    
  }
  return text;
};

const GapGeniusUtils = {
  exampleText,
  exampleResults,
  findAllExpressions,
  updateText,
  createNewReplacementObjects,
  createListFromInputLine,
  createInputfromList,
  createFootnoteReplacements,
  createGapGameReplacements,
  createClippedLabelText
};

export default GapGeniusUtils;

