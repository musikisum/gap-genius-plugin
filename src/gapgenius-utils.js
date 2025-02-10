const exampleText = 'An der Musikhochschule lernt man nicht nur ??Noten??, sondern auch, wie man mit vier Stunden Schlaf, drei Kaffees und einer kaputten Saite überlebt. Professor Müller hört selbst das leiseste falsche C, während du dich fragst, ob er ein Fledermaus-Gen hat. Während die ??Pianisten?? ihre Finger verknoten, üben die Sänger, Wagners Opern in der Mensa zu performen. Und am Ende? Ein Abschluss, ein Tinnitus – und die Fähigkeit, selbst im Schlaf Tonleitern zu spielen!';

const analyseText = (text, inserts) => {
  const regex = /\?\?(.*?)\?\?/g;
  let match;
  inserts.length = 0;
  while ((match = regex.exec(text)) !== null) {
    inserts.push({
      word: match[1],
      words: []
    });
  };
};

const GapGeniusUtils = {
  exampleText,
  analyseText
};

export default GapGeniusUtils;