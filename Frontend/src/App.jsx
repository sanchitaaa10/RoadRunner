import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import All Pages
import LandingPage from './pages/Landingpage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import MapView from './pages/MapView';
import JobsPage from './pages/JobsPage';
import DriversPage from './pages/DriversPage'; // <--- Imported correctly
import DriverDashboard from './pages/DriverDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Driver Mobile App */}
        <Route path="/driver" element={<DriverDashboard />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Dashboard Home (Stats) */}
          <Route index element={<DashboardHome />} />
          
          {/* Live Map */}
          <Route path="map" element={<MapView />} />
          
          {/* Jobs Board */}
          <Route path="jobs" element={<JobsPage />} />
          
          {/* Drivers List (Updated to use the Real Page) */}
          <Route path="drivers" element={<DriversPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;