import React, { useState, useEffect } from 'react';

const CityStationsTable = ({ selectedStation, stations, fetchStationData }) => {
  const [cityStations, setCityStations] = useState([]);
  const [stationsData, setStationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter stations by city when selected station changes
  useEffect(() => {
    if (selectedStation && stations.length > 0) {
      const city = selectedStation.city || getStationCity(selectedStation.name);
      
      if (city) {
        const sameCity = stations.filter(station => 
          (station.city && station.city.toLowerCase() === city.toLowerCase()) ||
          (!station.city && getStationCity(station.name).toLowerCase() === city.toLowerCase())
        );
        setCityStations(sameCity);
      } else {
        setCityStations([selectedStation]);
      }
    }
  }, [selectedStation, stations]);

  // Function to extract city from station name if not explicitly provided
  const getStationCity = (stationName) => {
    if (!stationName) return "";
    
    // Common patterns in station names: "Location, City" or "City - Location"
    if (stationName.includes(',')) {
      return stationName.split(',')[1].trim();
    } else if (stationName.includes(' - ')) {
      return stationName.split(' - ')[0].trim();
    }
    return "";
  };

  // Fetch data for all city stations
  useEffect(() => {
    const fetchAllStationsData = async () => {
      if (cityStations.length === 0) return;
      
      setLoading(true);
      try {
        const dataPromises = cityStations.map(station => 
          fetchStationData(station.latitude, station.longitude)
        );
        
        const results = await Promise.all(dataPromises);
        
        const stationsWithData = cityStations.map((station, index) => ({
          ...station,
          data: results[index]
        }));
        
        setStationsData(stationsWithData);
      } catch (error) {
        console.error("Error fetching city stations data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllStationsData();
  }, [cityStations]);

  // Function to determine AQI status color and label
  const getStatusInfo = (aqi) => {
    if (!aqi) return { color: '#999', label: 'Unknown' };
    
    if (aqi <= 50) return { color: '#00e400', label: 'Good' };
    if (aqi <= 100) return { color: '#ffff00', label: 'Moderate' };
    if (aqi <= 150) return { color: '#ff7e00', label: 'Poor' };
    if (aqi <= 200) return { color: '#ff0000', label: 'Unhealthy' };
    if (aqi <= 300) return { color: '#8f3f97', label: 'Very Unhealthy' };
    return { color: '#7e0023', label: 'Hazardous' };
  };

  if (!selectedStation || cityStations.length === 0) {
    return null;
  }

  const cityName = selectedStation.city || getStationCity(selectedStation.name) || "Current Location";

  return (
    <div className="city-stations-container" style={{
      backgroundColor: '#1f2937',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '20px',
      width: '100%'
    }}>
      <h2 style={{ color: 'white', marginBottom: '16px' }}>{cityName}'s Locations</h2>
      <h3 style={{ color: '#60a5fa', marginBottom: '24px' }}>Real-time Air Pollution Level</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          color: 'white'
        }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                Location
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                Status
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                AQI
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                PM2.5
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>(μg/m³)</span>
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                PM10
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>(μg/m³)</span>
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                Temp.
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>(°C)</span>
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
              <th style={{ padding: '12px 16px', color: '#9ca3af' }}>
                Humi.
                <span style={{ marginLeft: '4px', fontSize: '12px' }}>(%) </span>
                <span style={{ marginLeft: '4px', color: '#6b7280' }}>↓</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                  Loading station data...
                </td>
              </tr>
            ) : (
              stationsData.map(station => {
                const data = station.data || {};
                const aqi = data.aqi || 0;
                const status = getStatusInfo(aqi);
                
                return (
                  <tr key={station.station_id || station.id} style={{ 
                    backgroundColor: '#374151',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}>
                    <td style={{ padding: '16px' }}>{station.name || "Unknown"}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        backgroundColor: status.color,
                        color: status.label === 'Good' || status.label === 'Moderate' ? '#111' : '#fff',
                        padding: '4px 16px',
                        borderRadius: '20px',
                        display: 'inline-block'
                      }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>{aqi || "—"}</td>
                    <td style={{ padding: '16px' }}>{data.pm2_5?.toFixed(0) || "—"}</td>
                    <td style={{ padding: '16px' }}>{data.pm10?.toFixed(0) || "—"}</td>
                    <td style={{ padding: '16px' }}>
                      {data.temp ? data.temp.toFixed(0) : "28"}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {data.humidity ? data.humidity.toFixed(0) : "56"}
                    </td>
                  </tr>
                );
              })
            )}
            {!loading && stationsData.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>
                  No stations found in this city
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CityStationsTable;