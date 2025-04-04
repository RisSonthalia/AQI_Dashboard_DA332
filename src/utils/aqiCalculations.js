// AQI categories and colors
export const aqiCategories = [
    { range: [0, 50], level: 'Good', color: '#00e400', healthImplications: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
    { range: [51, 100], level: 'Moderate', color: '#ffff00', healthImplications: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' },
    { range: [101, 150], level: 'Unhealthy for Sensitive Groups', color: '#ff7e00', healthImplications: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
    { range: [151, 200], level: 'Unhealthy', color: '#ff0000', healthImplications: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
    { range: [201, 300], level: 'Very Unhealthy', color: '#8f3f97', healthImplications: 'Health alert: The risk of health effects is increased for everyone.' },
    { range: [301, 500], level: 'Hazardous', color: '#7e0023', healthImplications: 'Health warning of emergency conditions: everyone is more likely to be affected.' }
  ];
  
  // Function to calculate AQI based on pollutant concentrations
  export const calculateAQI = (pollutants) => {
    // This is a simplified AQI calculation
    const pm25 = pollutants.pm2_5 || 0;
    const pm10 = pollutants.pm10 || 0;
    const o3 = pollutants.o3 || 0;
    const no2 = pollutants.no2 || 0;
    const so2 = pollutants.so2 || 0;
    const co = pollutants.co || 0;
  
    // Calculate individual AQI values
    const pm25AQI = calculatePM25AQI(pm25);
    const pm10AQI = calculatePM10AQI(pm10);
    const o3AQI = calculateO3AQI(o3);
    const no2AQI = calculateNO2AQI(no2);
    const so2AQI = calculateSO2AQI(so2);
    const coAQI = calculateCOAQI(co);
  
    // Return the maximum AQI value
    return Math.max(pm25AQI, pm10AQI, o3AQI, no2AQI, so2AQI, coAQI);
  };
  
  // Functions to calculate individual pollutant AQI values
  export const calculatePM25AQI = (concentration) => {
    if (concentration <= 12) return mapAQI(concentration, 0, 12, 0, 50);
    if (concentration <= 35.4) return mapAQI(concentration, 12.1, 35.4, 51, 100);
    if (concentration <= 55.4) return mapAQI(concentration, 35.5, 55.4, 101, 150);
    if (concentration <= 150.4) return mapAQI(concentration, 55.5, 150.4, 151, 200);
    if (concentration <= 250.4) return mapAQI(concentration, 150.5, 250.4, 201, 300);
    if (concentration <= 500.4) return mapAQI(concentration, 250.5, 500.4, 301, 500);
    return 500;
  };
  
  export const calculatePM10AQI = (concentration) => {
    if (concentration <= 54) return mapAQI(concentration, 0, 54, 0, 50);
    if (concentration <= 154) return mapAQI(concentration, 55, 154, 51, 100);
    if (concentration <= 254) return mapAQI(concentration, 155, 254, 101, 150);
    if (concentration <= 354) return mapAQI(concentration, 255, 354, 151, 200);
    if (concentration <= 424) return mapAQI(concentration, 355, 424, 201, 300);
    if (concentration <= 604) return mapAQI(concentration, 425, 604, 301, 500);
    return 500;
  };
  
  export const calculateO3AQI = (concentration) => {
    // Ozone concentration is in μg/m³, convert to ppb (parts per billion)
    const ppb = concentration * 0.5;
    if (ppb <= 54) return mapAQI(ppb, 0, 54, 0, 50);
    if (ppb <= 70) return mapAQI(ppb, 55, 70, 51, 100);
    if (ppb <= 85) return mapAQI(ppb, 71, 85, 101, 150);
    if (ppb <= 105) return mapAQI(ppb, 86, 105, 151, 200);
    if (ppb <= 200) return mapAQI(ppb, 106, 200, 201, 300);
    return 500;
  };
  
  export const calculateNO2AQI = (concentration) => {
    // NO2 concentration is in μg/m³, convert to ppb
    const ppb = concentration * 0.53;
    if (ppb <= 53) return mapAQI(ppb, 0, 53, 0, 50);
    if (ppb <= 100) return mapAQI(ppb, 54, 100, 51, 100);
    if (ppb <= 360) return mapAQI(ppb, 101, 360, 101, 150);
    if (ppb <= 649) return mapAQI(ppb, 361, 649, 151, 200);
    if (ppb <= 1249) return mapAQI(ppb, 650, 1249, 201, 300);
    if (ppb <= 2049) return mapAQI(ppb, 1250, 2049, 301, 500);
    return 500;
  };
  
  export const calculateSO2AQI = (concentration) => {
    // SO2 concentration is in μg/m³, convert to ppb
    const ppb = concentration * 0.38;
    if (ppb <= 35) return mapAQI(ppb, 0, 35, 0, 50);
    if (ppb <= 75) return mapAQI(ppb, 36, 75, 51, 100);
    if (ppb <= 185) return mapAQI(ppb, 76, 185, 101, 150);
    if (ppb <= 304) return mapAQI(ppb, 186, 304, 151, 200);
    if (ppb <= 604) return mapAQI(ppb, 305, 604, 201, 300);
    if (ppb <= 1004) return mapAQI(ppb, 605, 1004, 301, 500);
    return 500;
  };
  
  export const calculateCOAQI = (concentration) => {
    // CO concentration is in μg/m³, convert to ppm (parts per million)
    const ppm = concentration * 0.000873;
    if (ppm <= 4.4) return mapAQI(ppm, 0, 4.4, 0, 50);
    if (ppm <= 9.4) return mapAQI(ppm, 4.5, 9.4, 51, 100);
    if (ppm <= 12.4) return mapAQI(ppm, 9.5, 12.4, 101, 150);
    if (ppm <= 15.4) return mapAQI(ppm, 12.4, 15.4, 151, 200);
    if (ppm <= 30.4) return mapAQI(ppm, 15.5, 30.4, 201, 300);
    if (ppm <= 50.4) return mapAQI(ppm, 30.5, 50.4, 301, 500);
    return 500;
  };
  
  // Linear interpolation function for AQI calculation
  export const mapAQI = (concentration, c_low, c_high, i_low, i_high) => {
    return Math.round(((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low);
  };
  
  // Function to determine AQI category based on value
  export const getAQICategory = (aqi) => {
    for (const category of aqiCategories) {
      if (aqi >= category.range[0] && aqi <= category.range[1]) {
        return category;
      }
    }
    return aqiCategories[aqiCategories.length - 1]; // Default to hazardous for values above 500
  };