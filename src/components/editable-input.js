import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ value, onSave }) {

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    setEditing(false);
    onSave(inputValue); // Speichert den Wert, wenn man speichert
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '100%' }}>
      {editing 
        ? <React.Fragment>
          <Input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            autoFocus
            onPressEnter={handleSave}
            onBlur={handleSave}
            style={{ flexGrow: 1 }}
            />
          <Button type="primary" icon={<CheckOutlined />} onClick={handleSave} />
          </React.Fragment>
        : <React.Fragment>
          <span
            style={{
              cursor: 'pointer',
              display: 'block',
              flexGrow: 1, // Lässt den Text so breit wie möglich werden
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            onClick={() => setEditing(true)}
            >
            {inputValue || <div style={{ color: '#aaa' }}>Klicken zum Bearbeiten</div>}
          </span>
          <Button type="link" icon={<EditOutlined />} onClick={() => setEditing(true)} />
          </React.Fragment>}
    </div>
  );
}

EditableInput.propTypes = {
  value: PropTypes.array,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  value: [],
  onSave: null,
};

export default EditableInput;
