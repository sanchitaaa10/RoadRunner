import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', bgcolor: '#f8fafc' }}>
      
      {/* 1. SIDEBAR */}
      <Sidebar />

      {/* 2. MAIN CONTENT AREA */}
      <Box sx={{ 
        flexGrow: 1, 
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        
        {/* --- THE BACKGROUND MAGIC START --- */}
        {/* Soft Purple Blob (Top Left) */}
        <Box sx={{
          position: 'absolute', top: -100, left: -100, width: 600, height: 600,
          bgcolor: '#c7d2fe', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.4, zIndex: 0, pointerEvents: 'none'
        }} />
        
        {/* Soft Pink Blob (Bottom Right) */}
        <Box sx={{
          position: 'absolute', bottom: -100, right: -100, width: 500, height: 500,
          bgcolor: '#fbcfe8', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.3, zIndex: 0, pointerEvents: 'none'
        }} />
        {/* --- THE BACKGROUND MAGIC END --- */}

        {/* 3. ACTUAL PAGE CONTENT (Floating above background) */}
        <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
          <Outlet />
        </Box>

      </Box>
      
    </Box>
  );
};

export default DashboardLayout;