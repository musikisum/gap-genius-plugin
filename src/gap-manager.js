import Fuse from 'fuse.js';

const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.7,
  keys: ['gap'], // optional
};

const getFuseMatch = test => {
  const fuse = new Fuse(test.synonyms.map(gap => ({ gap })), fuseOptions);
  const result = fuse.search(test.gapInput);
  const hasResult = result.length > 0;
  return hasResult ? { match: result[0].item.gap, input: test.gapInput, isRight: result.length > 0 } : null;
};

const refreshResults = tester => {
  const res = [];      
  for (let index = 0; index < Object.keys(tester).length; index += 1) {
    const test = tester[index];
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