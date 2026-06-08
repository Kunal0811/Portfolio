import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const observerRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: '⚡', title: 'Instant AI Generation', desc: 'Upload your PDF resume and let Gemini AI extract every detail — skills, experience, projects — in under 10 seconds.', color: '#f59e0b' },
    { icon: '📝', title: 'Manual Form Builder', desc: 'Prefer typing? Use our guided multi-step form to build your portfolio section by section with zero friction.', color: '#3b82f6' },
    { icon: '🎨', title: '3 Stunning Templates', desc: 'Dark Terminal for devs, Glass Modern for creatives, Bold Editorial for leaders. Switch anytime with one click.', color: '#8b5cf6' },
    { icon: '🔗', title: 'Instant Public Link', desc: 'Every portfolio gets a unique shareable URL. Share it on LinkedIn, in job applications, or anywhere online.', color: '#10b981' },
    { icon: '✏️', title: 'Live Editing', desc: 'Update your portfolio anytime. Re-upload a resume or go back and tweak the form — your link stays the same.', color: '#ef4444' },
    { icon: '📱', title: 'Mobile First', desc: 'Every template is fully responsive. Your portfolio looks stunning on phones, tablets, and desktops.', color: '#06b6d4' },
  ];

  const templates = [
    { name: 'Dark Terminal', desc: 'Perfect for developers', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#38bdf8', tag: 'DEV' },
    { name: 'Glass Modern', desc: 'For designers & creatives', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#fff', tag: 'CREATIVE' },
    { name: 'Bold Editorial', desc: 'For managers & leaders', bg: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', accent: '#212529', tag: 'PRO', light: true },
  ];

  const steps = [
    { n: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card required.' },
    { n: '02', title: 'Add Your Details', desc: 'Upload a PDF resume OR fill our smart form — your choice.' },
    { n: '03', title: 'Pick a Template', desc: 'Preview all 3 templates and choose the one that fits your vibe.' },
    { n: '04', title: 'Share Your Link', desc: 'Copy your unique URL and paste it everywhere. That\'s it.' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#06061a', color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        .fade-up { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up-d1 { transition-delay: 0.1s; }
        .fade-up-d2 { transition-delay: 0.2s; }
        .fade-up-d3 { transition-delay: 0.3s; }
        .fade-up-d4 { transition-delay: 0.4s; }
        .fade-up-d5 { transition-delay: 0.5s; }
        .fade-up-d6 { transition-delay: 0.6s; }

        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.8), 0 0 80px rgba(99,102,241,0.3); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes gradient-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes particle-float { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(-20px) scale(1); opacity: 0; } }
        @keyframes hero-text { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes badge-pop { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes line-grow { from { width: 0; } to { width: 100%; } }

        .hero-word { display: inline-block; animation: hero-text 0.8s ease forwards; opacity: 0; }
        .cta-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(99,102,241,0.4) !important; }
        .outline-btn:hover { background: rgba(255,255,255,0.08) !important; transform: translateY(-2px); }
        .feature-card { transition: transform 0.3s ease, border-color 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); }
        .template-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
        .template-card:hover { transform: scale(1.03); }
        .step-card { transition: background 0.3s ease; }
        .step-card:hover { background: rgba(255,255,255,0.07) !important; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #818cf8 !important; }
      `}</style>

      {/* Animated Background Particles */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            background: ['#6366f1','#8b5cf6','#3b82f6','#06b6d4'][i % 4],
            borderRadius: '50%',
            left: `${(i * 8.5) % 100}%`,
            animation: `particle-float ${8 + (i * 1.3)}s linear ${i * 0.7}s infinite`,
            opacity: 0.5,
          }} />
        ))}
      </div>

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: '64px',
        background: scrollY > 20 ? 'rgba(6,6,26,0.92)' : 'transparent',
        backdropFilter: scrollY > 20 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 20 ? '1px solid rgba(255,255,255,0.07)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>✦</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '18px', color: '#fff' }}>Portfolify AI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#features" className="nav-link" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Features</a>
          <a href="#templates" className="nav-link" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>Templates</a>
          <a href="#how" className="nav-link" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>How it works</a>
          <Link to="/login" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none', padding: '8px 16px' }} className="nav-link">Sign In</Link>
          <Link to="/register" className="cta-btn" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', padding: '9px 20px', borderRadius: '10px' }}>Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 5% 80px' }}>
        {/* Glow blob */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px', animation: 'badge-pop 0.6s ease 0.2s forwards', opacity: 0 }}>
          <span style={{ width: '6px', height: '6px', background: '#6366f1', borderRadius: '50%', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.05em' }}>POWERED BY GOOGLE GEMINI AI</span>
        </div>

        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(42px, 7vw, 84px)', lineHeight: 1.08, maxWidth: '900px', marginBottom: '28px', letterSpacing: '-0.02em' }}>
          <span className="hero-word" style={{ animationDelay: '0.4s', color: '#fff' }}>Your resume.&nbsp;</span>
          <span className="hero-word" style={{ animationDelay: '0.6s', background: 'linear-gradient(135deg, #818cf8, #c084fc, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Transformed</span>
          <span className="hero-word" style={{ animationDelay: '0.8s', color: '#fff' }}>&nbsp;into a</span>
          <br />
          <span className="hero-word" style={{ animationDelay: '1s', color: '#fff' }}>stunning portfolio.&nbsp;</span>
          <span className="hero-word" style={{ animationDelay: '1.2s', color: '#64748b' }}>In seconds.</span>
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8', maxWidth: '560px', lineHeight: 1.7, marginBottom: '40px', animation: 'hero-text 0.8s ease 1.4s forwards', opacity: 0 }}>
          Upload a PDF or fill a quick form. Pick a template. Get a beautiful, shareable portfolio link instantly.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', animation: 'hero-text 0.8s ease 1.6s forwards', opacity: 0 }}>
          <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, boxShadow: '0 10px 30px rgba(99,102,241,0.3)' }}>
            Build My Portfolio Free ✦
          </Link>
          <a href="#templates" className="outline-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0', textDecoration: 'none', padding: '16px 32px', borderRadius: '14px', fontSize: '16px', fontWeight: 600, transition: 'all 0.2s' }}>
            View Templates →
          </a>
        </div>

        {/* Floating stats */}
        <div style={{ display: 'flex', gap: '40px', marginTop: '72px', animation: 'hero-text 0.8s ease 1.8s forwards', opacity: 0 }}>
          {[['⚡ 10s', 'AI generation'], ['🎨 3', 'Templates'], ['🔗 Free', 'Public link']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>{val}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '100px 5%' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div id="feat-head" data-animate className={`fade-up ${isVisible['feat-head'] ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8', letterSpacing: '0.08em' }}>FEATURES</span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Everything you need to stand out</h2>
            <p style={{ color: '#64748b', fontSize: '18px', marginTop: '12px' }}>Built for developers, designers, and professionals alike.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {features.map((f, i) => (
              <div key={f.title} id={`feat-${i}`} data-animate className={`fade-up fade-up-d${(i % 3) + 1} feature-card ${isVisible[`feat-${i}`] ? 'visible' : ''}`}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', cursor: 'default' }}>
                <div style={{ width: '48px', height: '48px', background: `${f.color}18`, border: `1px solid ${f.color}30`, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" style={{ position: 'relative', zIndex: 1, padding: '100px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div id="tmpl-head" data-animate className={`fade-up ${isVisible['tmpl-head'] ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa', letterSpacing: '0.08em' }}>TEMPLATES</span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>3 unique styles. All stunning.</h2>
            <p style={{ color: '#64748b', fontSize: '18px', marginTop: '12px' }}>Pick the one that matches your personality. Switch anytime.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {templates.map((t, i) => (
              <div key={t.name} id={`tmpl-${i}`} data-animate className={`fade-up fade-up-d${i + 1} template-card ${isVisible[`tmpl-${i}`] ? 'visible' : ''}`}
                style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ height: '200px', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
                  <div style={{ background: t.light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: t.accent, fontFamily: 'Syne, sans-serif' }}>Alex Chen</div>
                    <div style={{ fontSize: '12px', color: t.light ? '#666' : 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Full Stack Engineer</div>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: t.light ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '3px 8px', fontSize: '10px', fontWeight: 800, color: t.accent, letterSpacing: '0.08em' }}>{t.tag}</div>
                </div>
                <div style={{ padding: '20px 24px', background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '16px' }}>{t.name}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ position: 'relative', zIndex: 1, padding: '100px 5%' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div id="how-head" data-animate className={`fade-up ${isVisible['how-head'] ? 'visible' : ''}`} style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', letterSpacing: '0.08em' }}>HOW IT WORKS</span>
            </div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>From zero to live in 2 minutes</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {steps.map((s, i) => (
              <div key={s.n} id={`step-${i}`} data-animate className={`fade-up fade-up-d${i + 1} step-card ${isVisible[`step-${i}`] ? 'visible' : ''}`}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.04)', position: 'absolute', top: '8px', right: '16px', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#6366f1', marginBottom: '12px', lineHeight: 1 }}>{s.n}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 5%' }}>
        <div id="cta" data-animate className={`fade-up ${isVisible['cta'] ? 'visible' : ''}`} style={{ maxWidth: '800px', margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '28px', padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: '16px', letterSpacing: '-0.02em' }}>Ready to impress? Start for free.</h2>
          <p style={{ color: '#94a3b8', fontSize: '17px', marginBottom: '36px', maxWidth: '400px', margin: '0 auto 36px' }}>No credit card. No complex setup. Your portfolio, live in minutes.</p>
          <Link to="/register" className="cta-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, boxShadow: '0 10px 30px rgba(99,102,241,0.4)' }}>
            Build My Portfolio Now ✦
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '40px 5%', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>✦</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '15px', color: '#fff' }}>Portfolify AI</span>
        </div>
        <span style={{ fontSize: '13px', color: '#475569' }}>© {new Date().getFullYear()} Portfolify AI. Built with React & Node.js.</span>
      </footer>
    </div>
  );
};

export default LandingPage;