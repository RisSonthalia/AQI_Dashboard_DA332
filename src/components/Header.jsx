import React from 'react';

const Header = ({ searchTerm, filteredStations, handleSearchChange, handleStationSelect, handleRefresh, lastUpdated }) => {
  return (
    <header className="header">
      <h1>Real-Time Air Quality Index Dashboard</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search stations by name, city, or state..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <div className="search-results">
            {filteredStations.slice(0, 10).map(station => (
              <div
                key={station.station_id || station.id}
                className="search-result-item"
                onClick={() => handleStationSelect(station)}
              >
                {station.name}, {station.city || 'Unknown'}, {station.state || 'Unknown'}
              </div>
            ))}
            {filteredStations.length === 0 && (
              <div className="search-result-item">No results found</div>
            )}
          </div>
        )}
      </div>
      <button className="refresh-button" onClick={handleRefresh}>
        Refresh Data
      </button>
      {lastUpdated && (
        <p className="last-updated">Last updated: {lastUpdated}</p>
      )}
    </header>
  );
};

export default Header;
