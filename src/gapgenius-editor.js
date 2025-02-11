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

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    updateContent({ text: GapgeniusUtils.exampleText });
  };

  const onTextChange = event => {
    const departure = event.target.value;
    // TODO
    updateContent({ text: departure });
  };

  const onReplacementsChange = (value, index) => {
    if (!value) {
      return;
    } 
    const updateWords = value.split(/[ ,;:]+/).filter(Boolean);
    // TODO
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={text} onChange={onTextChange} renderAnchors />
        </Form.Item>
        <Form.Item label={t('exampleText')} {...FORM_ITEM_LAYOUT}>
          <Button type="primary" onClick={onExampleButtonClick}>{t('insertText')}</Button>
        </Form.Item>
        { targetWords.map((word, index) => {
          return (
            <Form.Item key={index} label={word} {...FORM_ITEM_LAYOUT}>
              <EditableInput value={replacements[word]?.join(', ')} onSave={e => onReplacementsChange(e, index)} />
            </Form.Item>
          );
        })}
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
