import React from 'react';
import { Link } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';
import { motion } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StudentDashboard = () => {
  const stats = [
    { title: 'Upcoming Appointments', value: 3, sub: '2 this week', icon: <CalendarMonthIcon className="text-teal-500" />, color: 'bg-teal-50' },
    { title: 'Total Visits', value: 18, sub: '+1 this month', icon: <HistoryIcon className="text-blue-500" />, color: 'bg-blue-50' },
    { title: 'Certificates Ready', value: 2, sub: 'Available', icon: <DescriptionIcon className="text-purple-500" />, color: 'bg-purple-50' },
    { title: 'Unread Notifications', value: 2, sub: 'New', icon: <NotificationsIcon className="text-orange-500" />, color: 'bg-orange-50' },
  ];

  const appointments = [
    { date: '24', month: 'MAR', type: 'General Check-up', doctor: 'Dr. Syafiqah', location: 'Room 3', time: '10:30 AM', status: 'Confirmed' },
    { date: '28', month: 'MAR', type: 'Blood Test Follow-up', doctor: 'Dr. Rahman', location: 'Lab B', time: '2:00 PM', status: 'Pending' },
    { date: '02', month: 'APR', type: 'Dental Screening', doctor: 'Dr. Liyana', location: 'Dental Wing', time: '11:00 AM', status: 'Pending' },
  ];

  const notifications = [
    { text: 'Your appointment on 24 Mar is confirmed. Please arrive 10 min early.', time: '2 hours ago', unread: true },
    { text: 'Reminder: Complete your health profile — emergency contact missing.', time: 'Yesterday', unread: true },
    { text: 'Medical certificate for 15 Mar visit is ready for download.', time: '3 days ago', unread: false },
  ];

  return (
    <StudentLayout title="Dashboard" subtitle="Welcome back, Student!">
      <div className="space-y-8">
        {/* Queue Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0d9488] via-[#0f766e] to-[#115e59] rounded-[2rem] p-10 text-white shadow-2xl shadow-teal-900/30 relative overflow-hidden group"
        >
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-black/10 rounded-full blur-3xl"></div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="bg-white/10 backdrop-blur-xl rounded-[1.5rem] p-8 text-center border border-white/20 min-w-[200px] shadow-inner">
              <p className="text-[11px] uppercase tracking-[0.2em] font-black text-teal-200/80">Your Queue Number</p>
              <h2 className="text-7xl font-black mt-2 tracking-tighter">47</h2>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 text-teal-50">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
                </div>
                <p className="text-lg font-bold tracking-tight">Currently serving: <span className="text-white px-2 py-0.5 bg-white/10 rounded-md">Token 44</span></p>
              </div>
              <p className="text-base text-teal-100/70 mt-3 font-medium">📍 Room 3 • Dr. Syafiqah • Est. wait ~15 min</p>
            </div>

            <Link to="/queue">
              <button className="bg-white text-[#115e59] px-8 py-4 rounded-2xl font-black text-sm hover:bg-teal-50 transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] active:scale-95 uppercase tracking-wider">
                View Live Queue
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${stat.color} w-10 h-10 rounded-2xl flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.color} text-slate-500`}>
                  {stat.sub}
                </span>
              </div>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Lower Grid: Appointments and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">Upcoming Appointments</h2>
              <Link to="/appointments">
                <button className="text-[11px] font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                  View All
                </button>
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.map((apt, idx) => (
                <div key={idx} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                  <div className="text-center min-w-[50px]">
                    <p className="text-lg font-black text-teal-600">{apt.date}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{apt.month}</p>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{apt.type}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {apt.doctor} • {apt.location} • {apt.time}
                    </p>
                  </div>

                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold ${apt.status === 'Confirmed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
                    }`}>
                    {apt.status === 'Confirmed' ? <CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> : <AccessTimeIcon sx={{ fontSize: 14 }} />}
                    {apt.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
              <button className="text-[11px] font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                See All
              </button>
            </div>

            <div className="space-y-6">
              {notifications.map((notif, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${notif.unread ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'border border-slate-200'}`}></div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.text}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="flex justify-center pt-4">
          <Link to="/medical/status">
            <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">
              Recent Visits <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </button>
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
