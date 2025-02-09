import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import cloneDeep from '@educandu/educandu/utils/clone-deep.js';
import { Button, Select, Radio, Space, Row, Col, Typography, Switch, Tooltip } from 'antd';

const { Paragraph, Text } = Typography;

export default function GapgeniusPanel({ 
  inserts, 
  updateContent 
}) {

  const { t } = useTranslation('musikisum/educandu-plugin-progression-models');

  function createItem(item, index) {
    return <div key={index}><span><b>{item.word}:</b></span> <span>{item.words[0]}</span></div>;
  }

  return (
    <div>
      <div className='container'>        
        { inserts ? inserts.map((item, index) => createItem(item, index)) : null }
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
