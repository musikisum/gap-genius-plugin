import { Switch } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CheckIcon from '../images/check.js';
import CrossIcon from '../images/cross.js';
import { useTranslation } from 'react-i18next';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function GapResultTable({ tester, results }) {
  
  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');
  
  const [hideResult, setHideResult] = useState(true);
  
  const tableRed = {
    backgroundColor: 'rgba(255, 161, 161, 0.5)'
  };
  const tableGreen = {
    backgroundColor: 'rgba(222, 233, 191, 0.5)'
  };
  const tableYellow = {
    backgroundColor: 'rgba(249, 236, 185, 0.5)'
  };

  const evaluateColor = result => {
    if (result.isRight && result.match === result.input) {
      return tableGreen;
    } else if (result.isRight) {
      return tableYellow;
    }
    return tableRed;
  };

  return (
    <table>
      <thead>
        <tr style={{ backgroundColor: '#6d8bb1', color: 'white' }}>
          <th scope="col" className='colHead'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {t('searchTerm')} 
              <Switch
                checked={hideResult}
                onChange={() => setHideResult(!hideResult)}
                checkedChildren={<EyeOutlined />}
                unCheckedChildren={<EyeInvisibleOutlined />}
                />
            </div>
          </th>
          <th scope="col" className='colHead'>{t('yourInput')}</th>
          <th scope="col" className='colHead'>{t('yourResult')}</th>
        </tr>
      </thead>
      <tbody>
        {
          results.map((result, index) => {
            if(result.isRight) {
              return (
                <tr key={index} className='trHeight' style={evaluateColor(result)}>
                  <td className='colBody'>{hideResult ? '' : tester[index].expression}</td>
                  <td className='colBody'>{result.input}</td>
                  <td className='colBody checkAndCrossTd'><div>{`${t('checkText')} `}</div><CheckIcon /></td>
                </tr>
              );
            } else if (!result.isRight 
              && tester[index].gapInput !== '' 
              && tester[index].gapInput === result.input) {
              return (
                <tr key={index} className='trHeight' style={evaluateColor(result)}>
                  <td className='colBody'>{hideResult ? '' : tester[index].expression}</td>
                  <td className='colBody'>{result.input}</td>
                  <td className='colBody checkAndCrossTd'><div>{`${t('crossText')} `}</div><CrossIcon /></td>
                </tr>
              );
            }
            return (
              <tr key={index} className='trHeight'>
                <td className='colBody'>{hideResult ? '' : tester[index].expression}</td>
                <td className='colBody'>{tester[index].gapInput}</td>
                <td className='colBody' />
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
}

GapResultTable.propTypes = {
  results: PropTypes.array,
  tester: PropTypes.object
};

GapResultTable.defaultProps = {
  results: null,
  tester: null
};

export default GapResultTable;