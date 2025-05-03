import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        // Check if storedUser is a valid JSON string
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          setToken(storedToken);
          fetchCartCount(storedToken);
        } else {
          // Clear invalid data from localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setCartCount(0);
      }
    }
  }, []);

  const fetchCartCount = async (authToken) => {
    try {
      const response = await fetch('${BASE_URL}/api/cart', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (data.status === 'success' && data.data?.items) {
        const count = data.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      console.error('Failed to fetch cart count:', err);
    }
  };

  const login = (userData, token) => {
    if (!userData || typeof userData !== 'object') {
      console.error('Invalid user data provided to login:', userData);
      return;
    }
    if (!token) {
      console.error('No token provided to login');
      return;
    }
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    fetchCartCount(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCartCount(0);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cartCount, fetchCartCount }}>
      {children}
    </AuthContext.Provider>
  );
};