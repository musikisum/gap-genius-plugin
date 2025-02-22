import { Button } from 'antd';
import PropTypes from 'prop-types';
import GapManager from '../gap-manager.js';
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
  const [results, setResults] = useState();

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
      elements.push(<GapGameTextInput key={index} index={index} onTextInputChange={onChange} />);
      lastIndex = match.index + match[0].length;
      index += 1;
    }
    elements.push(text.substring(lastIndex));
    return elements;
  };

  const onEvaluateButtonClick = () => {    
    setEvaluate(!evaluate);
    const res = [];
    if (!evaluate) {      
      for (let index = 0; index < replacements.length; index += 1) {
        const test = tester[index];
        const result = GapManager.getFuseMatch(test);
        res.push(result);   
      } 
      setResults(res);     
    }
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
        ? <div className='gaptext-evaluation-area'>
          <div className='left'>
            <table>
              <thead>
                <tr>
                  <th scope="col" className='colHead'>Suchbegriff</th>
                  <th scope="col" className='colHead'>Deine Eingabe</th>
                  <th scope="col" className='colHead'>Ergebnis</th>
                </tr>
              </thead>
              <tbody>
                {
                  results.map((result, index) => {
                    if(result) {
                      return (
                        <tr key={index}>
                          <td>{result.match}</td>
                          <td>{result.input}</td>
                          <td>{result.isRight ? 'richtig': 'falsch'}</td>
                        </tr>
                      );
                    }  
                    return (
                      <tr key={index}>
                        <td>{replacements[index].expression}</td>
                        <td>keine Eingabe</td>
                        <td>falsch</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
          </div> 
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
