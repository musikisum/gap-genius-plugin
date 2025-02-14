import cloneDeep from '@educandu/educandu/utils/clone-deep.js';

const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem ??Akkord??, wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem ??Klang?? gesprochen. Nach dieser Definitionen ist unser musikalisches ??Hören?? entscheidend für die Verwendung der Begriffe. Man ??zwei?? Töne als Akkord hören, ??drei?? Töne in Terzschichtung dagegen auch als ??Klang??. Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang ??falsch??, denn es müsste C-Dur-??Akkord?? heißen, weil der Ausdruck aussagt, dass wir ??C?? als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen ??Windmühlen?? anzukämpfen?';

const regex = /\?\?(.*?)\?\?/g;

const createNewReplacementObject = (oldReplacements, text) => {
  let match;
  const replacements = {};
  while ((match = regex.exec(text)) !== null) {
    const key = match.index;
    const length = match[1].length;
    const term = text.substring(key + 2, key + 2 + length);
    const synonyms = [term];
    // add database based list of synonyms and merge with keyword
    if (oldReplacements && (key in oldReplacements)) {
      const newSet = new Set(synonyms);
      oldReplacements[key].forEach(word => newSet.add(word.trim()));
      synonyms.length = 0;
      synonyms.push(...newSet);
    }
    replacements[key] = synonyms;
  }
  return replacements;
};

const GapGeniusUtils = {
  exampleText,
  createNewReplacementObject
};

export default GapGeniusUtils;