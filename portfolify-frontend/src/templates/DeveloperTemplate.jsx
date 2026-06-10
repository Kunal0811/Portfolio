import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DeveloperTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [activeSection, setActiveSection] = useState('home');
  const [typedText, setTypedText]   = useState('');
  const [cursorOn, setCursorOn]     = useState(true);
  const [termLines, setTermLines]   = useState([]);

  /* ── Sections (filtered) ── */
  const sections = [
    { id: 'home',       label: '~/',         icon: '❯' },
    skills.length      && { id: 'skills',     label: 'skills/',    icon: '{}' },
    experience.length  && { id: 'experience', label: 'work/',      icon: '[]' },
    projects.length    && { id: 'projects',   label: 'projects/',  icon: '</>' },
    education.length   && { id: 'education',  label: 'edu/',       icon: '#'  },
    { id: 'contact',    label: 'contact/',   icon: '@'  },
  ].filter(Boolean);

  /* ── Typing ── */
  useEffect(() => {
    const text = pi.role || 'Software Engineer';
    let i = 0;
    const iv = setInterval(() => {
      setTypedText(text.slice(0, i));
      if (i++ > text.length) clearInterval(iv);
    }, 55);
    return () => clearInterval(iv);
  }, [pi.role]);

  /* ── Cursor blink ── */
  useEffect(() => {
    const iv = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(iv);
  }, []);

  /* ── Terminal boot ── */
  useEffect(() => {
    const lines = [
      { t: `$ portfolio init --user="${pi.name || 'Dev'}"`,       d: 300  },
      { t: '  resolving dependencies...',                          d: 700  },
      { t: `  ✓ ${skills.length} skills loaded`,                  d: 1100 },
      { t: `  ✓ ${experience.length} work entries parsed`,        d: 1500 },
      { t: `  ✓ ${projects.length} projects indexed`,             d: 1900 },
      { t: '  ✓ portfolio compiled successfully',                  d: 2300 },
      { t: '$ _',                                                  d: 2700 },
    ];
    lines.forEach(({ t, d }) =>
      setTimeout(() => setTermLines(prev => [...prev, t]), d));
  }, []);

  /* ── Scroll spy ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.35, rootMargin: '-5% 0px -55% 0px' }
    );
    sections.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections.length]);

  const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* ── Skill categoriser ── */
  const LANG_KW  = ['javascript','typescript','python','java','go','rust','c++','c#','ruby','php','swift','kotlin','dart'];
  const FRAME_KW = ['react','vue','angular','next','nuxt','express','django','flask','spring','laravel','rails','svelte','fastapi'];
  const cats = { Languages: [], Frameworks: [], Tools: [] };
  skills.forEach(s => {
    const sl = s.toLowerCase();
    if (LANG_KW.some(k => sl.includes(k)))  cats.Languages.push(s);
    else if (FRAME_KW.some(k => sl.includes(k))) cats.Frameworks.push(s);
    else cats.Tools.push(s);
  });
  const activeCats = Object.entries(cats).filter(([, v]) => v.length > 0);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#080c14', color:'#cdd6f4',
                  fontFamily:"'JetBrains Mono','Fira Code',monospace", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#0d1117}
        ::-webkit-scrollbar-thumb{background:#313244;border-radius:2px}

        @keyframes glow   { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes blink  { 0%,100%{opacity:1}   50%{opacity:0} }
        @keyframes fadein { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes scan   { 0%{transform:translateY(-10px)} 100%{transform:translateY(100vh)} }

        /* sidebar */
        .snav-btn { display:flex; align-items:center; gap:10px; width:100%; padding:10px 14px;
          border-radius:8px; cursor:pointer; font-size:12.5px; font-weight:500; color:#6c7086;
          border:none; background:transparent; font-family:inherit; text-align:left; transition:all .18s; }
        .snav-btn:hover { color:#89b4fa; background:rgba(137,180,250,.07); }
        .snav-btn.act  { color:#89b4fa; background:rgba(137,180,250,.12); border-left:2px solid #89b4fa; }
        .snav-icon { font-size:10px; font-weight:700; color:#89b4fa; width:22px; text-align:center; flex-shrink:0; }

        /* sections */
        .sec { min-height:100vh; padding:88px 64px 80px; display:flex; flex-direction:column; justify-content:center; }
        @media(max-width:768px){ .sec{ padding:72px 24px 64px; } }
        .sec-title { font-size:10.5px; font-weight:700; color:#89b4fa; letter-spacing:.18em;
          text-transform:uppercase; margin-bottom:36px; display:flex; align-items:center; gap:14px; }
        .sec-title::after { content:''; flex:1; height:1px;
          background:linear-gradient(90deg,rgba(137,180,250,.28),transparent); }

        /* skills */
        .chip { background:rgba(137,180,250,.07); border:1px solid rgba(137,180,250,.17);
          border-radius:6px; padding:6px 13px; font-size:11.5px; color:#89b4fa; font-weight:500;
          transition:all .2s; cursor:default; display:inline-block; }
        .chip:hover { background:rgba(137,180,250,.16); border-color:rgba(137,180,250,.4);
          transform:translateY(-2px); box-shadow:0 4px 14px rgba(137,180,250,.14); }

        /* timeline */
        .tl-item { border-left:1px solid rgba(137,180,250,.2); padding-left:24px;
          position:relative; padding-bottom:32px; }
        .tl-item:last-child { padding-bottom:0; border-color:transparent; }
        .tl-dot { position:absolute; left:-5px; top:2px; width:9px; height:9px; border-radius:50%;
          background:#89b4fa; box-shadow:0 0 0 3px rgba(137,180,250,.14), 0 0 12px rgba(137,180,250,.4); }

        /* project card */
        .proj { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07);
          border-radius:16px; padding:26px; transition:all .28s; position:relative; overflow:hidden; }
        .proj::before { content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(137,180,250,.06) 0%,transparent 60%);
          opacity:0; transition:opacity .28s; }
        .proj:hover { border-color:rgba(137,180,250,.32); transform:translateY(-5px);
          box-shadow:0 22px 44px rgba(0,0,0,.45), 0 0 0 1px rgba(137,180,250,.1); }
        .proj:hover::before { opacity:1; }

        /* terminal */
        .term { background:#0d1117; border:1px solid #21262d; border-radius:12px; overflow:hidden; max-width:500px; }
        .term-bar { background:#161b22; border-bottom:1px solid #21262d; padding:10px 16px;
          display:flex; align-items:center; gap:8px; }
        .term-dot { width:12px; height:12px; border-radius:50%; }
        .term-line { font-size:12.5px; line-height:1.85; padding:2px 0; }
        .term-line.cmd { color:#58a6ff; }
        .term-line.ok  { color:#3fb950; }
        .term-line.dim { color:#8b949e; }

        /* edu card */
        .edu { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:22px; transition:all .2s; }
        .edu:hover { border-color:rgba(137,180,250,.22); background:rgba(137,180,250,.03); }

        /* contact */
        .clink { display:flex; align-items:center; gap:10px; padding:14px 18px;
          background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07);
          border-radius:10px; color:#8b949e; font-size:13px; text-decoration:none;
          transition:all .2s; font-family:inherit; }
        .clink:hover { border-color:rgba(137,180,250,.32); color:#89b4fa;
          background:rgba(137,180,250,.06); transform:translateY(-2px); }
      `}</style>

      {/* scanline */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:1, opacity:.45,
        background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.035) 2px,rgba(0,0,0,.035) 4px)' }} />

      {/* ════ SIDEBAR ════ */}
      <aside style={{ position:'fixed', top:0, left:0, width:'220px', height:'100vh',
        background:'rgba(10,14,22,.96)', borderRight:'1px solid rgba(255,255,255,.05)',
        backdropFilter:'blur(20px)', display:'flex', flexDirection:'column',
        padding:'28px 14px', zIndex:100 }}>

        {/* brand */}
        <div style={{ paddingLeft:'4px', marginBottom:'36px' }}>
          <div style={{ fontSize:'10px', color:'#3fb950', fontWeight:600, letterSpacing:'.12em', marginBottom:'4px' }}>
            PORTFOLIO v2.0
          </div>
          <div style={{ fontSize:'15px', fontWeight:700, color:'#cdd6f4' }}>
            {(pi.name || 'Dev').split(' ')[0]}<span style={{ color:'#89b4fa' }}>.</span>
          </div>
        </div>

        {/* nav links */}
        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'2px' }}>
          {sections.map(s => (
            <button key={s.id} onClick={() => goto(s.id)}
              className={`snav-btn ${activeSection === s.id ? 'act' : ''}`}>
              <span className="snav-icon">{s.icon}</span>{s.label}
            </button>
          ))}
        </nav>

        {/* available badge */}
        <div style={{ padding:'12px 14px', background:'rgba(63,185,80,.06)',
          border:'1px solid rgba(63,185,80,.18)', borderRadius:'8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3fb950', animation:'glow 2s infinite' }} />
            <span style={{ fontSize:'10px', fontWeight:700, color:'#3fb950', letterSpacing:'.1em' }}>AVAILABLE</span>
          </div>
          <div style={{ fontSize:'11px', color:'#6c7086' }}>Open to opportunities</div>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <main style={{ marginLeft:'220px', flex:1, position:'relative', zIndex:2 }}>

        {/* ── HOME ── */}
        <section id="home" className="sec" style={{ position:'relative', overflow:'hidden' }}>
          {/* grid bg */}
          <div style={{ position:'absolute', inset:0, zIndex:0,
            backgroundImage:'linear-gradient(rgba(137,180,250,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(137,180,250,.04) 1px,transparent 1px)',
            backgroundSize:'40px 40px' }} />
          {/* glow blob */}
          <div style={{ position:'absolute', top:'25%', left:'-8%', width:'480px', height:'380px', zIndex:0,
            background:'radial-gradient(ellipse,rgba(137,180,250,.07) 0%,transparent 70%)' }} />

          <div style={{ position:'relative', zIndex:1, maxWidth:'700px' }}>
            {/* hello badge */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
              style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'28px',
                background:'rgba(137,180,250,.08)', border:'1px solid rgba(137,180,250,.22)',
                borderRadius:'4px', padding:'5px 13px' }}>
              <span style={{ color:'#3fb950', fontSize:'12px' }}>●</span>
              <span style={{ fontSize:'11px', color:'#6c7086', letterSpacing:'.08em' }}>HELLO, WORLD</span>
            </motion.div>

            {/* name */}
            <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:.7, delay:.1 }}
              style={{ fontSize:'clamp(38px,5.5vw,70px)', fontWeight:800, color:'#cdd6f4',
                lineHeight:1.05, letterSpacing:'-.02em', marginBottom:'16px' }}>
              {pi.name || 'Your Name'}
            </motion.h1>

            {/* typing role */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.3 }}
              style={{ fontSize:'clamp(17px,2.5vw,26px)', color:'#89b4fa', fontWeight:500,
                marginBottom:'22px', minHeight:'1.4em' }}>
              <span style={{ color:'#6c7086' }}>// </span>
              {typedText}
              <span style={{ opacity: cursorOn ? 1 : 0 }}>█</span>
            </motion.div>

            {/* bio */}
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5 }}
              style={{ fontSize:'15px', color:'#6c7086', lineHeight:1.85, maxWidth:'540px', marginBottom:'38px' }}>
              {pi.bio}
            </motion.p>

            {/* links */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:.7 }}
              style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'52px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`} className="clink">✉ {pi.email}</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="clink">⌨ GitHub ↗</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="clink">🔗 LinkedIn ↗</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="clink">🌐 Website ↗</a>}
              {pi.location && <span className="clink">📍 {pi.location}</span>}
            </motion.div>

            {/* terminal */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:.9 }}>
              <div className="term">
                <div className="term-bar">
                  <div className="term-dot" style={{ background:'#ff5f57' }} />
                  <div className="term-dot" style={{ background:'#febc2e' }} />
                  <div className="term-dot" style={{ background:'#28c840' }} />
                  <span style={{ marginLeft:'10px', fontSize:'11px', color:'#6c7086' }}>bash — portfolify</span>
                </div>
                <div style={{ padding:'16px 20px', minHeight:'130px' }}>
                  {termLines.map((l, i) => (
                    <div key={i} className={`term-line ${l.startsWith('$') ? 'cmd' : l.startsWith('  ✓') ? 'ok' : 'dim'}`}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* scroll hint */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:3 }}
            style={{ position:'absolute', bottom:'32px', left:'64px', display:'flex', alignItems:'center', gap:'8px', cursor:'pointer' }}
            onClick={() => goto(sections[1]?.id)}>
            <div style={{ display:'flex', flexDirection:'column', gap:'3px' }}>
              {[0,1,2].map(i => <div key={i} style={{ width:'2px', height: i===1 ? 12 : 6, background:'#313244', borderRadius:'1px' }} />)}
            </div>
            <span style={{ fontSize:'10.5px', color:'#313244', letterSpacing:'.12em' }}>SCROLL</span>
          </motion.div>
        </section>

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section id="skills" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.15 }} transition={{ duration:.6 }}>
              <div className="sec-title">Technical Skills</div>
              <div style={{ display:'flex', flexDirection:'column', gap:'28px', maxWidth:'740px' }}>
                {activeCats.map(([cat, catSkills]) => (
                  <div key={cat}>
                    <div style={{ fontSize:'10.5px', color:'#6c7086', fontWeight:600,
                      letterSpacing:'.12em', marginBottom:'12px' }}>{cat.toUpperCase()}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                      {catSkills.map((s, i) => (
                        <motion.span key={i} className="chip"
                          initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }}
                          viewport={{ once:true }} transition={{ delay: i * .035 }}>
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* extras */}
              {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'44px', display:'grid',
                  gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
                  gap:'16px', maxWidth:'740px' }}>
                  {certifications.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'10px', padding:'18px' }}>
                      <div style={{ fontSize:'10px', color:'#89b4fa', fontWeight:700, letterSpacing:'.12em', marginBottom:'10px' }}>CERTIFICATIONS</div>
                      {certifications.map((c,i) => <div key={i} style={{ fontSize:'12px', color:'#6c7086', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>▸ {c}</div>)}
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'10px', padding:'18px' }}>
                      <div style={{ fontSize:'10px', color:'#89b4fa', fontWeight:700, letterSpacing:'.12em', marginBottom:'10px' }}>LANGUAGES</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {languages.map((l,i) => <span key={i} style={{ background:'rgba(137,180,250,.08)', border:'1px solid rgba(137,180,250,.2)', borderRadius:'4px', padding:'3px 10px', fontSize:'11.5px', color:'#89b4fa' }}>{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'10px', padding:'18px' }}>
                      <div style={{ fontSize:'10px', color:'#89b4fa', fontWeight:700, letterSpacing:'.12em', marginBottom:'10px' }}>ACHIEVEMENTS</div>
                      {achievements.map((a,i) => <div key={i} style={{ fontSize:'12px', color:'#6c7086', padding:'4px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>🏆 {a}</div>)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </section>
        )}

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <section id="experience" className="sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="sec-title">Work Experience</div>
              <div style={{ maxWidth:'680px' }}>
                {experience.map((e, i) => (
                  <motion.div key={i} className="tl-item"
                    initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .13 }}>
                    <div className="tl-dot" />
                    <div style={{ display:'flex', justifyContent:'space-between',
                      alignItems:'flex-start', flexWrap:'wrap', gap:'8px', marginBottom:'6px' }}>
                      <div>
                        <div style={{ fontSize:'17px', fontWeight:700, color:'#cdd6f4', marginBottom:'2px' }}>{e.role}</div>
                        <div style={{ fontSize:'13px', color:'#89b4fa', fontWeight:500 }}>{e.company}</div>
                      </div>
                      <span style={{ background:'rgba(137,180,250,.08)', border:'1px solid rgba(137,180,250,.16)',
                        borderRadius:'4px', padding:'3px 10px', fontSize:'11px', color:'#6c7086',
                        fontWeight:500, whiteSpace:'nowrap' }}>{e.duration}</span>
                    </div>
                    <p style={{ fontSize:'13.5px', color:'#6c7086', lineHeight:1.8, marginTop:'8px' }}>{e.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section id="projects" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="sec-title">Featured Projects</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
                gap:'20px', maxWidth:'900px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="proj"
                    initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .09 }}
                    whileHover={{ y:-5 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
                      <div style={{ fontSize:'10.5px', color:'#3fb950', fontWeight:700, letterSpacing:'.08em' }}>
                        PROJECT_{String(i+1).padStart(2,'0')}
                      </div>
                      {p.link && (
                        <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`}
                          target="_blank" rel="noreferrer"
                          style={{ color:'#6c7086', fontSize:'16px', textDecoration:'none', transition:'color .2s' }}
                          onMouseEnter={e => e.currentTarget.style.color='#89b4fa'}
                          onMouseLeave={e => e.currentTarget.style.color='#6c7086'}>↗</a>
                      )}
                    </div>
                    <h3 style={{ fontSize:'17px', fontWeight:700, color:'#cdd6f4',
                      marginBottom:'10px', letterSpacing:'-.01em' }}>{p.title}</h3>
                    <p style={{ fontSize:'13px', color:'#6c7086', lineHeight:1.75, marginBottom:'16px' }}>{p.description}</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                      {p.tags?.map((t, j) => (
                        <span key={j} style={{ background:'rgba(137,180,250,.07)',
                          border:'1px solid rgba(137,180,250,.14)', borderRadius:'4px',
                          padding:'2px 8px', fontSize:'11px', color:'#89b4fa', fontWeight:500 }}>{t}</span>
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
          <section id="education" className="sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.2 }} transition={{ duration:.6 }}>
              <div className="sec-title">Education</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',
                gap:'16px', maxWidth:'720px' }}>
                {education.map((e, i) => (
                  <motion.div key={i} className="edu"
                    initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .11 }}>
                    <div style={{ fontSize:'10.5px', color:'#3fb950', fontWeight:700,
                      letterSpacing:'.08em', marginBottom:'10px' }}>{e.year}</div>
                    <div style={{ fontSize:'16px', fontWeight:700, color:'#cdd6f4', marginBottom:'4px' }}>{e.degree}</div>
                    <div style={{ fontSize:'13px', color:'#6c7086' }}>{e.school}</div>
                    {e.description && (
                      <div style={{ fontSize:'12px', color:'#6c7086', marginTop:'8px',
                        paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,.04)', lineHeight:1.65 }}>
                        {e.description}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="contact" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:.2 }} transition={{ duration:.6 }}>
            <div className="sec-title">Get In Touch</div>
            <div style={{ maxWidth:'560px' }}>
              <p style={{ fontSize:'15px', color:'#6c7086', lineHeight:1.85, marginBottom:'36px' }}>
                {pi.name ? `I'm ${pi.name}` : 'I\'m'} currently {' '}
                <span style={{ color:'#3fb950', fontWeight:600 }}>open to new opportunities</span>.
                Whether you have a project, a question, or just want to say hi — my inbox is always open.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'40px' }}>
                {pi.email    && <a href={`mailto:${pi.email}`} className="clink" style={{ maxWidth:'380px' }}>✉ {pi.email}</a>}
                {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="clink" style={{ maxWidth:'380px' }}>🔗 LinkedIn ↗</a>}
                {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="clink" style={{ maxWidth:'380px' }}>⌨ GitHub ↗</a>}
                {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="clink" style={{ maxWidth:'380px' }}>🌐 Website ↗</a>}
              </div>
              <div style={{ fontSize:'11px', color:'#313244', letterSpacing:'.08em' }}>
                © {new Date().getFullYear()} {pi.name} · Built with Portfolify AI
              </div>
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
};

export default DeveloperTemplate;