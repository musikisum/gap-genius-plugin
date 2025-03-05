import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import GapGeniusUtils from '../gap-genius-utils.js';
import Markdown from '@educandu/educandu/components/markdown.js';

function FootnoteText({ content }) {

  const { width, text, footnotes } = content;
  const mark = [',', ';', '.', '!', '?'];

  const [replacements, setReplacements] = useState(); 
  useEffect(() => {
    setReplacements(GapGeniusUtils.createNewReplacementObjects(text, footnotes));
  }, [text, footnotes]);

  const createFootnotesText = () => {
    let testText = text;
    const matches = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    for (let index = 0; index < matches.length; index += 1) {
      const match = matches[index];
      const matchIndex = testText.indexOf(`(${match.expression})(${match.gaptext})`);
      if (matchIndex !== -1) {      
        const nextCharIndex = matchIndex + 1 + match.expression.length + 2 + match.gaptext.length + 1;
        const nextChar = testText[nextCharIndex];
        let insertText;
        const includesMark = mark.includes(nextChar);
        if (includesMark) {
          insertText = `${match.expression}${nextChar}(${index + 1})`;
        } else {
          insertText = `${match.expression}(${index + 1})`;
        }
        const head = testText.substring(0, matchIndex);
        const tail = testText.substring(nextCharIndex + (includesMark ? 1 : 0));
        testText = head.concat('', insertText, tail);
      }
    }
    return testText;
  };

  /* eslint-disable react/jsx-indent */
  const area = (
    <React.Fragment>
      <Markdown 
        renderAnchors
        className={`u-horizontally-centered u-width-${content.width}`}
        >
        {createFootnotesText()}
      </Markdown>
      <div style={{ width: `${width}%` }} className='footnote-line'>
        <hr className='line' />
      </div>
      <div className='footnote-content'>
        {replacements 
          ? replacements.map(obj => {
            return (
            <Markdown
              key={obj.index} 
              renderAnchors
              className={`u-horizontally-centered u-width-${content.width}`}
              >
              {`(${obj.index + 1}) ${obj.list.length === 0 ? '' : obj.list[0]}`}
            </Markdown>);
          })
          : null}
      </div>
    </React.Fragment>
  );
  /* eslint-enable react/jsx-indent */

  return area;
};

FootnoteText.propTypes = {
  content: PropTypes.object,
};

FootnoteText.defaultProps = {
  content: null
};

export default FootnoteText;
