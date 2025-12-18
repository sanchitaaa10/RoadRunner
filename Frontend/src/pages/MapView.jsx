import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Switch, CircularProgress, Fade, Chip } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Traffic, GpsFixed, LocalShipping, Circle } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import io from 'socket.io-client';
import API_URL from '../config';

// --- LIGHT THEME CONSTANTS ---
const COLORS = {
  bg: '#f8fafc',        // Light Background
  card: '#ffffff',      // White Card
  orange: '#f97316',
  green: '#10b981',
  textMain: '#1e293b',  // Dark Text
  textMuted: '#64748b',
  border: '#e2e8f0'
};

// --- SOCKET SETUP ---
const socket = io(API_URL);

// --- ICONS ---
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Truck Icon
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/741/741407.png', 
  shadowUrl: iconShadow,
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -25],
  className: 'custom-marker-icon'
});

// --- TRAFFIC LAYER ---
const TrafficLayer = () => (
  <TileLayer
    url="https://mt0.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}"
    attribution='&copy; Google Maps'
    opacity={0.8}
  />
);

const MapView = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    // 1. Fetch Initial Data
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/drivers`);
        setDrivers(res.data);
        
        const total = res.data.length;
        const withLoc = res.data.filter(d => d.location && d.location.lat).length;
        setDebugInfo(`${withLoc}/${total} Active`);
        
        setLoading(false);
      } catch (err) { console.error(err); setLoading(false); }
    };
    fetchDrivers();

    // 2. Listen for Real-Time Updates
    const handleLocationUpdate = (data) => {
      setDrivers((prev) => {
        const exists = prev.find(d => d._id === data.driverId);
        if (exists) {
          return prev.map(d => d._id === data.driverId ? { ...d, location: { lat: data.lat, lng: data.lng } } : d);
        } else {
          return prev;
        }
      });
      setDebugInfo(`Syncing: Driver ${data.driverId.slice(-4)}`);
    };

    socket.on('locationUpdate', handleLocationUpdate);
    return () => socket.off('locationUpdate', handleLocationUpdate);
  }, []);

  // Component to Auto-Center Map
  const RecenterMap = () => {
    const map = useMap();
    useEffect(() => {
      if (!loading && drivers.length > 0) {
        const active = drivers.find(d => d.location && d.location.lat);
        if (active) {
          map.setView([active.location.lat, active.location.lng], 12, { animate: true });
        } else {
          map.setView([19.0760, 72.8777], 10);
        }
      }
    }, [loading, drivers, map]);
    return null;
  };

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: COLORS.bg }}><CircularProgress sx={{ color: COLORS.orange }} /></Box>;

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 20px)', bgcolor: COLORS.bg, position: 'relative', overflow: 'hidden' }}>
      
      {/* --- PROFESSIONAL LIGHT MAP STYLES --- */}
      <style>
        {`
          .leaflet-container { background: #e5e7eb !important; font-family: 'Plus Jakarta Sans', sans-serif; }
          
          /* Clean White Popup Card */
          .leaflet-popup-content-wrapper { 
            background: ${COLORS.card} !important; 
            color: ${COLORS.textMain} !important; 
            border-radius: 12px !important;
            border: 1px solid ${COLORS.border};
            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
            padding: 0 !important;
          }
          .leaflet-popup-content { margin: 0 !important; width: 160px !important; }
          .leaflet-popup-tip { background: ${COLORS.card} !important; border-top: 1px solid ${COLORS.border}; }
          
          /* Close Button */
          .leaflet-container a.leaflet-popup-close-button {
            color: ${COLORS.textMuted} !important;
            font-size: 18px !important;
            padding: 4px !important;
          }
          .leaflet-container a.leaflet-popup-close-button:hover { color: ${COLORS.textMain} !important; }

          /* Zoom Controls */
          .leaflet-control-zoom a {
            background-color: ${COLORS.card} !important;
            color: ${COLORS.textMain} !important;
            border: 1px solid ${COLORS.border} !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
          }
          .leaflet-control-zoom a:hover { background-color: #f3f4f6 !important; }
        `}
      </style>

      {/* FLOATING HEADER CONTROLS (Light Glass) */}
      <Fade in={!loading} timeout={800}>
        <Box sx={{ 
          position: 'absolute', top: 40, left: 40, right: 40, zIndex: 1000, 
          pointerEvents: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' 
        }}>
          
          {/* Status Badge */}
          <Paper sx={{ 
            pointerEvents: 'auto', p: '10px 20px', borderRadius: 4, 
            bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Box sx={{ p: 1, bgcolor: '#fff7ed', borderRadius: '50%', color: COLORS.orange, display: 'flex' }}>
              <GpsFixed fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="800" color={COLORS.textMain} letterSpacing={0.5}>LIVE FLEET MAP</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Circle sx={{ width: 8, height: 8, color: COLORS.green }} />
                <Typography variant="caption" color={COLORS.textMuted} fontWeight="600">
                  {debugInfo || "Scanning network..."}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Traffic Switch */}
          <Paper sx={{ 
            pointerEvents: 'auto', p: '8px 16px', borderRadius: 50, 
            bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)',
            border: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', gap: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <Traffic fontSize="small" sx={{ color: showTraffic ? COLORS.orange : COLORS.textMuted }} />
            <Typography variant="caption" fontWeight="bold" color={COLORS.textMain}>Traffic Layer</Typography>
            <Switch 
              size="small"
              checked={showTraffic} 
              onChange={(e) => setShowTraffic(e.target.checked)} 
              sx={{ 
                '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.orange },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.orange },
                '& .MuiSwitch-track': { backgroundColor: '#cbd5e1' }
              }} 
            />
          </Paper>
        </Box>
      </Fade>

      {/* MAP CONTAINER */}
      <Paper elevation={0} sx={{ 
        height: '100%', width: '100%', borderRadius: 4, overflow: 'hidden', 
        border: `1px solid ${COLORS.border}`, position: 'relative',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
      }}>
        <MapContainer center={[19.0760, 72.8777]} zoom={12} style={{ height: '100%', width: '100%' }}>
          
          {/* PROFESSIONAL LIGHT MAP TILES (Voyager) */}
          {!showTraffic ? (
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
          ) : (
            <TrafficLayer /> 
          )}

          {drivers.map(driver => (
            driver.location && driver.location.lat && (
              <Marker key={driver._id} position={[driver.location.lat, driver.location.lng]} icon={truckIcon}>
                <Popup>
                  <Box sx={{ p: 1.5, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1.5 }}>
                      <LocalShipping sx={{ color: COLORS.orange, fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: COLORS.textMain }}>{driver.name}</Typography>
                    </Box>
                    
                    <Chip 
                      label={driver.status?.toUpperCase() || 'OFFLINE'} 
                      size="small" 
                      sx={{ 
                        height: 22, fontSize: '0.65rem', fontWeight: 'bold', width: '100%', mb: 1.5,
                        bgcolor: driver.status === 'available' ? '#dcfce7' : '#ffedd5',
                        color: driver.status === 'available' ? '#166534' : '#9a3412',
                        border: `1px solid ${driver.status === 'available' ? '#bbf7d0' : '#fed7aa'}`
                      }} 
                    />
                    
                    <Typography variant="caption" color={COLORS.textMuted} sx={{ display: 'block', fontSize: '0.75rem', borderTop: `1px solid ${COLORS.border}`, pt: 1 }}>
                      {driver.vehicleType} • {driver.licensePlate}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>
            )
          ))}
          
          <RecenterMap />
        </MapContainer>
      </Paper>
    </Box>
  );
};

export default MapView;