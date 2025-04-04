import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HistoricalHistogram = ({ historicalData, selectedPollutant, setSelectedPollutant }) => {
  // Get color based on AQI value
  const getBarColor = (value) => {
    if (value <= 50) return '#A8E05F'; // Good
    if (value <= 100) return '#FDD74B'; // Moderate
    if (value <= 150) return '#FB9B57'; // Unhealthy for Sensitive Groups
    if (value <= 200) return '#F66A67'; // Unhealthy
    if (value <= 300) return '#A97ABC'; // Very Unhealthy
    return '#A87383'; // Hazardous
  };

  // Format data for Chart.js
  const prepareChartData = () => {
    if (!historicalData || !historicalData.labels || !historicalData[selectedPollutant]) {
      return {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            borderWidth: 0,
            borderRadius: 2,
            barThickness: 16,
          }
        ]
      };
    }

    // Use the actual data from historicalData
    return {
      labels: historicalData.labels,
      datasets: [
        {
          data: historicalData[selectedPollutant],
          backgroundColor: historicalData[selectedPollutant].map(value => getBarColor(value)),
          borderWidth: 0,
          borderRadius: 2,
          barThickness: 16,
        }
      ]
    };
  };

  // Chart data
  const chartData = prepareChartData();
  
  // Format time string for display
  const formatTimeString = (timeString) => {
    try {
      // Parse the time string
      // Expected format could be "YYYY-MM-DD HH:MM:SS" or "HH:MM:SS AM/PM"
      const timeParts = timeString.split(' ');
      
      // Extract time part
      let timePortion;
      if (timeParts.length >= 2) {
        // If there's a date and time, get just the time
        timePortion = timeParts[1];
      } else {
        // If it's just a time string
        timePortion = timeParts[0];
      }
      
      // Extract hours, minutes, seconds
      const timeComponents = timePortion.split(':');
      if (timeComponents.length < 2) return timeString; // Invalid format
      
      let hours = parseInt(timeComponents[0]);
      const minutes = timeComponents[1];
      let period = '';
      
      // Determine AM/PM
      if (timeString.includes('AM') || timeString.includes('PM')) {
        period = timeString.includes('PM') ? 'PM' : 'AM';
      } else {
        // Convert 24-hour format to 12-hour for display
        if (hours >= 12) {
          period = 'PM';
          if (hours > 12) hours -= 12;
        } else {
          period = 'AM';
          if (hours === 0) hours = 12;
        }
      }
      
      return `${hours}:${minutes} ${period}`;
    } catch (e) {
      return timeString; // Fallback to original
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(32, 37, 43, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            // Use the formatTimeString function for consistent formatting
            return formatTimeString(tooltipItems[0].label);
          },
          label: (context) => {
            return `${selectedPollutant.toUpperCase()}: ${context.raw.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8E9BAE',
          font: {
            size: 11,
          },
          maxRotation: 45,
          autoSkip: false, // Show all labels
          callback: function(value, index) {
            // Use the formatTimeString function for consistent formatting
            const timeString = this.getLabelForValue(value);
            return formatTimeString(timeString);
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(142, 155, 174, 0.15)',
        },
        ticks: {
          color: '#8E9BAE',
          font: {
            size: 11,
          },
          stepSize: 20,
        },
        title: {
          display: true,
          text: selectedPollutant.toUpperCase(),
          color: '#8E9BAE',
          font: {
            size: 12,
          }
        }
      }
    }
  };

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
        {chartData.labels && chartData.labels.length > 0 ? (
          <Bar data={chartData} options={chartOptions} height={300} />
        ) : (
          <div className="no-data">No data available</div>
        )}
      </div>
    </div>
  );
};

export default HistoricalHistogram;