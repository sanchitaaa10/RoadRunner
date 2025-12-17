import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Link, Paper, ToggleButton, ToggleButtonGroup 
} from '@mui/material';
import { LocalShipping, AdminPanelSettings } from '@mui/icons-material';
import axios from 'axios';
import API_URL from '../config'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // LOGIN TYPE TOGGLE (Visual Guide)
  const [loginType, setLoginType] = useState('admin'); // 'admin' or 'driver'

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('user', JSON.stringify(data));
      
      // AUTO-REDIRECT BASED ON ROLE
      if (data.role === 'driver') {
        window.location.href = '/driver';
      } else {
        window.location.href = '/dashboard';
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', backgroundColor: '#f1f5f9' }}>
      
      {/* LEFT SIDE (Image) */}
      <Box sx={{ 
        flex: '1.2', display: { xs: 'none', md: 'block' },
        backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <Box sx={{ width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', p: 5 }}>
          <Typography variant="h3" fontWeight="bold">Welcome Back.</Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE (Form) */}
      <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: '100%', maxWidth: 450 }}>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
             <Typography variant="h4" fontWeight="bold" color="#1e293b">Log In</Typography>
             <Typography color="text.secondary">Access your {loginType} account</Typography>
          </Box>

          {/* --- ROLE TOGGLE BUTTON --- */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={loginType}
              exclusive
              onChange={(e, newType) => { if(newType) setLoginType(newType); }}
              sx={{ bgcolor: '#f1f5f9', p: 0.5, borderRadius: 3 }}
            >
              <ToggleButton value="admin" sx={{ px: 3, borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}>
                 <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} /> Dispatcher
              </ToggleButton>
              <ToggleButton value="driver" sx={{ px: 3, borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}>
                 <LocalShipping fontSize="small" sx={{ mr: 1 }} /> Driver
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField 
              required fullWidth label="Email Address" name="email" type="email" 
              value={formData.email} onChange={handleChange} 
            />
            <TextField 
              required fullWidth label="Password" name="password" type="password" 
              value={formData.password} onChange={handleChange} 
            />
            
            <Button 
              type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ 
                py: 1.5, fontSize: '1.1rem', borderRadius: 2, 
                bgcolor: loginType === 'driver' ? '#10b981' : '#6366f1', // Green for Driver, Purple for Admin
                '&:hover': { bgcolor: loginType === 'driver' ? '#059669' : '#4f46e5' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : `Login as ${loginType === 'driver' ? 'Driver' : 'Admin'}`}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="/register" underline="hover" sx={{ fontWeight: 'bold', color: '#64748b' }}>
                 Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>

        </Paper>
      </Box>
    </div>
  );
};

export default LoginPage;