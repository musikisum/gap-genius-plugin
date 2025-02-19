import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
            value={inputLine}
            onChange={e => setInputLine(e.target.value)}
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
              flexGrow: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            onClick={() => setEditing(true)}
            >
            {inputLine || <div style={{ color: '#aaa' }}>Klicken zum Bearbeiten</div>}
          </span>
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
