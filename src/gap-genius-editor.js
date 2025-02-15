import React, { useState } from 'react';
import { Button, Form, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import GapGeniusUtils from './gap-genius-utils.js';
import Info from '@educandu/educandu/components/info.js';
import EditableInput from './components/editable-input.js';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';
import { FORM_ITEM_LAYOUT, FORM_ITEM_LAYOUT_WITHOUT_LABEL } from '@educandu/educandu/domain/constants.js';

export default function GapGeniusEditor({ content, onContentChanged }) {

  console.log('content rerender:', content);
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    const et = GapGeniusUtils.exampleText;
    const nro = GapGeniusUtils.createNewReplacementObjects(et);
    updateContent({ text: et, replacements: nro });
  };

  const onAnalyseButtonClick = () => {
    console.log('Analyse button click!');
  };

  const onTextChange = event => {
    const newText = event.target.value;
    updateContent({ text: newText });
  };

  const onReplacementsChange = (event, itemIndex) => {
    console.log('index', event)
    // updateContent({ replacements: replacementsCopy });
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={content.text} onChange={onTextChange} renderAnchors />
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          <Flex options={['center']} gap='middle'>
            <Button type='primary' onClick={onExampleButtonClick}>{t('insertText')}</Button>
            <Button type='primary' onClick={onAnalyseButtonClick}>{content.analyseText ? t('keywordInputMode'): t('textInputMode')}</Button>
          </Flex>
        </Form.Item>
        { !content.analyseText
          ? content.replacements.map(item => {
            return (
              <Form.Item key={item.index} label={`${item.index}. ${item.list[0]}`} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={item} onSave={event => onReplacementsChange(event, item.index)} />
              </Form.Item>
            );
          })
          : <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px', color: 'red', fontWeight: 'bold' }}>{t('errorText')}</div>}
        <Form.Item
          label={<Info tooltip={t('common:widthInfo')}>{t('common:width')}</Info>}
          {...FORM_ITEM_LAYOUT}
          >
          <ObjectWidthSlider value={content.width} onChange={handleWidthChange} />
        </Form.Item>
      </Form>
    </div>
  );
}

GapGeniusEditor.propTypes = {
  ...sectionEditorProps
};
