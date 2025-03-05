import React from 'react';
import Updater from './update-vaidation.js';
import FootnoteText from './components/footnote-text.js';
import GapGameText from  './components/gap-game-text.js';
import { sectionDisplayProps } from '@educandu/educandu/ui/default-prop-types.js';

export default function GapGeniusDisplay({ content }) {

  const updatedContent = Updater.sanitizeContent(content);
  return content.footnotes
    ? <div className="EP_Educandu_Gap_Genius_Display"><FootnoteText content={updatedContent} /></div>
    : <div className="EP_Educandu_Gap_Genius_Display"><GapGameText content={updatedContent} /></div>;
}

GapGeniusDisplay.propTypes = {
  ...sectionDisplayProps
};
