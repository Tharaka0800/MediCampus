import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CreateProfile from './pages/CreateProfile';
import StudentHealthDashboard from './pages/StudentHealthDashboard';
import BookAppointment from './pages/BookAppointment';
import AdminQueueConsole from './pages/AdminQueueConsole';
import PublicQueueDisplay from './pages/PublicQueueDisplay';
import DoctorLogin from './pages/DoctorLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import CertificateVerify from './pages/CertificateVerify';
import EventPortal from './pages/EventPortal';
import EmergencyCenter from './pages/EmergencyCenter';
import { ProfileProvider } from './context/ProfileContext';
import CertificateDocument from './pages/CertificateDocument';
import './App.css';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Student Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/dashboard" element={<StudentHealthDashboard />} />
            <Route path="/certificate/:id/download" element={<CertificateDocument />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/events" element={<EventPortal />} />
            <Route path="/emergency" element={<EmergencyCenter />} />

            {/* Doctor Routes */}
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/queue" element={<AdminQueueConsole />} />
            <Route path="/admin/login" element={<AdminQueueConsole />} />

            {/* Public Routes */}
            <Route path="/queue/public" element={<PublicQueueDisplay />} />
            <Route path="/verify-certificate" element={<CertificateVerify />} />
          </Routes>
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App;

//this comment added to check gitdesktop