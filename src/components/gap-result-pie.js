import React from 'react';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

function GapResultPie({ results }) {

  ChartJS.register(ArcElement, Tooltip, Legend);

  const { t } = useTranslation('musikisum/educandu-plugin-gap-genius');

  const currentData = results.reduce((akku, item) => {
    if(!item) {
      akku[0] += 1;
      return akku;
    }
    if(!item.match) {
      akku[0] += 1;
    } else if(item.match === item.input) {
      akku[1] += 1;
    } else {
      akku[2] += 1;
    }
    return akku;
  }, [0, 0, 0]);

  const data = {
    labels: [t('crossText'), t('checkText'), t('checkText2')],
    datasets: [
      {
        label: t('votesText'),
        data: currentData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
}

GapResultPie.propTypes = {
  results: PropTypes.array
};

GapResultPie.defaultProps = {
  results: null
};

export default GapResultPie;