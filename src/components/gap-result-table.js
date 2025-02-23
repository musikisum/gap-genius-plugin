import React from 'react';
import PropTypes from 'prop-types';

function GapResultTable({ results, replacements }) {

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
          <th scope="col" className='colHead'>Suchbegriff</th>
          <th scope="col" className='colHead'>Deine Eingabe</th>
          <th scope="col" className='colHead'>Ergebnis</th>
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
                  <td className='colBody'>{result.isRight ? 'richtig': 'falsch'}</td>
                </tr>
              );
            }  
            return (
              <tr key={index} style={tableRed}>
                <td className='colBody'>{replacements[index].expression}</td>
                <td className='colBody'>keine Eingabe</td>
                <td className='colBody'>falsch</td>
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
  replacements: PropTypes.array
};

GapResultTable.defaultProps = {
  results: null,
  replacements: null
};

export default GapResultTable;