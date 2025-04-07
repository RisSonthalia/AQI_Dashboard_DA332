
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ searchTerm, filteredStations, handleSearchChange, handleStationSelect, handleRefresh, lastUpdated, isDark }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(searchTerm || '');

  // Update local state when prop changes
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const navigateToHome = () => {
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // If we have filtered stations and the user presses enter, select the first one
    if (filteredStations && filteredStations.length > 0) {
      const firstStation = filteredStations[0];
      navigate('/', { state: { selectedStation: firstStation, isDark } });
    }
  };

  const handleStationSelectAndNavigate = (station) => {
    // First handle the selection with the parent component's handler
    if (handleStationSelect) {
      handleStationSelect(station);
    }
    
    // Then navigate to home with the selected station
    navigate('/', { state: { selectedStation: station, isDark } });
  };

  const handleLocalSearchChange = (e) => {
    setSearchInput(e.target.value);
    if (handleSearchChange) {
      handleSearchChange(e);
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-top">
          <div className="logo-section">
            <h1 onClick={navigateToHome} className="site-title">
              Real-Time Analysis
            </h1>
          </div>

          <div className="controls-section">
            <button className="refresh-button" onClick={handleRefresh}>
              Refresh Data
            </button>
          </div>
          {/* {lastUpdated && <p className="last-updated">Last updated: {lastUpdated}</p>} */}
        </div>

        <div className="search-wrapper">
          <form onSubmit={handleSearchSubmit} className="search-container">
            <input
              type="text"
              placeholder="Search stations by name, city, or state..."
              value={searchInput}
              onChange={handleLocalSearchChange}
              className="search-input"
            />
            <div className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
            </div>
          </form>

          {searchInput && (
            <div className="search-results">
              {filteredStations.slice(0, 10).map((station) => (
                <div
                  key={station.station_id || station.id}
                  className="search-result-item"
                  onClick={() => handleStationSelectAndNavigate(station)}
                >
                  <div className="station-name">{station.name}</div>
                  <div className="station-location">
                    {station.city || 'Unknown'}, {station.state || 'Unknown'}
                  </div>
                </div>
              ))}
              {filteredStations.length === 0 && (
                <div className="search-result-item no-results">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


// import React from 'react';
// import './Header.css'; // Import the CSS file

// const Header = ({ searchTerm, filteredStations, handleSearchChange, handleStationSelect, handleRefresh, lastUpdated }) => {
//   const navigateToHome = () => {
//     // Navigate to home page
//     window.location.href = '/';
//   };

//   return (
//     <header className="header">
//       <div className="header-container">
//         <div className="header-top">
//           <div className="logo-section">
//             <h1
//               onClick={navigateToHome}
//               className="site-title"
//             >
//               Real-Time Analysis
//             </h1>
//           </div>

//           <div className="controls-section">
//             <button
//               className="refresh-button"
//               onClick={handleRefresh}
//             >
//               Refresh Data
//             </button>

//           </div>
//           {lastUpdated && (
//             <p className="last-updated">
//               Last updated: {lastUpdated}
//             </p>
//           )}
//         </div>
        
//         <div className="search-wrapper">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search stations by name, city, or state..."
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="search-input"
//             />
//             <div className="search-icon">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                 <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" fill="none" />
//               </svg>
//             </div>
//           </div>
         
//           {searchTerm && (
//             <div className="search-results">
//               {filteredStations.slice(0, 10).map(station => (
//                 <div
//                   key={station.station_id || station.id}
//                   className="search-result-item"
//                   onClick={() => handleStationSelect(station)}
//                 >
//                   <div className="station-name">{station.name}</div>
//                   <div className="station-location">{station.city || 'Unknown'}, {station.state || 'Unknown'}</div>
//                 </div>
//               ))}
//               {filteredStations.length === 0 && (
//                 <div className="search-result-item no-results">No results found</div>
//               )}
//             </div>
            
//           )}

          
//         </div>
//       </div>

//     </header>
//   );
// };

// export default Header;