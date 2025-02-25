import React from 'react';
import PropTypes from 'prop-types';
import GapGeniusUtils from '../gap-genius-utils.js';
import Markdown from '@educandu/educandu/components/markdown.js';

function FootnoteText({ content }) {

  const { width, text } = content;
  const charsWithoutWhitespace = [',', ';', '.'];

  const createFootnotesText = () => {
    let testText = text;
    let index = 1;
    for (const match of text.matchAll(GapGeniusUtils.regex)) {
      const nextChar = text[match.index + match[0].length];
      testText = testText.replace(match[0], `${match.groups.expression}(${index})${charsWithoutWhitespace.includes(nextChar) ? '' : ' '}`);
      index += 1;
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
        {content.replacements.map(obj => {
          return (
            <Markdown
              key={obj.index} 
              renderAnchors
              className={`u-horizontally-centered u-width-${content.width}`}
              >
              {`(${obj.index + 1}) ${obj.list.length === 0 ? '' : obj.list[0]}`}
            </Markdown>);
        })}
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
