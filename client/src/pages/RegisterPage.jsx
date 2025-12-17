import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Link, MenuItem, Paper 
} from '@mui/material';
import axios from 'axios';
import API_URL from '../config'; 

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'driver', // Default to driver since most mobile users are drivers
    vehicleType: 'Truck',
    licensePlate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log("🚀 Submitting Registration to:", `${API_URL}/api/auth/register`);
      
      // 1. Send Data to Backend
      const { data } = await axios.post(`${API_URL}/api/auth/register`, formData);
      
      console.log("✅ Registration Success:", data);

      // 2. Save User to Storage
      localStorage.setItem('user', JSON.stringify(data));
      
      // 3. Redirect based on Role
      if (data.role === 'driver') {
        window.location.href = '/driver';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      console.error("❌ Registration Error:", err);
      // Extract the REAL error message from the server response
      const serverMsg = err.response?.data?.message || err.message || "Connection failed";
      setError(serverMsg);
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: Image (Hidden on very small mobile screens automatically by flexbox if needed, but keeping simple here) */}
      <Box sx={{ 
        flex: '1.5', 
        display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on laptop
        backgroundImage: 'url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        position: 'relative', 
        alignItems: 'center', 
        justifyContent: 'center'
      }}>
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
          opacity: 0.9
        }} />
        <Box sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center', p: 4 }}>
           <Typography variant="h3" fontWeight="bold" gutterBottom>Join Fleet</Typography>
           <Typography variant="h6" sx={{ opacity: 0.9 }}>Create your driver account and start earning.</Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE: Form */}
      <Box sx={{ 
        flex: '1', 
        backgroundColor: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflowY: 'auto',
        p: 4
      }}>
        <Box sx={{ maxWidth: '400px', width: '100%' }}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
             <Typography component="h1" variant="h4" fontWeight="bold" color="primary">Sign Up</Typography>
             <Typography color="text.secondary">Start driving with RoadRunner</Typography>
          </Box>

          {/* REAL ERROR MESSAGE ALERT */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField 
              required fullWidth 
              label="Full Name" 
              name="name" 
              value={formData.name}
              onChange={handleChange} 
            />
            
            <TextField 
              required fullWidth 
              label="Email" 
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange} 
            />
            
            <TextField 
              required fullWidth 
              label="Password" 
              name="password" 
              type="password" 
              value={formData.password}
              onChange={handleChange} 
            />
            
            <TextField 
              select fullWidth 
              label="Vehicle Type" 
              name="vehicleType" 
              value={formData.vehicleType} 
              onChange={handleChange}
            >
              {['Truck', 'Van', 'Bike', 'Scooter'].map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </TextField>

            <TextField 
              required fullWidth 
              label="License Plate" 
              name="licensePlate" 
              value={formData.licensePlate}
              onChange={handleChange} 
              helperText="e.g., MH-04-TR-9999"
            />
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large" 
              disabled={loading} 
              sx={{ 
                py: 1.5, 
                mt: 1, 
                fontSize: '1.1rem', 
                borderRadius: 2,
                bgcolor: '#6366f1',
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/login" variant="body2" sx={{ fontWeight: 'bold', textDecoration: 'none' }}>
                 Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default RegisterPage;