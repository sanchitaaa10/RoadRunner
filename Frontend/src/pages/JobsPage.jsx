import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Grid, Paper, Chip, IconButton, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, 
  Card, CardContent, CircularProgress, Fade, Grow 
} from '@mui/material';
import { 
  Add, Place, CheckCircle, Map, Close 
} from '@mui/icons-material';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API_URL from '../config';

// --- THEME ---
const COLORS = {
  bg: '#0f172a',
  columnBg: '#1e293b',
  cardBg: 'rgba(255,255,255,0.03)',
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  orange: '#f97316',
  green: '#10b981',
  blue: '#3b82f6',
  border: 'rgba(255,255,255,0.08)'
};

// --- CUSTOM INPUT STYLE ---
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    borderRadius: '10px',
    bgcolor: 'rgba(0,0,0,0.2)',
    '& fieldset': { borderColor: COLORS.border },
    '&:hover fieldset': { borderColor: COLORS.orange },
    '&.Mui-focused fieldset': { borderColor: COLORS.orange },
  },
  '& .MuiInputLabel-root': { color: COLORS.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: COLORS.orange },
  '& .MuiSvgIcon-root': { color: COLORS.textMuted },
  '& .MuiSelect-icon': { color: COLORS.textMuted },
};

// --- LEAFLET ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- SMART MAP COMPONENT ---
const RoutingMap = ({ pickup, dropoff }) => {
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCoords = async (address) => {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
        if (res.data && res.data[0]) {
          return [parseFloat(res.data[0].lat), parseFloat(res.data[0].lon)];
        }
      } catch (e) { console.error("Geocoding error", e); }
      return null;
    };

    const fetchRoute = async () => {
      setLoading(true);
      const start = await getCoords(pickup);
      const end = await getCoords(dropoff);

      if (start && end) {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        try {
          const res = await axios.get(url);
          const coords = res.data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]); 
          setRouteCoords(coords);
        } catch (err) {
          console.error("Routing API Failed", err);
          setRouteCoords([start, end]); 
        }
      }
      setLoading(false);
    };

    fetchRoute();
  }, [pickup, dropoff]);

  const Recenter = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
      if (coords.length > 0) map.fitBounds(coords, { padding: [20, 20] });
    }, [coords, map]);
    return null;
  };

  return (
    <Box sx={{ height: 400, width: '100%', borderRadius: 2, overflow: 'hidden', bgcolor: '#000', border: `1px solid ${COLORS.border}` }}>
       {loading && <Box p={2} textAlign="center" color="white"><CircularProgress size={20} sx={{ color: COLORS.orange }} /> Calculating Route...</Box>}
       <MapContainer center={[20, 78]} zoom={4} style={{ height: '100%', width: '100%' }}>
         <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
         {routeCoords.length > 0 && (
           <>
             <Polyline positions={routeCoords} color={COLORS.orange} weight={4} opacity={0.9} />
             <Marker position={routeCoords[0]}><Popup>Pickup: {pickup}</Popup></Marker>
             <Marker position={routeCoords[routeCoords.length - 1]}><Popup>Dropoff: {dropoff}</Popup></Marker>
             <Recenter coords={routeCoords} />
           </>
         )}
       </MapContainer>
    </Box>
  );
};

// --- MAIN PAGE ---
const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [openCreate, setOpenCreate] = useState(false);
  const [viewRouteJob, setViewRouteJob] = useState(null); 

  const [newJob, setNewJob] = useState({ 
    orderId: '', customer: '', pickupAddress: '', dropoffAddress: '', amount: '', status: 'pending' 
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, driversRes] = await Promise.all([
        axios.get(`${API_URL}/api/jobs`),
        axios.get(`${API_URL}/api/auth/drivers`)
      ]);
      setJobs(jobsRes.data);
      setDrivers(driversRes.data);
      setLoading(false);
    } catch (err) { console.error(err); setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      await axios.post(`${API_URL}/api/jobs`, newJob);
      setOpenCreate(false);
      fetchData(); 
      setNewJob({ orderId: '', customer: '', pickupAddress: '', dropoffAddress: '', amount: '', status: 'pending' });
    } catch (err) { alert("Error creating job"); }
  };

  const handleAssign = async (jobId, driverId) => {
    try {
      await axios.put(`${API_URL}/api/jobs/${jobId}`, { status: 'assigned', assignedDriver: driverId });
      await axios.put(`${API_URL}/api/auth/status/${driverId}`, { status: 'busy' });
      fetchData();
    } catch (err) { alert("Assignment Failed"); }
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const activeJobs = jobs.filter(j => j.status === 'assigned' || j.status === 'picked_up');
  const completedJobs = jobs.filter(j => j.status === 'delivered');

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', minHeight: '100vh', bgcolor: COLORS.bg }}>
      
      {/* HEADER */}
      <Fade in={!loading}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="800" color="white">Dispatch Board</Typography>
            <Typography color={COLORS.textMuted}>Drag, drop, and assign deliveries.</Typography>
          </Box>
          <Button 
            variant="contained" startIcon={<Add />} 
            sx={{ bgcolor: COLORS.orange, height: 45, borderRadius: 2, fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#ea580c' } }}
            onClick={() => setOpenCreate(true)}
          >
            New Job
          </Button>
        </Box>
      </Fade>

      {/* COLUMNS */}
      <Grid container spacing={3}>
        {/* 1. PENDING */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: COLORS.columnBg, minHeight: 600, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 1, alignItems: 'center' }}>
              <Typography fontWeight="bold" color={COLORS.textMuted} letterSpacing={1}>PENDING</Typography>
              <Chip label={pendingJobs.length} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold' }} />
            </Box>
            {pendingJobs.map((job, i) => (
              <Grow in timeout={300 * (i+1)} key={job._id}>
                <div><JobCard job={job} drivers={drivers} onAssign={handleAssign} onViewMap={() => setViewRouteJob(job)} /></div>
              </Grow>
            ))}
          </Paper>
        </Grid>

        {/* 2. ON ROUTE */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: COLORS.columnBg, minHeight: 600, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 1, alignItems: 'center' }}>
              <Typography fontWeight="bold" color={COLORS.blue} letterSpacing={1}>ON ROUTE</Typography>
              <Chip label={activeJobs.length} size="small" sx={{ bgcolor: `${COLORS.blue}20`, color: COLORS.blue, fontWeight: 'bold' }} />
            </Box>
            {activeJobs.map((job, i) => (
              <Grow in timeout={300 * (i+1)} key={job._id}>
                <div><JobCard key={job._id} job={job} drivers={drivers} isLive onViewMap={() => setViewRouteJob(job)} /></div>
              </Grow>
            ))}
          </Paper>
        </Grid>

        {/* 3. DELIVERED */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: COLORS.columnBg, minHeight: 600, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, px: 1, alignItems: 'center' }}>
              <Typography fontWeight="bold" color={COLORS.green} letterSpacing={1}>DELIVERED</Typography>
              <Chip label={completedJobs.length} size="small" sx={{ bgcolor: `${COLORS.green}20`, color: COLORS.green, fontWeight: 'bold' }} />
            </Box>
            {completedJobs.map((job, i) => (
              <Grow in timeout={300 * (i+1)} key={job._id}>
                <div><JobCard key={job._id} job={job} drivers={drivers} isDone onViewMap={() => setViewRouteJob(job)} /></div>
              </Grow>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* --- MODALS --- */}
      <Dialog 
        open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: COLORS.columnBg, color: 'white', borderRadius: 3, border: `1px solid ${COLORS.border}` } }}
      >
        <DialogTitle fontWeight="bold">Create New Shipment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <TextField label="Order ID (e.g. #ORD-001)" fullWidth value={newJob.orderId} onChange={e => setNewJob({...newJob, orderId: e.target.value})} sx={inputSx} />
            <TextField label="Customer Name" fullWidth value={newJob.customer} onChange={e => setNewJob({...newJob, customer: e.target.value})} sx={inputSx} />
            <TextField label="Pickup Address" fullWidth value={newJob.pickupAddress} onChange={e => setNewJob({...newJob, pickupAddress: e.target.value})} sx={inputSx} />
            <TextField label="Dropoff Address" fullWidth value={newJob.dropoffAddress} onChange={e => setNewJob({...newJob, dropoffAddress: e.target.value})} sx={inputSx} />
            <TextField label="Amount ($)" type="number" fullWidth value={newJob.amount} onChange={e => setNewJob({...newJob, amount: e.target.value})} sx={inputSx} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: COLORS.textMuted }}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" sx={{ bgcolor: COLORS.orange, fontWeight: 'bold', '&:hover': { bgcolor: '#ea580c' } }}>Create Job</Button>
        </DialogActions>
      </Dialog>

      <Dialog 
        open={!!viewRouteJob} onClose={() => setViewRouteJob(null)} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: COLORS.columnBg, color: 'white', borderRadius: 3, border: `1px solid ${COLORS.border}` } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${COLORS.border}` }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">Route: #{viewRouteJob?.orderId}</Typography>
            <Typography variant="caption" color={COLORS.textMuted}>
              {viewRouteJob?.pickupAddress} <span style={{color: COLORS.orange}}>➜</span> {viewRouteJob?.dropoffAddress}
            </Typography>
          </Box>
          <IconButton onClick={() => setViewRouteJob(null)} sx={{ color: COLORS.textMuted }}><Close /></IconButton>
        </Box>
        <DialogContent sx={{ p: 0 }}>
          {viewRouteJob && (
            <RoutingMap pickup={viewRouteJob.pickupAddress} dropoff={viewRouteJob.dropoffAddress} />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// --- JOB CARD (Safe Version) ---
const JobCard = ({ job, drivers, onAssign, isLive, isDone, onViewMap }) => {
  const [selectedDriver, setSelectedDriver] = useState('');

  return (
    <Card 
      sx={{ 
        mb: 2, borderRadius: 3, bgcolor: COLORS.cardBg, color: 'white',
        border: `1px solid ${COLORS.border}`, boxShadow: 'none', 
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography fontWeight="bold" sx={{ color: 'white' }}>#{job.orderId}</Typography>
          <Chip 
            label={isDone ? "Done" : isLive ? "Active" : "New"} 
            size="small" 
            sx={{ 
              height: 20, fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase',
              bgcolor: isDone ? `${COLORS.green}20` : isLive ? `${COLORS.blue}20` : 'rgba(255,255,255,0.1)',
              color: isDone ? COLORS.green : isLive ? COLORS.blue : COLORS.textMuted
            }} 
          />
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Place sx={{ color: COLORS.orange, fontSize: 16 }} />
          <Typography variant="body2" color={COLORS.textMuted} noWrap>
            To: <b style={{ color: 'white' }}>{job.dropoffAddress}</b>
          </Typography>
        </Box>

        <Button 
          startIcon={<Map />} size="small" fullWidth variant="outlined" 
          onClick={onViewMap}
          sx={{ mb: 2, borderRadius: 2, borderColor: COLORS.border, color: COLORS.textMuted, '&:hover': { borderColor: COLORS.textMuted, color: 'white' } }}
        >
          View Route
        </Button>

        {!isLive && !isDone && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField 
              select size="small" fullWidth label="Assign Driver" 
              value={selectedDriver} 
              onChange={(e) => setSelectedDriver(e.target.value)}
              sx={inputSx}
              SelectProps={{ MenuProps: { PaperProps: { sx: { bgcolor: COLORS.columnBg, color: 'white' } } } }}
            >
              {drivers.filter(d => d.status === 'available').map(d => (
                <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
              ))}
            </TextField>
            <IconButton 
              sx={{ bgcolor: COLORS.orange, color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#ea580c' } }}
              disabled={!selectedDriver}
              onClick={() => onAssign(job._id, selectedDriver)}
            >
              <CheckCircle />
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default JobsPage;