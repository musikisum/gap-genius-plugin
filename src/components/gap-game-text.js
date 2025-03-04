import PropTypes from 'prop-types';
import { Button, Tooltip } from 'antd';
import GapManager from '../gap-manager.js';
import { useTranslation } from 'react-i18next';
import GapResultPie from './gap-result-pie.js';
import GapResultTable from './gap-result-table.js';
import React, { useState, useEffect } from 'react';
import GapGeniusUtils from '../gap-genius-utils.js';
import GapGameTextInput from './gap-game-text-input.js';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';

function GapGameText({ content }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const { width, text, showFillIns, replacements } = content;
  const exampleResults = GapGeniusUtils.exampleResults;

  const [tester, setTester] = useState();
  const [evaluate, setEvaluate] = useState(false);
  const [results, setResults] = useState();

  useEffect(() => {
    const repl = replacements.length ? replacements : GapGeniusUtils.createNewReplacementObjects(text); 
    const obj = repl.reduce((akku, item) => {
      akku[item.index] = {
        expression: item.expression,
        gapInput: showFillIns ? exampleResults[item.index] : '',
        synonyms: item.list
      };
      return akku;
    }, {});
    setTester(obj);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (index, value) => {
    const testCopy = cloneDeep(tester);
    testCopy[index].gapInput = value;
    setTester(testCopy);
  };

  const createGapGameText = () => {
    const elements = [];
    let lastIndex = 0;
    let index = 0;
    const matches = GapGeniusUtils.findAllExpressions(text);
    for (const match of matches) {
      const { expression, list } = match;
      const originalMatch = `(${expression})(${list})`;
      const matchIndex = text.indexOf(originalMatch, lastIndex);
      if (matchIndex !== -1) {
        elements.push(text.substring(lastIndex, matchIndex));
        elements.push(<GapGameTextInput key={index} index={index} onTextInputChange={onChange} showFillIns={showFillIns} />);
        lastIndex = matchIndex + originalMatch.length;
        index += 1;
      }
    }
    elements.push(text.substring(lastIndex));
    return elements;
  };

  const onEvaluateButtonClick = () => {    
    setEvaluate(!evaluate);
    if (!evaluate) {
      setResults(GapManager.refreshResults(tester));
    }
  };

  const onRefreshButtonClick = () => {
    const newResults = GapManager.refreshResults(tester);
    setResults(newResults);
  };

  const table = <div className='left'><GapResultTable tester={tester} results={results} /></div>;
  const pie = <div className='right'><GapResultPie tester={tester} results={results} /></div>;

  return (
    <div className={`u-horizontally-centered u-width-${width}`}>
      <div className='gaptext-content'> 
        { createGapGameText() }
      </div>
      <div className='gaptext-button-area'>
        <Tooltip title={t('resultButton')}>
          <Button type='primary' onClick={onEvaluateButtonClick}>{!evaluate ? t('checkResult') : t('hideResult')}</Button>
        </Tooltip>
        <Tooltip title={t('refreshButton')}>
          <Button type='primary' onClick={onRefreshButtonClick} disabled={!evaluate}>{t('refreshResult')}</Button>
        </Tooltip>
      </div>
      { evaluate ? <div className='gaptext-evaluation-area'>{table}{pie}</div> : null }
    </div>
  );
};

GapGameText.propTypes = {
  content: PropTypes.object,
};

GapGameText.defaultProps = {
  content: null
};

export default GapGameText;
