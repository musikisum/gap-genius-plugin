import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '../images/check.js';
import CrossIcon from '../images/cross.js';
import { useTranslation } from 'react-i18next';

function GapResultTable({ tester, results }) {

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const tableRed = {
    backgroundColor: 'rgba(255, 99, 132, 0.2)'
  };
  const tableGreen = {
    backgroundColor: 'rgba(75, 192, 192, 0.2)'
  };
  const tableYellow = {
    backgroundColor: 'rgba(255, 206, 86, 0.2)'
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
          <th scope="col" className='colHead'>{t('searchTerm')}</th>
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
                  <td className='colBody'>{result.match}</td>
                  <td className='colBody'>{result.input}</td>
                  {result.isRight ? <td className='colBody checkAndCrossTd'><div>{`${t('checkText')} `}</div><CheckIcon /></td> : null }
                  {!result.isRight ? <td className='colBody checkAndCrossTd'><div>{`${t('crossText')} `}</div><CrossIcon /></td> : null }
                </tr>
              );
            }  
            return (
              <tr key={index} style={tableRed}>
                <td className='colBody'>{tester[index].expression}</td>
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