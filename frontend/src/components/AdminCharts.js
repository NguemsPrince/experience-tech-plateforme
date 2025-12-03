import React, { useState } from 'react';

const AdminCharts = ({ darkMode = false }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const revenueData = {
    '7d': [12000, 15000, 18000, 22000, 19000, 25000, 28000],
    '30d': [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 78000, 85000, 92000, 88000, 95000, 102000, 98000, 105000, 112000, 108000, 115000, 122000, 118000, 125000, 132000, 128000, 135000, 142000, 138000, 145000],
    '90d': [120000, 135000, 150000, 165000, 180000, 195000, 210000, 225000, 240000, 255000, 270000, 285000, 300000, 315000, 330000, 345000, 360000, 375000, 390000, 405000, 420000, 435000, 450000, 465000, 480000, 495000, 510000, 525000, 540000, 555000, 570000, 585000, 600000, 615000, 630000, 645000, 660000, 675000, 690000, 705000, 720000, 735000, 750000, 765000, 780000, 795000, 810000, 825000, 840000, 855000, 870000, 885000, 900000, 915000, 930000, 945000, 960000, 975000, 990000, 1005000, 1020000, 1035000, 1050000, 1065000, 1080000, 1095000, 1110000, 1125000, 1140000, 1155000, 1170000, 1185000, 1200000, 1215000, 1230000, 1245000, 1260000, 1275000, 1290000, 1305000, 1320000, 1335000, 1350000, 1365000, 1380000, 1395000, 1410000, 1425000, 1440000, 1455000, 1470000, 1485000, 1500000]
  };


  return (
    <div className="space-y-8">
      {/* Revenue Chart */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Évolution des Revenus</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Croissance mensuelle</p>
          </div>
          <div className="flex space-x-2">
            {['7d', '30d', '90d'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-64">
          <div className="absolute inset-0 flex items-end space-x-1">
            {revenueData[selectedPeriod].map((value, index) => {
              const max = Math.max(...revenueData[selectedPeriod]);
              const height = (value / max) * 100;
              return (
                <div
                  key={index}
                  className="flex-1 bg-green-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${Math.max(height, 10)}%` }}
                  title={`${value.toLocaleString()} FCFA`}
                />
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminCharts;

