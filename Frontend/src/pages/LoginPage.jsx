import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Link, Paper, ToggleButton, ToggleButtonGroup, InputAdornment 
} from '@mui/material';
import { LocalShipping, AdminPanelSettings, Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config'; 

// --- THEME COLORS (Matched to Screenshot) ---
const COLORS = {
  background: '#0f172a',      // Deep Navy Background
  card: '#1e293b',            // Lighter Navy Card
  inputBg: '#f8fafc',         // White/Light Inputs
  textMain: '#ffffff',        // White Text
  primary: '#6366f1',         // Purple Button
  orange: '#f97316',          // Orange Accent
  toggleInactive: 'rgba(255,255,255,0.05)'
};

// --- ANIMATIONS ---
const containerVar = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('admin');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('user', JSON.stringify(data));
      
      setLoading(false);
      setShowSuccess(true); // Trigger Truck Animation

      setTimeout(() => {
        window.location.href = data.role === 'driver' ? '/driver' : '/dashboard';
      }, 1800);

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  // Input Style (White Background as per screenshot)
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: COLORS.inputBg,
      borderRadius: '8px',
      color: '#0f172a', // Dark text inside white input
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary },
    },
    '& .MuiInputLabel-root': { color: '#64748b' },
    '& .MuiInputLabel-root.Mui-focused': { color: COLORS.primary },
  };

  return (
    <Box sx={{ 
      width: '100vw', height: '100vh', display: 'flex', 
      bgcolor: COLORS.background, fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden' 
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* --- SUCCESS ANIMATION (Zooming Truck) --- */}
      <AnimatePresence>
        {showSuccess && (
          <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)' }} />
            
            {/* Speed Lines Background */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: '-100%' }} transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', height: '2px', width: '50%', background: 'rgba(255,255,255,0.2)', top: '40%' }} 
            />
            
            <motion.div
              initial={{ x: '-120vw' }}
              animate={{ x: '120vw' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}
            >
               <LocalShipping sx={{ fontSize: 200, color: COLORS.orange, filter: 'drop-shadow(0 0 40px rgba(249, 115, 22, 0.8))' }} />
               <Typography variant="h2" fontWeight="900" color="white" sx={{ fontStyle: 'italic', textShadow: '0 0 20px black' }}>
                 LOGGED IN...
               </Typography>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* LEFT SIDE (Warehouse Image) */}
      <Box sx={{ 
        flex: '1.2', display: { xs: 'none', md: 'block' }, position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.4))' }} />
        <Box sx={{ position: 'relative', height: '100%', p: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
             <Box sx={{ p: 1, bgcolor: COLORS.orange, borderRadius: 2 }}><LocalShipping /></Box>
             <Typography variant="h5" fontWeight="bold">RoadRunner</Typography>
          </Box>
          <Typography variant="h2" fontWeight="bold" sx={{ mb: 2 }}>Welcome Back.</Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 450, lineHeight: 1.6 }}>
            Log in to manage your fleet, track shipments, and optimize your logistics operations.
          </Typography>
        </Box>
      </Box>

      {/* RIGHT SIDE (Form) */}
      <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Paper 
          component={motion.div}
          variants={containerVar}
          initial="hidden"
          animate="visible"
          elevation={0} 
          sx={{ 
            p: 6, borderRadius: 4, width: '100%', maxWidth: 480, 
            bgcolor: COLORS.card, border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
          }}
        >
          
          <motion.div variants={itemVar}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
               <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>Log In</Typography>
               <Typography color="#94a3b8">Access your <span style={{ color: COLORS.orange, fontWeight: 'bold' }}>{loginType}</span> account</Typography>
            </Box>
          </motion.div>

          {/* Toggle Button */}
          <motion.div variants={itemVar}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <ToggleButtonGroup
                value={loginType}
                exclusive
                onChange={(e, newType) => newType && setLoginType(newType)}
                sx={{ bgcolor: COLORS.toggleInactive, p: 0.5, borderRadius: 2 }}
              >
                <ToggleButton value="admin" sx={{ px: 4, py: 1, borderRadius: 2, color: '#94a3b8', textTransform: 'none', fontWeight: 'bold', '&.Mui-selected': { bgcolor: COLORS.orange, color: 'white', '&:hover': { bgcolor: COLORS.orangeHover } } }}>
                   <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} /> Dispatcher
                </ToggleButton>
                <ToggleButton value="driver" sx={{ px: 4, py: 1, borderRadius: 2, color: '#94a3b8', textTransform: 'none', fontWeight: 'bold', '&.Mui-selected': { bgcolor: COLORS.orange, color: 'white', '&:hover': { bgcolor: COLORS.orangeHover } } }}>
                   <LocalShipping fontSize="small" sx={{ mr: 1 }} /> Driver
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </motion.div>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 1, ml: 0.5 }}>Email Address *</Typography>
              <TextField 
                fullWidth placeholder="dave@roadrunner.com" name="email" type="email" 
                value={formData.email} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment> }}
              />
            </motion.div>

            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 1, ml: 0.5 }}>Password *</Typography>
              <TextField 
                fullWidth placeholder="•••••••" name="password" type="password" 
                value={formData.password} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" sx={{ color: '#94a3b8' }} /></InputAdornment> }}
              />
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Button 
                type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ 
                  py: 2, mt: 2, fontSize: '1rem', borderRadius: 2, 
                  bgcolor: COLORS.primary, fontWeight: 'bold', textTransform: 'none',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                  '&:hover': { bgcolor: '#4f46e5' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="#94a3b8">
                  Don't have an account? <Link href="/register" underline="hover" sx={{ color: COLORS.orange, fontWeight: 'bold' }}>Sign Up</Link>
                </Typography>
              </Box>
            </motion.div>
          </Box>

        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;