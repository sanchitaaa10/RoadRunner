import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Avatar, Chip, Button, IconButton, 
  CircularProgress, LinearProgress, Card, CardContent 
} from '@mui/material';
import { 
  LocalShipping, Phone, Email, DirectionsCar, TwoWheeler, 
  CheckCircle, DoNotDisturbOn, FiberManualRecord 
} from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../config';

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH REAL DRIVERS ---
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/drivers`);
        setDrivers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  // --- 2. CALCULATE STATS ---
  const total = drivers.length;
  const online = drivers.filter(d => d.status === 'available').length;
  const busy = drivers.filter(d => d.status === 'busy').length;
  const offline = drivers.filter(d => d.status === 'offline' || !d.status).length;

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Fleet Drivers</Typography>
        <Typography variant="body2" color="text.secondary">Manage your workforce and vehicle status.</Typography>
      </Box>

      {/* --- STATS ROW --- */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { label: 'Total Fleet', val: total, color: '#6366f1', icon: <LocalShipping /> },
          { label: 'Online Ready', val: online, color: '#10b981', icon: <CheckCircle /> },
          { label: 'On Delivery', val: busy, color: '#f59e0b', icon: <DirectionsCar /> },
          { label: 'Offline', val: offline, color: '#94a3b8', icon: <DoNotDisturbOn /> },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper sx={{ 
              p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)' 
            }} elevation={0}>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>{stat.val}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">{stat.label}</Typography>
              </Box>
              <Box sx={{ 
                p: 1.5, borderRadius: '50%', color: stat.color, bgcolor: `${stat.color}15` 
              }}>
                {stat.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* --- DRIVER CARDS GRID --- */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#334155' }}>Driver Roster</Typography>
      
      <Grid container spacing={3}>
        {drivers.map((driver) => (
          <Grid item xs={12} sm={6} md={4} key={driver._id}>
            <Card sx={{ 
              borderRadius: 4, border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              position: 'relative', overflow: 'visible', transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }
            }}>
              
              {/* STATUS BADGE */}
              <Chip 
                label={driver.status === 'available' ? 'ONLINE' : driver.status === 'busy' ? 'BUSY' : 'OFFLINE'} 
                size="small"
                icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
                sx={{ 
                  position: 'absolute', top: 16, right: 16, fontWeight: 'bold', fontSize: '0.7rem',
                  bgcolor: driver.status === 'available' ? '#dcfce7' : driver.status === 'busy' ? '#ffedd5' : '#f1f5f9',
                  color: driver.status === 'available' ? '#166534' : driver.status === 'busy' ? '#9a3412' : '#64748b',
                  borderColor: driver.status === 'available' ? '#bbf7d0' : 'transparent', border: '1px solid'
                }} 
              />

              <CardContent sx={{ p: 3 }}>
                
                {/* PROFILE HEADER */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar sx={{ 
                    width: 60, height: 60, bgcolor: '#eff6ff', color: '#3b82f6', 
                    fontSize: 24, fontWeight: 'bold', border: '2px solid white', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' 
                  }}>
                    {driver.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>{driver.name}</Typography>
                    <Typography variant="caption" color="text.secondary">ID: #{driver._id.slice(-6).toUpperCase()}</Typography>
                  </Box>
                </Box>

                {/* VEHICLE DETAILS */}
                <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {driver.vehicleType === 'Bike' ? <TwoWheeler fontSize="small" color="action" /> : <LocalShipping fontSize="small" color="action" />}
                    <Typography variant="body2" fontWeight="bold" color="#334155">
                      {driver.vehicleType}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Plate: <span style={{ fontWeight: 'bold', color: '#475569' }}>{driver.licensePlate}</span>
                  </Typography>
                </Box>

                {/* CONTACT ACTIONS */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" fullWidth size="small" startIcon={<Phone />}
                    href={`tel:${driver.phone || ''}`}
                    sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}
                  >
                    Call
                  </Button>
                  <Button 
                    variant="outlined" fullWidth size="small" startIcon={<Email />}
                    href={`mailto:${driver.email}`}
                    sx={{ borderRadius: 2, borderColor: '#e2e8f0', color: '#64748b' }}
                  >
                    Email
                  </Button>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {/* EMPTY STATE */}
        {drivers.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8, opacity: 0.5 }}>
            <Typography variant="h6">No drivers found.</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default DriversPage;