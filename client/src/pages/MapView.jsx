import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Paper, Typography, Chip, CircularProgress } from '@mui/material';
import io from 'socket.io-client';
import axios from 'axios';
import API_URL from '../config';

const socket = io(API_URL);

// --- CUSTOM TRUCK ICON ---
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7586/7586655.png', // Nice Truck Icon
  iconSize: [45, 45], 
  iconAnchor: [22, 22], 
  popupAnchor: [0, -20]
});

const MapView = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Load
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/drivers`);
        setDrivers(res.data);
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchDrivers();

    // 2. REAL-TIME UPDATES (The Magic ✨)
    socket.on('locationUpdate', (data) => {
      console.log("📍 Map Update Received:", data);
      
      setDrivers(prevDrivers => 
        prevDrivers.map(driver => {
          // Find the driver who moved and update ONLY their position
          if (driver._id === data.driverId) {
            return { ...driver, lat: data.lat, lng: data.lng };
          }
          return driver;
        })
      );
    });

    return () => socket.off('locationUpdate');
  }, []);

  if (loading) return <Box p={4}><CircularProgress /></Box>;

  // Count active drivers for the badge
  const activeCount = drivers.filter(d => d.lat && d.lng).length;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      {/* HEADER */}
      <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">🇮🇳 India Fleet Live Map</Typography>
        <Chip label={`${activeCount} Drivers Tracking`} color="success" size="small" />
      </Paper>

      {/* MAP - 75vh Height */}
      <Paper sx={{ 
        flexGrow: 1, height: '75vh', overflow: 'hidden', borderRadius: 3, 
        border: '4px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}>
        <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* RENDER DRIVERS */}
          {drivers.map((driver) => (
            (driver.lat && driver.lng) && (
              <Marker key={driver._id} position={[driver.lat, driver.lng]} icon={truckIcon}>
                <Popup>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">{driver.name}</Typography>
                    <Typography variant="caption">{driver.vehicleType}</Typography>
                    <br />
                    <Typography variant="caption" color="primary">Speed: {Math.floor(Math.random() * 60)} km/h</Typography>
                  </Box>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default MapView;