import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio'; // <-- Import it here

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* NEW: The Public Portfolio Route */}
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;