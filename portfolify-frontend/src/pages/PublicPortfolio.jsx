import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DeveloperTemplate from '../templates/DeveloperTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';

const TEMPLATE_MAP = {
  developer: DeveloperTemplate,
  modern: ModernTemplate,
  creative: CreativeTemplate,
};

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/portfolios/user/${userId}`)
      .then(r => setPortfolioData(r.data))
      .catch(() => setError("We couldn't find this portfolio."))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06061a' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (error || !portfolioData) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#06061a', padding: '24px', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 40px', maxWidth: '380px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>Portfolio Not Found</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '28px', lineHeight: 1.6 }}>{error}</p>
        <Link to="/" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', textDecoration: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 700 }}>Go Home</Link>
      </div>
    </div>
  );

  const templateKey = portfolioData.template || 'developer';
  const TemplateComponent = TEMPLATE_MAP[templateKey] || DeveloperTemplate;
  const isLight = templateKey === 'creative';

  const barBg = isLight ? 'rgba(250,250,248,0.88)' : 'rgba(8,12,20,0.88)';
  const barBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const barText = isLight ? '#1c1c1e' : '#cdd6f4';
  const barMuted = isLight ? '#888' : '#64748b';

  return (
    <div style={{ position: 'relative' }}>
      {/* Floating attribution + share bar */}
      <div style={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
        background: barBg, backdropFilter: 'blur(16px)',
        border: `1px solid ${barBorder}`, borderRadius: '100px',
        padding: '8px 8px 8px 20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        fontFamily: 'DM Sans, sans-serif',
        whiteSpace: 'nowrap',
      }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: barMuted }}>
          Made with{' '}
          <Link to="/" style={{ color: isLight ? '#6366f1' : '#818cf8', textDecoration: 'none', fontWeight: 700 }}>
            Portfolify AI
          </Link>
          {' '}✦
        </span>
        <button onClick={handleCopy} style={{
          background: isLight ? '#1c1c1e' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          color: '#fff', border: 'none', borderRadius: '100px',
          padding: '8px 18px', fontSize: '13px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
        }}>
          {copied ? '✓ Copied!' : '🔗 Share'}
        </button>
      </div>

      <TemplateComponent data={portfolioData} />
    </div>
  );
};

export default PublicPortfolio;