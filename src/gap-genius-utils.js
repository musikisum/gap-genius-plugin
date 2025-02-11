const exampleText = 'Carl Dahlhaus hat die Begriffe Akkord und Klang sehr scharfsinnig definiert. Man spricht von einem ??Akkord??, wenn man einen Grundton hört, hören wir keinen Grundton, wird von einem ??Klang?? gesprochen. Nach dieser Definitionen ist unser musikalisches ??Hören?? entscheidend für die Verwendung der Begriffe. Man ??zwei?? Töne als Akkord hören, ??drei?? Töne in Terzschichtung dagegen auch als ??Klang??. Aus dieser Perspektive ist der Ausdruck C-Dur-Dreiklang ??falsch??, denn es müsste C-Dur-??Akkord?? heißen, weil der Ausdruck aussagt, dass wir ??C?? als Grundton wahrnehmen. Ist die Definition so gut, dass es sich lohnt, gegen ??Windmühlen?? anzukämpfen?';

// Create an object includes a dictionary of raplacements, an array of keywords and a boolean for an eaval number of special signs.
const transformTextToGapGeniusModel = (text, replacements) => {
  const regex = /\?\?(.*?)\?\?/g;
  let match;
  const gapGenius = {};
  const replacementDic = {};
  const keywords = [];
  const indices = [];
  while ((match = regex.exec(text)) !== null) {
    const index = match.index;    
    const length = match[1].length;
    const term = text.substring(index + 2, index + length + 2);
    // creates inices and keywords arrays with the same length
    indices.push(index);
    keywords.push(term);
    const synonyms = [term];
    // add database based list of synonyms and merge with keyword 
    if (replacements && (index in replacements)) {
      const newSet = new Set(synonyms);
      replacements[index].forEach(word => newSet.add(word));
      synonyms.length = 0;
      synonyms.push(...newSet);
    }
    replacementDic[index] = synonyms;
  };
  gapGenius.indices = indices;
  gapGenius.keywords = keywords;
  gapGenius.replacementDic = replacementDic;
  const count = (text.match(/\?\?/g) || [])?.length;
  // eslint-disable-next-line no-undefined
  gapGenius.isEval = count !== null && count !== undefined && count % 2 === 0;
  return gapGenius;
};

const GapGeniusUtils = {
  exampleText,
  transformTextToGapGeniusModel
};

export default GapGeniusUtils;