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
import { replaceItem } from '@educandu/educandu/utils/array-utils.js';

export default function GaggeniusEditor({ content, onContentChanged }) {
  
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');
  
  const gapGenius = GapGeniusUtils.transformTextToGapGeniusModel(content);

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    updateContent({ text: GapGeniusUtils.exampleText });
  };

  const onTextChange = event => {
    const newText = event.target.value;;
    updateContent({ ...content, text: newText });
  };

  const onReplacementsChange = (value, index) => {
    if (!value) {
      return;
    } 
    const dicKey = gapGenius.indices[index];
    const synonyms = gapGenius.replacements[dicKey];
    synonyms.length = 0;
    synonyms.push(...value.split(/[ ,;:]+/).filter(Boolean));
    updateContent({ replacements: gapGenius.replacements });
  };

  return (
    <div className="EP_Educandu_Gapgenius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={gapGenius.text} onChange={onTextChange} renderAnchors />
        </Form.Item>
        <Form.Item label={t('exampleText')} {...FORM_ITEM_LAYOUT}>
          <Button type="primary" onClick={onExampleButtonClick}>{t('insertText')}</Button>
        </Form.Item>
        { gapGenius.isEval
          ? gapGenius.keywords.map((word, index) => {
            return (
              <Form.Item key={index} label={word} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={gapGenius.replacements[gapGenius.indices[index]].join(', ')} onSave={e => onReplacementsChange(e, index)} />
              </Form.Item>
            );
          })
          : <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px', color: 'red', fontWeight: 'bold' }}>{t('errorText')}</div>}
        <Form.Item
          label={<Info tooltip={t('common:widthInfo')}>{t('common:width')}</Info>}
          {...FORM_ITEM_LAYOUT}
          >
          <ObjectWidthSlider value={gapGenius.width} onChange={handleWidthChange} />
        </Form.Item>
      </Form>
    </div>
  );
}

GaggeniusEditor.propTypes = {
  ...sectionEditorProps
};
