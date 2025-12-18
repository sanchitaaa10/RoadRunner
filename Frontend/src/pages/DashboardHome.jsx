import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Chip, Avatar, CircularProgress, Fade, Grow, Button, Divider, LinearProgress 
} from '@mui/material';
import { 
  LocalShipping, AccessTime, CheckCircle, Person, TrendingUp, Add, 
  NotificationsActive, Build, LocalGasStation, Warning 
} from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../config';
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
  purple: '#8b5cf6',
  red: '#ef4444'
};

// --- ANIMATION VARIANTS ---
const containerVar = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// 1. STAT CARD COMPONENT
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Paper 
    elevation={0}
    component={motion.div}
    variants={itemVar}
    whileHover={{ y: -5, boxShadow: `0 10px 30px -10px ${color}40` }}
    sx={{ 
      p: 3, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      bgcolor: COLORS.cardBg, color: 'white',
      border: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)', height: '100%'
    }}
  >
    <Box>
      <Typography variant="body2" color={COLORS.textMuted} fontWeight="bold" sx={{ mb: 1, letterSpacing: 0.5, textTransform: 'uppercase', fontSize: '0.7rem' }}>{title}</Typography>
      <Typography variant="h4" fontWeight="800" sx={{ color: 'white', mb: 0.5 }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <TrendingUp fontSize="inherit" /> {subtitle}
      </Typography>
    </Box>
    <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
      {React.cloneElement(icon, { fontSize: 'large' })}
    </Box>
  </Paper>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({ totalDrivers: 0, activeDrivers: 0, pendingJobs: 0, completedJobs: 0 });
  const [driverList, setDriverList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock Activity Data
  const recentActivity = [
    { text: "Order #2291 delivered by Mike", time: "2 min ago", icon: <CheckCircle fontSize="small" />, color: COLORS.green },
    { text: "New Job #2292 assigned to Sarah", time: "15 min ago", icon: <Add fontSize="small" />, color: COLORS.blue },
    { text: "Truck #04 reported low fuel", time: "1 hr ago", icon: <LocalGasStation fontSize="small" />, color: COLORS.orange },
    { text: "System maintenance scheduled", time: "3 hrs ago", icon: <Build fontSize="small" />, color: COLORS.textMuted },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversRes, jobsRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/drivers`),
          axios.get(`${API_URL}/api/jobs`)
        ]);

        const drivers = driversRes.data;
        const jobs = jobsRes.data;

        setStats({
          totalDrivers: drivers.length,
          activeDrivers: drivers.filter(d => d.status === 'available' || d.status === 'busy').length,
          pendingJobs: jobs.filter(j => j.status === 'pending').length,
          completedJobs: jobs.filter(j => j.status === 'delivered').length
        });
        
        setDriverList(drivers); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}><CircularProgress sx={{ color: '#f97316' }} /></Box>;

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}> 
      
      {/* HEADER */}
      <Fade in={!loading} timeout={500}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: 'white', mb: 1 }}>
              Welcome back, <span style={{ color: COLORS.orange }}>Admin</span>
            </Typography>
            <Typography variant="body1" color={COLORS.textMuted}>
              Here's what's happening with your fleet today.
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
            <Typography variant="caption" color={COLORS.textMuted} sx={{ display: 'block', mb: 0.5 }}>DATE</Typography>
            <Chip label={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'white', fontWeight: 'bold' }} />
          </Box>
        </Box>
      </Fade>

      {/* STATS GRID */}
      <motion.div variants={containerVar} initial="hidden" animate="visible">
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Fleet" value={stats.totalDrivers} subtitle={`${stats.activeDrivers} Online`} icon={<LocalShipping />} color={COLORS.blue} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Pending Jobs" value={stats.pendingJobs} subtitle="Requires Action" icon={<AccessTime />} color={COLORS.orange} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Active Drivers" value={stats.activeDrivers} subtitle="On The Road" icon={<Person />} color={COLORS.green} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Completed" value={stats.completedJobs} subtitle="Deliveries" icon={<CheckCircle />} color={COLORS.purple} />
          </Grid>
        </Grid>
      </motion.div>

      <Grid container spacing={3}> 
        
        {/* LEFT COLUMN: Vehicle Status & Fleet Health */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            
            {/* Live Vehicle Status */}
            <Grid item xs={12}>
              <Fade in={!loading} timeout={1000}>
                <Paper 
                  sx={{ 
                    p: 3, borderRadius: 4, minHeight: 400,
                    bgcolor: COLORS.cardBg, border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" color="white">Live Vehicle Status</Typography>
                    <Chip label="Real-Time Updates" sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: COLORS.green, fontWeight: 'bold', border: `1px solid ${COLORS.green}` }} size="small" />
                  </Box>
                  
                  {driverList.length === 0 ? (
                    <Typography color={COLORS.textMuted} align="center" py={5}>No drivers registered yet.</Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {driverList.map((driver) => (
                        <Box key={driver._id} sx={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                          p: 2, borderRadius: 3,
                          bgcolor: 'rgba(255,255,255,0.03)', 
                          border: '1px solid rgba(255,255,255,0.05)',
                          transition: '0.2s', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ position: 'relative' }}>
                                <Avatar sx={{ bgcolor: COLORS.cardBg, color: 'white', border: `1px solid ${COLORS.textMuted}` }}>{driver.name[0]}</Avatar>
                                <Box sx={{ 
                                  position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', border: `2px solid ${COLORS.cardBg}`,
                                  bgcolor: driver.status === 'available' ? COLORS.green : driver.status === 'busy' ? COLORS.orange : COLORS.textMuted
                                }} />
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold" color="white">{driver.name}</Typography>
                                <Typography variant="caption" color={COLORS.textMuted}>
                                  {driver.vehicleType} • {driver.licensePlate}
                                </Typography>
                              </Box>
                          </Box>
                          
                          <Chip 
                              label={driver.status} 
                              size="small" 
                              sx={{ 
                                bgcolor: driver.status === 'available' ? 'rgba(16, 185, 129, 0.15)' : driver.status === 'busy' ? 'rgba(249, 115, 22, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                                color: driver.status === 'available' ? COLORS.green : driver.status === 'busy' ? COLORS.orange : COLORS.textMuted,
                                fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: 0.5,
                                border: `1px solid ${driver.status === 'available' ? COLORS.green : driver.status === 'busy' ? COLORS.orange : COLORS.textMuted}`
                              }} 
                            />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Fade>
            </Grid>
            <Grow in={!loading} timeout={2000}>
              <Paper sx={{ p: 3, borderRadius: 4, bgcolor: COLORS.cardBg, border: '1px solid rgba(255,255,255,0.05)', flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <NotificationsActive sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="white">Recent Activity</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {recentActivity.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                       <Box sx={{ mt: 0.5, color: item.color }}>{item.icon}</Box>
                       <Box>
                         <Typography variant="body2" color="white" fontWeight="500">{item.text}</Typography>
                         <Typography variant="caption" color={COLORS.textMuted}>{item.time}</Typography>
                       </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grow>

            {/* Fleet Health Section (New) */}
            
            <Grid item xs={12}>
               <Paper sx={{ p: 3, borderRadius: 4, bgcolor: COLORS.cardBg, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <Typography variant="h6" fontWeight="bold" color="white" mb={3}>Fleet Health</Typography>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                         <Typography variant="body2" color={COLORS.textMuted}>Maintenance Status</Typography>
                         <Typography variant="body2" color={COLORS.green} fontWeight="bold">98% Operational</Typography>
                       </Box>
                       <LinearProgress variant="determinate" value={98} sx={{ height: 8, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.green } }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                         <Typography variant="body2" color={COLORS.textMuted}>Fuel Efficiency</Typography>
                         <Typography variant="body2" color={COLORS.blue} fontWeight="bold">Great</Typography>
                       </Box>
                       <LinearProgress variant="determinate" value={85} sx={{ height: 8, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: COLORS.blue } }} />
                    </Grid>
                  </Grid>
               </Paper>
            </Grid>

          </Grid>
        </Grid>

        {/* RIGHT COLUMN: Dispatch & Activity */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
            
            {/* Dispatch Center */}
            <Fade in={!loading} timeout={1500}>
              <Paper 
                sx={{ 
                  p: 4, borderRadius: 4, bgcolor: COLORS.cardBg, color: 'white', 
                  display: 'flex', flexDirection: 'column', 
                  justifyContent: 'center', alignItems: 'center', textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden',
                  boxShadow: `0 0 40px -10px ${COLORS.orange}20`
                }}
              >
                {/* Background Glow */}
                <Box sx={{ position: 'absolute', top: '-50%', right: '-50%', width: '100%', height: '100%', bgcolor: COLORS.orange, opacity: 0.1, filter: 'blur(80px)', borderRadius: '50%' }} />
                
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(249, 115, 22, 0.15)', borderRadius: '50%', color: COLORS.orange, border: `1px solid ${COLORS.orange}` }}>
                    <LocalShipping sx={{ fontSize: 35 }} />
                  </Box>
                  
                  <Typography variant="h6" fontWeight="800" gutterBottom>Dispatch Center</Typography>
                  <Typography variant="body2" sx={{ color: COLORS.textMuted, mb: 3 }}>
                    You have <span style={{ color: COLORS.green, fontWeight: 'bold' }}>{stats.activeDrivers} active drivers</span> ready.
                  </Typography>

                  <Button 
                    variant="contained" fullWidth startIcon={<Add />}
                    sx={{ 
                      bgcolor: COLORS.orange, fontWeight: 'bold', textTransform: 'none', borderRadius: 2, py: 1.5,
                      '&:hover': { bgcolor: '#ea580c', transform: 'translateY(-2px)' }
                    }}
                  >
                    Assign New Job
                  </Button>
                </Box>
              </Paper>
            </Fade>

            
            

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;