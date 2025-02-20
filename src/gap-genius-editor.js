import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Flex, Switch } from 'antd';
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
  console.log('footnotes:', footnotes)

  // console.log('replacements:', replacements);
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  const onExampleButtonClick = () => {
    const et = GapGeniusUtils.exampleText;
    const nros = GapGeniusUtils.createNewReplacementObjects(et, footnotes);
    updateContent({ text: et, replacements: nros });
  };

  const onTextChange = event => {
    updateContent({ text: event.target.value });
  };

  const onTextUpdateChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    const newText = GapGeniusUtils.updateText(text, nro, footnotes);
    updateContent({ text: newText, replacements: nro });
  };

  const onModusChange = () => {
    const nro = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    updateContent({ analyseText: !analyseText, replacements: nro });
  };

  const onReplacementsChange = (inputLine, itemIndex) => {
    const replacementCopy = cloneDeep(replacements);
    const item = replacementCopy[itemIndex];
    replacementCopy[itemIndex] = { 
      ...item, 
      list: GapGeniusUtils.createListFromInputLine(inputLine, item.expression, footnotes)
    };
    const newText = GapGeniusUtils.updateText(text, replacementCopy, footnotes);
    updateContent({ text: newText, replacements: replacementCopy });
  };

  const onSwitchChange = hasFootnotes => {
    let replacementCopy = cloneDeep(replacements);
    replacementCopy = hasFootnotes 
      ? GapGeniusUtils.createFootnoteReplacements(replacementCopy, t('footenoteErrorText')) 
      : GapGeniusUtils.createGapGameReplacements(replacementCopy, t('footenoteErrorText')); 
    const newText = GapGeniusUtils.updateText(text, replacementCopy, hasFootnotes);
    updateContent({ text: newText, replacements: replacementCopy, footnotes: hasFootnotes });
  };

  return (
    <div className="EP_Educandu_Gap_Genius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('switchLabelText')} {...FORM_ITEM_LAYOUT}>
          <Switch 
            className='customSwitch'
            checked={footnotes}
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
            <Button className='antBtn' type='primary' onClick={onTextUpdateChange}>{t('actualizeText')}</Button>
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
              <Form.Item
                key={item.index}
                label={`${item.index + 1}. ${item.expression}`}
                {...FORM_ITEM_LAYOUT}
                >
                <EditableInput 
                  index={item.index}
                  line={GapGeniusUtils.createInputfromList(item.index, item.expression, item.list, footnotes, t('footenoteErrorText'))}
                  expression={item.expression}
                  footnotes={footnotes}
                  onSave={e => onReplacementsChange(e, item.index)}
                  classname='editable-input'
                  />
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
