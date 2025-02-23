import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';

function GapGameTextInput({ index, onTextInputChange }) {

  const onTextChange = (key, value) => {
    onTextInputChange(key, value);
  };

  return (
    <Input 
      onChange={e => onTextChange(index, e.target.value)} 
      style={{ display: 'inline-block', width: 200, margin: '0 10px' }}
      />
  );
}

GapGameTextInput.propTypes = {
  index: PropTypes.number,
  onTextInputChange: PropTypes.func,
};

GapGameTextInput.defaultProps = {
  index: 0,
  onTextInputChange: null,
};

export default GapGameTextInput;