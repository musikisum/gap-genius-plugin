import PropTypes from 'prop-types';
import { Input, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ line, footnotes, onSave }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const [editing, setEditing] = useState(false);
  const [inputLine, setInputLine] = useState('');

  useEffect(() => {    
    setInputLine(line);
  }, [line]);

  const handleSave = () => {
    setEditing(false);
    const temp = inputLine ? inputLine.trim() : '';
    setInputLine(temp);
    onSave(temp);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '100%' }}>
      {editing 
        ? <React.Fragment>
          <Input
            className='text-editable-input'
            value={inputLine}
            autoFocus
            onChange={e => setInputLine(e.target.value)}
            onPressEnter={handleSave}
            onBlur={handleSave}
            />
          <Tooltip title={t('saveButtonText')}>
            <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
          </Tooltip>
          </React.Fragment>
        : <React.Fragment>
          <div
            className='text-editable-input-display'
            onClick={() => setEditing(true)}
            >
            {inputLine || <div style={{ color: '#aaa' }}>{footnotes ? t('defaultFootnoteInputText') : t('defaultGapInputText')}</div>}
          </div>
          <Tooltip title={t('inputButtonText')}>
            <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          </Tooltip>
          </React.Fragment>}
    </div>
  );
}

EditableInput.propTypes = {
  line: PropTypes.string,
  footnotes: PropTypes.bool,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  line: null,
  footnotes: false,
  onSave: null,
};

export default EditableInput;
