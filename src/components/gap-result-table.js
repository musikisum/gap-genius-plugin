import React from 'react';
import PropTypes from 'prop-types';

function GapResultTable({ results, replacements }) {
  return (
    <div className='left'>
      <table>
        <thead>
          <tr>
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
                  <tr key={index} className={result.isRight ? 'green' : 'red'}>
                    <td>{result.match}</td>
                    <td>{result.input}</td>
                    <td>{result.isRight ? 'richtig': 'falsch'}</td>
                  </tr>
                );
              }  
              return (
                <tr key={index} className='red'>
                  <td>{replacements[index].expression}</td>
                  <td>keine Eingabe</td>
                  <td>falsch</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
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