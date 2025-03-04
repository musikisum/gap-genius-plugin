import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import GapGeniusUtils from '../gap-genius-utils.js';
import Markdown from '@educandu/educandu/components/markdown.js';

function FootnoteText({ content }) {

  const { width, text } = content;
  const charsWithoutWhitespace = [',', ';', '.'];

  const [replacements, setReplacements] = useState(); 
  useEffect(() => {
    const tempObj = GapGeniusUtils.createNewReplacementObjects(text);
    setReplacements(GapGeniusUtils.createFootnoteReplacements(tempObj));
  }, [text]);

  const createFootnotesText = () => {
    let testText = text;
    let index = 1;
    const matches = GapGeniusUtils.findAllExpressions(text);
    for (const match of matches) {
      const matchIndex = testText.indexOf(`(${match.expression})(${match.list})`);
      if (matchIndex === -1) {
        // eslint-disable-next-line no-continue
        continue;
      };
      const nextChar = testText[matchIndex + match.expression.length + match.list.length + 4]; // Berücksichtigt die "( )" um den Ausdruck
      const replacement = `${match.expression}(${index})${charsWithoutWhitespace.includes(nextChar) ? '' : ' '}`;

      testText = testText.replace(`(${match.expression})(${match.list})`, replacement);
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
