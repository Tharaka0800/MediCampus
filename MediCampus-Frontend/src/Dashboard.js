import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
//comment for check git error
  // Fetch student data and notifications from Backend!!!!!!!
  useEffect(() => {
    // Replace with your actual student registration number
    const studentId = "ST999"; 
    
    fetch(`http://localhost:5000/api/student/profile/${studentId}`)
      .then(res => res.json())
      .then(data => setProfile(data));

    fetch(`http://localhost:5000/api/notifications/${studentId}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);
//comment to check
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Student Health Dashboard</h1>
      
      {/* Profile Section */}
      <section style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
        <h2>Personal Health Profile</h2>
        {profile ? (
          <div>
            <p><strong>Name:</strong> {profile.studentName}</p>
            <p><strong>Emergency Contact:</strong> {profile.emergencyContact.name} ({profile.emergencyContact.phoneNumber})</p>
            <p><strong>Allergies:</strong> {profile.allergies}</p>
          </div>
        ) : <p>Loading Profile...</p>}
      </section>

      {/* Notifications Section */}
      <section style={{ border: '1px solid #ddd', padding: '15px' }}>
        <h2>Smart Notifications & Reminders</h2>
        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <div key={index} style={{ background: '#f9f9f9', padding: '10px', margin: '5px 0' }}>
              <strong>{note.type}:</strong> {note.message}
            </div>
          ))
        ) : <p>No new notifications.</p>}
      </section>
    </div>
  );
};

export default Dashboard;