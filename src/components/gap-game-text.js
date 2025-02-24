import { Button } from 'antd';
import PropTypes from 'prop-types';
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
  console.log('replacements:', replacements)
  const exampleResults = GapGeniusUtils.exampleResults;

  const [tester, setTester] = useState();
  const [evaluate, setEvaluate] = useState(false);
  const [results, setResults] = useState();

  useEffect(() => {
    const obj = replacements.reduce((akku, item) => {
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
    for (const match of text.matchAll(GapGeniusUtils.regex)) {
      elements.push(text.substring(lastIndex, match.index));
      elements.push(<GapGameTextInput key={index} index={index} onTextInputChange={onChange} showFillIns={showFillIns} />);
      lastIndex = match.index + match[0].length;
      index += 1;
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

  return (
    <div className={`u-horizontally-centered u-width-${width}`}>
      <div className='gaptext-content'> 
        { createGapGameText() }
      </div>
      <div className='gaptext-button-area'>
        <Button type='primary' onClick={onEvaluateButtonClick}>{!evaluate ? t('checkResult') : t('hideResult')}</Button>
        <Button type='primary' onClick={onRefreshButtonClick} disabled={!evaluate}>{t('refreshResult')}</Button>
      </div>
      <div className='gaptext-evaluation-area'>
        <div className='left'>
          { evaluate 
            ? <GapResultTable results={results} replacements={replacements} />
            : null}
        </div>
        <div className='right'>
          { evaluate 
            ? <GapResultPie results={results} replacements={replacements} />
            : null}
        </div>
      </div>
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
