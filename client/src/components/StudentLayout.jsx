import React from 'react';
import StudentSidebar from './StudentSidebar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const StudentLayout = ({ children, title = 'Dashboard', subtitle = 'MediCampus - Student Health Portal' }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <StudentSidebar user={{ name: 'Student', id: 'Unknown ID' }} />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-3.5 flex items-center justify-between border-b border-slate-200/60">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">{title}</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <NotificationsNoneIcon sx={{ fontSize: 22 }} />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
              <PersonOutlineIcon sx={{ fontSize: 22 }} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-8 flex-1">
          {children}
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-slate-200/60 bg-white/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              &copy; 2024 <span className="text-teal-600">MediCampus</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Privacy Policy</a>
              <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Terms of Service</a>
              <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-widest">Help Center</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default StudentLayout;
