import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Markdown from '@educandu/educandu/components/markdown.js';

function FootnoteText({ content }) {

  const { text, replacements } = content;
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const markdownLinksToAnchorElements = footnoteText => {
    // const pattern = /\[(.*?)\]\((.*?)\)/g;
    const pattern = /\[(?<text>.*?)\]\((?<url>.*?)\)/g;;
    return footnoteText.replace(pattern, '<a href="$<url>">$<text></a>');  
  };

  const createFootnotesText = () => {
    const testText = text;
    return testText; 
  };

  const maskDefaultText = new RegExp(`(\\d+)\\.\\s*${t('footenoteErrorText')}\\s*`, 'g');

  const textReplace = fnText => {
    return fnText.replace(maskDefaultText, (_, number) => `${number}\\. ${t('footenoteErrorText')}`);
  };

  return (
    <React.Fragment>
      <Markdown 
        renderAnchors
        className={`u-horizontally-centered u-width-${content.width}`}
        >
        {createFootnotesText()}
      </Markdown>
      <div style={{ width: '33%', height: '1px', backgroundColor: 'gray', marginBottom: 0, margin: '40px 0' }} />
      <div className='footnote-content'>
        {content.replacements.map(obj => {
          return (
            <Markdown
              key={obj.index} 
              renderAnchors
              className={`u-horizontally-centered u-width-${content.width}`}
              >
              {`(${obj.index}) ${textReplace(obj.list[0])}`}
          </Markdown>);
        })}
      </div>
    </React.Fragment>
  );

  // return /* @__PURE__ */ React.createElement(Markdown, { renderAnchors: true, className: `u-horizontally-centered u-width-${content.width}` }, content.text);
};

FootnoteText.propTypes = {
  content: PropTypes.object,
};

FootnoteText.defaultProps = {
  content: null
};

export default FootnoteText;
