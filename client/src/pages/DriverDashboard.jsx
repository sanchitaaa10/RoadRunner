import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, CircularProgress, Container, Avatar, Paper, IconButton, Badge, Alert } from '@mui/material';
import { Star, Notifications, Place } from '@mui/icons-material'; // Add Icons as needed
import axios from 'axios';
import io from 'socket.io-client';
import API_URL from '../config';
import ChatWidget from '../components/ChatWidget';

const socket = io(API_URL);

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [gpsError, setGpsError] = useState('');
  const [locationDebug, setLocationDebug] = useState(null); // Shows coords on screen for testing
  const [loading, setLoading] = useState(true);
  
  const watchIdRef = useRef(null);

  const fetchDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return (window.location.href = '/login');
      const res = await axios.get(`${API_URL}/api/auth/drivers`);
      const me = res.data.find(d => d._id === user._id);
      setDriver(me);
      setLoading(false);
      
      // Auto-start tracking if online
      if (me.status === 'available') startTracking(me._id);
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { 
    fetchDashboard(); 
    return () => stopTracking(); 
  }, []);

  const startTracking = (driverId) => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    console.log("🛰️ Starting GPS Tracking...");
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGpsError(''); // Clear error if successful
        setLocationDebug({ lat: latitude.toFixed(4), lng: longitude.toFixed(4) }); // Show on UI

        // EMIT TO SERVER
        socket.emit('driverLocationUpdate', { 
          driverId, 
          lat: latitude, 
          lng: longitude 
        });
      },
      (err) => {
        console.error("GPS Error:", err);
        // Common Error: Code 1 = Permission Denied, Code 2 = Unavailable (e.g., http block)
        if (err.code === 1) setGpsError("GPS Permission Denied. Please allow location access.");
        else if (err.code === 2) setGpsError("GPS Signal Unavailable. Are you on https?");
        else setGpsError(`GPS Error: ${err.message}`);
      }, 
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  };

  const stopTracking = () => { 
    if(watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
  };

  // Toggle Status Button
  const toggleStatus = async () => {
    const newStatus = driver.status === 'available' ? 'offline' : 'available';
    await axios.put(`${API_URL}/api/auth/status/${driver._id}`, { status: newStatus });
    setDriver({ ...driver, status: newStatus });
    if (newStatus === 'available') startTracking(driver._id);
    else stopTracking();
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1f5f9', pb: 10 }}>
      {/* HEADER */}
      <Paper sx={{ p: 2, bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#6366f1' }}>{driver?.name[0]}</Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">{driver?.name}</Typography>
            <Typography variant="caption">{driver?.vehicleType}</Typography>
          </Box>
        </Box>
        <Chip 
          label={driver?.status === 'available' ? 'ONLINE' : 'OFFLINE'} 
          color={driver?.status === 'available' ? 'success' : 'default'} 
        />
      </Paper>

      <Container sx={{ mt: 3 }}>
        
        {/* GPS DEBUG & ERROR BOX */}
        {gpsError && (
          <Alert severity="error" sx={{ mb: 2 }}>{gpsError}</Alert>
        )}
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
             <Typography variant="h6">GPS Status</Typography>
             {locationDebug ? (
               <Typography color="green">
                 📡 Broadcasting: {locationDebug.lat}, {locationDebug.lng}
               </Typography>
             ) : (
               <Typography color="text.secondary">Waiting for GPS signal...</Typography>
             )}
          </CardContent>
        </Card>

        {/* STATUS TOGGLE */}
        <Button 
          fullWidth variant="contained" size="large" 
          color={driver?.status === 'available' ? 'error' : 'success'}
          onClick={toggleStatus}
          sx={{ py: 2, fontSize: '1.2rem' }}
        >
          {driver?.status === 'available' ? 'Stop Shift' : 'Go Online'}
        </Button>

      </Container>

      {/* CHAT WIDGET */}
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