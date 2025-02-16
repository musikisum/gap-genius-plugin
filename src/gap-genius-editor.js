import React from 'react';
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

  const { analyseText, text, width, replacements } = content;
  console.log('replacements:', replacements)
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

  const onTextChange = event => {
    const newText = event.target.value;
    updateContent({ text: newText });
  };

  const onModusChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text);
    updateContent({ text, analyseText: !analyseText, replacements: nro });
  };

  const onTextSaveChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text);
    const newText = GapGeniusUtils.updateTextWithSynonyms(text, nro);
    updateContent({ text: newText, replacements: nro });
  };

  const onReplacementsChange = item => {
    const updatedReplacementsCopy = cloneDeep(replacements).map(obj => obj.index === item.index ? { ...obj, list: item.list } : obj);
    const newText = GapGeniusUtils.updateTextWithSynonyms(text, updatedReplacementsCopy);
    updateContent({ text: newText, replacements: updatedReplacementsCopy });
  };

  return (
    <div className="EP_Educandu_Gap_Genius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput value={text} onChange={onTextChange} renderAnchors disabled={analyseText} className='defaultTextColor' />
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          <Flex options={['center']} gap='middle'>
            <Button type='primary' className={analyseText ? 'btuttonColorVariables' : 'btuttonColorText'} onClick={onModusChange}>{analyseText ? t('keywordsInputMode'): t('textInputMode')}</Button>
            <Button type='primary' onClick={onTextSaveChange}>{t('actualizeText')}</Button>
            <Button type='primary' onClick={onExampleButtonClick}>{t('insertText')}</Button>
          </Flex>
        </Form.Item>
        { analyseText ? <div className='messageArea' >{t('errorText')}</div> : null }
        { analyseText
          ? replacements.map(item => {
            return (
              <Form.Item key={item.index + 1} label={`${item.index}. ${item.list[0]}`} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={item} onSave={event => onReplacementsChange(event, item.index)} />
              </Form.Item>
            );
          })
          : null}
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

GapGeniusEditor.propTypes = {
  ...sectionEditorProps
};
