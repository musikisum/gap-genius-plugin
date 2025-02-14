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
    const indices = Object.keys(replacements).map(key => Number(key));
    updateContent({ text: GapGeniusUtils.exampleText, replacements, indices });
  };

  const onTextChange = event => {
    const newText = event.target.value;

    const count = (newText.match(/\?\?/g) || [])?.length;
    // eslint-disable-next-line no-undefined
    const isEval = count !== null && count !== undefined && count % 2 === 0;
    
    if (!isEval) {
      updateContent({ ...content, isEval, text: newText });
    } else {
      // hier neue Wert speichern
      const replacements = GapGeniusUtils.createNewReplacementObject(content.replacements, newText);
      const indices = Object.keys(replacements).map(key => Number(key));
      updateContent({ text: newText, isEval, replacements, indices });
    }
  };

  const onReplacementsChange = (value, index) => {
    if (!value) {
      return;
    } 
    const replacementsCopy = cloneDeep(content.replacements);
    const dicKey = content.indices[index];
    const synonyms = replacementsCopy[dicKey];
    synonyms.length = 0;
    synonyms.push(...value.split(/[ ;]+/).filter(Boolean));
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
          ? Object.keys(content.replacements).map((key, index) => {
            return (
              <Form.Item key={index} label={content.replacements[key][0]} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={content.replacements[content.indices[index]].join('; ')} onSave={e => onReplacementsChange(e, index)} />
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
