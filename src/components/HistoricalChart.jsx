import React from 'react';
import { Line } from 'react-chartjs-2';

const HistoricalChart = ({ historicalData, selectedPollutant, setSelectedPollutant, chartData, chartOptions }) => {
  return (
    <div className="historical-chart">
      <h2 className="chart-title">Historical Air Quality Data</h2>
      <div className="chart-controls">
        <select
          value={selectedPollutant}
          onChange={(e) => setSelectedPollutant(e.target.value)}
          className="pollutant-select"
        >
          <option value="aqi">AQI</option>
          <option value="pm2_5">PM2.5</option>
          <option value="pm10">PM10</option>
          <option value="o3">O3</option>
          <option value="no2">NO2</option>
          <option value="so2">SO2</option>
          <option value="co">CO</option>
          <option value="no">NO</option>
          <option value="nh3">NH3</option>
        </select>
      </div>
      <div className="chart-container">
        {historicalData.labels && historicalData.labels.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data">No historical data available</div>
        )}
      </div>
    </div>
  );
};

export default HistoricalChart;
