import { Link, useLocation } from 'react-router-dom';

export default function Header({ role = 'student', userName = '' }) {
  const location = useLocation();
  const initials = userName ? userName.split(' ').map(w => w[0]).join('').toUpperCase() : '?';

  const navLinks = {
    student: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/book-appointment', label: 'Appointments' },
      { path: '/events', label: 'Events' },
      { path: '/emergency', label: 'SOS', emergency: true },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard' },
    ],
    admin: [
      { path: '/admin/queue', label: 'Queue Console' },
      { path: '/admin/queue', label: 'Dashboard' },
    ],
  };

  const links = navLinks[role] || navLinks.student;

  return (
    <header className="bg-white border-b border-mc-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 bg-gradient-to-br from-teal to-teal-dark rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 26 26" fill="none" width="18" height="18">
                <path d="M13 3C13 3 7 7 7 13.5C7 17.09 9.69 20 13 20C16.31 20 19 17.09 19 13.5C19 7 13 3 13 3Z" fill="white" fillOpacity="0.9"/>
                <rect x="10" y="10" width="6" height="1.5" rx="0.75" fill="#0d9488"/>
                <rect x="12.25" y="8" width="1.5" height="6" rx="0.75" fill="#0d9488"/>
              </svg>
            </div>
            <div className="font-serif text-lg text-mc-text tracking-tight">
              Medi<span className="text-teal italic">Campus</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <Link
                key={link.path + link.label}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all no-underline ${
                  link.emergency
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 font-semibold'
                    : location.pathname === link.path
                      ? 'bg-teal-bg text-teal-dark font-semibold'
                      : 'text-mc-muted hover:text-mc-text hover:bg-gray-50'
                }`}
              >
                {link.emergency && <span className="mr-1">🚨</span>}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link
              to="/verify-certificate"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal bg-teal-bg border border-green-200 rounded-full no-underline hover:bg-green-100 transition-all"
            >
              <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse" />
              Verify Certificate
            </Link>
            {userName && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-300 to-teal rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
