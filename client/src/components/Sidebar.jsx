import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Typography, Avatar, IconButton, Tooltip 
} from '@mui/material';
import { 
  Dashboard, LocalShipping, Map, People, ChevronLeft, ChevronRight 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  // SAFETY CHECK: If no user found, default to 'Admin' to prevent crash
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Admin', role: 'dispatcher' };

  const menuItems = [
    { text: 'Overview', icon: <Dashboard />, path: '/dashboard' }, // Links to DashboardHome
    { text: 'Live Map', icon: <Map />, path: '/dashboard/map' },
    { text: 'Jobs Board', icon: <LocalShipping />, path: '/dashboard/jobs' },
    { text: 'Drivers', icon: <People />, path: '/dashboard/drivers' },
  ];

  return (
    <Box sx={{ 
      width: collapsed ? 80 : 280, 
      height: '100vh', 
      bgcolor: '#ffffff', 
      borderRight: '1px solid #e2e8f0',
      display: 'flex', 
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'relative',
      zIndex: 1200,
      boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
    }}>
      
      {/* HEADER */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 2 }}>
        <Box sx={{ 
          width: 40, height: 40, bgcolor: '#6366f1', borderRadius: 3, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
        }}>
          <LocalShipping fontSize="small" />
        </Box>
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b', whiteSpace: 'nowrap' }}>
            RoadRunner
          </Typography>
        )}
      </Box>

      {/* MENU */}
      <List sx={{ flexGrow: 1, px: 2, mt: 2 }}>
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
                    bgcolor: isActive ? '#e0e7ff' : 'transparent', 
                    color: isActive ? '#4338ca' : '#64748b',
                    '&:hover': { bgcolor: '#f1f5f9', color: '#1e293b' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center', color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />}
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
          position: 'absolute', top: 40, right: -15, 
          bgcolor: 'white', border: '1px solid #e2e8f0', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: 30, height: 30, zIndex: 1300,
          '&:hover': { bgcolor: '#f8fafc' }
        }}
      >
        {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
      </IconButton>

      {/* PROFILE */}
      <Box sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40, fontSize: 16 }}>{user.name?.[0] || 'A'}</Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" fontWeight="bold" noWrap>{user.name || 'Admin'}</Typography>
              <Typography variant="caption" color="text.secondary" noWrap>View Profile</Typography>
            </Box>
          )}
        </Box>
      </Box>

    </Box>
  );
};

export default Sidebar;