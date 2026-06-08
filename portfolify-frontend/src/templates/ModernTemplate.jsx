import React, { useEffect, useState } from 'react'

const ModernTemplate = ({ data }) => {
  const { personalInfo: pi = {}, skills = [], experience = [], projects = [], education = [], certifications = [], languages = [], achievements = [] } = data

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: 'linear-gradient(135deg, #667eea 0%, #764ba2 40%, #f64f59 100%)', backgroundAttachment: 'fixed' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .card { background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.18); border-radius: 24px; }
        .glass-tag { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 12px; font-size: 13px; color: rgba(255,255,255,0.9); font-weight: 600; backdrop-filter: blur(8px); }
        .proj-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 20px; transition: all 0.25s; backdrop-filter: blur(10px); }
        .proj-card:hover { background: rgba(255,255,255,0.12); transform: translateY(-4px); }
        .fade-up { animation: fade-up 0.7s ease forwards; opacity: 0; }
        .d1{animation-delay:0.1s} .d2{animation-delay:0.25s} .d3{animation-delay:0.4s} .d4{animation-delay:0.55s} .d5{animation-delay:0.7s}
        a { color: rgba(255,255,255,0.8); text-decoration: none; }
        a:hover { color: #fff; text-decoration: underline; }
      `}</style>

      {/* Background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', animation: 'float 6s ease infinite' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', animation: 'float 8s ease infinite 2s' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Hero card */}
        <div className="card fade-up d1" style={{ padding: '48px', marginBottom: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.3), #fff)' }} />
          
          {/* Avatar placeholder */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px', backdropFilter: 'blur(8px)' }}>
            {(pi.name || 'U')[0].toUpperCase()}
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 60px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>{pi.name || 'Your Name'}</h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: '20px' }}>{pi.role}</p>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.8 }}>{pi.bio}</p>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {pi.email && <a href={`mailto:${pi.email}`} className="glass-tag">✉ Email</a>}
            {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noopener noreferrer" className="glass-tag">⌨ GitHub</a>}
            {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noopener noreferrer" className="glass-tag">🔗 LinkedIn</a>}
            {pi.location && <span className="glass-tag">📍 {pi.location}</span>}
            {pi.website && <a href={pi.website.startsWith('http') ? pi.website : `https://${pi.website}`} target="_blank" rel="noopener noreferrer" className="glass-tag">🌐 Website</a>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="card fade-up d2" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: '16px' }}>SKILLS & EXPERTISE</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50px', padding: '6px 16px', fontSize: '13px', color: '#fff', fontWeight: 600, backdropFilter: 'blur(4px)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="card fade-up d3" style={{ padding: '32px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', marginBottom: '24px' }}>WORK EXPERIENCE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {experience.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '2px' }}>{e.role}</div>
                    <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '8px' }}>{e.company}</div>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{e.description}</p>
                  </div>
                  <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, whiteSpace: 'nowrap' }}>{e.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects grid */}
        {projects.length > 0 && (
          <div className="fade-up d4" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ padding: '32px 32px 20px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>FEATURED PROJECTS</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {projects.map((p, i) => (
                <div key={i} className="proj-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 700, color: '#fff', fontSize: '15px' }}>{p.title}</h4>
                    {p.link && <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>↗</a>}
                  </div>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '12px' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.tags?.map((t, j) => <span key={j} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education + Extras */}
        {(education.length > 0 || certifications.length > 0 || languages.length > 0) && (
          <div className="fade-up d5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {education.length > 0 && (
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: '16px' }}>EDUCATION</h3>
                {education.map((e, i) => (
                  <div key={i} style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: i < education.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{e.degree}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{e.school} {e.year && `· ${e.year}`}</div>
                  </div>
                ))}
              </div>
            )}
            {(certifications.length > 0 || languages.length > 0) && (
              <div className="card" style={{ padding: '28px' }}>
                {certifications.length > 0 && (
                  <div style={{ marginBottom: languages.length > 0 ? '20px' : 0 }}>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: '10px' }}>CERTIFICATIONS</h3>
                    {certifications.map((c, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', padding: '4px 0', fontWeight: 500 }}>• {c}</div>)}
                  </div>
                )}
                {languages.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', marginBottom: '10px' }}>LANGUAGES</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {languages.map((l, i) => <span key={i} className="glass-tag">{l}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModernTemplate