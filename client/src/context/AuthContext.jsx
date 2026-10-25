import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = 'http://localhost:5001/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved user and token from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('student_user');
    const token = localStorage.getItem('student_token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login action
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const userData = response.data;

      localStorage.setItem('student_token', userData.token);
      localStorage.setItem('student_user', JSON.stringify({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        rollNumber: userData.rollNumber,
        branch: userData.branch
      }));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  // Register action
  const register = async (name, email, password, rollNumber, branch) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        rollNumber,
        branch
      });
      const userData = response.data;

      localStorage.setItem('student_token', userData.token);
      localStorage.setItem('student_user', JSON.stringify({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        rollNumber: userData.rollNumber,
        branch: userData.branch
      }));

      setUser(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('student_token');
    localStorage.removeItem('student_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
