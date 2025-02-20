import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ line, onSave }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const [editing, setEditing] = useState(false);
  const [inputLine, setInputLine] = useState();

  useEffect(() => {
    setInputLine(line);
  }, [line]);

  const handleSave = () => {
    setEditing(false);    
    onSave(inputLine);
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
            {inputLine || <div style={{ color: '#aaa' }}>Klicken zum Bearbeiten</div>}
          </div>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          </React.Fragment>}
    </div>
  );
}

EditableInput.propTypes = {
  line: PropTypes.string,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  line: null,
  onSave: null,
};

export default EditableInput;
