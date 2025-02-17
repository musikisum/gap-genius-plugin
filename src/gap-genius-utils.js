const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definitionen ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(zwei) Töne als Akkord hören, (drei)() Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (C)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten) anzukämpfen?';

const _regex = /\((?<expression>[^()]+)\)\((?<list>[^()]*)\)/g;

const createNewReplacementObjects = (text, footnotes) => {
  let index = 0;
  const obj = [];
  for (const match of text.matchAll(_regex)) {
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

function updateTextWithSynonyms(text, replacements, footnotes) {
  let matchIndex = 0;
  return text.replace(_regex, (match, expression) => {
    const replacementObj = replacements[matchIndex];
    matchIndex += 1;
    if (replacementObj && replacementObj.expression === expression) {
      return !footnotes ? `(${expression})(${replacementObj.list.join('; ')})` : `(${expression})(${replacementObj.list[0]})`;
    } 
    return match;     
  });
}

const GapGeniusUtils = {
  exampleText,
  updateTextWithSynonyms,
  createNewReplacementObjects
};

export default GapGeniusUtils;