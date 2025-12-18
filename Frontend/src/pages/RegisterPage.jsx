import React, { useState } from 'react';
import { 
  Box, Button, TextField, Typography, Alert, CircularProgress, Link, MenuItem, Paper, InputAdornment 
} from '@mui/material';
import { LocalShipping, Person, Email, Lock, Badge, DirectionsCar, Speed } from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import API_URL from '../config'; 

const COLORS = {
  background: '#0f172a',
  card: '#1e293b',
  inputBg: '#f8fafc',
  primary: '#6366f1',
  orange: '#f97316'
};

const containerVar = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'driver', vehicleType: 'Truck', licensePlate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, formData);
      localStorage.setItem('user', JSON.stringify(data));
      setLoading(false);
      setShowSuccess(true);

      setTimeout(() => {
        window.location.href = data.role === 'driver' ? '/driver' : '/dashboard';
      }, 1800);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Connection failed");
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      bgcolor: COLORS.inputBg, borderRadius: '8px', color: '#0f172a',
      '& fieldset': { borderColor: 'transparent' },
      '&:hover fieldset': { borderColor: COLORS.primary },
      '&.Mui-focused fieldset': { borderColor: COLORS.primary },
    },
  };

  return (
    <Box sx={{ 
      width: '100vw', height: '100vh', display: 'flex', 
      bgcolor: COLORS.background, fontFamily: '"Plus Jakarta Sans", sans-serif', overflow: 'hidden' 
    }}>
      
      {/* --- TRUCK ANIMATION --- */}
      <AnimatePresence>
        {showSuccess && (
          <Box sx={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(5px)' }} />
            <motion.div
              initial={{ x: '-100vw' }} animate={{ x: '150vw' }} transition={{ duration: 1.2, ease: "easeInOut" }}
              style={{ display: 'flex', alignItems: 'center', gap: 20 }}
            >
               <LocalShipping sx={{ fontSize: 220, color: COLORS.orange, filter: 'drop-shadow(0 0 50px rgba(249, 115, 22, 1))' }} />
               <Typography variant="h1" fontWeight="900" color="white" sx={{ fontStyle: 'italic', letterSpacing: -2 }}>JOINING FLEET...</Typography>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>

      {/* LEFT SIDE (Truck Image) */}
      <Box sx={{ 
        flex: '1.5', display: { xs: 'none', md: 'flex' }, position: 'relative',
        backgroundImage: 'url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center', alignItems: 'center', justifyContent: 'center'
      }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)' }} />
        <Box sx={{ position: 'relative', zIndex: 2, color: 'white', textAlign: 'center' }}>
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
             <Box sx={{ mb: 2, display: 'inline-flex', p: 2, bgcolor: 'rgba(249, 115, 22, 0.2)', borderRadius: '50%' }}>
                <Speed sx={{ fontSize: 50, color: COLORS.orange }} />
             </Box>
             <Typography variant="h3" fontWeight="900" gutterBottom>Join the Fleet</Typography>
             <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 400, mx: 'auto' }}>
               Create your driver account, register your vehicle, and start earning today.
             </Typography>
           </motion.div>
        </Box>
      </Box>

      {/* RIGHT SIDE (Form) */}
      <Box sx={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, bgcolor: COLORS.background }}>
        <Paper 
          component={motion.div}
          variants={containerVar}
          initial="hidden"
          animate="visible"
          elevation={0}
          sx={{ 
            p: 5, borderRadius: 4, width: '100%', maxWidth: 450,
            bgcolor: COLORS.card, border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
             <Typography variant="h4" fontWeight="800" color="white" gutterBottom>Sign Up</Typography>
             <Typography color="#94a3b8">Start driving with <span style={{ color: COLORS.orange, fontWeight: 'bold' }}>RoadRunner</span></Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5, ml: 0.5 }}>Full Name *</Typography>
              <TextField 
                fullWidth placeholder="John Doe" name="name" 
                value={formData.name} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person fontSize="small" /></InputAdornment> }}
              />
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5, ml: 0.5 }}>Email *</Typography>
              <TextField 
                fullWidth placeholder="driver@example.com" name="email" type="email" 
                value={formData.email} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }}
              />
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5, ml: 0.5 }}>Password *</Typography>
              <TextField 
                fullWidth placeholder="••••••••" name="password" type="password" 
                value={formData.password} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock fontSize="small" /></InputAdornment> }}
              />
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5, ml: 0.5 }}>Vehicle Type</Typography>
              <TextField 
                select fullWidth name="vehicleType" 
                value={formData.vehicleType} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><DirectionsCar fontSize="small" /></InputAdornment> }}
              >
                {['Truck', 'Van', 'Bike', 'Scooter'].map((opt) => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            </motion.div>

            <motion.div variants={itemVar}>
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5, ml: 0.5 }}>License Plate *</Typography>
              <TextField 
                fullWidth placeholder="MH-04-TR-9999" name="licensePlate" 
                value={formData.licensePlate} onChange={handleChange} sx={inputSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Badge fontSize="small" /></InputAdornment> }}
              />
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Button 
                type="submit" fullWidth variant="contained" size="large" disabled={loading} 
                sx={{ 
                  py: 2, mt: 2, fontSize: '1rem', borderRadius: 2, fontWeight: 'bold', textTransform: 'none',
                  bgcolor: COLORS.primary, boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                  '&:hover': { bgcolor: '#4f46e5' }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </motion.div>
            
            <motion.div variants={itemVar}>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="#94a3b8">
                  Already have an account? <Link href="/login" underline="hover" sx={{ color: COLORS.orange, fontWeight: 'bold' }}>Login</Link>
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterPage;