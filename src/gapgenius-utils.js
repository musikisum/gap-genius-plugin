import cloneDeep from '@educandu/educandu/utils/clone-deep.js';

const exampleText = 'An der Musikhochschule lernt man nicht nur ??Noten??, sondern auch, wie man mit vier Stunden Schlaf, drei Kaffees und einer kaputten Saite überlebt. Professor Müller hört selbst das leiseste falsche C, während du dich fragst, ob er ein Fledermaus-Gen hat. Während die ??Pianisten?? ihre Finger verknoten, üben die Sänger, Wagners Opern in der Mensa zu performen. Und am Ende? Ein Abschluss, ein Tinnitus – und die Fähigkeit, selbst im Schlaf Tonleitern zu spielen!';

const analyseText = text => {
  const regex = /\?\?(.*?)\?\?/g;
  let match;
  const departureTerms = [];
  while ((match = regex.exec(text)) !== null) {
    departureTerms.push(match[1]);
  };
  return departureTerms;
};

const adjustReplacementsTerms = (targetTerms, replacements) => {
  const copiedReplacements = cloneDeep(replacements);
  return Object.fromEntries(
    Object.entries(copiedReplacements)
      .filter(([key]) => targetTerms.includes(key))
      .map(([key, value]) => [key, typeof value === 'string' ? value : ''])
  );
};

const checkNumberOfSpecialSigns = text => {
  const count = (text.match(/\?\?/g) || [])?.length;
  // eslint-disable-next-line no-undefined
  return count !== null && count !== undefined && count % 2 === 0;
};

const GapGeniusUtils = {
  exampleText,
  analyseText,
  adjustReplacementsTerms,
  checkNumberOfSpecialSigns
};

export default GapGeniusUtils;