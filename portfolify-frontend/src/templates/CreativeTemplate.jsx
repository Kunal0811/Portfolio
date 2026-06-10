import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CreativeTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [activeIdx, setActiveIdx]   = useState(0);
  const [scrolled, setScrolled]     = useState(false);
  const sectionsRef = useRef([]);

  // Build sections list once (stable reference for scroll handler)
  const sectionDefs = [
    { id: 'intro',      label: 'Intro',      emoji: '👋' },
    experience.length  > 0 && { id: 'experience', label: 'Experience', emoji: '💼' },
    projects.length    > 0 && { id: 'projects',   label: 'Projects',   emoji: '🚀' },
    skills.length      > 0 && { id: 'skills',     label: 'Skills',     emoji: '🧠' },
    education.length   > 0 && { id: 'education',  label: 'Education',  emoji: '🎓' },
    { id: 'contact',    label: 'Contact',    emoji: '✉️' },
  ].filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
      let found = 0;
      sectionDefs.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        const { top } = el.getBoundingClientRect();
        if (top <= 110) found = i;
      });
      setActiveIdx(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionDefs.length]);

  const goto = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const ACCENT_POOL = ['#f97316','#06b6d4','#8b5cf6','#10b981','#f59e0b','#ef4444'];

  return (
    <div style={{ background:'#fafaf8', color:'#1c1c1e', fontFamily:"'Fraunces',Georgia,serif", minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#e0ddd8}

        .dm { font-family:'DM Sans',sans-serif; }
        .c-sec { padding:100px 80px; max-width:1080px; margin:0 auto; }
        @media(max-width:768px){ .c-sec{ padding:72px 24px; } }

        /* pill nav */
        .c-nav { background:#fff; border:1px solid #e8e4de; border-radius:100px;
          padding:5px 6px; display:flex; gap:3px;
          box-shadow:0 2px 16px rgba(0,0,0,.07); }
        .c-nav-btn { padding:7px 15px; border-radius:100px; border:none; background:transparent;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:#999;
          cursor:pointer; transition:all .2s; }
        .c-nav-btn:hover { color:#1c1c1e; background:rgba(0,0,0,.04); }
        .c-nav-btn.act { background:#1c1c1e; color:#fff; }

        /* section label */
        .c-eyebrow { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.15em; text-transform:uppercase; color:#aaa; margin-bottom:16px; }
        .c-rule { width:36px; height:3px; background:#f97316; border-radius:2px; margin-bottom:32px; }

        /* experience */
        .c-exp-row { border-top:1px solid #ede9e3; padding:28px 0;
          display:grid; grid-template-columns:180px 1fr; gap:36px;
          transition:padding-left .2s; }
        .c-exp-row:first-of-type { border-top:1px solid #ede9e3; }
        .c-exp-row:hover { padding-left:10px; background:rgba(249,115,22,.015); }

        /* project card */
        .c-proj { background:#fff; border:1px solid #ede9e3; border-radius:20px;
          overflow:hidden; transition:all .28s; }
        .c-proj:hover { transform:translateY(-6px); box-shadow:0 22px 56px rgba(0,0,0,.1); border-color:#f97316; }

        /* skill row */
        .c-skill-row { display:flex; align-items:center; justify-content:space-between;
          padding:13px 0; border-bottom:1px solid #ede9e3; }
        .c-skill-row:first-of-type { border-top:1px solid #ede9e3; }
        .c-skill-row .dm { font-size:14px; color:#444; font-weight:500; }
        .c-skill-dot { width:7px; height:7px; border-radius:50%; background:#f97316; flex-shrink:0; }

        /* buttons */
        .c-btn-dark { display:inline-flex; align-items:center; gap:8px; padding:15px 32px;
          border-radius:100px; background:#1c1c1e; color:#fff; font-family:'DM Sans',sans-serif;
          font-size:15px; font-weight:700; text-decoration:none; border:none; cursor:pointer;
          transition:all .25s; font-family:'DM Sans',sans-serif; }
        .c-btn-dark:hover { background:#f97316; transform:translateY(-2px); box-shadow:0 12px 32px rgba(249,115,22,.32); }
        .c-btn-ghost { display:inline-flex; align-items:center; gap:8px; padding:15px 32px;
          border-radius:100px; background:transparent; border:1.5px solid #d5d0ca; color:#555;
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; text-decoration:none;
          transition:all .25s; }
        .c-btn-ghost:hover { border-color:#1c1c1e; color:#1c1c1e; transform:translateY(-2px); }
      `}</style>

      {/* ── FLOATING PILL NAV ── */}
      <div style={{ position:'fixed', top:'22px', left:'50%', transform:'translateX(-50%)',
        zIndex:200, transition:'opacity .3s', opacity: scrolled ? 1 : 0.7 }}>
        <div className="c-nav">
          {sectionDefs.map((s, i) => (
            <button key={s.id} onClick={() => goto(s.id)}
              className={`c-nav-btn ${activeIdx === i ? 'act' : ''}`}>
              <span style={{ marginRight:'4px' }}>{s.emoji}</span>{s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── INTRO ── */}
      <section id="intro" style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        justifyContent:'center', padding:'120px 80px 80px', maxWidth:'1080px', margin:'0 auto',
        position:'relative' }}>
        {/* decorative blob */}
        <div style={{ position:'absolute', top:'8%', right:'0', width:'340px', height:'340px',
          background:'radial-gradient(circle,rgba(249,115,22,.07) 0%,transparent 70%)',
          borderRadius:'50%', pointerEvents:'none' }} />

        <motion.div initial={{ opacity:0, y:44 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.9, ease:[0.16,1,0.3,1] }}>

          {/* available line */}
          <div className="dm" style={{ fontSize:'14px', fontWeight:600, color:'#f97316',
            letterSpacing:'.06em', marginBottom:'28px', display:'flex', alignItems:'center', gap:'10px' }}>
            <span style={{ width:'28px', height:'2px', background:'#f97316', display:'inline-block' }} />
            Open to new opportunities
          </div>

          {/* giant serif name */}
          <h1 style={{ fontSize:'clamp(52px,8.5vw,108px)', fontWeight:900, lineHeight:.95,
            letterSpacing:'-.03em', marginBottom:'36px' }}>
            {(pi.name || 'Your Name').split(' ').map((word, wi) => (
              <span key={wi} style={{ display:'block', fontStyle: wi % 2 === 1 ? 'italic' : 'normal',
                color: wi % 2 === 1 ? '#f97316' : '#1c1c1e' }}>
                {word}
              </span>
            ))}
          </h1>

          <div style={{ display:'flex', alignItems:'flex-start', gap:'52px', flexWrap:'wrap' }}>
            {/* bio + CTA */}
            <div style={{ maxWidth:'420px' }}>
              <div className="dm" style={{ fontSize:'12px', fontWeight:700, color:'#f97316',
                letterSpacing:'.1em', marginBottom:'10px' }}>
                {pi.role?.toUpperCase() || 'PROFESSIONAL'}
                {pi.location && ` · ${pi.location}`}
              </div>
              <p className="dm" style={{ fontSize:'17px', color:'#555', lineHeight:1.82, marginBottom:'28px' }}>
                {pi.bio}
              </p>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                {pi.email    && <a href={`mailto:${pi.email}`} className="c-btn-dark">Say Hello ↗</a>}
                {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="c-btn-ghost">GitHub</a>}
                {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="c-btn-ghost">LinkedIn</a>}
                {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="c-btn-ghost">Website</a>}
              </div>
            </div>

            {/* info card */}
            <div style={{ background:'#fff', border:'1px solid #ede9e3', borderRadius:'20px',
              padding:'28px 32px', minWidth:'210px', boxShadow:'0 4px 24px rgba(0,0,0,.05)' }}>
              <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#bbb',
                letterSpacing:'.14em', marginBottom:'20px' }}>QUICK INFO</div>
              {[
                ['ROLE', pi.role || '—'],
                ['LOCATION', pi.location || '—'],
                ['PROJECTS', `${projects.length} shipped`],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom:'14px' }}>
                  <div className="dm" style={{ fontSize:'10.5px', color:'#ccc', marginBottom:'2px' }}>{k}</div>
                  <div className="dm" style={{ fontSize:'14px', fontWeight:700, color:'#1c1c1e' }}>{v}</div>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#10b981' }} />
                <span className="dm" style={{ fontSize:'13px', fontWeight:700, color:'#10b981' }}>Open to work</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* scroll nudge */}
        <div className="dm" onClick={() => goto(sectionDefs[1]?.id)}
          style={{ position:'absolute', bottom:'36px', left:'80px', display:'flex',
            alignItems:'center', gap:'10px', cursor:'pointer', opacity:.5 }}>
          <span style={{ fontSize:'12px', fontWeight:600, letterSpacing:'.1em' }}>SCROLL</span>
          <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
            {[0,1,2].map(i => <div key={i} style={{ width:'16px', height:'1.5px', background:'#ccc', borderRadius:'1px' }} />)}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <section id="experience">
          <div className="c-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.7, ease:[0.16,1,0.3,1] }}>
              <div className="c-eyebrow">Experience</div>
              <div className="c-rule" />
              <h2 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, letterSpacing:'-.025em',
                marginBottom:'48px', lineHeight:1.08 }}>
                Where I've <em style={{ fontStyle:'italic', color:'#f97316' }}>worked</em>
              </h2>

              {experience.map((e, i) => (
                <motion.div key={i} className="c-exp-row"
                  initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ delay: i * .11 }}>
                  <div className="dm">
                    <div style={{ fontSize:'13px', fontWeight:700, color:'#aaa', marginBottom:'4px' }}>{e.duration}</div>
                    <div style={{ fontSize:'15px', fontWeight:700, color:'#f97316' }}>{e.company}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'22px', fontWeight:700, color:'#1c1c1e',
                      marginBottom:'10px', letterSpacing:'-.015em' }}>{e.role}</div>
                    <p className="dm" style={{ fontSize:'15px', color:'#666', lineHeight:1.78 }}>{e.description}</p>
                  </div>
                </motion.div>
              ))}
              <div style={{ borderBottom:'1px solid #ede9e3' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects" style={{ background:'#f4f1ec', padding:'100px 0' }}>
          <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'0 80px' }}>
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.7 }}>
              <div className="c-eyebrow">Projects</div>
              <div className="c-rule" />
              <h2 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, letterSpacing:'-.025em',
                marginBottom:'48px', lineHeight:1.08 }}>
                Things I've <em style={{ fontStyle:'italic', color:'#f97316' }}>built</em>
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(310px,1fr))', gap:'22px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="c-proj"
                    initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .09 }}>
                    {/* card top */}
                    <div style={{ height:'140px', borderBottom:'1px solid #ede9e3',
                      background:`linear-gradient(135deg,${ACCENT_POOL[i%ACCENT_POOL.length]}1a,${ACCENT_POOL[(i+2)%ACCENT_POOL.length]}0d)`,
                      display:'flex', alignItems:'center', justifyContent:'space-between',
                      padding:'24px 28px' }}>
                      <div style={{ fontSize:'40px' }}>{'🚀⚡🎯💡🔧🎨🧩🌐'[i%8]}</div>
                      <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#aaa', letterSpacing:'.1em' }}>
                        PROJECT {String(i+1).padStart(2,'0')}
                      </div>
                    </div>
                    {/* card body */}
                    <div style={{ padding:'24px 28px 28px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                        <h3 style={{ fontSize:'19px', fontWeight:800, color:'#1c1c1e', letterSpacing:'-.01em' }}>{p.title}</h3>
                        {p.link && (
                          <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`}
                            target="_blank" rel="noreferrer"
                            style={{ width:'32px', height:'32px', borderRadius:'50%', border:'1.5px solid #ddd',
                              display:'flex', alignItems:'center', justifyContent:'center',
                              color:'#888', fontSize:'14px', textDecoration:'none', flexShrink:0,
                              transition:'all .2s' }}
                            onMouseEnter={e=>{ e.currentTarget.style.background='#1c1c1e'; e.currentTarget.style.color='#fff'; e.currentTarget.style.borderColor='#1c1c1e'; }}
                            onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#888'; e.currentTarget.style.borderColor='#ddd'; }}>
                            ↗
                          </a>
                        )}
                      </div>
                      <p className="dm" style={{ fontSize:'14px', color:'#666', lineHeight:1.72, marginBottom:'16px' }}>{p.description}</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {p.tags?.map((t,j) => (
                          <span key={j} className="dm" style={{ background:'#ede9e3', borderRadius:'4px',
                            padding:'3px 9px', fontSize:'11px', color:'#666', fontWeight:700 }}>{t}</span>
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
        <section id="skills">
          <div className="c-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.15 }} transition={{ duration:.7 }}>
              <div className="c-eyebrow">Skills</div>
              <div className="c-rule" />
              <h2 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, letterSpacing:'-.025em',
                marginBottom:'48px', lineHeight:1.08 }}>
                What I <em style={{ fontStyle:'italic', color:'#f97316' }}>know</em>
              </h2>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 52px', maxWidth:'740px' }}>
                {skills.map((s, i) => (
                  <motion.div key={i} className="c-skill-row"
                    initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .035 }}>
                    <span className="dm">{s}</span>
                    <div className="c-skill-dot" />
                  </motion.div>
                ))}
              </div>

              {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'56px', display:'grid',
                  gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'36px' }}>
                  {certifications.length > 0 && (
                    <div>
                      <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#aaa', letterSpacing:'.14em', marginBottom:'16px' }}>CERTIFICATIONS</div>
                      {certifications.map((c,i) => <div key={i} className="dm" style={{ fontSize:'14px', color:'#555', padding:'8px 0', borderBottom:'1px solid #ede9e3' }}>— {c}</div>)}
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div>
                      <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#aaa', letterSpacing:'.14em', marginBottom:'16px' }}>LANGUAGES</div>
                      {languages.map((l,i) => <div key={i} className="dm" style={{ fontSize:'14px', color:'#555', padding:'8px 0', borderBottom:'1px solid #ede9e3' }}>— {l}</div>)}
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div>
                      <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#aaa', letterSpacing:'.14em', marginBottom:'16px' }}>ACHIEVEMENTS</div>
                      {achievements.map((a,i) => <div key={i} className="dm" style={{ fontSize:'14px', color:'#555', padding:'8px 0', borderBottom:'1px solid #ede9e3' }}>🏆 {a}</div>)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section id="education" style={{ background:'#f4f1ec', padding:'100px 0' }}>
          <div style={{ maxWidth:'1080px', margin:'0 auto', padding:'0 80px' }}>
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.15 }} transition={{ duration:.7 }}>
              <div className="c-eyebrow">Education</div>
              <div className="c-rule" />
              <h2 style={{ fontSize:'clamp(32px,4.5vw,56px)', fontWeight:800, letterSpacing:'-.025em',
                marginBottom:'48px', lineHeight:1.08 }}>
                Where I <em style={{ fontStyle:'italic', color:'#f97316' }}>studied</em>
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>
                {education.map((e,i) => (
                  <motion.div key={i}
                    initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .11 }}
                    style={{ background:'#fff', border:'1px solid #ede9e3', borderRadius:'20px',
                      padding:'28px', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
                    <div className="dm" style={{ fontSize:'10.5px', fontWeight:700, color:'#f97316',
                      letterSpacing:'.1em', marginBottom:'12px' }}>{e.year}</div>
                    <div style={{ fontSize:'19px', fontWeight:800, color:'#1c1c1e',
                      marginBottom:'4px', letterSpacing:'-.015em' }}>{e.degree}</div>
                    <div className="dm" style={{ fontSize:'14px', color:'#888', fontWeight:500 }}>{e.school}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact">
        <div style={{ maxWidth:'780px', margin:'0 auto', padding:'120px 80px', textAlign:'center' }}>
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div className="c-eyebrow" style={{ textAlign:'center' }}>Reach Out</div>
            <h2 style={{ fontSize:'clamp(44px,7vw,80px)', fontWeight:900, letterSpacing:'-.035em',
              lineHeight:.95, marginBottom:'24px' }}>
              Let's make<br />
              <em style={{ fontStyle:'italic', color:'#f97316' }}>something</em><br />
              great.
            </h2>
            <p className="dm" style={{ fontSize:'17px', color:'#888', lineHeight:1.75,
              marginBottom:'44px', maxWidth:'440px', margin:'0 auto 44px' }}>
              I'm always open to new projects, creative ideas, or a good conversation.
            </p>
            <div style={{ display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap', marginBottom:'80px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`} className="c-btn-dark">✉ {pi.email}</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="c-btn-ghost">LinkedIn ↗</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="c-btn-ghost">GitHub ↗</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="c-btn-ghost">Website ↗</a>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <div className="dm" style={{ padding:'24px 80px', borderTop:'1px solid #ede9e3',
        display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px',
        fontSize:'12px', color:'#bbb', background:'#fafaf8' }}>
        <span>© {new Date().getFullYear()} {pi.name}</span>
        <span>Built with Portfolify AI</span>
      </div>
    </div>
  );
};

export default CreativeTemplate;