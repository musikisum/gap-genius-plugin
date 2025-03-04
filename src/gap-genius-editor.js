import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GapGeniusUtils from './gap-genius-utils.js';
import Info from '@educandu/educandu/components/info.js';
import EditableInput from './components/editable-input.js';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { Button, Form, Switch, Radio, Tooltip } from 'antd';
import MarkdownInput from '@educandu/educandu/components/markdown-input.js';
import { sectionEditorProps } from '@educandu/educandu/ui/default-prop-types.js';
import ObjectWidthSlider from '@educandu/educandu/components/object-width-slider.js';
import { FORM_ITEM_LAYOUT, FORM_ITEM_LAYOUT_WITHOUT_LABEL } from '@educandu/educandu/domain/constants.js';

export default function GapGeniusEditor({ content, onContentChanged }) {

  const { width, text, cacheText, footnotes, showExample, showFillIns, replacements } = content;
  const [enableEditorInputs, setEnableEditorInputs] = useState(false);

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  // Radio group options
  const RadioGroup = Radio.Group;
  const radioOptions = [
    {
      label: t('gameMode'),
      value: 'true'
    },
    {
      label: t('footNoteMode'),
      value: 'false'
    }
  ];

  const updateContent = newContentValues => {
    onContentChanged({ ...content, ...newContentValues });
  };

  // Handle plugin width in display mode 
  const handleWidthChange = value => {
    updateContent({ width: value });
  };

  // Handle text changes
  const onTextChange = event => {
    updateContent({ text: event.target.value });
  };

  // Provide an example to demonstrate the plugin functionalaties
  const onExampleButtonClick = () => {
    let nros;
    if (!showExample) {
      const exampleText = GapGeniusUtils.exampleText;
      nros = GapGeniusUtils.createNewReplacementObjects(exampleText, footnotes);
      const temp = text;
      updateContent({ text: exampleText, cacheText: temp, replacements: nros, showExample: !showExample });
    } else {
      nros = GapGeniusUtils.createNewReplacementObjects(cacheText, footnotes);
      updateContent({ text: cacheText, cacheText: '', replacements: nros, showExample: !showExample, showFillIns: false });
    }
  };

  // Save text after text changes in markdown input
  const onTextUpdateClick = () => {
    const nros = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    const newText = GapGeniusUtils.updateText(text, nros, footnotes);
    updateContent({ text: newText, replacements: nros });
  };

  // Enable text input fields
  const onEnableTextInputsClick = () => {
    const nros = GapGeniusUtils.createNewReplacementObjects(text, footnotes);
    const newText = GapGeniusUtils.updateText(text, nros, footnotes);
    setEnableEditorInputs(!enableEditorInputs);
    updateContent({ text: newText, replacements: nros });
  };

  // Save input field content after press save button
  const onReplacementsChange = (inputLine, itemIndex) => {
    const replacementCopy = cloneDeep(replacements);
    const item = replacementCopy[itemIndex];
    const tempList = GapGeniusUtils.createListFromInputLine(inputLine, item.expression, footnotes);
    replacementCopy[itemIndex] = { 
      ...item, 
      list: tempList
    };
    const newText = GapGeniusUtils.updateText(text, replacementCopy, footnotes);
    updateContent({ text: newText, replacements: replacementCopy });
  };

  // Radio buttons to set the mode
  const onGameModeSwitchChange = e => {
    // At this point, value and footnotes have different values
    const hasFootnotes = e.target.value === 'false';
    let replacementCopy = cloneDeep(replacements);
    replacementCopy = hasFootnotes 
      ? GapGeniusUtils.createFootnoteReplacements(replacementCopy) 
      : GapGeniusUtils.createGapGameReplacements(replacementCopy); 
    const newText = GapGeniusUtils.updateText(text, replacementCopy, hasFootnotes);
    updateContent({ text: newText, replacements: replacementCopy, footnotes: hasFootnotes });
  };
  
  // Insert or delete ruslts for example mode input
  const onExampleResultsSwitchChange = value => {
    updateContent({ showFillIns: !value });
  };

  return (
    <div className="EP_Educandu_Gap_Genius_Editor">
      <Form labelAlign="left">
        <Form.Item label={t('switchLabelText')} {...FORM_ITEM_LAYOUT}>
          <div className='flexArea'>
            <div className='switchContainer'>
              <Tooltip title={t('modeRadios')}>
                <RadioGroup options={radioOptions} onChange={onGameModeSwitchChange} optionType='button' defaultValue={`${!footnotes}`} />
              </Tooltip>
            </div>
            <div className='switchContainer' style={{ display: showExample && !footnotes ? 'flex' : 'none' }}>
              <div className='switchlabelLeft'>{t('showExampleResult')}</div>
              <Tooltip title={t('switchExample')}>
                <Switch
                  className='customSwitch'
                  checkedChildren={t('insertResults')} 
                  unCheckedChildren={t('deleteResults')}
                  defaultChecked={!showFillIns}
                  onChange={onExampleResultsSwitchChange}
                  />
              </Tooltip>
            </div>
          </div>
        </Form.Item>
        <Form.Item label={t('gapText')} {...FORM_ITEM_LAYOUT}>
          <MarkdownInput 
            value={text} 
            onChange={onTextChange} 
            disabled={enableEditorInputs || showExample} 
            className='defaultTextColor' 
            renderAnchors 
            />
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          <div className='flexArea'>
            <Tooltip title={t('buttonTextInput')}>
              <Button className='antBtn' type='primary' onClick={onEnableTextInputsClick} disabled={showExample}>{enableEditorInputs ? t('keywordsInputMode'): t('textInputMode')}</Button>
            </Tooltip>
            <Tooltip title={t('buttonTextUpdate')}>
              <Button className='antBtn' type='primary' onClick={onTextUpdateClick} disabled={enableEditorInputs || showExample}>{t('actualizeText')}</Button>
            </Tooltip>
            <Tooltip title={t('buttonExample')}>
              <Button className='antBtn errorColor' type='primary' onClick={onExampleButtonClick}>{ showExample ? t('deleteText') : t('insertText')}</Button>
            </Tooltip>
          </div>
        </Form.Item>
        <Form.Item {...FORM_ITEM_LAYOUT_WITHOUT_LABEL}>
          { enableEditorInputs 
            ? <div className='messageArea' >{ footnotes ? t('inputFootnoteVariables') : t('inputTextVariables')}</div> 
            : null }
        </Form.Item>
        { enableEditorInputs
          ? replacements.map(item => {
            return (
              <Form.Item
                key={item.index}
                label={`${item.index + 1}. ${GapGeniusUtils.createClippedLabelText(item.expression)}`}
                {...FORM_ITEM_LAYOUT}
                >
                <EditableInput
                  line={GapGeniusUtils.createInputfromList(item.expression, item.list, footnotes)}
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
