const pluginContent = {
  width: 100,
  text: '',
  cacheText: '',
  footnotes: false,
  showExample: false,
  showFillIns: false,
  replacements: []
};

const sanitizeReplacements = replacements => {
  if (!Array.isArray(replacements)) {
    return [];
  }
  const newReplaxements = replacements.reduce((akku, replacement) => {
    if(typeof replacement?.index === 'number') {
      akku.push({
        index: replacement.index,
        expression: typeof replacement.expression === 'string' ? replacement.expression : '',
        gaptext: typeof replacement.gaptext === 'string' ? replacement.gaptext : '',
        list: Array.isArray(replacement.list) ? replacement.list.filter(item => typeof item === 'string') : []
      });
    }
    return akku;
  }, []); 
  return newReplaxements;
};

const sanitizeContent = loadedContent => {
  if (!loadedContent || typeof loadedContent !== 'object') {
    return { ...pluginContent };
  }
  const updateContent = {};
  Object.keys(pluginContent).forEach(key => {
    if (key in loadedContent) {
      updateContent[key] = key === 'replacements' 
        ? sanitizeReplacements(loadedContent[key]) 
        : loadedContent[key];
    } else {
      updateContent[key] = pluginContent[key];
    }
  });
  return updateContent;
};

const Updater = {
  sanitizeContent
};

export default Updater; 