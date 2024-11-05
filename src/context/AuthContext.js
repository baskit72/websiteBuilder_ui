import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Helper function to decode token and check expiration (for JWTs)
const isTokenExpired = (token) => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    return Date.now() >= exp * 1000; // Check if token is expired
  } catch (error) {
    console.error('Invalid token:', error);
    return true; // Treat invalid tokens as expired
  }
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  // Check for token in localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      setIsAuthenticated(true);
    } else {
      logout(); // Auto logout if token is invalid/expired
    }
    setLoading(false); // Stop loading once check is complete
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
