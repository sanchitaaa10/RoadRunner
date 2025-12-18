import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Avatar, Chip, Button, IconButton, 
  CircularProgress, LinearProgress, Card, CardContent, Fade, Grow 
} from '@mui/material';
import { 
  LocalShipping, Phone, Email, DirectionsCar, TwoWheeler, 
  CheckCircle, DoNotDisturbOn, FiberManualRecord, Chat 
} from '@mui/icons-material';
import axios from 'axios';
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
  border: 'rgba(255,255,255,0.08)'
};

// --- ANIMATIONS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatDriver, setChatDriver] = useState(null); 

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

  const total = drivers.length;
  const online = drivers.filter(d => d.status === 'available').length;
  const busy = drivers.filter(d => d.status === 'busy').length;
  const offline = drivers.filter(d => d.status === 'offline' || !d.status).length;

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: COLORS.bg }}><CircularProgress sx={{ color: COLORS.orange }} /></Box>;

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 }, minHeight: '100vh', bgcolor: COLORS.bg, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* Import Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* HEADER */}
      <Fade in={!loading}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" color="white">Fleet Drivers</Typography>
          <Typography variant="body1" color={COLORS.textMuted}>Manage your workforce and vehicle status.</Typography>
        </Box>
      </Fade>

      {/* --- STATS ROW --- */}
      <motion.div variants={containerVar} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            { label: 'Total Fleet', val: total, color: COLORS.blue, icon: <LocalShipping /> },
            { label: 'Online Ready', val: online, color: COLORS.green, icon: <CheckCircle /> },
            { label: 'On Delivery', val: busy, color: COLORS.orange, icon: <DirectionsCar /> },
            { label: 'Offline', val: offline, color: COLORS.textMuted, icon: <DoNotDisturbOn /> },
          ].map((stat, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper 
                component={motion.div} whileHover={{ y: -5 }}
                sx={{ 
                  p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  bgcolor: COLORS.cardBg, border: `1px solid ${COLORS.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }} 
              >
                <Box>
                  <Typography variant="h4" fontWeight="800" sx={{ color: 'white' }}>{stat.val}</Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textMuted, fontWeight: 'bold', textTransform: 'uppercase' }}>{stat.label}</Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: '50%', color: stat.color, bgcolor: `${stat.color}15` }}>
                  {React.cloneElement(stat.icon, { fontSize: 'medium' })}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* --- DRIVER CARDS GRID --- */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>Driver Roster</Typography>
      
      <Grid container spacing={3}>
        {drivers.map((driver, i) => (
          <Grow in timeout={300 * ((i % 5) + 1)} key={driver._id}>
            <Grid item xs={12} sm={6} md={4}>
              <Card sx={{ 
                borderRadius: 4, bgcolor: COLORS.cardBg, border: `1px solid ${COLORS.border}`,
                position: 'relative', overflow: 'visible', transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', borderColor: COLORS.orange, boxShadow: `0 10px 30px -10px ${COLORS.orange}20` }
              }}>
                
                {/* STATUS BADGE */}
                <Chip 
                  label={driver.status === 'available' ? 'ONLINE' : driver.status === 'busy' ? 'BUSY' : 'OFFLINE'} 
                  size="small"
                  icon={<FiberManualRecord sx={{ fontSize: '8px !important' }} />}
                  sx={{ 
                    position: 'absolute', top: 16, right: 16, fontWeight: 'bold', fontSize: '0.65rem', height: 22,
                    bgcolor: driver.status === 'available' ? `${COLORS.green}20` : driver.status === 'busy' ? `${COLORS.orange}20` : 'rgba(255,255,255,0.1)',
                    color: driver.status === 'available' ? COLORS.green : driver.status === 'busy' ? COLORS.orange : COLORS.textMuted,
                    border: `1px solid ${driver.status === 'available' ? COLORS.green : driver.status === 'busy' ? COLORS.orange : COLORS.textMuted}`
                  }} 
                />

                <CardContent sx={{ p: 3 }}>
                  
                  {/* PROFILE HEADER */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ 
                      width: 56, height: 56, bgcolor: COLORS.bg, color: 'white', 
                      fontSize: 20, fontWeight: 'bold', border: `1px solid ${COLORS.textMuted}`
                    }}>
                      {driver.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" color="white" lineHeight={1.2}>{driver.name}</Typography>
                      <Typography variant="caption" color={COLORS.textMuted}>ID: #{driver._id.slice(-6).toUpperCase()}</Typography>
                    </Box>
                  </Box>

                  {/* VEHICLE DETAILS */}
                  <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 3, mb: 3, border: `1px solid ${COLORS.border}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      {driver.vehicleType === 'Bike' ? <TwoWheeler fontSize="small" sx={{ color: COLORS.orange }} /> : <LocalShipping fontSize="small" sx={{ color: COLORS.orange }} />}
                      <Typography variant="body2" fontWeight="bold" color="white">
                        {driver.vehicleType}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color={COLORS.textMuted} sx={{ display: 'block' }}>
                      Plate: <span style={{ color: 'white' }}>{driver.licensePlate}</span>
                    </Typography>
                  </Box>

                  {/* CONTACT ACTIONS */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      variant="outlined" size="small" startIcon={<Phone />}
                      href={`tel:${driver.phone || ''}`}
                      sx={{ flex: 1, borderRadius: 2, borderColor: COLORS.border, color: COLORS.textMuted, '&:hover': { borderColor: 'white', color: 'white' } }}
                    >
                      Call
                    </Button>
                    
                    {/* CHAT BUTTON */}
                    <Button 
                      variant="contained" size="small" startIcon={<Chat />}
                      onClick={() => setChatDriver(driver)}
                      sx={{ flex: 1, borderRadius: 2, bgcolor: COLORS.orange, fontWeight: 'bold', '&:hover': { bgcolor: '#ea580c' } }}
                    >
                      Chat
                    </Button>
                  </Box>

                </CardContent>
              </Card>
            </Grid>
          </Grow>
        ))}
        
        {/* EMPTY STATE */}
        {drivers.length === 0 && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 8, opacity: 0.5 }}>
            <Typography variant="h6" color="white">No drivers found.</Typography>
          </Box>
        )}
      </Grid>

      {/* --- ADMIN CHAT WIDGET POPUP --- */}
      {chatDriver && (
        <ChatWidget 
          userId={chatDriver._id} 
          userName="Dispatcher"   
          targetName={chatDriver.name}
          role="admin"
          onClose={() => setChatDriver(null)}
        />
      )}

    </Box>
  );
};

export default DriversPage;