import React from 'react';
import LiveAQIIndicator from './LiveAQIIndicator';

const StationInfo = ({ selectedStation }) => {
  return (
    
    <div className="station-info">
      {/* Live AQI indicator */}
      <LiveAQIIndicator />
      <h2>{selectedStation.name}</h2>
      <p>
        {selectedStation.city || 'Unknown'}, {selectedStation.state || 'Unknown'},{' '}
        {selectedStation.country || 'Unknown'}
      </p>
    </div>
  );
};

export default StationInfo;
