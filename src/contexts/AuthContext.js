// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Must be inside the component

  // Function to fetch current user
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        logout(); // If token is invalid, logout the user
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem('token', token);
    fetchUser();
    navigate('/'); // Redirect to home after login
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};