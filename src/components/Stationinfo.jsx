import React from 'react';

const StationInfo = ({ selectedStation }) => {
  return (
    <div className="station-info">
      <h2>{selectedStation.name}</h2>
      <p>
        {selectedStation.city || 'Unknown'}, {selectedStation.state || 'Unknown'},{' '}
        {selectedStation.country || 'Unknown'}
      </p>
    </div>
  );
};

export default StationInfo;
