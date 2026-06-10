import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import ProtectedRoute from './ProtectedRoute';

const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06061a', gap: '16px', fontFamily: 'DM Sans, sans-serif' }}>
    <div style={{ fontSize: '72px', fontWeight: 800, color: 'rgba(255,255,255,0.1)' }}>404</div>
    <p style={{ color: '#64748b', fontSize: '16px' }}>Page not found</p>
    <a href="/" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>← Back to home</a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Public portfolio routes */}
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
        <Route path="/u/:username" element={<PublicPortfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;