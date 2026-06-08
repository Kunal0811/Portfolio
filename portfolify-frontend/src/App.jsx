import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio'; // <-- Import it here
import DeveloperPortfolio from './templates/DeveloperTemplate';
import ModernPortfolio from './templates/ModernTemplate';

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
        {/* Template Previews */}
        <Route path="/template/developer" element={<DeveloperPortfolio />} />
        <Route path="/template/modern" element={<ModernPortfolio />} />
      </Routes>
    </Router>
  );
}

export default App;