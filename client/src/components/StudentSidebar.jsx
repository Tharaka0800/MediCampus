import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import CardMembershipIcon from '@mui/icons-material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';

const StudentSidebar = ({ user = { name: 'Student', id: 'Unknown ID' } }) => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
    { name: 'Health Profile', path: '/health-profile', icon: <PersonIcon sx={{ fontSize: 20 }} /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />, badge: 2 },
    { name: 'Medical History', path: '/medical-history', icon: <HistoryIcon sx={{ fontSize: 20 }} /> },
    { name: 'Certificates', path: '/medical/status', icon: <CardMembershipIcon sx={{ fontSize: 20 }} /> },
    { name: 'Notifications', path: '/notifications', icon: <NotificationsIcon sx={{ fontSize: 20 }} />, badge: 2 },
  ];

  const accountItems = [
    { name: 'Delete Profile', path: '/delete-profile', icon: <DeleteIcon sx={{ fontSize: 20 }} />, danger: true },
    { name: 'Sign Out', path: '/logout', icon: <LogoutIcon sx={{ fontSize: 20 }} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-teal-950 text-white flex flex-col fixed left-0 top-0 z-50 overflow-y-auto">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-teal-900/40">
        <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <span className="text-xl font-black text-white">M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight leading-none text-white">MediCampus</span>
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1 opacity-60">Health Hub</span>
        </div>
      </div>

      <div className="px-4 py-2 text-[10px] font-bold text-teal-500 uppercase tracking-widest opacity-60">
        Main Menu
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              location.pathname === item.path
                ? 'bg-teal-800 text-white shadow-lg'
                : 'text-teal-100/70 hover:bg-teal-900 hover:text-white'
            }`}
          >
            <span className={`${location.pathname === item.path ? 'text-teal-400' : 'text-teal-100/50 group-hover:text-teal-300'}`}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.name}</span>
            {item.badge && (
              <span className="ml-auto w-5 h-5 bg-teal-500 text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ))}

        <div className="pt-8 px-4 py-2 text-[10px] font-bold text-teal-500 uppercase tracking-widest opacity-60">
          Account
        </div>

        {accountItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              item.danger 
                ? 'text-orange-400 hover:bg-orange-950/30' 
                : 'text-teal-100/70 hover:bg-teal-900 hover:text-white'
            }`}
          >
            <span className="opacity-50 group-hover:opacity-100">{item.icon}</span>
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile Card */}
      <div className="p-4 mt-auto">
        <div className="bg-teal-900/40 rounded-2xl p-4 flex items-center gap-3 border border-teal-800/30 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-lg font-bold shadow-teal-500/20 shadow-lg">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-[10px] text-teal-400 truncate">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
