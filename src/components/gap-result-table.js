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

  const evaluatColor = result => {
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
            if(result) {
              return (
                <tr key={index} style={evaluatColor(result)}>
                  <td className='colBody'>{hideResult ? '' : result.match}</td>
                  <td className='colBody'>{result.input}</td>
                  {result.isRight ? <td className='colBody checkAndCrossTd'><div>{`${t('checkText')} `}</div><CheckIcon /></td> : null }
                  {!result.isRight ? <td className='colBody checkAndCrossTd'><div>{`${t('crossText')} `}</div><CrossIcon /></td> : null }
                </tr>
              );
            }  
            return (
              <tr key={index} style={tableRed}>
                <td className='colBody'>{hideResult ? '' : tester[index].expression}</td>
                <td className='colBody'>{tester[index].gapInput}</td>
                <td className='colBody checkAndCrossTd'>
                  <div>{`${t('crossText')} `}</div><CrossIcon />
                </td>
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