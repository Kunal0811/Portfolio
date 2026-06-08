import React, { useEffect, useState } from 'react'

const DeveloperTemplate = ({ data }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const { personalInfo: pi = {}, skills = [], experience = [], projects = [], education = [], certifications = [], languages = [], achievements = [] } = data

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: '#e2e8f0', fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 2px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(56,189,248,0.2)} 50%{box-shadow:0 0 40px rgba(56,189,248,0.5)} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .fade-up { animation: fade-up 0.7s ease forwards; }
        .d1{animation-delay:0.1s} .d2{animation-delay:0.2s} .d3{animation-delay:0.3s} .d4{animation-delay:0.4s} .d5{animation-delay:0.5s} .d6{animation-delay:0.6s}
        .skill-chip { transition: all 0.2s; cursor: default; }
        .skill-chip:hover { background: rgba(56,189,248,0.2) !important; transform: translateY(-2px); }
        .proj-card { transition: all 0.25s; }
        .proj-card:hover { transform: translateY(-4px); border-color: rgba(56,189,248,0.4) !important; }
        a { color: #38bdf8; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* Scanline effect */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)', animation: 'scan 4s linear infinite', zIndex: 50, pointerEvents: 'none' }} />

      {/* Grid background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Header */}
        <header className="fade-up d1" style={{ marginBottom: '64px', opacity: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '4px', padding: '6px 14px', marginBottom: '20px', fontFamily: 'monospace' }}>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{'>_'}</span>
            <span style={{ color: '#64748b', fontSize: '13px' }}>init portfolio --user="{pi.name || 'Developer'}"</span>
            <span style={{ color: '#38bdf8', animation: 'blink 1s infinite', fontWeight: 700 }}>█</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '12px' }}>
            {pi.name || 'Your Name'}
          </h1>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: '#38bdf8', fontWeight: 500, marginBottom: '20px' }}>
            <span style={{ color: '#475569' }}>// </span>{pi.role || 'Software Engineer'}
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.8, maxWidth: '600px', marginBottom: '28px' }}>{pi.bio}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {pi.email && <a href={`mailto:${pi.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 14px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>✉ {pi.email}</a>}
            {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '6px', padding: '8px 14px', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>⌨ GitHub</a>}
            {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '6px', padding: '8px 14px', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>🔗 LinkedIn</a>}
            {pi.website && <a href={pi.website.startsWith('http') ? pi.website : `https://${pi.website}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '6px', padding: '8px 14px', color: '#38bdf8', fontSize: '13px', fontWeight: 600 }}>🌐 Website</a>}
          </div>
        </header>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="fade-up d2" style={{ marginBottom: '56px', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{'{ '}</span>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>skills</h3>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{' }'}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {skills.map((s, i) => (
                <span key={i} className="skill-chip" style={{ background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#7dd3fc', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="fade-up d3" style={{ marginBottom: '56px', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{'[ '}</span>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>experience</h3>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{' ]'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {experience.map((e, i) => (
                <div key={i} style={{ borderLeft: '2px solid rgba(56,189,248,0.3)', paddingLeft: '20px', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px rgba(56,189,248,0.6)' }} />
                  <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '16px', marginBottom: '2px' }}>{e.role}</div>
                  <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600, marginBottom: '8px' }}>{e.company} <span style={{ color: '#475569', fontWeight: 400 }}>• {e.duration}</span></div>
                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7 }}>{e.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="fade-up d4" style={{ marginBottom: '56px', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{'<'}</span>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>projects</h3>
              <span style={{ color: '#38bdf8', fontSize: '18px', fontWeight: 700 }}>{'/>'}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {projects.map((p, i) => (
                <div key={i} className="proj-card" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: 700, color: '#f8fafc', fontSize: '15px' }}>{p.title}</h4>
                    {p.link && <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontSize: '16px', flexShrink: 0 }}>↗</a>}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, marginBottom: '12px' }}>{p.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.tags?.map((t, j) => <span key={j} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="fade-up d5" style={{ marginBottom: '40px', opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>// </span>
              <h3 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>education</h3>
            </div>
            {education.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{e.degree}</div>
                  <div style={{ color: '#64748b', fontSize: '13px' }}>{e.school}</div>
                </div>
                <span style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '4px', padding: '2px 8px', fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>{e.year}</span>
              </div>
            ))}
          </section>
        )}

        {/* Extras row */}
        {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
          <section className="fade-up d6" style={{ opacity: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {certifications.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>CERTIFICATIONS</div>
                {certifications.map((c, i) => <div key={i} style={{ color: '#64748b', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>▸ {c}</div>)}
              </div>
            )}
            {languages.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>LANGUAGES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {languages.map((l, i) => <span key={i} style={{ background: 'rgba(56,189,248,0.08)', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', color: '#7dd3fc', fontWeight: 600 }}>{l}</span>)}
                </div>
              </div>
            )}
            {achievements.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' }}>
                <div style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>ACHIEVEMENTS</div>
                {achievements.map((a, i) => <div key={i} style={{ color: '#64748b', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>🏆 {a}</div>)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default DeveloperTemplate