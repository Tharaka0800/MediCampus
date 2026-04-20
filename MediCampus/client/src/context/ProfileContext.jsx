import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/student';

export const ProfileProvider = ({ children }) => {
  const [profile, setProfileState] = useState(null);
  const [identifier, setIdentifier] = useState(localStorage.getItem('studentIdentifier') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Read Profile
  const fetchProfile = async (idToFetch) => {
    const id = idToFetch || identifier;
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      setProfileState(response.data.profile);
      setIdentifier(id);
      localStorage.setItem('studentIdentifier', id);
    } catch (err) {
      console.error("Error fetching profile:", err);
      // Wait to set error, might be not found (404)
      if (err.response && err.response.status === 404) {
        setProfileState(null); // Explicitly null if not found
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Create / Update Profile
  const createOrUpdateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      if (profile) {
        // Update (PUT)
        const response = await axios.put(`${API_BASE_URL}/${identifier || profileData.registrationNumber}`, profileData);
        setProfileState(response.data.profile);
      } else {
        // Create (POST)
        const response = await axios.post(`${API_BASE_URL}`, profileData);
        setProfileState(response.data.profile);
        setIdentifier(response.data.profile.registrationNumber);
        localStorage.setItem('studentIdentifier', response.data.profile.registrationNumber);
      }
      return true; // Success
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.message || err.message);
      return false; // Failed
    } finally {
      setLoading(false);
    }
  };

  // Delete Profile
  const deleteProfile = async () => {
    if (!identifier) return false;
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE_URL}/${identifier}`);
      setProfileState(null);
      setIdentifier(null);
      localStorage.removeItem('studentIdentifier');
      return true;
    } catch (err) {
      console.error("Error deleting profile:", err);
      setError(err.response?.data?.message || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfileState(null);
    setIdentifier(null);
    localStorage.removeItem('studentIdentifier');
  };

  // Auto-fetch if identifier exists in localStorage on mount
  useEffect(() => {
    if (identifier) {
      fetchProfile(identifier);
    }
  }, []); // Only run once on mount

  return (
    <ProfileContext.Provider value={{ 
        profile, 
        setProfile: setProfileState, // kept for backward compatibility if needed temporarily
        identifier,
        loading, 
        error, 
        fetchProfile, 
        createOrUpdateProfile, 
        deleteProfile,
        logout,
        setIdentifier
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
