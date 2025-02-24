import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ line, footnotes, onSave }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const [editing, setEditing] = useState(false);
  const [inputLine, setInputLine] = useState('');

  useEffect(() => {    
    setInputLine(line);
  }, []);

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
          <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
          </React.Fragment>
        : <React.Fragment>
          <div
            className='text-editable-input-display'
            onClick={() => setEditing(true)}
            >
            {inputLine || <div style={{ color: '#aaa' }}>{footnotes ? t('defaultFootnoteInputText') : t('defaultGapInputText')}</div>}
          </div>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          </React.Fragment>}
    </div>
  );
}

EditableInput.propTypes = {
  line: PropTypes.string,
  expression: PropTypes.string,
  footnotes: PropTypes.bool,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  line: null,
  expression: null,
  footnotes: false,
  onSave: null,
};

export default EditableInput;
