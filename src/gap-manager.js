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

const GapManager = {
  getFuseMatch
};

export default GapManager;