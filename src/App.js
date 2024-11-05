import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateSite from './pages/CreateSite';
import EditSite from './pages/EditSite';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use the authentication context

  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
          />
          <Route
            path="/create-site"
            element={isAuthenticated ? <CreateSite /> : <Navigate to="/" replace />}
          />
          <Route
            path="/edit-site/:id"
            element={isAuthenticated ? <EditSite /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </DndProvider>
  );
};

// Wrap the entire app with the AuthProvider
const WrappedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default WrappedApp;