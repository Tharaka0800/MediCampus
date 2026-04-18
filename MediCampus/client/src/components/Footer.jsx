import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-teal-dark to-[#064e3b] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center backdrop-blur">
                <svg viewBox="0 0 26 26" fill="none" width="20" height="20">
                  <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                  <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
                  <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
                </svg>
              </div>
              <span className="font-serif text-lg">Medi<span className="opacity-60 italic">Campus</span></span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              A comprehensive student health management platform for modern university campuses.
            </p>
          </div>

          {/* Students */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Students</h4>
            <ul className="space-y-2">
              {[
                ['/dashboard', 'Health Dashboard'],
                ['/book-appointment', 'Book Appointment'],
                ['/events', 'Health Events'],
                ['/emergency', 'Emergency SOS'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-white/60 hover:text-white transition-colors no-underline">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Staff */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Staff</h4>
            <ul className="space-y-2">
              {[
                ['/doctor/login', 'Doctor Portal'],
                ['/admin/login', 'Admin Login'],
                ['/queue/public', 'Live Queue Display'],
                ['/verify-certificate', 'Verify Certificate'],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-white/60 hover:text-white transition-colors no-underline">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Emergency</h4>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span>📞</span> Campus Clinic: <strong className="text-white/90">011-123 4567</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>🚑</span> Emergency: <strong className="text-white/90">999</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span> clinic@campus.edu.my
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {year} MediCampus — Student Health Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Help Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
