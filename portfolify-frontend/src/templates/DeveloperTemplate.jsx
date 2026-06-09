import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const DeveloperTemplate = ({ data }) => {
  if (!data) return null;
  const { personalInfo: pi = {}, skills = [], experience = [], projects = [], education = [], certifications = [], languages = [], achievements = [] } = data;

  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [terminalLines, setTerminalLines] = useState([]);
  const [hoveredProject, setHoveredProject] = useState(null);
  const sectionRefs = useRef({});
  const containerRef = useRef(null);

  const sections = [
    { id: 'home', label: '~/', icon: '❯' },
    { id: 'skills', label: 'skills/', icon: '{}' },
    { id: 'experience', label: 'work/', icon: '[]' },
    { id: 'projects', label: 'projects/', icon: '</>' },
    { id: 'education', label: 'edu/', icon: '#' },
  ].filter(s => {
    if (s.id === 'experience') return experience.length > 0;
    if (s.id === 'projects') return projects.length > 0;
    if (s.id === 'education') return education.length > 0;
    if (s.id === 'skills') return skills.length > 0;
    return true;
  });

  // Typing animation
  const fullText = pi.role || 'Software Engineer';
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [fullText]);

  // Cursor blink
  useEffect(() => {
    const t = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  // Terminal boot sequence
  useEffect(() => {
    const lines = [
      { text: '$ init portfolio --user="' + (pi.name || 'Developer') + '"', delay: 200 },
      { text: '✓ Loading profile data...', delay: 600 },
      { text: '✓ ' + skills.length + ' skills indexed', delay: 1000 },
      { text: '✓ ' + experience.length + ' roles found', delay: 1400 },
      { text: '✓ ' + projects.length + ' projects deployed', delay: 1800 },
      { text: '✓ Portfolio ready.', delay: 2200 },
    ];
    lines.forEach(({ text, delay }) => {
      setTimeout(() => setTerminalLines(prev => [...prev, text]), delay);
    });
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4, rootMargin: '-10% 0px -50% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections.length]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const skillCategories = {
    'Languages': skills.filter(s => ['JavaScript','TypeScript','Python','Java','Go','Rust','C++','C#','Ruby','PHP','Swift','Kotlin'].some(l => s.toLowerCase().includes(l.toLowerCase()))),
    'Frameworks': skills.filter(s => ['React','Vue','Angular','Next','Nuxt','Express','Django','Flask','Spring','Laravel','Rails'].some(l => s.toLowerCase().includes(l.toLowerCase()))),
    'Tools': skills.filter(s => !['JavaScript','TypeScript','Python','Java','Go','Rust','C++','C#','Ruby','PHP','Swift','Kotlin','React','Vue','Angular','Next','Nuxt','Express','Django','Flask','Spring','Laravel','Rails'].some(l => s.toLowerCase().includes(l.toLowerCase()))),
  };
  // Flatten uncategorized back into whichever bucket works
  const allCategorized = Object.values(skillCategories).flat();
  const uncategorized = skills.filter(s => !allCategorized.includes(s));
  if (uncategorized.length > 0) skillCategories['Tools'] = [...skillCategories['Tools'], ...uncategorized];
  const cleanCategories = Object.entries(skillCategories).filter(([,v]) => v.length > 0);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080c14', color: '#cdd6f4', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #313244; border-radius: 2px; }
        
        .nav-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 500; color: #6c7086; border: none; background: transparent; font-family: inherit; text-align: left; transition: all 0.2s; }
        .nav-item:hover { color: #89b4fa; background: rgba(137,180,250,0.06); }
        .nav-item.active { color: #89b4fa; background: rgba(137,180,250,0.1); border-left: 2px solid #89b4fa; }
        .nav-icon { font-size: 11px; font-weight: 700; color: #89b4fa; width: 24px; text-align: center; flex-shrink: 0; }

        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes glow { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .section-title { font-size: 11px; font-weight: 700; color: #89b4fa; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 12px; }
        .section-title::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, rgba(137,180,250,0.3), transparent); }

        .skill-chip { background: rgba(137,180,250,0.06); border: 1px solid rgba(137,180,250,0.15); border-radius: 6px; padding: 6px 14px; font-size: 12px; color: #89b4fa; font-weight: 500; transition: all 0.2s; cursor: default; display: inline-block; }
        .skill-chip:hover { background: rgba(137,180,250,0.15); border-color: rgba(137,180,250,0.4); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(137,180,250,0.15); }

        .timeline-item { border-left: 1px solid rgba(137,180,250,0.2); padding-left: 24px; position: relative; padding-bottom: 32px; }
        .timeline-item:last-child { padding-bottom: 0; border-color: transparent; }
        .timeline-dot { position: absolute; left: -5px; top: 0; width: 9px; height: 9px; border-radius: 50%; background: #89b4fa; box-shadow: 0 0 0 3px rgba(137,180,250,0.15), 0 0 12px rgba(137,180,250,0.4); }

        .project-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; transition: all 0.3s; position: relative; overflow: hidden; cursor: default; }
        .project-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(137,180,250,0.05) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; }
        .project-card:hover { border-color: rgba(137,180,250,0.3); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(137,180,250,0.1); }
        .project-card:hover::before { opacity: 1; }

        .terminal-window { background: #0d1117; border: 1px solid #21262d; border-radius: 12px; overflow: hidden; }
        .terminal-bar { background: #161b22; border-bottom: 1px solid #21262d; padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
        .terminal-dot { width: 12px; height: 12px; border-radius: 50%; }
        .terminal-line { font-size: 13px; line-height: 1.8; color: #8b949e; padding: 2px 0; }
        .terminal-line.success { color: #3fb950; }
        .terminal-line.cmd { color: #58a6ff; }
        .terminal-prompt { color: #3fb950; margin-right: 8px; }

        .edu-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 24px; transition: all 0.2s; }
        .edu-card:hover { border-color: rgba(137,180,250,0.2); background: rgba(137,180,250,0.03); }

        .contact-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; text-decoration: none; color: #8b949e; font-size: 13px; transition: all 0.2s; font-family: inherit; }
        .contact-item:hover { border-color: rgba(137,180,250,0.3); color: #89b4fa; background: rgba(137,180,250,0.05); }

        .section-wrap { min-height: 100vh; padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; }
        @media(max-width:768px) { .section-wrap { padding: 60px 24px; } }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)', pointerEvents: 'none', zIndex: 1, opacity: 0.5 }} />

      {/* Fixed sidebar */}
      <aside style={{ position: 'fixed', top: 0, left: 0, width: '220px', height: '100vh', background: 'rgba(13,17,23,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '32px 16px', zIndex: 100 }}>
        {/* Logo */}
        <div style={{ marginBottom: '40px', paddingLeft: '4px' }}>
          <div style={{ fontSize: '11px', color: '#3fb950', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '4px' }}>PORTFOLIO v2.0</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#cdd6f4', letterSpacing: '-0.01em' }}>{pi.name?.split(' ')[0] || 'Dev'}<span style={{ color: '#89b4fa' }}>.</span></div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className={`nav-item ${activeSection === s.id ? 'active' : ''}`}>
              <span className="nav-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>

        {/* Status */}
        <div style={{ padding: '12px 16px', background: 'rgba(63,185,80,0.06)', border: '1px solid rgba(63,185,80,0.15)', borderRadius: '8px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3fb950', animation: 'glow 2s infinite' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#3fb950', letterSpacing: '0.1em' }}>AVAILABLE</span>
          </div>
          <div style={{ fontSize: '11px', color: '#6c7086' }}>Open to opportunities</div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: '220px', flex: 1, position: 'relative', zIndex: 2 }}>

        {/* ── HERO ── */}
        <section id="home" className="section-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Background grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(137,180,250,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(137,180,250,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0 }} />
          {/* Glow */}
          <div style={{ position: 'absolute', top: '30%', left: '-10%', width: '500px', height: '400px', background: 'radial-gradient(ellipse, rgba(137,180,250,0.06) 0%, transparent 70%)', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
            

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, color: '#cdd6f4', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '16px' }}>
              {pi.name || 'Your Name'}
            </motion.h1>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: '#89b4fa', fontWeight: 500, marginBottom: '24px', minHeight: '1.4em' }}>
              <span style={{ color: '#6c7086' }}>// </span>{typedText}<span style={{ opacity: cursorVisible ? 1 : 0, color: '#89b4fa' }}>█</span>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontSize: '16px', color: '#6c7086', lineHeight: 1.8, maxWidth: '540px', marginBottom: '40px' }}>
              {pi.bio}
            </motion.p>

            {/* Contact links */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '56px' }}>
              {pi.email && <a href={`mailto:${pi.email}`} className="contact-item">✉ {pi.email}</a>}
              {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noreferrer" className="contact-item">⌨ GitHub ↗</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="contact-item">🔗 LinkedIn ↗</a>}
              {pi.website && <a href={pi.website.startsWith('http') ? pi.website : `https://${pi.website}`} target="_blank" rel="noreferrer" className="contact-item">🌐 Website ↗</a>}
              {pi.location && <span className="contact-item">📍 {pi.location}</span>}
            </motion.div>

            
          </div>
        </section>

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section id="skills" className="section-wrap" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
              <div className="section-title">Technical Skills</div>

              {cleanCategories.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '720px' }}>
                  {cleanCategories.map(([cat, catSkills]) => (
                    <div key={cat}>
                      <div style={{ fontSize: '11px', color: '#6c7086', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '14px' }}>{cat.toUpperCase()}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {catSkills.map((s, i) => (
                          <motion.span key={i} className="skill-chip"
                            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            transition={{ delay: i * 0.04 }}>
                            {s}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '720px' }}>
                  {skills.map((s, i) => (
                    <motion.span key={i} className="skill-chip"
                      initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}>
                      {s}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Extras row */}
              {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '720px' }}>
                  {certifications.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ fontSize: '10px', color: '#89b4fa', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '10px' }}>CERTIFICATIONS</div>
                      {certifications.map((c, i) => <div key={i} style={{ fontSize: '12px', color: '#6c7086', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>▸ {c}</div>)}
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ fontSize: '10px', color: '#89b4fa', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '10px' }}>LANGUAGES</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {languages.map((l, i) => <span key={i} style={{ background: 'rgba(137,180,250,0.08)', border: '1px solid rgba(137,180,250,0.2)', borderRadius: '4px', padding: '3px 10px', fontSize: '12px', color: '#89b4fa' }}>{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ fontSize: '10px', color: '#89b4fa', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '10px' }}>ACHIEVEMENTS</div>
                      {achievements.map((a, i) => <div key={i} style={{ fontSize: '12px', color: '#6c7086', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>🏆 {a}</div>)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </section>
        )}

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <section id="experience" className="section-wrap">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
              <div className="section-title">Work Experience</div>
              <div style={{ maxWidth: '680px' }}>
                {experience.map((e, i) => (
                  <motion.div key={i} className="timeline-item"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                    <div className="timeline-dot" />
                    <div style={{ marginBottom: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '17px', fontWeight: 700, color: '#cdd6f4', marginBottom: '2px' }}>{e.role}</div>
                        <div style={{ fontSize: '13px', color: '#89b4fa', fontWeight: 500 }}>{e.company}</div>
                      </div>
                      <span style={{ background: 'rgba(137,180,250,0.08)', border: '1px solid rgba(137,180,250,0.15)', borderRadius: '4px', padding: '3px 10px', fontSize: '11px', color: '#6c7086', fontWeight: 500, whiteSpace: 'nowrap' }}>{e.duration}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#6c7086', lineHeight: 1.8, marginTop: '8px' }}>{e.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section id="projects" className="section-wrap" style={{ background: 'rgba(255,255,255,0.01)' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
              <div className="section-title">Featured Projects</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '900px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="project-card"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', color: '#3fb950', fontWeight: 700, letterSpacing: '0.08em' }}>PROJECT_{String(i + 1).padStart(2, '0')}</div>
                      {p.link && (
                        <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer"
                          style={{ color: '#6c7086', fontSize: '16px', textDecoration: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#89b4fa'} onMouseLeave={e => e.currentTarget.style.color = '#6c7086'}>↗</a>
                      )}
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#cdd6f4', marginBottom: '10px', letterSpacing: '-0.01em' }}>{p.title}</h3>
                    <p style={{ fontSize: '13px', color: '#6c7086', lineHeight: 1.75, marginBottom: '16px' }}>{p.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {p.tags?.map((t, j) => (
                        <span key={j} style={{ background: 'rgba(137,180,250,0.06)', border: '1px solid rgba(137,180,250,0.12)', borderRadius: '4px', padding: '2px 8px', fontSize: '11px', color: '#89b4fa', fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <section id="education" className="section-wrap">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
              <div className="section-title">Education</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '720px' }}>
                {education.map((e, i) => (
                  <motion.div key={i} className="edu-card"
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                    <div style={{ fontSize: '11px', color: '#3fb950', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>{e.year}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#cdd6f4', marginBottom: '4px' }}>{e.degree}</div>
                    <div style={{ fontSize: '13px', color: '#6c7086' }}>{e.school}</div>
                    {e.description && <div style={{ fontSize: '12px', color: '#6c7086', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.6 }}>{e.description}</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </main>
    </div>
  );
};

export default DeveloperTemplate;