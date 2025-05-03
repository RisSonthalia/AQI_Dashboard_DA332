import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat/dist/leaflet-heat.js';
import TopBar from '../components/real-time-main-page/TopBar';
import Footer from '../components/real-time-main-page/Footer';
import './HomePage.css';
import { Home } from 'lucide-react';

// Center coordinates for India's map
const INDIA_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;
const API_KEY = 'aac405e628f9c30a047d3de13192a7f7';

// AQI color scale
const getAqiColor = (aqi) => {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#99004c'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
};

// Calculate AQI from pollutant values
const calculateAQI = (pollutants) => {
  // Simplified AQI calculation based on PM2.5
  const pm25 = pollutants.pm2_5;
  
  if (pm25 <= 12) {
    return Math.round((50 - 0) / (12 - 0) * (pm25 - 0) + 0);
  } else if (pm25 <= 35.4) {
    return Math.round((100 - 51) / (35.4 - 12.1) * (pm25 - 12.1) + 51);
  } else if (pm25 <= 55.4) {
    return Math.round((150 - 101) / (55.4 - 35.5) * (pm25 - 35.5) + 101);
  } else if (pm25 <= 150.4) {
    return Math.round((200 - 151) / (150.4 - 55.5) * (pm25 - 55.5) + 151);
  } else if (pm25 <= 250.4) {
    return Math.round((300 - 201) / (250.4 - 150.5) * (pm25 - 150.5) + 201);
  } else {
    return Math.round((500 - 301) / (500.4 - 250.5) * (pm25 - 250.5) + 301);
  }
};

// Get AQI category
const getAqiCategory = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

function HomePage() {
  const [stations, setStations] = useState([]);
  const [stationsWithAqi, setStationsWithAqi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [dataCache, setDataCache] = useState({
    timestamp: null,
    data: []
  });
  
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const heatLayer = useRef(null);
  const markersLayer = useRef(null);
  
  // Toggle dark mode
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);
  
  // Toggle station markers
  const toggleMarkers = () => {
    setShowMarkers(!showMarkers);
    if (markersLayer.current) {
      if (!showMarkers) {
        markersLayer.current.addTo(leafletMap.current);
      } else {
        leafletMap.current.removeLayer(markersLayer.current);
      }
    }
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Create map instance
      leafletMap.current = L.map(mapRef.current).setView(INDIA_CENTER, DEFAULT_ZOOM);
      
      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);
      
      // Create layers for markers and heat
      markersLayer.current = L.layerGroup().addTo(leafletMap.current);
      
      // Add India outline
      fetch('/india-states.geojson')
        .then(response => response.json())
        .then(data => {
          L.geoJSON(data, {
            style: {
              color: isDark ? '#666' : '#999',
              weight: 1,
              fillOpacity: 0.1,
              fillColor: isDark ? '#222' : '#f5f5f5'
            }
          }).addTo(leafletMap.current);
        })
        .catch(err => console.error("Error loading India GeoJSON:", err));
    }
    
    // Cleanup function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update map theme when dark mode changes
  useEffect(() => {
    if (leafletMap.current) {
      // This is just a workaround since we can't easily change tile layers
      // In a real application, you would switch between light and dark map tiles
      const container = leafletMap.current.getContainer();
      if (isDark) {
        container.style.filter = 'invert(0.8) brightness(0.8) contrast(1.2)';
      } else {
        container.style.filter = 'none';
      }
    }
  }, [isDark]);

  // Load station data from CSV
  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await fetch('/metadata.csv');
        const csvData = await response.text();

        Papa.parse(csvData, {
          header: true,
          complete: (results) => {
            const validStations = results.data.filter(
              station =>
                station.station_id && station.latitude && station.longitude && 
                station.name && station.country && station.city && station.state 
            );
            
            setStations(validStations);
            
            // Fetch AQI data once stations are loaded
            fetchAllStationsData(validStations);
          },
          error: (error) => {
            console.error("CSV parsing error:", error);
            setError('Error parsing CSV: ' + error.message);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Station data loading error:", error);
        setError('Error loading station data: ' + error.message);
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // Fetch AQI data for all stations
  const fetchAllStationsData = async (stationList) => {
    if (!stationList || stationList.length === 0) return;
    
    const currentTime = new Date();
    
    // Check if cache is still valid (less than 1 hour old)
    if (
      dataCache.timestamp && 
      dataCache.data.length > 0 && 
      (currentTime - dataCache.timestamp) < 3600000
    ) {
      console.log("Using cached AQI data");
      setStationsWithAqi(dataCache.data);
      setLastUpdated(dataCache.timestamp);
      setLoading(false);
      updateMapLayers(dataCache.data);
      return;
    }
    
    setLoading(true);
    console.log("Fetching fresh AQI data");
    
    try {
      // Use Promise.all to fetch data for all stations in parallel
      // In a real app, you might want to batch these requests
      const batchSize = 10;
      let allStationsData = [];
      
      for (let i = 0; i < stationList.length; i += batchSize) {
        const batch = stationList.slice(i, i + batchSize);
        const batchPromises = batch.map(async (station) => {
          try {
            const airResponse = await axios.get(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${station.latitude}&lon=${station.longitude}&appid=${API_KEY}`
            );
            
            const pollutants = airResponse.data.list[0].components;
            
            const aqi = calculateAQI(pollutants);
            const aqiCategory = getAqiCategory(aqi);
            const aqiColor = getAqiColor(aqi);
            
            return {
              ...station,
              aqi,
              aqiCategory,
              aqiColor,
              pollutants: {
                pm2_5: pollutants.pm2_5,
                pm10: pollutants.pm10,
                no2: pollutants.no2,
                o3: pollutants.o3,
                co: pollutants.co,
                so2: pollutants.so2,
              }
            };
          } catch (error) {
            console.error(`Error fetching data for station ${station.name}:`, error);
            
            // Return station with placeholder data
            return {
              ...station,
              aqi: null,
              aqiCategory: 'Unknown',
              aqiColor: '#999',
              pollutants: {}
            };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        allStationsData = [...allStationsData, ...batchResults];
        
        // Update progress
        console.log(`Fetched ${allStationsData.length} of ${stationList.length} stations`);
      }
      
      // Filter out stations with null AQI
      const validStationsData = allStationsData.filter(station => station.aqi !== null);
      
      // Update state and cache
      setStationsWithAqi(validStationsData);
      setDataCache({
        timestamp: currentTime,
        data: validStationsData
      });
      setLastUpdated(currentTime);
      setLoading(false);
      
      // Update map with fresh data
      updateMapLayers(validStationsData);
      
    } catch (error) {
      console.error("Error fetching AQI data:", error);
      setError('Error fetching AQI data: ' + error.message);
      setLoading(false);
    }
  };

  // Set up data refresh interval
  useEffect(() => {
    // Refresh data every hour
    const intervalId = setInterval(() => {
      fetchAllStationsData(stations);
    }, 3600000);
    
    return () => clearInterval(intervalId);
  }, [stations]);

  // Update map layers with the latest data
  const updateMapLayers = (stationsData) => {
    if (!leafletMap.current || !stationsData.length) return;
    
    // Clear existing layers
    if (markersLayer.current) {
      markersLayer.current.clearLayers();
    }
    
    if (heatLayer.current) {
      leafletMap.current.removeLayer(heatLayer.current);
    }
    
    // Create heatmap data points
    const heatData = stationsData
      .filter(station => station.aqi !== null)
      .map(station => {
        const intensity = station.aqi / 500; // Normalize AQI (0-500 scale) to 0-1
        return [
          parseFloat(station.latitude), 
          parseFloat(station.longitude), 
          intensity
        ];
      });
    
    // Add extra interpolation points to make heatmap more continuous
    // Create a grid of points covering India to improve interpolation
    const extraPoints = [];
    
    // India bounds (approx)
    const north = 35.5;
    const south = 6.5;
    const east = 97.5;
    const west = 68.0;
    
    // Grid spacing (degrees)
    const spacing = 0.75;
    
    // For each grid point, find nearest stations and interpolate values
    for (let lat = south; lat <= north; lat += spacing) {
      for (let lng = west; lng <= east; lng += spacing) {
        // Skip if already has a station nearby (within 0.3 degrees)
        const hasNearbyStation = stationsData.some(station => {
          const stLat = parseFloat(station.latitude);
          const stLng = parseFloat(station.longitude);
          const distance = Math.sqrt(
            Math.pow(stLat - lat, 2) + Math.pow(stLng - lng, 2)
          );
          return distance < 0.3;
        });
        
        if (!hasNearbyStation) {
          // Find 3 nearest stations
          const nearest = stationsData
            .filter(station => station.aqi !== null)
            .map(station => ({
              station,
              distance: Math.sqrt(
                Math.pow(parseFloat(station.latitude) - lat, 2) + 
                Math.pow(parseFloat(station.longitude) - lng, 2)
              )
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 3);
          
          // Skip if no stations nearby
          if (nearest.length === 0) continue;
          
          // Inverse distance weighted interpolation
          let weightedSum = 0;
          let weightSum = 0;
          
          nearest.forEach(({ station, distance }) => {
            // Add a small epsilon to avoid division by zero
            const weight = 1 / (distance + 0.0001);
            weightedSum += station.aqi * weight;
            weightSum += weight;
          });
          
          const interpolatedAqi = weightSum > 0 ? weightedSum / weightSum : 0;
          const intensity = interpolatedAqi / 500;
          
          // Add to extra points
          extraPoints.push([lat, lng, intensity * 0.8]); // Slightly lower intensity for interpolated points
        }
      }
    }
    
    // Combine actual station data with interpolated points
    const combinedHeatData = [...heatData, ...extraPoints];
    
    // Add heatmap layer
    heatLayer.current = L.heatLayer(combinedHeatData, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      minOpacity: 0.4,
      gradient: {
        0.0: '#00e400',  // Good - Green
        0.2: '#ffff00',  // Moderate - Yellow
        0.4: '#ff7e00',  // Unhealthy for Sensitive - Orange
        0.6: '#ff0000',  // Unhealthy - Red
        0.8: '#99004c',  // Very Unhealthy - Purple
        1.0: '#7e0023'   // Hazardous - Maroon
      }
    }).addTo(leafletMap.current);
    
    // Create a custom map pin icon
    const createMarkerIcon = (color) => {
      return L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="pin-container">
                <div class="pin" style="background-color: ${color};">
                  <div class="pin-inner"></div>
                </div>
                <div class="pin-shadow"></div>
              </div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -45]
      });
    };
    
    // Add markers for stations
    stationsData.forEach(station => {
      const markerIcon = createMarkerIcon(station.aqi ? station.aqiColor : '#999');
      
      const marker = L.marker(
        [parseFloat(station.latitude), parseFloat(station.longitude)],
        { icon: markerIcon }
      );
      
      // Add popup with station info
      const popupContent = `
        <div class="station-popup">
          <h3>${station.name}</h3>
          <p><strong>City:</strong> ${station.city}, ${station.state}</p>
          ${station.aqi ? `
            <p><strong>AQI:</strong> ${station.aqi} (${station.aqiCategory})</p>
            <p><strong>PM2.5:</strong> ${station.pollutants.pm2_5?.toFixed(1) || 'N/A'} μg/m³</p>
            <p><strong>PM10:</strong> ${station.pollutants.pm10?.toFixed(1) || 'N/A'} μg/m³</p>
            <p><strong>NO₂:</strong> ${station.pollutants.no2?.toFixed(1) || 'N/A'} μg/m³</p>
            <p><strong>O₃:</strong> ${station.pollutants.o3?.toFixed(1) || 'N/A'} μg/m³</p>
            <p><strong>CO:</strong> ${station.pollutants.co?.toFixed(1) || 'N/A'} mg/m³</p>
            <p><strong>SO₂:</strong> ${station.pollutants.so2?.toFixed(1) || 'N/A'} μg/m³</p>
          ` : `<p>No AQI data available</p>`}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersLayer.current.addLayer(marker);
    });
    
    // Show/hide markers based on current state
    if (!showMarkers) {
      leafletMap.current.removeLayer(markersLayer.current);
    }
  };

  return (
    <div className={`app ${isDark ? 'dark-mode' : ''}`}>
      <TopBar toggleDarkMode={toggleDarkMode} isDark={isDark} />
      
      <div className="content">
        <div className="header">
          <h1>India Air Quality Index Heatmap</h1>
          <p>Real-time AQI visualization from 662 monitoring stations across India</p>
          
          {lastUpdated && (
            <p className="last-updated">
              Last updated: {lastUpdated.toLocaleTimeString()} ({lastUpdated.toLocaleDateString()})
            </p>
          )}
        </div>
        
        <div className="map-container">
          {loading && <div className="loading-overlay"><div className="loader"></div></div>}
          
          <div className="map-controls">
            <button className="control-button" onClick={toggleMarkers}>
              {showMarkers ? 'Hide Stations' : 'Show Stations'}
            </button>
            <button className="control-button" onClick={() => fetchAllStationsData(stations)}>
              Refresh Data
            </button>
          </div>
          
          <div className="map" id="map" ref={mapRef}></div>
          
          <div className="map-legend">
            <h3>AQI Legend</h3>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#00e400'}}></span>
              <span>Good (0-50)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#ffff00'}}></span>
              <span>Moderate (51-100)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#ff7e00'}}></span>
              <span>Unhealthy for Sensitive Groups (101-150)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#ff0000'}}></span>
              <span>Unhealthy (151-200)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#99004c'}}></span>
              <span>Very Unhealthy (201-300)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#7e0023'}}></span>
              <span>Hazardous (301+)</span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default HomePage;