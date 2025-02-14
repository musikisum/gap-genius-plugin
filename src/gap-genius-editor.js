import React from 'react';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import GapGeniusUtils from './gap-genius-utils.js';
import Info from '@educandu/educandu/components/info.js';
import EditableInput from './components/editable-input.js';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { FORM_ITEM_LAYOUT } from '@educandu/educandu/domain/constants.js';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';

export default function GaggeniusEditor({ content, onContentChanged }) {
  
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');
  
  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    const replacements = GapGeniusUtils.createNewReplacementObject(content.replacements, GapGeniusUtils.exampleText);
    updateContent({ text: GapGeniusUtils.exampleText, replacements });
  };

  const onTextChange = event => {
    const newText = event.target.value;
    const count = (newText.match(/\?\?/g) || [])?.length;
    // eslint-disable-next-line no-undefined
    const isEval = count !== null && count !== undefined && count % 2 === 0;
    if (isEval) {
      // Create a deep Copy of replacements object
      const replacements = GapGeniusUtils.createNewReplacementObject(content.replacements, newText);
      updateContent({ isEval, text: newText, replacements });      
    } else {
      updateContent({ isEval, text: newText });
    }
  };

  const onReplacementsChange = (value, key) => {
    if (typeof value !== 'string') {
      return;
    } 
    const replacementsCopy = cloneDeep(content.replacements);
    const synonyms = replacementsCopy[key];
    synonyms.length = 0;
    synonyms.push(...value.split(/[;]+/).map(word => word.trim()));
    updateContent({ replacements: replacementsCopy });
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={content.text} onChange={onTextChange} renderAnchors />
        </Form.Item>
        <Form.Item label={t('exampleText')} {...FORM_ITEM_LAYOUT}>
          <Button type="primary" onClick={onExampleButtonClick}>{t('insertText')}</Button>
        </Form.Item>
        { content.isEval
          ? Object.entries(content.replacements).map(([key, value]) => {
            return (
              <Form.Item key={key} label={value[0]} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={value.join('; ')} onSave={event => onReplacementsChange(event, key)} />
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

GaggeniusEditor.propTypes = {
  ...sectionEditorProps
};
