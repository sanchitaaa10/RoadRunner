import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Typography, Avatar, IconButton, Tooltip, Divider 
} from '@mui/material';
import { 
  Dashboard, LocalShipping, Map, People, ChevronLeft, ChevronRight 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// --- THEME ---
const COLORS = {
  bg: '#1e293b',        // Dark Sidebar Background
  primary: '#f97316',   // Orange Accent
  textMain: '#ffffff',
  textMuted: '#94a3b8',
  border: 'rgba(255,255,255,0.08)',
  hover: 'rgba(255,255,255,0.05)'
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // SAFETY CHECK: If no user found, default to 'Admin' to prevent crash
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'dispatcher' };

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/dashboard' }, 
    { text: 'Live Map', icon: <Map />, path: '/dashboard/map' },
    { text: 'Jobs Board', icon: <LocalShipping />, path: '/dashboard/jobs' },
    { text: 'Drivers', icon: <People />, path: '/dashboard/drivers' },
  ];

  return (
    <Box sx={{ 
      width: collapsed ? 80 : 280, 
      height: '100vh', 
      bgcolor: COLORS.bg, 
      borderRight: `1px solid ${COLORS.border}`,
      display: 'flex', 
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'relative',
      zIndex: 1200,
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    }}>
      
      {/* HEADER */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 2, height: 80 }}>
        <Box sx={{ 
          width: 40, height: 40, bgcolor: COLORS.primary, borderRadius: 3, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          boxShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
        }}>
          <LocalShipping fontSize="small" />
        </Box>
        {!collapsed && (
          <Typography variant="h6" fontWeight="800" sx={{ color: 'white', whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
            RoadRunner
          </Typography>
        )}
      </Box>

      <Divider sx={{ borderColor: COLORS.border, mx: 3 }} />

      {/* MENU */}
      <List sx={{ flexGrow: 1, px: 2, mt: 3 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, display: 'block' }}>
              <Tooltip title={collapsed ? item.text : ""} placement="right">
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    borderRadius: 3, 
                    bgcolor: isActive ? COLORS.primary : 'transparent', 
                    color: isActive ? 'white' : COLORS.textMuted,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: isActive ? '#ea580c' : COLORS.hover, color: 'white' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? '800' : '500', fontSize: '0.95rem' }} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* TOGGLE BUTTON */}
      <IconButton 
        onClick={() => setCollapsed(!collapsed)}
        sx={{ 
          position: 'absolute', top: 35, right: -15, 
          bgcolor: COLORS.bg, border: `1px solid ${COLORS.border}`, 
          color: COLORS.textMuted,
          width: 30, height: 30, zIndex: 1300,
          '&:hover': { bgcolor: COLORS.primary, color: 'white', borderColor: COLORS.primary }
        }}
      >
        {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
      </IconButton>

      {/* PROFILE */}
      <Box sx={{ p: 2, borderTop: `1px solid ${COLORS.border}`, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Avatar sx={{ bgcolor: COLORS.primary, width: 40, height: 40, fontSize: 16, fontWeight: 'bold' }}>
            {user.name?.[0] || 'A'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ color: 'white' }}>{user.name || 'Admin'}</Typography>
              <Typography variant="caption" sx={{ color: COLORS.textMuted }} noWrap>Dispatcher</Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default Sidebar;