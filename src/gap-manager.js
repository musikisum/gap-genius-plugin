import Fuse from 'fuse.js';

const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.3,
  keys: ['gap'], // optional
};

const getFuseMatch = test => {
  const fuse = new Fuse(test.synonyms.map(gap => ({ gap })), fuseOptions);
  const result = fuse.search(test.gapInput);
  const hasResult = result.length > 0;
  return hasResult 
    ? { match: result[0].item.gap, input: test.gapInput, isRight: true } 
    : { match: null, input: test.gapInput, isRight: false };
};

const refreshResults = tester => {
  const res = [];      
  for (let index = 0; index < Object.keys(tester).length; index += 1) {
    const test = tester[index];
    test.synonyms.unshift(test.expression);
    const match = getFuseMatch(test);
    res.push(match);   
  } 
  return res; 
};

const GapManager = {
  getFuseMatch,
  refreshResults
};

export default GapManager;