import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DeveloperTemplate from './templates/DeveloperTemplate'
import ModernTemplate from './templates/ModernTemplate' // <-- Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preview/developer" element={<DeveloperTemplate />} />
        <Route path="/preview/modern" element={<ModernTemplate />} /> {/* <-- Add this route */}
      </Routes>
    </Router>
  )
}

export default App