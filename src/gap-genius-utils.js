const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem (Akkord)(), wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem (Klang)(Geräusch) gesprochen. Nach dieser Definitionen ist unser musikalisches (Hören)(Wahrnehmen, Denken, Vorstellen) entscheidend für die Verwendung der Begriffe. Man kann (zwei)(zwei) Töne als Akkord hören, (drei)() Töne in Terzschichtung dagegen auch als (Klang)(). Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang (falsch)(ungenau, schlecht, zu vermeiden), denn es müsste (C-Dur-Akkord)() heißen, weil der Ausdruck aussagt, dass wir (C)() als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen (Windmühlen)(die Masse, Vorurteile, ungenaues Denken, alle, die meisten) anzukämpfen?';

const _regex = /\((?<expression>[^()]+)\)\((?<list>[^()]*)\)/g;

const createNewReplacementObjects = text => {
  let index = 0;
  const obj = [];
  for (const match of text.matchAll(_regex)) {
    const expression = match.groups.expression;
    const list = match.groups.list.split(/[;]\s*/).filter(item => item !== '');
    list.unshift(expression);
    obj.push({ index, expression, list: [...new Set(list)] });
    index += 1;
  };
  return obj;
};

function updateTextWithSynonyms(text, replacements) {
  if (!text) {
    return 'Ein interner Fehler ist aufgetreten, Entschuldigung!';
  }
  let matchIndex = 0;
  return text.replace(_regex, (match, expression) => {
    const replacementObj = replacements[matchIndex];
    matchIndex += 1;
    return replacementObj && replacementObj.expression === expression 
      ? `(${expression})(${replacementObj.list.join('; ')})`
      : match;
  });
}

const GapGeniusUtils = {
  exampleText,
  updateTextWithSynonyms,
  createNewReplacementObjects
};

export default GapGeniusUtils;