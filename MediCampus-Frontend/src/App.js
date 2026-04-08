import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import CreateProfile from './pages/CreateProfile';
import StudentHealthDashboard from './pages/StudentHealthDashboard';
import { ProfileProvider } from './context/ProfileContext';
import './App.css';

function App() {
  return (
    <ProfileProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/dashboard" element={<StudentHealthDashboard />} />
          </Routes>
        </div>
      </Router>
    </ProfileProvider>
  );
}

export default App;

//this comment added to check gitdesktop