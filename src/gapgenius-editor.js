import React from 'react';
import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import GapGeniusPanel from './gapgenius-panel.js';
import Info from '@educandu/educandu/components/info.js';
import { FORM_ITEM_LAYOUT } from '@educandu/educandu/domain/constants.js';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';

export default function GaggeniusEditor({ content, onContentChanged }) {
  
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');
  const { text, width, inserts } = content;

  const exampleText = text ? text : 'An der Musikhochschule lernt man nicht nur ??Noten??, sondern auch, wie man mit vier Stunden Schlaf, drei Kaffees und einer kaputten Saite überlebt. Professor Müller hört selbst das leiseste falsche C, während du dich fragst, ob er ein Fledermaus-Gen hat. Während die ??Pianisten?? ihre Finger verknoten, üben die Sänger, Wagners Opern in der Mensa zu performen. Und am Ende? Ein Abschluss, ein Tinnitus – und die Fähigkeit, selbst im Schlaf Tonleitern zu spielen!';

  const regex = /\?\?(.*?)\?\?/g;
  let match;
  inserts.length = 0;
  while ((match = regex.exec(exampleText)) !== null) {
    inserts.push({
      word: match[1],
      words: []
    });
  };

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleTextChanged = event => {
    if (event.target.value !== exampleText) {
      updateContent({ text: event.target.value });
    }
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={exampleText} onChange={handleTextChanged} renderAnchors />
        </Form.Item>
        <Form.Item>
          <GapGeniusPanel inserts={inserts} updateContent={updateContent} />
        </Form.Item>
        <Form.Item
          label={<Info tooltip={t('common:widthInfo')}>{t('common:width')}</Info>}
          {...FORM_ITEM_LAYOUT}
          >
          <ObjectWidthSlider value={width} onChange={handleWidthChange} />
        </Form.Item>
      </Form>
    </div>
  );
}

GaggeniusEditor.propTypes = {
  ...sectionEditorProps
};
