import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import GapGeniusUtils from '../gap-genius-utils.js';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';

function EditableInput({ index, line, expression, footnotes, onSave }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const [editing, setEditing] = useState(false);
  const [inputLine, setInputLine] = useState(line);



  const handleSave = () => {
    setEditing(false);    
    onSave(GapGeniusUtils.adjustLine(inputLine, footnotes, index, expression, t('footenoteErrorText')));
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
  index: PropTypes.number,
  line: PropTypes.string,
  expression: PropTypes.string,
  footnotes: PropTypes.bool,
  onSave: PropTypes.func
};

EditableInput.defaultProps = {
  index: null,
  line: null,
  expression: null,
  footnotes: false,
  onSave: null,
};

export default EditableInput;
