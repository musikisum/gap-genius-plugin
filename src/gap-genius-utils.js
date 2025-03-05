// Text for exemplification, hwo does the plugin work 
const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definition ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(drei) Töne als Akkord hören, (drei)(vier) Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden, widersprüchlich), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (c)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten, andere Meinungen, Unwissenheit) anzukämpfen?';

// Example object for example mode
const exampleResults = ['Akord', 'Klang', 'Gehör', 'zwei', 'drei', 'Klang', 'falsch', 'c-Dur Akord', 'c', 'Blödheit'];

// Create an replacement object with index, espression and list properties from text 
const createNewReplacementObjects = (text, footnotes) => {
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
        closeParens += 1;
      } else if (text[rightIndex] === ')') {
        if (closeParens > 0) {
          closeParens -= 1;
        } else {
          break; // match the )-sign of an expression
        }
      }
      rightIndex += 1;
    }
    // Save expression and list
    if (leftIndex >= 0 && rightIndex < text.length) {
      const expression = text.slice(leftIndex + 1, splitIndex).trim();
      const rawList = text.slice(splitIndex + 2, rightIndex).trim();
      const gaptext = rawList ? rawList : '';
      let list;
      if (footnotes) {
        list = rawList ? [rawList] : [''];
      } else {
        list = rawList ? rawList.split(/[,;]\s*/).map(item => item.trim()) : [rawList];
      }
      matches.push({ index: matches.length, expression, gaptext, list });
    }
    searchIndex = rightIndex + 1;
  }
  return matches;
};

// Update text from replacements
const updateText = (text, replacements, footnotes) => {
  if (replacements.length === 0) {
    return text;
  }
  let updatedText = text;
  const matches = createNewReplacementObjects(text, footnotes);
  for (let index = 0; index < matches.length; index += 1) {
    if (replacements[index]) {
      const { expression, gaptext } = matches[index];
      const oldResult = `(${expression})(${gaptext})`;
      const newGapText = replacements[index]?.gaptext ?? '';
      const newResult = `(${expression})(${newGapText})`;
      const position = updatedText.indexOf(oldResult);
      if (position !== -1) {
        const head = updatedText.substring(0, position);
        const tail = updatedText.substring(position + oldResult.length);
        updatedText = head.concat('', newResult, tail);
      }
    }    
  }
  return updatedText;
};

// Create text for the input copmponent
const createInputfromList = (expression, list, footnotes) => {
  if (!list || list.length === 0) {
    return '';
  }
  const tempList = footnotes 
    ? [...list] 
    : [...new Set(list)].filter(item => item.toLowerCase() !== expression.toLowerCase());
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
  updateText,
  createNewReplacementObjects,
  createListFromInputLine,
  createInputfromList,
  createClippedLabelText
};

export default GapGeniusUtils;

