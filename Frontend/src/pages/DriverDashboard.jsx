import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, Chip, CircularProgress, 
  Container, Avatar, Grid, Paper, IconButton, Badge, Alert, LinearProgress, Menu, MenuItem, ListItemText, ListItemIcon, Fade, Grow 
} from '@mui/material';
import { 
  AccessTime, AttachMoney, LocalGasStation, Speed, Star, Notifications, 
  Timeline, Logout, Directions, Circle, CheckCircle, Warning 
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API_URL from '../config';
import ChatWidget from '../components/ChatWidget'; 
import { motion } from 'framer-motion';

// --- THEME ---
const COLORS = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  orange: '#f97316',
  green: '#10b981',
  blue: '#3b82f6',
  red: '#ef4444',
  purple: '#8b5cf6',
  border: 'rgba(255,255,255,0.08)'
};

// --- FIX LEAFLET MARKER ICONS ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io(API_URL);

// --- HELPER: MAP COMPONENT TO DRAW ROUTE ---
const RoutingMap = ({ pickup, dropoff }) => {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    // 1. Geocode Addresses to Lat/Lng
    const getCoords = async (address) => {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
        if (res.data && res.data[0]) {
          return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
        }
      } catch (e) { console.error(e); }
      return null;
    };

    const fetchRoute = async () => {
      const start = await getCoords(pickup);
      const end = await getCoords(dropoff);

      if (start && end) {
        // 2. Get Real Road Path
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        
        try {
          const routeRes = await axios.get(url);
          const coordinates = routeRes.data.routes[0].geometry.coordinates;
          setRouteCoords(coordinates.map(coord => [coord[1], coord[0]]));
        } catch (err) {
          console.error("Routing Error:", err);
          setRouteCoords([start, end]);
        }
      }
    };

    fetchRoute();
  }, [pickup, dropoff]);

  const Recenter = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords.length > 0) {
        map.fitBounds(coords, { padding: [20, 20] });
      }
    }, [coords, map]);
    return null;
  };

  return (
    <Box sx={{ height: 300, width: '100%', borderRadius: 3, overflow: 'hidden', mt: 3, border: `1px solid ${COLORS.border}` }}>
       <MapContainer center={[20, 78]} zoom={5} style={{ height: '100%', width: '100%' }}>
         {/* Dark Mode Map Tiles */}
         <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
         
         {routeCoords.length > 0 && (
           <>
             <Polyline positions={routeCoords} color={COLORS.orange} weight={5} opacity={0.8} />
             <Marker position={routeCoords[0]}><Popup>Pickup</Popup></Marker>
             <Marker position={routeCoords[routeCoords.length - 1]}><Popup>Dropoff</Popup></Marker>
             <Recenter coords={routeCoords} />
           </>
         )}
       </MapContainer>
    </Box>
  );
};

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shiftTime, setShiftTime] = useState(0);
  const [gpsError, setGpsError] = useState('');
  
  // Notification State
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to RoadRunner! 🚛", time: "Just now", read: false },
    { id: 2, text: "Please verify your vehicle documents.", time: "2 hrs ago", read: false }
  ]);

  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const handleLogout = () => {
    stopTracking();
    stopTimer();
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const fetchDashboard = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) { window.location.href = '/login'; return; }
      const user = JSON.parse(userStr);

      const driversRes = await axios.get(`${API_URL}/api/auth/drivers`);
      const myProfile = driversRes.data.find(d => d._id === user._id);
      
      if (!myProfile) { handleLogout(); return; }
      setDriver(myProfile);

      const jobsRes = await axios.get(`${API_URL}/api/jobs`);
      const myJob = jobsRes.data.find(j => 
        j.assignedDriver?._id === user._id && j.status === 'assigned'
      );
      
      if (myJob && !currentJob) {
        addNotification(`New Job Assigned: #${myJob.orderId}`);
      }
      
      setCurrentJob(myJob);
      setLoading(false);

      if (myProfile.status === 'available') {
        startTimer();
        startTracking(myProfile._id);
      }
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { 
    fetchDashboard(); 
    return () => { stopTracking(); stopTimer(); }; 
  }, []);

  const addNotification = (text) => {
    setNotifications(prev => [{ id: Date.now(), text, time: "Just now", read: false }, ...prev]);
  };

  const startTimer = () => { if (!timerRef.current) timerRef.current = setInterval(() => setShiftTime(p => p + 1), 1000); };
  const stopTimer = () => { clearInterval(timerRef.current); timerRef.current = null; };
  const formatTime = (s) => `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

  const startTracking = (driverId) => {
    if (!navigator.geolocation) { setGpsError("No GPS Support"); return; }
    setGpsError('');
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => socket.emit('driverLocationUpdate', { driverId, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err), 
      { enableHighAccuracy: true }
    );
  };
  const stopTracking = () => { if(watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };

  const toggleStatus = async () => {
    if (!driver) return;
    const newStatus = driver.status === 'available' ? 'offline' : 'available';
    try {
      await axios.put(`${API_URL}/api/auth/status/${driver._id}`, { status: newStatus });
      setDriver({ ...driver, status: newStatus });
      if (newStatus === 'available') { startTimer(); startTracking(driver._id); } else { stopTimer(); stopTracking(); }
    } catch (err) { alert("Network Error"); }
  };

  const completeJob = async () => {
    try {
      await axios.put(`${API_URL}/api/jobs/${currentJob._id}`, { status: 'delivered' });
      await axios.put(`${API_URL}/api/auth/status/${driver._id}`, { status: 'available' });
      window.location.reload(); 
    } catch (err) { alert("Error completing job"); }
  };

  // Notification Handlers
  const handleNotifClick = (event) => setAnchorEl(event.currentTarget);
  const handleNotifClose = () => {
    setAnchorEl(null);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: COLORS.bg }}><CircularProgress sx={{ color: COLORS.orange }} /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.bg, pb: 10, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* Import Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* NAVBAR */}
      <Paper sx={{ position: 'sticky', top: 0, zIndex: 100, bgcolor: 'rgba(30, 41, 59, 0.85)', backdropFilter: 'blur(12px)', px: 2, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: COLORS.orange, fontWeight: 'bold' }}>{driver?.name[0]}</Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color="white">{driver?.name}</Typography>
            <Typography variant="caption" color={COLORS.textMuted}>Platinum Driver</Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
           <IconButton sx={{ color: 'white', mr: 1 }} onClick={handleNotifClick}>
             <Badge badgeContent={unreadCount} color="error">
               <Notifications />
             </Badge>
           </IconButton>
           
           <IconButton onClick={handleLogout} sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: COLORS.red, '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' } }}>
             <Logout />
           </IconButton>
        </Box>
      </Paper>

      {/* NOTIFICATION MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleNotifClose} PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1, bgcolor: COLORS.cardBg, color: 'white', border: `1px solid ${COLORS.border}` } }}>
         <Typography variant="subtitle2" sx={{ p: 2, pb: 1, fontWeight: 'bold', color: COLORS.textMuted }}>Notifications</Typography>
         {notifications.length === 0 ? (
           <MenuItem disabled><Typography variant="body2" color={COLORS.textMuted}>No new notifications</Typography></MenuItem>
         ) : (
           notifications.map(n => (
             <MenuItem key={n.id} onClick={handleNotifClose} sx={{ bgcolor: n.read ? 'transparent' : 'rgba(255,255,255,0.05)' }}>
               <ListItemIcon><Circle sx={{ fontSize: 10, color: n.read ? 'transparent' : COLORS.orange }} /></ListItemIcon>
               <ListItemText primary={n.text} secondary={n.time} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: n.read ? 'normal' : 'bold', color: 'white' }} secondaryTypographyProps={{ color: COLORS.textMuted }} />
             </MenuItem>
           ))
         )}
      </Menu>

      {/* CONTENT */}
      <Container maxWidth="md" sx={{ mt: 4, px: 2 }}>
        {gpsError && <Alert severity="error" sx={{ mb: 3 }}>{gpsError}</Alert>}

        {/* STATUS CARD */}
        <Fade in={!loading} timeout={500}>
          <Card sx={{ borderRadius: 4, mb: 4, bgcolor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
              <Box>
                 <Typography variant="caption" fontWeight="bold" letterSpacing={1} color={COLORS.textMuted}>CURRENT STATUS</Typography>
                 <Typography variant="h5" fontWeight="800" sx={{ color: driver?.status === 'available' ? COLORS.green : COLORS.red, mt: 0.5 }}>
                   {driver?.status === 'available' ? 'ONLINE' : 'OFFLINE'}
                 </Typography>
              </Box>
              <Button 
                variant="contained" onClick={toggleStatus} size="large"
                sx={{ borderRadius: 3, px: 4, py: 1, fontWeight: 'bold', bgcolor: driver?.status === 'available' ? COLORS.red : COLORS.green, '&:hover': { bgcolor: driver?.status === 'available' ? '#dc2626' : '#059669' } }}
              >
                {driver?.status === 'available' ? 'Stop' : 'Go Online'}
              </Button>
            </CardContent>
          </Card>
        </Fade>

        {/* METRICS */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { label: 'Earnings', val: '₹2,450', icon: <AttachMoney />, color: COLORS.green },
            { label: 'Shift', val: formatTime(shiftTime), icon: <AccessTime />, color: COLORS.blue },
            { label: 'Trips', val: '5', icon: <Timeline />, color: COLORS.purple },
            { label: 'Fuel', val: '80%', icon: <LocalGasStation />, color: COLORS.orange },
          ].map((item, i) => (
            <Grow in={!loading} timeout={500 + (i * 100)} key={i}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, borderRadius: 3, bgcolor: COLORS.cardBg, textAlign: 'center', border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} elevation={0}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: `${item.color}20`, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5, color: item.color }}>{item.icon}</Box>
                  <Typography variant="h6" fontWeight="800" color="white">{item.val}</Typography>
                  <Typography variant="caption" fontWeight="bold" color={COLORS.textMuted}>{item.label}</Typography>
                </Paper>
              </Grid>
            </Grow>
          ))}
        </Grid>

        {/* ACTIVE JOB WITH MAP */}
        {currentJob ? (
          <Fade in timeout={800}>
            <Card sx={{ borderRadius: 4, mb: 3, bgcolor: COLORS.cardBg, border: `1px solid ${COLORS.orange}`, position: 'relative', overflow: 'visible' }}>
              <Box sx={{ position: 'absolute', top: -12, left: 24, bgcolor: COLORS.orange, px: 2, py: 0.5, borderRadius: 50, color: 'white', fontWeight: 'bold', fontSize: '0.75rem', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.4)' }}>
                ACTIVE ORDER
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                   <Typography variant="h5" fontWeight="800" color="white">#{currentJob.orderId}</Typography>
                   <Chip label="In Progress" sx={{ bgcolor: `${COLORS.blue}20`, color: COLORS.blue, fontWeight: 'bold' }} icon={<Directions sx={{ color: `${COLORS.blue} !important` }} />} />
                </Box>

                <RoutingMap pickup={currentJob.pickupAddress} dropoff={currentJob.dropoffAddress} />

                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <LocalGasStation sx={{ color: COLORS.orange }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color={COLORS.textMuted}>DESTINATION</Typography>
                    <Typography variant="h6" fontWeight="bold" color="white">{currentJob.dropoffAddress}</Typography>
                  </Box>
                </Box>

                <Button fullWidth variant="contained" size="large" onClick={completeJob} sx={{ mt: 3, py: 1.8, borderRadius: 3, fontSize: '1rem', fontWeight: 'bold', bgcolor: COLORS.green, '&:hover': { bgcolor: '#059669' } }}>
                  Complete Delivery
                </Button>
              </CardContent>
            </Card>
          </Fade>
        ) : (
          <Fade in timeout={800}>
            <Card sx={{ borderRadius: 4, mb: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <CardContent sx={{ py: 8 }}>
                <Box sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '50%', mx: 'auto', mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Speed sx={{ color: COLORS.orange, fontSize: 40 }} />
                </Box>
                <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>Scanning for Jobs...</Typography>
                <Typography color={COLORS.textMuted}>You are visible to dispatch. Stay tight!</Typography>
              </CardContent>
            </Card>
          </Fade>
        )}
      </Container>

      {/* FLOATING CHAT WIDGET */}
      {driver && (
        <ChatWidget 
          userId={driver._id} 
          userName={driver.name} 
          targetName="Dispatcher" 
          role="driver"
        />
      )}

    </Box>
  );
};

export default DriverDashboard;