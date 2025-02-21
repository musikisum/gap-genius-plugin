import React from 'react';
import { useTranslation } from 'react-i18next';
import FootnoteText from './components/footnote-text.js';
import GapGameText from  './components/gap-game-text.js';
import { sectionDisplayProps } from '@educandu/educandu/ui/default-prop-types.js';

export default function GapGeniusDisplay({ content }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  return content.footnotes
    ? <div className="EP_Educandu_Gap_Genius_Display"><FootnoteText content={content} /></div>
    : <div className="EP_Educandu_Gap_Genius_Display"><GapGameText content={content} /></div>;
}

GapGeniusDisplay.propTypes = {
  ...sectionDisplayProps
};
