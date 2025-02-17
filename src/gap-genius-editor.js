import React from 'react';
import { Button, Form, Flex, Switch } from 'antd';
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

  const { width, text, footnotes, analyseText, replacements } = content;
  console.log('replacements:', replacements);
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    const et = GapGeniusUtils.exampleText;
    const nro = GapGeniusUtils.createNewReplacementObjects(et, footnotes);
    updateContent({ text: et, replacements: nro });
  };

  const onTextChange = event => {
    const newText = event.target.value;
    updateContent({ text: newText });
  };

  const onModusChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    updateContent({ analyseText: !analyseText, replacements: nro });
  };

  const onTextSaveChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    const newText = GapGeniusUtils.updateTextWithSynonyms(text, nro, footnotes);
    updateContent({ text: newText, replacements: nro });
  };

  const onReplacementsChange = item => {
    const replacementCopy = cloneDeep(replacements);
    replacementCopy[item.index] = item;
    const newText = GapGeniusUtils.updateTextWithSynonyms(text, replacementCopy, footnotes);
    updateContent({ text: newText, replacements: replacementCopy });
  };

  const onSwitchChange = value => {
    const replacementCopy = cloneDeep(replacements);
    if (value) {
      replacementCopy.map(obj => {
        obj.list[0] = obj.list.join('; ');
        obj.list.length = 1; 
        return obj;
      });
    } else {
      replacementCopy.map(obj => {
        obj.list = obj.list[0].split(/[,;]\s*/).filter(item => item !== '');
        return obj;
      });
    }
    console.log(replacementCopy)
    updateContent({ replacements: replacementCopy, footnotes: value });
  };

  return (
    <div className="EP_Educandu_Gap_Genius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('switchLabelText')} {...FORM_ITEM_LAYOUT}>
          <Switch 
            className='customSwitch' 
            checkedChildren={t('gameMode')} 
            unCheckedChildren={t('footNoteMode')} 
            onChange={onSwitchChange} 
            />
        </Form.Item>
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput 
            value={text} 
            onChange={onTextChange} 
            disabled={analyseText} 
            className='defaultTextColor' 
            renderAnchors 
            />
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          <Flex className='antFlex' gap='middle'>
            <Button className='antBtn' type='primary' onClick={onModusChange}>{analyseText ? t('keywordsInputMode'): t('textInputMode')}</Button>
            <Button className='antBtn' type='primary' onClick={onTextSaveChange}>{t('actualizeText')}</Button>
            <Button className='antBtn' type='primary' onClick={onExampleButtonClick}>{t('insertText')}</Button>
          </Flex>
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          { analyseText 
            ? <div className='messageArea' >{ !footnotes ? t('inputTextVariables') : t('inputFootnoteVariables')}</div> 
            : null }
        </Form.Item>
        { analyseText
          ? replacements.map(item => {
            return (
              <Form.Item key={item.index} label={`${item.index + 1}. ${item.expression}`} {...FORM_ITEM_LAYOUT}>
                <EditableInput value={item} footnotes={footnotes} onSave={event => onReplacementsChange(event, item.index)} />
              </Form.Item>
            );
          })
          : null }
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
