import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Composant de graphique donut réutilisable
 */
const DoughnutChart = ({
  data,
  title,
  height = 300,
  showLegend = true,
  legendPosition = 'right',
  centerText = null,
  className = ''
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%' // Taille du trou au centre
  };

  return (
    <div className={`${className} relative`} style={{ height }}>
      <Doughnut options={options} data={data} />
      
      {/* Texte au centre si fourni */}
      {centerText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {centerText.value}
            </div>
            {centerText.label && (
              <div className="text-sm text-gray-500 mt-1">
                {centerText.label}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoughnutChart;

