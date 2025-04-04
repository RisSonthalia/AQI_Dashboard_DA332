import axios from 'axios';
import { calculateAQI } from './aqiCalculator';

// API key (in a real app, this should be in an environment variable)
const API_KEY = 'aac405e628f9c30a047d3de13192a7f7';

// Fetch current AQI data for a location
export const fetchCurrentAQIData = async (latitude, longitude) => {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
  );

  const pollutants = response.data.list[0].components;
  const aqi = calculateAQI(pollutants);

  return {
    aqi,
    pollutants
  };
};

// Fetch historical air pollution data
export const fetchHistoricalAQIData = async (latitude, longitude) => {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - (24 * 60 * 60);

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${latitude}&lon=${longitude}&start=${oneDayAgo}&end=${now}&appid=${API_KEY}`
  );

  // Process historical data
  const history = {
    labels: [],
    aqi: [],
    pm2_5: [],
    pm10: [],
    o3: [],
    no2: [],
    so2: [],
    co: [],
    no: [],
    nh3: []
  };

  response.data.list.forEach(item => {
    const datetime = new Date(item.dt * 1000);
    history.labels.push(datetime.toLocaleTimeString());

    const currentAQI = calculateAQI(item.components);
    history.aqi.push(currentAQI);
    history.pm2_5.push(item.components.pm2_5);
    history.pm10.push(item.components.pm10);
    history.o3.push(item.components.o3);
    history.no2.push(item.components.no2);
    history.so2.push(item.components.so2);
    history.co.push(item.components.co);
    history.no.push(item.components.no);
    history.nh3.push(item.components.nh3);
  });

  return history;
};