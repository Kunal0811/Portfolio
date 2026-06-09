import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const ModernTemplate = ({ data }) => {
  if (!data) return null;
  const { personalInfo: pi = {}, skills = [], experience = [], projects = [], education = [], certifications = [], languages = [], achievements = [] } = data;

  const [activeSection, setActiveSection] = useState('about');
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const navSections = ['about', 'skills', 'work', 'projects', 'education'].filter(s => {
    if (s === 'work') return experience.length > 0;
    if (s === 'projects') return projects.length > 0;
    if (s === 'education') return education.length > 0;
    if (s === 'skills') return skills.length > 0;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 60);
    const handleMouse = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouse);
    return () => { window.removeEventListener('scroll', handleScroll); window.removeEventListener('mousemove', handleMouse); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3, rootMargin: '0px 0px -40% 0px' }
    );
    navSections.forEach(s => { const el = document.getElementById(s); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [navSections.length]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const avatarLetter = (pi.name || 'U')[0].toUpperCase();
  const accentColor = '#c084fc';
  const accentDim = 'rgba(192,132,252,0.15)';

  return (
    <div style={{ background: '#0a0a0f', color: '#e8e8f0', fontFamily: "'Outfit', 'DM Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #2d2d3d; border-radius: 2px; }
        html { scroll-behavior: smooth; }

        .nav-link { font-size: 13px; font-weight: 500; color: #666680; cursor: pointer; padding: 6px 0; border-bottom: 1px solid transparent; transition: all 0.2s; background: none; border: none; font-family: inherit; }
        .nav-link:hover, .nav-link.active { color: #e8e8f0; }
        .nav-link.active { border-color: #c084fc; }

        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(20px); }

        .skill-bar-wrap { margin-bottom: 14px; }
        .skill-label { display: flex; justify-content: space-between; font-size: 13px; color: #999; margin-bottom: 6px; }
        .skill-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
        .skill-fill { height: 100%; background: linear-gradient(90deg, #c084fc, #818cf8); border-radius: 2px; }

        .proj-thumb { width: 100%; aspect-ratio: 16/9; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 36px; flex-shrink: 0; position: relative; overflow: hidden; }

        .exp-card { border-left: 2px solid rgba(192,132,252,0.2); padding-left: 24px; padding-bottom: 36px; position: relative; }
        .exp-card:last-child { padding-bottom: 0; }
        .exp-dot { position: absolute; left: -6px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #c084fc; box-shadow: 0 0 0 4px rgba(192,132,252,0.12), 0 0 16px rgba(192,132,252,0.4); }

        .tag { background: rgba(192,132,252,0.1); border: 1px solid rgba(192,132,252,0.2); border-radius: 6px; padding: 4px 10px; font-size: 12px; color: #c084fc; font-weight: 500; }

        .section-pad { padding: 100px 80px; max-width: 1000px; margin: 0 auto; }
        @media (max-width: 768px) { .section-pad { padding: 80px 24px; } }

        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>

      {/* Mouse follower glow */}
      <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,132,252,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, left: mousePos.x - 200, top: mousePos.y - 200, transition: 'left 0.4s ease, top 0.4s ease' }} />

      {/* Fixed nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: navScrolled ? 'rgba(10,10,15,0.92)' : 'transparent', backdropFilter: navScrolled ? 'blur(20px)' : 'none', borderBottom: navScrolled ? '1px solid rgba(255,255,255,0.06)' : 'none', transition: 'all 0.4s' }}>
        <div style={{ fontWeight: 800, fontSize: '16px', color: '#e8e8f0', letterSpacing: '-0.02em' }}>
          {pi.name?.split(' ')[0] || 'Portfolio'}<span style={{ color: '#c084fc' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {navSections.map(s => (
            <button key={s} onClick={() => scrollTo(s)} className={`nav-link ${activeSection === s ? 'active' : ''}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="about" ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '60px' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', animation: 'float 8s ease infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(129,140,248,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', animation: 'float 11s ease infinite 3s', pointerEvents: 'none' }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="section-pad" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '80px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Avatar */}
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #c084fc, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '32px', boxShadow: '0 0 40px rgba(192,132,252,0.3)' }}>
              {avatarLetter}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.25)', borderRadius: '100px', padding: '5px 14px', marginBottom: '24px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c084fc', boxShadow: '0 0 6px #c084fc' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#c084fc', letterSpacing: '0.06em' }}>{pi.role || 'Professional'}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(48px, 7vw, 88px)', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '24px' }}>
              <span style={{ color: '#e8e8f0' }}>Hi, I'm </span>
              <span style={{ background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)', backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'gradient-shift 4s ease infinite' }}>
                {pi.name?.split(' ')[0] || 'Alex'}
              </span>
              <span style={{ color: '#e8e8f0' }}>.</span>
            </h1>

            <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#666680', lineHeight: 1.8, maxWidth: '560px', marginBottom: '40px' }}>{pi.bio}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '60px' }}>
              {pi.email && <a href={`mailto:${pi.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #c084fc, #818cf8)', borderRadius: '10px', padding: '12px 24px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 24px rgba(192,132,252,0.3)', transition: 'all 0.2s' }}>✉ Get in Touch</a>}
              {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 24px', color: '#e8e8f0', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>⌨ GitHub</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 24px', color: '#e8e8f0', fontSize: '14px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>🔗 LinkedIn</a>}
            </div>

            {/* Stat strip */}
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {[
                [experience.length || '—', 'Roles'],
                [projects.length || '—', 'Projects'],
                [skills.length || '—', 'Skills'],
                [education.length || '—', 'Degrees'],
              ].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#e8e8f0', letterSpacing: '-0.02em' }}>{val}</div>
                  <div style={{ fontSize: '12px', color: '#666680', fontWeight: 500, marginTop: '2px' }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section id="skills" style={{ padding: '100px 80px', maxWidth: '1000px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.12em', marginBottom: '12px' }}>EXPERTISE</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px' }}>Skills & Tools</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', maxWidth: '800px' }}>
              {skills.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#ccc', cursor: 'default', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,132,252,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                  {s}
                </motion.div>
              ))}
            </div>

            {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
              <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {certifications.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.1em', marginBottom: '14px' }}>CERTIFICATIONS</div>
                    {certifications.map((c, i) => <div key={i} style={{ fontSize: '13px', color: '#999', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>• {c}</div>)}
                  </div>
                )}
                {languages.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.1em', marginBottom: '14px' }}>LANGUAGES</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {languages.map((l, i) => <span key={i} className="tag">{l}</span>)}
                    </div>
                  </div>
                )}
                {achievements.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.1em', marginBottom: '14px' }}>ACHIEVEMENTS</div>
                    {achievements.map((a, i) => <div key={i} style={{ fontSize: '13px', color: '#999', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>🏆 {a}</div>)}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <section id="work" style={{ padding: '100px 80px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.12em', marginBottom: '12px' }}>CAREER</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '56px' }}>Work History</h2>
              <div style={{ maxWidth: '680px' }}>
                {experience.map((e, i) => (
                  <motion.div key={i} className="exp-card"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                    <div className="exp-dot" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      <div>
                        <div style={{ fontSize: '19px', fontWeight: 700, color: '#e8e8f0', marginBottom: '3px' }}>{e.role}</div>
                        <div style={{ fontSize: '14px', color: '#c084fc', fontWeight: 600 }}>{e.company}</div>
                      </div>
                      <span style={{ background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.15)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: '#999', whiteSpace: 'nowrap' }}>{e.duration}</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666680', lineHeight: 1.8 }}>{e.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: '100px 80px' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.6 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.12em', marginBottom: '12px' }}>WORK</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px' }}>Featured Projects</h2>

              {/* Project selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {projects.map((p, i) => (
                  <button key={i} onClick={() => setActiveProject(i)}
                    style={{ padding: '8px 18px', borderRadius: '8px', border: '1px solid', borderColor: activeProject === i ? '#c084fc' : 'rgba(255,255,255,0.08)', background: activeProject === i ? 'rgba(192,132,252,0.12)' : 'transparent', color: activeProject === i ? '#c084fc' : '#666680', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                    {p.title}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {projects[activeProject] && (
                  <motion.div key={activeProject}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '40px', minHeight: '260px' }}>
                    {/* Visual */}
                    <div style={{ background: `linear-gradient(135deg, ${['rgba(192,132,252,0.15)','rgba(129,140,248,0.15)','rgba(56,189,248,0.15)','rgba(52,211,153,0.15)'][activeProject % 4]}, rgba(0,0,0,0.3))`, borderRadius: '16px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '48px' }}>{'🚀🎨⚡💡🔧🎯'[activeProject % 6]}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#666680', letterSpacing: '0.08em' }}>PROJECT {String(activeProject + 1).padStart(2, '0')}</div>
                    </div>
                    {/* Info */}
                    <div>
                      <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#e8e8f0', marginBottom: '12px', letterSpacing: '-0.01em' }}>{projects[activeProject].title}</h3>
                      <p style={{ fontSize: '15px', color: '#666680', lineHeight: 1.8, marginBottom: '20px' }}>{projects[activeProject].description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                        {projects[activeProject].tags?.map((t, j) => <span key={j} className="tag">{t}</span>)}
                      </div>
                      {projects[activeProject].link && (
                        <a href={projects[activeProject].link.startsWith('http') ? projects[activeProject].link : `https://${projects[activeProject].link}`}
                          target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #c084fc, #818cf8)', borderRadius: '8px', padding: '10px 20px', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                          View Project ↗
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section id="education" style={{ padding: '100px 80px', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#c084fc', letterSpacing: '0.12em', marginBottom: '12px' }}>BACKGROUND</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px' }}>Education</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {education.map((e, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(192,132,252,0.25)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                    <div style={{ background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.2)', borderRadius: '6px', padding: '3px 10px', fontSize: '11px', color: '#c084fc', fontWeight: 700, display: 'inline-block', marginBottom: '14px' }}>{e.year}</div>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: '#e8e8f0', marginBottom: '4px' }}>{e.degree}</div>
                    <div style={{ fontSize: '14px', color: '#666680' }}>{e.school}</div>
                    {e.description && <div style={{ fontSize: '13px', color: '#555', marginTop: '10px', lineHeight: 1.6 }}>{e.description}</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <footer style={{ padding: '80px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>Let's Work Together</h2>
          <p style={{ color: '#666680', fontSize: '16px', marginBottom: '32px' }}>Open to new opportunities and collaborations.</p>
          {pi.email && (
            <a href={`mailto:${pi.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #c084fc, #818cf8)', borderRadius: '12px', padding: '16px 36px', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 16px 40px rgba(192,132,252,0.3)' }}>
              ✉ {pi.email}
            </a>
          )}
        </motion.div>
      </footer>
    </div>
  );
};

export default ModernTemplate;