import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, 
  CircularProgress, Avatar, Paper, IconButton 
} from '@mui/material';
import { 
  Add, LocalShipping, CheckCircle, Place, AccessTime, Person, Map as MapIcon, Close 
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import API_URL from '../config';

// Fix Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const JobsPage = () => {
  const [jobs, setJobs] = useState([]); 
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [mapCoords, setMapCoords] = useState({ start: null, end: null });
  const [mapLoading, setMapLoading] = useState(false);

  // Forms
  const [newJob, setNewJob] = useState({ orderId: '', pickupAddress: '', dropoffAddress: '' });
  const [selectedDriverId, setSelectedDriverId] = useState('');

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    try {
      const [jobsRes, driversRes] = await Promise.all([
        axios.get(`${API_URL}/api/jobs`),
        axios.get(`${API_URL}/api/auth/drivers`)
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setDrivers(Array.isArray(driversRes.data) ? driversRes.data : []);
      setLoading(false);
    } catch (err) { 
      setJobs([]); setDrivers([]); setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- 2. IMPROVED GEOCODING (Fixes Wrong Location) ---
  const geocode = async (address) => {
    try {
      // APPEND "India" to ensure we don't get results from other countries
      // You can also change this to ", Mumbai, India" if you want to be even more specific
      const query = `${address}, India`; 
      
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        console.log(`📍 Found: ${data[0].display_name}`); // Debug log
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (e) { 
      console.error("Geocoding Error:", e);
      return null; 
    }
  };

  // --- 3. HANDLE VIEW MAP CLICK ---
  const handleViewMap = async (job) => {
    setSelectedJob(job);
    setOpenMap(true);
    setMapLoading(true);
    setMapCoords({ start: null, end: null });

    const start = await geocode(job.pickupAddress);
    const end = await geocode(job.dropoffAddress);

    setMapCoords({ start, end });
    setMapLoading(false);
  };

  // --- 4. ACTIONS ---
  const handleCreateJob = async () => {
    if(!newJob.orderId) return alert("Order ID Required");
    try {
      await axios.post(`${API_URL}/api/jobs`, newJob);
      setOpenCreate(false);
      setNewJob({ orderId: '', pickupAddress: '', dropoffAddress: '' });
      fetchData();
    } catch (err) { alert("Failed to create job"); }
  };

  const handleAssignDriver = async () => {
    try {
      await axios.put(`${API_URL}/api/jobs/${selectedJob._id}`, { status: 'assigned', assignedDriver: selectedDriverId });
      await axios.put(`${API_URL}/api/auth/status/${selectedDriverId}`, { status: 'busy' });
      setOpenAssign(false);
      fetchData();
    } catch (err) { alert("Failed to assign"); }
  };

  const getJobsByStatus = (status) => jobs.filter(j => j.status === status);

  if (loading) return <Box p={4} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ width: '100%', p: 1 }}>
      
      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
           <Typography variant="h4" fontWeight="bold" color="#1e293b">Dispatch Board</Typography>
           <Typography variant="body2" color="text.secondary">Drag, drop, and assign deliveries.</Typography>
        </Box>
        <Button 
          variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}
          sx={{ bgcolor: '#6366f1', borderRadius: 3, px: 3, py: 1.5 }}
        >
          New Job
        </Button>
      </Box>

      {/* KANBAN COLUMNS */}
      <Grid container spacing={3}>
        {['pending', 'assigned', 'delivered'].map((status) => (
          <Grid item xs={12} md={4} key={status}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: status === 'pending' ? '#fff7ed' : status === 'assigned' ? '#eff6ff' : '#f0fdf4', 
              borderRadius: 4, minHeight: '60vh' 
            }} elevation={0}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textTransform: 'capitalize', color: '#1e293b' }}>
                {status === 'assigned' ? 'On Route' : status} ({getJobsByStatus(status).length})
              </Typography>
              
              {getJobsByStatus(status).map(job => (
                <Card key={job._id} sx={{ mb: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight="bold">#{job.orderId}</Typography>
                      {/* VIEW MAP BUTTON */}
                      <IconButton size="small" onClick={() => handleViewMap(job)} sx={{ color: '#6366f1', bgcolor: '#e0e7ff' }}>
                        <MapIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold">{job.dropoffAddress}</Typography>
                      <Typography variant="caption" color="text.secondary">From: {job.pickupAddress}</Typography>
                    </Box>

                    {status === 'pending' && (
                      <Button fullWidth variant="contained" size="small" onClick={() => { setSelectedJob(job); setOpenAssign(true); }} sx={{ bgcolor: '#1e293b' }}>
                        Assign Driver
                      </Button>
                    )}
                    {status === 'assigned' && job.assignedDriver && (
                       <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                         <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{job.assignedDriver.name[0]}</Avatar>
                         <Typography variant="caption" fontWeight="bold">{job.assignedDriver.name}</Typography>
                       </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MODALS (Create & Assign) - Same as before */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Order ID" fullWidth value={newJob.orderId} onChange={(e) => setNewJob({ ...newJob, orderId: e.target.value })} />
            {/* Added Helper Text for Better Address Input */}
            <TextField label="Pickup (e.g. Belapur, Navi Mumbai)" fullWidth value={newJob.pickupAddress} onChange={(e) => setNewJob({ ...newJob, pickupAddress: e.target.value })} />
            <TextField label="Dropoff (e.g. Vashi, Navi Mumbai)" fullWidth value={newJob.dropoffAddress} onChange={(e) => setNewJob({ ...newJob, dropoffAddress: e.target.value })} />
            <Button variant="contained" onClick={handleCreateJob} sx={{ mt: 2 }}>Create</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={openAssign} onClose={() => setOpenAssign(false)} fullWidth>
        <DialogTitle>Assign Driver</DialogTitle>
        <DialogContent>
          <TextField select label="Select Driver" fullWidth value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)} sx={{ mt: 1 }}>
            {drivers.filter(d => d.status === 'available').map(d => (
              <MenuItem key={d._id} value={d._id}>{d.name} (Available)</MenuItem>
            ))}
          </TextField>
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleAssignDriver} disabled={!selectedDriverId}>Confirm</Button>
        </DialogContent>
      </Dialog>

      {/* --- MAP MODAL (UPDATED) --- */}
      <Dialog open={openMap} onClose={() => setOpenMap(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">Route Details: #{selectedJob?.orderId}</Typography>
            <Typography variant="caption">{selectedJob?.pickupAddress} ➝ {selectedJob?.dropoffAddress}</Typography>
          </Box>
          <IconButton onClick={() => setOpenMap(false)}><Close /></IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ height: '400px', p: 0 }}>
          {mapLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress /> <Typography sx={{ ml: 2 }}>Locating Address in India...</Typography>
            </Box>
          ) : (
            mapCoords.start && mapCoords.end ? (
              <MapContainer 
                center={mapCoords.start} 
                zoom={10} 
                style={{ height: '100%', width: '100%' }}
                bounds={[mapCoords.start, mapCoords.end]} 
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={mapCoords.start}><Popup>Pickup</Popup></Marker>
                <Marker position={mapCoords.end}><Popup>Dropoff</Popup></Marker>
                <Polyline positions={[mapCoords.start, mapCoords.end]} color="blue" weight={5} />
              </MapContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%" flexDirection="column">
                <Typography color="error" fontWeight="bold">Location Not Found</Typography>
                <Typography variant="caption">Try entering "City, State" (e.g., "Vashi, Mumbai")</Typography>
              </Box>
            )
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
};

export default JobsPage;