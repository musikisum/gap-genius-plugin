import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import GapGeniusUtils from '../gap-genius-utils.js';

function GapGameTextInput({ index, onTextInputChange, showFillIns }) {

  const exampleResults = GapGeniusUtils.exampleResults;

  const onTextChange = (key, value) => {
    onTextInputChange(key, value);
  };

  return (
    <Input
      defaultValue={showFillIns ? exampleResults[index] : ''}
      onChange={e => onTextChange(index, e.target.value)} 
      style={{ display: 'inline-block', width: 200, margin: '0 10px' }}
      />
  );
}

GapGameTextInput.propTypes = {
  index: PropTypes.number,
  onTextInputChange: PropTypes.func,
  showFillIns: PropTypes.bool
};

GapGameTextInput.defaultProps = {
  index: 0,
  onTextInputChange: null,
  showFillIns: false
};

export default GapGameTextInput;