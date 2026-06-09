import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreativeTemplate = ({ data }) => {
  if (!data) return null;
  const { personalInfo: pi = {}, skills = [], experience = [], projects = [], education = [], certifications = [], languages = [], achievements = [] } = data;

  const [activeSection, setActiveSection] = useState(0);
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sections = [
    { id: 'intro', label: 'Intro', emoji: '👋' },
    experience.length > 0 && { id: 'experience', label: 'Experience', emoji: '💼' },
    projects.length > 0 && { id: 'projects', label: 'Projects', emoji: '🚀' },
    skills.length > 0 && { id: 'skills', label: 'Skills', emoji: '🧠' },
    education.length > 0 && { id: 'education', label: 'Education', emoji: '🎓' },
    { id: 'contact', label: 'Contact', emoji: '✉️' },
  ].filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      const found = sections.find(s => {
        const el = document.getElementById(s.id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom > 120;
      });
      if (found) setActiveSection(sections.indexOf(found));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections.length]);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setNavOpen(false); };

  const accentColors = ['#f97316', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const accent = accentColors[0];

  return (
    <div style={{ background: '#fafaf8', color: '#1c1c1e', fontFamily: "'Fraunces', Georgia, serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400;1,9..144,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #e5e5e0; }

        .dm { font-family: 'DM Sans', sans-serif; }

        .nav-pill { background: #fff; border: 1px solid #e8e8e0; border-radius: 100px; padding: 6px 8px; display: flex; gap: 4px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .nav-btn { padding: 6px 14px; border-radius: 100px; border: none; background: transparent; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.2s; }
        .nav-btn:hover { color: #1c1c1e; background: rgba(0,0,0,0.04); }
        .nav-btn.active { background: #1c1c1e; color: #fff; }

        .section-label { font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #999; margin-bottom: 20px; }
        .section-divider { width: 40px; height: 3px; background: #f97316; border-radius: 2px; margin-bottom: 32px; }

        .exp-item { border-bottom: 1px solid #f0ede8; padding: 28px 0; display: grid; grid-template-columns: 180px 1fr; gap: 32px; transition: background 0.2s; }
        .exp-item:first-child { border-top: 1px solid #f0ede8; }
        .exp-item:hover { background: rgba(249,115,22,0.02); padding-left: 8px; }

        .proj-card { background: #fff; border: 1px solid #ebe8e0; border-radius: 20px; overflow: hidden; transition: all 0.3s; cursor: default; }
        .proj-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); border-color: #f97316; }
        .proj-card:hover .proj-arrow { transform: translate(3px, -3px); }
        .proj-arrow { transition: transform 0.2s; }

        .skill-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #f0ede8; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #444; }
        .skill-item:first-child { border-top: 1px solid #f0ede8; }
        .skill-dot { width: 6px; height: 6px; border-radius: 50%; background: #f97316; }

        .contact-btn { display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; border-radius: 100px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.25s; }
        .contact-btn.primary { background: #1c1c1e; color: #fff; }
        .contact-btn.primary:hover { background: #f97316; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(249,115,22,0.3); }
        .contact-btn.secondary { background: transparent; border: 1.5px solid #ddd; color: #444; }
        .contact-btn.secondary:hover { border-color: #1c1c1e; color: #1c1c1e; transform: translateY(-2px); }

        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
      `}</style>

      {/* Fixed pill nav */}
      <div style={{ position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 200, transition: 'all 0.3s', opacity: scrolled ? 1 : 0.8 }}>
        <div className="nav-pill">
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => scrollTo(s.id)} className={`nav-btn ${activeSection === i ? 'active' : ''}`}>
              <span style={{ marginRight: '4px' }}>{s.emoji}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── INTRO ── */}
      <section id="intro" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 80px 80px', maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        {/* Decorative orange accent */}
        <div style={{ position: 'absolute', top: '10%', right: '0', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div className="dm" style={{ fontSize: '14px', fontWeight: 600, color: '#f97316', letterSpacing: '0.06em', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '2px', background: '#f97316', display: 'inline-block' }} />
            Available for work
          </div>

          <h1 style={{ fontSize: 'clamp(52px, 8vw, 100px)', fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em', marginBottom: '32px' }}>
            {pi.name?.split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block', color: i === 0 ? '#1c1c1e' : '#f97316', fontStyle: i === 1 ? 'italic' : 'normal' }}>
                {word}
              </span>
            )) || <span>Your Name</span>}
          </h1>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap' }}>
            <div style={{ maxWidth: '420px' }}>
              <p className="dm" style={{ fontSize: '17px', color: '#555', lineHeight: 1.8, marginBottom: '24px' }}>{pi.bio}</p>
              <div className="dm" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {pi.email && <a href={`mailto:${pi.email}`} className="contact-btn primary">Say Hello ↗</a>}
                {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noreferrer" className="contact-btn secondary">GitHub</a>}
                {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="contact-btn secondary">LinkedIn</a>}
              </div>
            </div>

            {/* Info card */}
            <div style={{ background: '#fff', border: '1px solid #ebe8e0', borderRadius: '20px', padding: '28px 32px', minWidth: '220px', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
              <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.12em', marginBottom: '20px' }}>QUICK INFO</div>
              {pi.role && <div style={{ marginBottom: '12px' }}><div className="dm" style={{ fontSize: '11px', color: '#bbb', marginBottom: '2px' }}>ROLE</div><div className="dm" style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1e' }}>{pi.role}</div></div>}
              {pi.location && <div style={{ marginBottom: '12px' }}><div className="dm" style={{ fontSize: '11px', color: '#bbb', marginBottom: '2px' }}>BASED IN</div><div className="dm" style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1e' }}>{pi.location}</div></div>}
              <div style={{ marginBottom: '12px' }}><div className="dm" style={{ fontSize: '11px', color: '#bbb', marginBottom: '2px' }}>PROJECTS</div><div className="dm" style={{ fontSize: '14px', fontWeight: 600, color: '#1c1c1e' }}>{projects.length} shipped</div></div>
              <div><div className="dm" style={{ fontSize: '11px', color: '#bbb', marginBottom: '2px' }}>STATUS</div><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} /><span className="dm" style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>Open to work</span></div></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: '40px', left: '80px', display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={() => scrollTo(sections[1]?.id)} style={{ cursor: 'pointer', position: 'absolute', bottom: '40px', left: '80px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="dm" style={{ fontSize: '12px', color: '#aaa', fontWeight: 600, letterSpacing: '0.08em' }}>SCROLL DOWN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width: '16px', height: '1.5px', background: '#ddd', borderRadius: '1px' }} />)}
          </div>
        </motion.div>
      </section>

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <section id="experience" style={{ padding: '100px 80px', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
            <div className="section-label">Experience</div>
            <div className="section-divider" />
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px', lineHeight: 1.1 }}>
              Where I've <em style={{ fontStyle: 'italic', color: '#f97316' }}>worked</em>
            </h2>

            {experience.map((e, i) => (
              <motion.div key={i} className="exp-item"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="dm">
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#888', marginBottom: '4px' }}>{e.duration}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#f97316' }}>{e.company}</div>
                </div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#1c1c1e', marginBottom: '10px', letterSpacing: '-0.01em' }}>{e.role}</div>
                  <p className="dm" style={{ fontSize: '15px', color: '#666', lineHeight: 1.75 }}>{e.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects" style={{ padding: '100px 80px', background: '#f5f3ef', maxWidth: '100%' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.7 }}>
              <div className="section-label">Projects</div>
              <div className="section-divider" />
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px', lineHeight: 1.1 }}>
                Things I've <em style={{ fontStyle: 'italic', color: '#f97316' }}>built</em>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="proj-card"
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    {/* Card top - colored band */}
                    <div style={{ height: '140px', background: `linear-gradient(135deg, ${accentColors[i % accentColors.length]}18, ${accentColors[(i + 2) % accentColors.length]}18)`, borderBottom: '1px solid #ebe8e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px' }}>
                      <div style={{ fontSize: '40px' }}>{'🚀⚡🎯💡🔧🎨'[i % 6]}</div>
                      <div style={{ fontFamily: 'DM Sans', fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.1em' }}>PROJECT {String(i + 1).padStart(2, '0')}</div>
                    </div>
                    {/* Card body */}
                    <div style={{ padding: '24px 28px 28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#1c1c1e', letterSpacing: '-0.01em' }}>{p.title}</h3>
                        {p.link && (
                          <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer"
                            className="proj-arrow"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '14px', textDecoration: 'none', flexShrink: 0 }}>↗</a>
                        )}
                      </div>
                      <p className="dm" style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '16px' }}>{p.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {p.tags?.map((t, j) => (
                          <span key={j} className="dm" style={{ background: '#f0ede8', borderRadius: '4px', padding: '3px 9px', fontSize: '11px', color: '#666', fontWeight: 700 }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section id="skills" style={{ padding: '100px 80px', maxWidth: '1100px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
            <div className="section-label">Skills</div>
            <div className="section-divider" />
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px', lineHeight: 1.1 }}>
              What I <em style={{ fontStyle: 'italic', color: '#f97316' }}>know</em>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px', maxWidth: '720px' }}>
              {skills.map((s, i) => (
                <motion.div key={i} className="skill-item"
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                  <span>{s}</span>
                  <div className="skill-dot" />
                </motion.div>
              ))}
            </div>

            {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
              <div style={{ marginTop: '56px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
                {certifications.length > 0 && (
                  <div>
                    <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.12em', marginBottom: '16px' }}>CERTIFICATIONS</div>
                    {certifications.map((c, i) => <div key={i} className="dm" style={{ fontSize: '14px', color: '#555', padding: '8px 0', borderBottom: '1px solid #f0ede8' }}>— {c}</div>)}
                  </div>
                )}
                {languages.length > 0 && (
                  <div>
                    <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.12em', marginBottom: '16px' }}>LANGUAGES</div>
                    {languages.map((l, i) => <div key={i} className="dm" style={{ fontSize: '14px', color: '#555', padding: '8px 0', borderBottom: '1px solid #f0ede8' }}>— {l}</div>)}
                  </div>
                )}
                {achievements.length > 0 && (
                  <div>
                    <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#999', letterSpacing: '0.12em', marginBottom: '16px' }}>ACHIEVEMENTS</div>
                    {achievements.map((a, i) => <div key={i} className="dm" style={{ fontSize: '14px', color: '#555', padding: '8px 0', borderBottom: '1px solid #f0ede8' }}>🏆 {a}</div>)}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section id="education" style={{ padding: '100px 80px', background: '#f5f3ef' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}>
              <div className="section-label">Education</div>
              <div className="section-divider" />
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '48px', lineHeight: 1.1 }}>
                Where I <em style={{ fontStyle: 'italic', color: '#f97316' }}>studied</em>
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {education.map((e, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                    style={{ background: '#fff', border: '1px solid #ebe8e0', borderRadius: '20px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                    <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', marginBottom: '12px' }}>{e.year}</div>
                    <div style={{ fontSize: '19px', fontWeight: 800, color: '#1c1c1e', marginBottom: '4px', letterSpacing: '-0.01em' }}>{e.degree}</div>
                    <div className="dm" style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>{e.school}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '120px 80px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="dm" style={{ fontSize: '11px', fontWeight: 700, color: '#f97316', letterSpacing: '0.14em', marginBottom: '20px' }}>REACH OUT</div>
          <h2 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.0, marginBottom: '24px' }}>
            Let's make<br /><em style={{ fontStyle: 'italic', color: '#f97316' }}>something</em><br />great.
          </h2>
          <p className="dm" style={{ fontSize: '17px', color: '#888', lineHeight: 1.7, marginBottom: '40px' }}>I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {pi.email && <a href={`mailto:${pi.email}`} className="contact-btn primary">✉ {pi.email}</a>}
            {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="contact-btn secondary">LinkedIn ↗</a>}
            {pi.github && <a href={pi.github.startsWith('http') ? pi.github : `https://${pi.github}`} target="_blank" rel="noreferrer" className="contact-btn secondary">GitHub ↗</a>}
            {pi.website && <a href={pi.website.startsWith('http') ? pi.website : `https://${pi.website}`} target="_blank" rel="noreferrer" className="contact-btn secondary">Website ↗</a>}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="dm" style={{ padding: '24px 80px', borderTop: '1px solid #ebe8e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#bbb' }}>
        <span>© {new Date().getFullYear()} {pi.name}</span>
        <span>Built with Portfolify AI</span>
      </div>
    </div>
  );
};

export default CreativeTemplate;