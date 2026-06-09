import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';
import DeveloperTemplate from './templates/DeveloperTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/portfolio/:userId" element={<PublicPortfolio />} />
        {/* Template preview routes */}
        <Route path="/template/developer" element={<DeveloperTemplate />} />
        <Route path="/template/modern" element={<ModernTemplate />} />
        <Route path="/template/creative" element={<CreativeTemplate />} />
      </Routes>
    </Router>
  );
}

export default App;