import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import DeveloperTemplate from '../templates/DeveloperTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const TEMPLATE_MAP = {
  developer: DeveloperTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
};

const PublicPortfolio = () => {
  const { userId, username } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        let response;
        if (username) {
          response = await api.get(`/api/portfolios/u/${username}`);
        } else {
          response = await api.get(`/api/portfolios/user/${userId}`);
        }
        setPortfolioData(response.data);
      } catch (err) {
        setError("We couldn't find a portfolio at this link.");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId, username]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06061a', gap: '16px' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: '#64748b', fontSize: '15px' }}>Loading portfolio...</p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#06061a', padding: '24px' }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 40px', maxWidth: '400px', width: '100%', fontFamily: 'DM Sans, sans-serif' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>Portfolio Not Found</h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>{error}</p>
          <Link to="/" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>Return to Home</Link>
        </div>
      </div>
    );
  }

  const templateKey = portfolioData.template || 'developer';
  const TemplateComponent = TEMPLATE_MAP[templateKey] || DeveloperTemplate;

  return <TemplateComponent data={portfolioData} accentColor={portfolioData.accentColor} />;
};

export default PublicPortfolio;