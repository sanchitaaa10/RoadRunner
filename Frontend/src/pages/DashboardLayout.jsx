import React, { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Typography, Avatar, IconButton, Tooltip, Divider, Button 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Map as MapIcon, 
  LocalShipping as TruckIcon, 
  Work as WorkIcon, 
  Logout as LogoutIcon,
  LocalShipping,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- THEME ---
const COLORS = {
  bgDark: '#0f172a',    // Main Background
  sidebarBg: '#1e293b', // Sidebar / Cards
  primary: '#f97316',   // Orange Accent
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  border: 'rgba(255,255,255,0.08)'
};

const drawerWidth = 260;
const collapsedWidth = 80;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true); // Sidebar State

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const menuItems = [
    { text: 'Overview', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Live Map', icon: <MapIcon />, path: '/dashboard/map' },
    { text: 'Jobs Board', icon: <WorkIcon />, path: '/dashboard/jobs' },
    { text: 'Drivers', icon: <TruckIcon />, path: '/dashboard/drivers' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: COLORS.bgDark, minHeight: '100vh', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
      
      {/* Import Font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden',
            bgcolor: COLORS.sidebarBg,
            color: 'white',
            borderRight: `1px solid ${COLORS.border}`
          },
        }}
      >
        {/* HEADER & TOGGLE */}
        <Box sx={{ 
          p: 2, display: 'flex', alignItems: 'center', 
          justifyContent: open ? 'space-between' : 'center', 
          minHeight: 80 
        }}>
          {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 35, height: 35, bgcolor: COLORS.primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 10px #f97316' }}>
                   <LocalShipping fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight="800" color="white" letterSpacing="-0.5px">RoadRunner</Typography>
              </Box>
            </motion.div>
          )}
          
          <IconButton onClick={() => setOpen(!open)} sx={{ color: COLORS.textMuted, '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: COLORS.border }} />

        {/* MENU ITEMS */}
        <List sx={{ px: 1, flexGrow: 1, mt: 3 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1, display: 'block' }}>
                <Tooltip title={!open ? item.text : ""} placement="right">
                  <ListItemButton 
                    onClick={() => navigate(item.path)}
                    selected={isActive}
                    sx={{ 
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: 3, 
                      color: isActive ? 'white' : COLORS.textMuted,
                      bgcolor: isActive ? COLORS.primary : 'transparent',
                      transition: '0.2s',
                      '&:hover': { bgcolor: isActive ? COLORS.primary : 'rgba(255,255,255,0.05)', color: 'white' },
                      '&.Mui-selected': { bgcolor: COLORS.primary, color: 'white', '&:hover': { bgcolor: '#ea580c' } } // Hover on selected
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 0, 
                      mr: open ? 2 : 'auto', 
                      justifyContent: 'center', 
                      color: 'inherit' 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    
                    <ListItemText 
                      primary={item.text} 
                      sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }} 
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* PROFILE & LOGOUT (Bottom) */}
        <Box sx={{ p: open ? 2 : 1, borderTop: `1px solid ${COLORS.border}`, bgcolor: 'rgba(0,0,0,0.2)' }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', 
            justifyContent: open ? 'flex-start' : 'center', 
            gap: 2, mb: 2, px: open ? 1 : 0 
          }}>
            <Avatar sx={{ bgcolor: COLORS.primary, width: 35, height: 35, fontSize: 14, fontWeight: 'bold' }}>D</Avatar>
            {open && (
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">Dispatcher Dave</Typography>
                <Typography variant="caption" color={COLORS.textMuted}>Admin</Typography>
              </Box>
            )}
          </Box>
          
          {open ? (
            <Button 
              fullWidth variant="outlined" startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ 
                borderRadius: 2, textTransform: 'none', fontWeight: 'bold', 
                borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444', 
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' } 
              }}
            >
              Log Out
            </Button>
          ) : (
             <Tooltip title="Log Out" placement="right">
               <IconButton onClick={handleLogout} sx={{ color: '#ef4444', width: '100%', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}>
                 <LogoutIcon />
               </IconButton>
             </Tooltip>
          )}
        </Box>

      </Drawer>

      {/* MAIN CONTENT AREA */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: COLORS.bgDark, minHeight: '100vh', p: 0, overflowX: 'hidden' }}>
        <Outlet />
      </Box>

    </Box>
  );
};

export default DashboardLayout;