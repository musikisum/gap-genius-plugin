import React, { useState } from 'react';
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

export default function GapGeniusEditor({ content, onContentChanged }) {

  console.log('content rerender:', content);
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  // Matched the ??-Signs in the content text property
  const [matchesCount, setMatchesCount] = useState(0);
  const [isEval, setIsEval] = useState(true);

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    const newText = GapGeniusUtils.exampleText;
    setMatchesCount([...newText.matchAll(/\?\?/g)]);
    setIsEval(true);
    const replacements = GapGeniusUtils.createNewReplacementObject(newText, content.replacements);
    updateContent({ text: newText, replacements });
  };

  // TODO:
  const onTextChange = event => {
    const newText = event.target.value;
    const matches = [...newText.matchAll(/\?\?/g)].length;
    console.log('matches:', matches)
    setMatchesCount(matches);
    if (matches % 2 === 0) {
      setIsEval(true);
      // Problem: alte ReplacementValues gehen hier verloren, weil sich in content.replacement die keys geändert haben 
      const replacements = GapGeniusUtils.createNewReplacementObject(newText, content.replacements);
      updateContent({ text: newText, replacements });
    } else { 
      setIsEval(false);
      updateContent({ ... content, text: newText });
    }
  };

  const onReplacementsChange = (value, key) => {
    const replacementsCopy = cloneDeep(content.replacements);
    if (!(key in replacementsCopy)) {
      replacementsCopy[key] = [];
    }
    if(value) {
      replacementsCopy[key].push(...value);
    }
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
        { isEval
          ? Object.entries(content.replacements).map(([key, value]) => {
            return (
              <Form.Item key={key} label={key.split('_')[0]} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={value} onSave={event => onReplacementsChange(event, key)} />
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
