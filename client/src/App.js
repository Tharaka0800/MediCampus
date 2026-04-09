import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AppointmentPage from './pages/AppointmentPage';
import QueuePage from './pages/QueuePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageDoctors from './pages/ManageDoctors';
import MedicalHub from './pages/MedicalHub';
import MedicalApplication from './pages/MedicalApplication';
import MedicalStatus from './pages/MedicalStatus';
import DoctorMedicalPanel from './pages/DoctorMedicalPanel';
import VerifyCertificate from './pages/VerifyCertificate';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';
import NotificationBell from './components/NotificationBell';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Define routes that should NOT show the global Navbar
  const dashboardRoutes = [
    '/dashboard',
    '/health-profile',
    '/appointments',
    '/medical-history',
    '/notifications'
  ];

  return (
    <Router>
      <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <ConditionalNavbar dashboardRoutes={dashboardRoutes} darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/doctors" element={<ManageDoctors />} />
          <Route path="/medical" element={<MedicalHub />} />
          <Route path="/medical/apply" element={<MedicalApplication />} />
          <Route path="/medical/status" element={<MedicalStatus />} />
          <Route path="/medical/doctor" element={<DoctorMedicalPanel />} />
          <Route path="/verify" element={<VerifyCertificate />} />
          <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
        </Routes>
      </div>
    </Router>
  );
}



function ConditionalNavbar({ dashboardRoutes, darkMode, setDarkMode }) {
  const location = useLocation();
  const isDashboard = dashboardRoutes.some(route => location.pathname.startsWith(route));

  if (isDashboard) return null;

  return (
    <>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="absolute top-4 right-4 z-50">
        <NotificationBell />
      </div>
    </>
  );
}

export default App;