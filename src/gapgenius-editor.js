import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import GapgeniusUtils from './gapgenius-utils.js';
import Info from '@educandu/educandu/components/info.js';
import EditableInput from './components/editable-input.js';
import { FORM_ITEM_LAYOUT } from '@educandu/educandu/domain/constants.js';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';

export default function GaggeniusEditor({ content, onContentChanged }) {
  
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');
  const regex = /\?\?(.*?)\?\?/g;

  const { text, width, targetWords, replacements } = content;

  let match;
  targetWords.length = 0;
  while ((match = regex.exec(text)) !== null) {
    targetWords.push(match[1]);
  };

  console.log('content', content);

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    updateContent({ text: GapgeniusUtils.exampleText });
  };

  const onTargetWordChange = (event, index) => {
    updateContent({ text: event.target.value });
  };

  const onReplacementsChange = (event, index) => {
    const updateWords = event.target.value.split(/[ ,;:]+/).filter(Boolean);
    console.log(updateWords)
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={text} onChange={onTargetWordChange} renderAnchors />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={onExampleButtonClick}>Beispieltext</Button>
        </Form.Item>
        <Form.Item>
          {/* <GapGeniusPanel inserts={inserts} updateContent={updateContent} /> */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            { targetWords.map((word, index) => {
              return (
                <div key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <Input value={word} readOnly onChange={e => onTargetWordChange(e, index)} style={{ width: '25%' }} />
                  <EditableInput value={replacements[index]} onSave={e => onReplacementsChange(e, index)} />
                </div>
              );
            })}
          </div>
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
