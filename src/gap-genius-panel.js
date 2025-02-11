import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { Button, Select, Radio, Space, Row, Col, Typography, Switch, Tooltip, Input } from 'antd';

const { Paragraph, Text } = Typography;

export default function GapgeniusPanel({ inserts, updateContent }) {
  const { t } = useTranslation('musikisum/educandu-plugin-progression-models');

  // Lokalen State für das zweite Input-Feld speichern, damit der Wert nicht überschrieben wird
  const [inputValues, setInputValues] = useState(inserts.map(item => item.words.join(', ')));

  function createItem(item, index) {
    return (
      <div key={index} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
        <Input value={item.word} readOnly onChange={e => handleTextChange(e, index)} style={{ width: '25%' }} />
        <Input
          value={inputValues[index]}
          onChange={e => handleWordsChange(e, index)}
        />
      </div>
    );
  }

  // Änderung am zweiten Input-Feld lokal speichern
  const handleWordsChange = (event, index) => {
    const newValue = event.target.value;

    // Update des lokalen States
    const updatedInputValues = [...inputValues];
    updatedInputValues[index] = newValue;
    setInputValues(updatedInputValues);

    // Update des parent states mit aufbereiteter Liste
    const cInserts = cloneDeep(inserts);
    cInserts[index].words = newValue.split(/[ ,;:]+/).filter(Boolean);
    updateContent({ inserts: cInserts });
  };

  return (
    <div>
      <div className='container'>
        {inserts ? inserts.map((item, index) => createItem(item, index)) : null}
      </div>
    </div>
  );
}

GapgeniusPanel.propTypes = {
  inserts: PropTypes.array,
  updateContent: PropTypes.func
};

GapgeniusPanel.defaultProps = {
  inserts: [],
  updateContent: null,
};
