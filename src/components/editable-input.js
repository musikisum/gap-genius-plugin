import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ value, footnotes, onSave }) {
  
  const expression = value.expression;
  const [editing, setEditing] = useState(false);
  const [inputLine, setInputLine] = useState(value.list.join('; '));

  const handleSave = () => {
    setEditing(false);
    const resultForGaps = inputLine
      .split(/\s*[;,]\s*/)
      .map(word => word.trim())
      .filter(word => word);
    const newList = footnotes ? [inputLine] : resultForGaps;
    onSave({ ...value, list: newList });
  };

  const onSetInputLine = event => {
    let line = event.target.value.trim();
    if (!footnotes && !line.startsWith(expression)) {
      line = `${expression}; ${line}`;
    }
    setInputLine(line);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', width: '100%' }}>
      {editing 
        ? <React.Fragment>
          <Input
            value={inputLine}
            onChange={e => onSetInputLine(e)}
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
  value: PropTypes.shape({
    index: PropTypes.number.isRequired,
    expression: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  footnotes: PropTypes.bool,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  value: null,
  footnotes: false,
  onSave: null,
};

export default EditableInput;
