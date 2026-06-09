import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, LayoutTemplate } from 'lucide-react';
import DeveloperTemplate from '../templates/DeveloperTemplate'; // <-- Modular Import!

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolios/user/${userId}`);
        setPortfolioData(response.data);
      } catch (err) {
        setError("We couldn't locate an active public portfolio associated with this link.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPortfolio();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-bold">Assembling Live Portfolio...</h2>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Unreachable</h2>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition">Return to Homepage</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      {/* Dynamic Navigation Topbar */}
      <div className="max-w-5xl mx-auto mb-8 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
          <LayoutTemplate className="w-5 h-5" /> Portfolify AI
        </Link>
        <Link to="/register" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">
          Build Your Portfolio ✨
        </Link>
      </div>

      {/* Render the Modular Interactive Template and Inject data */}
      <DeveloperTemplate data={portfolioData} />
    </div>
  );
};

export default PublicPortfolio;