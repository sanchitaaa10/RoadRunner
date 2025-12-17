import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, Typography, Button, Card, CardContent, Chip, CircularProgress, 
  Container, Avatar, Grid, Paper, IconButton, Badge, LinearProgress 
} from '@mui/material';
import { 
  Place, PowerSettingsNew, AccessTime, AttachMoney, 
  LocalGasStation, Speed, Star, Notifications, Timeline, Build 
} from '@mui/icons-material';
import axios from 'axios';
import io from 'socket.io-client';
import API_URL from '../config';

const socket = io(API_URL);

const DriverDashboard = () => {
  const [driver, setDriver] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shiftTime, setShiftTime] = useState(0); 
  
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);

  const fetchDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return (window.location.href = '/login');

      const driversRes = await axios.get(`${API_URL}/api/auth/drivers`);
      const myProfile = driversRes.data.find(d => d._id === user._id);
      setDriver(myProfile);

      const jobsRes = await axios.get(`${API_URL}/api/jobs`);
      const myJob = jobsRes.data.find(j => 
        j.assignedDriver?._id === user._id && j.status === 'assigned'
      );
      setCurrentJob(myJob);
      setLoading(false);

      if (myProfile.status === 'available') {
        startTimer();
        startTracking(myProfile._id);
      }
    } catch (error) { setLoading(false); }
  };

  useEffect(() => { fetchDashboard(); return () => { stopTracking(); stopTimer(); }; }, []);

  const startTimer = () => { if (!timerRef.current) timerRef.current = setInterval(() => setShiftTime(p => p + 1), 1000); };
  const stopTimer = () => { clearInterval(timerRef.current); timerRef.current = null; };
  const formatTime = (s) => `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;

  const startTracking = (driverId) => {
    if (!navigator.geolocation) return;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => socket.emit('driverLocationUpdate', { driverId, lat: pos.coords.latitude, lng: pos.coords.longitude }),
      null, { enableHighAccuracy: true }
    );
  };
  const stopTracking = () => { if(watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };

  const toggleStatus = async () => {
    try {
      const newStatus = driver.status === 'available' ? 'offline' : 'available';
      await axios.put(`${API_URL}/api/auth/status/${driver._id}`, { status: newStatus });
      setDriver({ ...driver, status: newStatus });
      if (newStatus === 'available') { startTimer(); startTracking(driver._id); } 
      else { stopTimer(); stopTracking(); }
    } catch (err) { alert("Network Error"); }
  };

  const completeJob = async () => {
    try {
      await axios.put(`${API_URL}/api/jobs/${currentJob._id}`, { status: 'delivered' });
      await axios.put(`${API_URL}/api/auth/status/${driver._id}`, { status: 'available' });
      window.location.reload(); 
    } catch (err) { alert("Error"); }
  };

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', 
      pb: 4 
    }}>
      
      {/* --- TOP NAV BAR (Sticky) --- */}
      <Paper elevation={3} sx={{ 
        position: 'sticky', top: 0, zIndex: 100,
        bgcolor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        color: '#1e293b', borderRadius: 0, px: 2, py: 1.5,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 45, height: 45, bgcolor: '#6366f1', fontSize: 18 }}>
            {driver?.name[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" lineHeight={1.2}>{driver?.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Star sx={{ fontSize: 16, color: '#f59e0b' }} />
              <Typography variant="caption" fontWeight="bold" color="text.secondary">4.9 • Platinum</Typography>
            </Box>
          </Box>
        </Box>
        <IconButton sx={{ bgcolor: '#f1f5f9' }} size="small">
          <Badge badgeContent={2} color="error"><Notifications fontSize="small" /></Badge>
        </IconButton>
      </Paper>

      {/* --- MAIN CONTENT --- */}
      <Container maxWidth="md" sx={{ mt: 3, px: 2 }}>
        
        {/* 1. STATUS CARD */}
        <Card sx={{ 
          borderRadius: 4, mb: 3, 
          bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
        }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <Box>
               <Typography variant="caption" color="text.secondary" fontWeight="bold" letterSpacing={1}>CURRENT STATUS</Typography>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                 <Box sx={{ 
                   width: 12, height: 12, borderRadius: '50%', 
                   bgcolor: driver?.status === 'available' ? '#10b981' : '#ef4444',
                   boxShadow: driver?.status === 'available' ? '0 0 0 3px #d1fae5' : 'none'
                 }} />
                 <Typography variant="h6" fontWeight="800" sx={{ 
                   color: driver?.status === 'available' ? '#10b981' : '#ef4444' 
                 }}>
                   {driver?.status === 'available' ? 'ONLINE' : 'OFFLINE'}
                 </Typography>
               </Box>
            </Box>
            <Button 
              variant="contained" 
              onClick={toggleStatus}
              sx={{ 
                borderRadius: 3, px: 3, fontWeight: 'bold', 
                bgcolor: driver?.status === 'available' ? '#ef4444' : '#10b981',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                '&:hover': { bgcolor: driver?.status === 'available' ? '#dc2626' : '#059669' }
              }}
            >
              {driver?.status === 'available' ? 'Stop Shift' : 'Go Online'}
            </Button>
          </CardContent>
        </Card>

        {/* 2. STATS GRID */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            { label: 'Earnings', val: '₹2,450', icon: <AttachMoney fontSize="small" />, color: '#10b981', bg: '#d1fae5' },
            { label: 'Shift Time', val: formatTime(shiftTime), icon: <AccessTime fontSize="small" />, color: '#3b82f6', bg: '#dbeafe' },
            { label: 'Trips', val: '5', icon: <Timeline fontSize="small" />, color: '#8b5cf6', bg: '#ede9fe' },
            { label: 'Fuel', val: '80%', icon: <LocalGasStation fontSize="small" />, color: '#f59e0b', bg: '#fef3c7' },
          ].map((item, i) => (
            <Grid item xs={6} sm={3} key={i}>
              <Paper sx={{ 
                p: 2, borderRadius: 3, height: '100%', 
                bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(5px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }} elevation={0}>
                <Box sx={{ 
                  width: 36, height: 36, borderRadius: '50%', bgcolor: item.bg, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1, color: item.color 
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" fontWeight="800" color="#1e293b">{item.val}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">{item.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 3. ACTIVE JOB / SCANNER */}
        {currentJob ? (
          <Card sx={{ 
            borderRadius: 4, mb: 3, overflow: 'visible',
            background: 'linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ bgcolor: '#6366f1', color: 'white', px: 2, py: 0.5, display: 'inline-block', borderRadius: '4px 0 4px 0', fontSize: '0.75rem', fontWeight: 'bold' }}>
              PRIORITY ORDER
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="#1e293b">#{currentJob.orderId}</Typography>
                  <Typography variant="caption" color="text.secondary">Order ID</Typography>
                </Box>
                <Chip label="In Progress" sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 'bold' }} />
              </Box>
              
              <Box sx={{ position: 'relative', pl: 3, mb: 4, borderLeft: '2px dashed #cbd5e1' }}>
                <Box sx={{ position: 'absolute', left: -9, top: 0, bgcolor: 'white', borderRadius: '50%', p: 0.5, border: '1px solid #e2e8f0' }}>
                  <Place sx={{ color: '#3b82f6', fontSize: 16 }} />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">PICKUP LOCATION</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{currentJob.pickupAddress}</Typography>
                </Box>
                <Box sx={{ position: 'absolute', left: -9, bottom: 0, bgcolor: 'white', borderRadius: '50%', p: 0.5, border: '1px solid #e2e8f0' }}>
                  <Place sx={{ color: '#ef4444', fontSize: 16 }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold">DROPOFF LOCATION</Typography>
                  <Typography variant="subtitle1" fontWeight="bold">{currentJob.dropoffAddress}</Typography>
                </Box>
              </Box>

              <Button 
                fullWidth variant="contained" size="large" 
                onClick={completeJob}
                sx={{ 
                  borderRadius: 3, py: 1.5, fontSize: '1rem', fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                }}
              >
                Complete Delivery
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card sx={{ 
            borderRadius: 4, mb: 3, textAlign: 'center', position: 'relative', overflow: 'hidden',
            bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.5)'
          }}>
            {/* Radar Animation */}
            <Box sx={{ 
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 250, height: 250, borderRadius: '50%', bgcolor: '#6366f1', opacity: 0.05,
              animation: 'pulse 2s infinite'
            }} />
            <style>{`@keyframes pulse { 0% { width: 100px; height: 100px; opacity: 0.3; } 100% { width: 300px; height: 300px; opacity: 0; } }`}</style>
            
            <CardContent sx={{ py: 6 }}>
              <Box sx={{ width: 60, height: 60, bgcolor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <Speed sx={{ fontSize: 30, color: '#3b82f6' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" color="#1e293b">Scanning for Jobs...</Typography>
              <Typography variant="body2" color="text.secondary">Stay online. New jobs appear automatically.</Typography>
            </CardContent>
          </Card>
        )}

        {/* 4. METRICS ROW */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                 <Typography variant="subtitle1" fontWeight="bold">Driver Score</Typography>
                 <Build fontSize="small" color="disabled" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight="bold">Acceptance Rate</Typography>
                  <Typography variant="caption" fontWeight="bold" color="success.main">94%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={94} color="success" sx={{ borderRadius: 2, height: 6, bgcolor: '#dcfce7' }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" fontWeight="bold">On-Time Delivery</Typography>
                  <Typography variant="caption" fontWeight="bold" color="primary.main">98%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={98} color="primary" sx={{ borderRadius: 2, height: 6, bgcolor: '#dbeafe' }} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
             <Paper sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', height: '100%' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>Vehicle Health</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pb: 1, borderBottom: '1px solid #f1f5f9' }}>
                   <Typography variant="body2" color="text.secondary">Oil Life</Typography>
                   <Chip label="Good" size="small" color="success" variant="filled" sx={{ height: 20, fontSize: '0.7rem' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Typography variant="body2" color="text.secondary">Maintenance</Typography>
                   <Typography variant="body2" fontWeight="bold" color="#f59e0b">Due in 5 days</Typography>
                </Box>
             </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default DriverDashboard;