import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import GapGeniusUtils from '../gap-genius-utils.js';
import GapGameTextInput from './gap-game-text-input.js';

import cloneDeep from '@educandu/educandu/utils/clone-deep.js';

function GapGameText({ content }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const { width, text, replacements } = content;
  const [tester, setTester] = useState();
  const [evaluate, setEvaluate] = useState(false);

  useEffect(() => {
    const obj = replacements.reduce((akku, item) => {
      akku[item.index] = {
        expression: item.expression,
        gapInput: '',
        synonyms: item.list
      };
      return akku;
    }, {});
    setTester(obj);
  }, [replacements]);

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
      elements.push(<GapGameTextInput key={index} index={index} onTextInputChange={onChange} />);
      lastIndex = match.index + match[0].length;
      index += 1;
    }
    elements.push(text.substring(lastIndex));
    return elements;
  };

  const onEvaluateButtonClick = () => {
    setEvaluate(!evaluate);
  };

  return (
    <div className={`u-horizontally-centered u-width-${width}`}>
      <div className='gaptext-content'> 
        { createGapGameText() }
      </div>
      <div className='gaptext-button-area'>
        <Button type='primary' onClick={onEvaluateButtonClick}>{!evaluate ? t('checkResult') : t('hideResult')}</Button>
      </div>
      { evaluate 
        ? <div className='gaptext-evaluation-area' /> 
        : null}
    </div>
  );

  // return /* @__PURE__ */ React.createElement(Markdown, { renderAnchors: true, className: `u-horizontally-centered u-width-${content.width}` }, content.text);
};

GapGameText.propTypes = {
  content: PropTypes.object,
};

GapGameText.defaultProps = {
  content: null
};

export default GapGameText;
