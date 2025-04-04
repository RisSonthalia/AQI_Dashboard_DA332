 // AQI categories and colors
export const aqiCategories = [
    { range: [0, 50], level: 'Good', color: '#00e400', healthImplications: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
    { range: [51, 100], level: 'Moderate', color: '#ffff00', healthImplications: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' },
    { range: [101, 150], level: 'Unhealthy for Sensitive Groups', color: '#ff7e00', healthImplications: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
    { range: [151, 200], level: 'Unhealthy', color: '#ff0000', healthImplications: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
    { range: [201, 300], level: 'Very Unhealthy', color: '#8f3f97', healthImplications: 'Health alert: The risk of health effects is increased for everyone.' },
    { range: [301, 500], level: 'Hazardous', color: '#7e0023', healthImplications: 'Health warning of emergency conditions: everyone is more likely to be affected.' }
  ];


 