import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Grid, Paper, Chip, Avatar, LinearProgress, CircularProgress 
} from '@mui/material';
import { 
  LocalShipping, AccessTime, CheckCircle, Person, DirectionsCar 
} from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../config';

// 1. STAT CARD COMPONENT (UI Only)
const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Paper sx={{ 
    p: 3, borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%',
    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
  }}>
    <Box>
      <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 1 }}>{title}</Typography>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: color, fontWeight: 'bold' }}>{subtitle}</Typography>
    </Box>
    <Box sx={{ width: 50, height: 50, borderRadius: 3, bgcolor: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
      {icon}
    </Box>
  </Paper>
);

const DashboardHome = () => {
  // 2. STATE FOR REAL DATA
  const [stats, setStats] = useState({
    totalDrivers: 0,
    activeDrivers: 0,
    pendingJobs: 0,
    completedJobs: 0
  });
  const [driverList, setDriverList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. FETCH REAL DATA FROM API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Drivers & Jobs in parallel
        const [driversRes, jobsRes] = await Promise.all([
          axios.get(`${API_URL}/api/auth/drivers`),
          axios.get(`${API_URL}/api/jobs`)
        ]);

        const drivers = driversRes.data;
        const jobs = jobsRes.data;

        // --- CALCULATE STATS ---
        const active = drivers.filter(d => d.status === 'available' || d.status === 'busy').length;
        const pending = jobs.filter(j => j.status === 'pending').length;
        const completed = jobs.filter(j => j.status === 'delivered').length;
        
        // Update State
        setStats({
          totalDrivers: drivers.length,
          activeDrivers: active,
          pendingJobs: pending,
          completedJobs: completed
        });
        
        setDriverList(drivers); // Save list for the table
        setLoading(false);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%' }}> 
      
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e293b' }}>Dashboard Overview</Typography>
        <Typography variant="body2" color="text.secondary">Real-time fleet metrics</Typography>
      </Box>

      {/* STATS GRID (REAL DATA) */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Fleet" 
            value={stats.totalDrivers} 
            subtitle={`${stats.activeDrivers} Online Now`} 
            icon={<LocalShipping />} 
            color="#3b82f6" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Pending Jobs" 
            value={stats.pendingJobs} 
            subtitle="Requires Dispatch" 
            icon={<AccessTime />} 
            color="#f59e0b" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Active Drivers" 
            value={stats.activeDrivers} 
            subtitle="Ready for jobs" 
            icon={<Person />} 
            color="#10b981" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Total Deliveries" 
            value={stats.completedJobs} 
            subtitle="All time completed" 
            icon={<CheckCircle />} 
            color="#8b5cf6" 
          />
        </Grid>
      </Grid>

      {/* LOWER SECTION */}
      <Grid container spacing={3} sx={{ width: '100%' }}>
        
        {/* LEFT: REAL Vehicle Status List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">Live Vehicle Status</Typography>
              <Chip label="Real-Time" color="success" size="small" variant="outlined" />
            </Box>
            
            {driverList.length === 0 ? (
              <Typography color="text.secondary" align="center">No drivers registered yet.</Typography>
            ) : (
              driverList.map((driver) => (
                <Box key={driver._id} sx={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 3,
                  borderLeft: `4px solid ${driver.status === 'available' ? '#10b981' : driver.status === 'busy' ? '#f59e0b' : '#cbd5e1'}`
                }}>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'white', color: '#64748b', border: '1px solid #e2e8f0' }}>
                        {driver.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">{driver.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {driver.vehicleType} • {driver.licensePlate}
                        </Typography>
                      </Box>
                   </Box>
                   
                   <Chip 
                      label={driver.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: driver.status === 'available' ? '#dcfce7' : driver.status === 'busy' ? '#ffedd5' : '#f1f5f9',
                        color: driver.status === 'available' ? '#166534' : driver.status === 'busy' ? '#9a3412' : '#64748b',
                        fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.7rem'
                      }} 
                    />
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* RIGHT: Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, borderRadius: 4, bgcolor: '#1e293b', color: 'white', 
            height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', textAlign: 'center' 
          }}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
              <LocalShipping sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" fontWeight="bold">Dispatch Center</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 3 }}>
              {stats.activeDrivers} drivers available for new assignments.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;