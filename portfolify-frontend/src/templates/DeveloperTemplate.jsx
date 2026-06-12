import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/*
  NightOS — Developer Template
  Dark monospace aesthetic. Fixed sidebar nav. Each section is full-height.
  Skills: icon-card groups. Projects: numbered with visual block. Experience: role + bullets.
*/

const DeveloperTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [active, setActive]         = useState('home');
  const [typed, setTyped]           = useState('');
  const [cursor, setCursor]         = useState(true);
  const [termLines, setTermLines]   = useState([]);
  const [ticker, setTicker]         = useState(0);

  /* sections */
  const SECTIONS = [
    { id: 'home',       label: '~/',        icon: '❯_' },
    skills.length      && { id: 'skills',     label: 'skills/',   icon: '{}' },
    experience.length  && { id: 'experience', label: 'work/',     icon: '[]' },
    projects.length    && { id: 'projects',   label: 'projects/', icon: '</>' },
    education.length   && { id: 'education',  label: 'edu/',      icon: '##' },
    { id: 'contact',    label: 'contact/',  icon: '@:' },
  ].filter(Boolean);

  /* typing */
  useEffect(() => {
    const text = pi.role || 'Software Engineer';
    let i = 0;
    const iv = setInterval(() => { setTyped(text.slice(0, i)); if (i++ > text.length) clearInterval(iv); }, 55);
    return () => clearInterval(iv);
  }, [pi.role]);

  /* cursor blink */
  useEffect(() => { const iv = setInterval(() => setCursor(v => !v), 530); return () => clearInterval(iv); }, []);

  /* terminal */
  useEffect(() => {
    const lines = [
      { t: `$ init --user="${pi.name || 'Dev'}"`,        d: 300  },
      { t: `  loading profile...`,                        d: 700  },
      { t: `  ✓ ${skills.length} skills found`,          d: 1100 },
      { t: `  ✓ ${experience.length} roles parsed`,      d: 1500 },
      { t: `  ✓ ${projects.length} projects indexed`,    d: 1900 },
      { t: `  ✓ ready`,                                   d: 2300 },
    ];
    lines.forEach(({ t, d }) => setTimeout(() => setTermLines(p => [...p, t]), d));
  }, []);

  /* scroll spy */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.25, rootMargin: '0px 0px -55% 0px' }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [SECTIONS.length]);

  /* ticker */
  useEffect(() => { const iv = setInterval(() => setTicker(t => t + 1), 2500); return () => clearInterval(iv); }, []);

  const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* skill groups — icon + name + tags */
  const SKILL_GROUPS = [
    { icon: '⚙️', label: 'Languages',  keys: ['javascript','typescript','python','java','go','rust','c++','c#','ruby','php','swift','kotlin','dart','sql'] },
    { icon: '🧩', label: 'Frameworks', keys: ['react','vue','angular','next','nuxt','express','django','flask','spring','laravel','rails','svelte','fastapi','tailwind','bootstrap'] },
    { icon: '🛠', label: 'Tools',      keys: ['git','docker','kubernetes','aws','azure','gcp','figma','linux','bash','webpack','vite','jest','postgres','mongo','mysql','redis'] },
  ];
  const groups = SKILL_GROUPS.map(g => ({
    ...g,
    items: skills.filter(s => g.keys.some(k => s.toLowerCase().includes(k)))
  })).filter(g => g.items.length > 0);
  const ungrouped = skills.filter(s => !groups.flatMap(g => g.items).includes(s));
  if (ungrouped.length > 0) groups.push({ icon: '✦', label: 'Other', items: ungrouped });

  const tickerItems = [...skills, ...certifications].filter(Boolean);

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d1117', color:'#e6edf3',
      fontFamily:"'JetBrains Mono','Fira Code',monospace", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-track{background:#0d1117} ::-webkit-scrollbar-thumb{background:#30363d;border-radius:2px}

        @keyframes glow    { 0%,100%{opacity:.3} 50%{opacity:1} }
        @keyframes ticker  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadein  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        /* sidebar */
        .snav { display:flex; align-items:center; gap:10px; width:100%; padding:9px 12px; border-radius:6px;
          cursor:pointer; font-size:12px; font-weight:500; color:#7d8590; border:none; background:transparent;
          font-family:inherit; text-align:left; transition:all .18s; letter-spacing:.02em; }
        .snav:hover { color:#58a6ff; background:rgba(88,166,255,.06); }
        .snav.act   { color:#58a6ff; background:rgba(88,166,255,.1);  border-left:2px solid #58a6ff; }
        .snav-ic    { font-size:10px; font-weight:700; color:#58a6ff; width:26px; text-align:center; flex-shrink:0; letter-spacing:0; }

        /* section layout */
        .sec  { min-height:100vh; padding:80px 64px; display:flex; flex-direction:column; justify-content:center; }
        @media(max-width:900px){ .sec{ padding:72px 28px; } }
        .sec-label { font-size:10px; font-weight:700; color:#58a6ff; letter-spacing:.18em;
          text-transform:uppercase; margin-bottom:32px; display:flex; align-items:center; gap:12px; }
        .sec-label::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,rgba(88,166,255,.3),transparent); }

        /* skill group card */
        .sg-card { background:rgba(255,255,255,.025); border:1px solid #21262d; border-radius:10px; padding:22px 24px; transition:border-color .2s; }
        .sg-card:hover { border-color:rgba(88,166,255,.3); }
        .sg-tag  { background:rgba(88,166,255,.08); border:1px solid rgba(88,166,255,.18); border-radius:4px;
          padding:5px 12px; font-size:11.5px; color:#58a6ff; font-weight:500; transition:all .18s; cursor:default; display:inline-block; }
        .sg-tag:hover { background:rgba(88,166,255,.18); transform:translateY(-1px); }

        /* timeline */
        .tl  { border-left:1px solid #21262d; padding-left:24px; padding-bottom:36px; position:relative; }
        .tl:last-child { padding-bottom:0; border-color:transparent; }
        .tl-dot { position:absolute; left:-5px; top:4px; width:9px; height:9px; border-radius:50%;
          background:#58a6ff; box-shadow:0 0 0 3px rgba(88,166,255,.12), 0 0 12px rgba(88,166,255,.4); }
        .tl-bullet { font-size:13px; color:#7d8590; line-height:1.8; padding:2px 0;
          padding-left:14px; position:relative; }
        .tl-bullet::before { content:'▸'; position:absolute; left:0; color:#58a6ff; font-size:10px; top:3px; }

        /* project card */
        .proj-card { background:rgba(255,255,255,.02); border:1px solid #21262d; border-radius:12px;
          padding:28px; transition:all .25s; position:relative; overflow:hidden; display:grid;
          grid-template-columns:1fr 1fr; gap:32px; align-items:center; }
        .proj-card::before { content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(88,166,255,.04),transparent 60%); opacity:0; transition:opacity .25s; }
        .proj-card:hover { border-color:rgba(88,166,255,.28); }
        .proj-card:hover::before { opacity:1; }
        @media(max-width:700px){ .proj-card{ grid-template-columns:1fr; } }

        /* terminal */
        .term { background:#010409; border:1px solid #21262d; border-radius:10px; overflow:hidden; }
        .term-bar { background:#161b22; border-bottom:1px solid #21262d; padding:10px 16px;
          display:flex; align-items:center; gap:8px; }
        .term-dot { width:11px; height:11px; border-radius:50%; }
        .term-line { font-size:12.5px; line-height:1.9; padding:1px 0; }
        .term-line.cmd { color:#58a6ff; }
        .term-line.ok  { color:#3fb950; }
        .term-line.dim { color:#7d8590; }

        /* contact link */
        .clink { display:flex; align-items:center; gap:10px; padding:14px 18px; background:rgba(255,255,255,.02);
          border:1px solid #21262d; border-radius:8px; color:#7d8590; font-size:13px;
          text-decoration:none; transition:all .2s; font-family:inherit; }
        .clink:hover { border-color:rgba(88,166,255,.28); color:#58a6ff; background:rgba(88,166,255,.04); transform:translateX(4px); }

        /* scrolling ticker */
        .ticker-track { display:flex; gap:0; white-space:nowrap; animation:ticker 30s linear infinite; }
        .ticker-item  { display:inline-flex; align-items:center; gap:12px; padding:0 24px; font-size:12px;
          color:#7d8590; font-weight:500; letter-spacing:.04em; }
        .ticker-item::after { content:'·'; color:#30363d; }

        /* edu card */
        .edu-card { background:rgba(255,255,255,.02); border:1px solid #21262d; border-radius:10px; padding:24px; transition:border-color .2s; }
        .edu-card:hover { border-color:rgba(88,166,255,.2); }
      `}</style>

      {/* ════ SIDEBAR ════ */}
      <aside style={{ position:'fixed', top:0, left:0, width:'216px', height:'100vh',
        background:'rgba(13,17,23,.97)', borderRight:'1px solid #21262d',
        backdropFilter:'blur(16px)', display:'flex', flexDirection:'column',
        padding:'28px 12px', zIndex:100 }}>

        <div style={{ paddingLeft:'4px', marginBottom:'32px' }}>
          <div style={{ fontSize:'10px', color:'#3fb950', fontWeight:600, letterSpacing:'.12em', marginBottom:'4px' }}>v2.0.0</div>
          <div style={{ fontSize:'16px', fontWeight:700, color:'#e6edf3', letterSpacing:'-.01em' }}>
            {(pi.name || 'Dev').split(' ').map(w => w[0]).join('')}<span style={{ color:'#58a6ff' }}>.</span>
          </div>
        </div>

        <nav style={{ flex:1, display:'flex', flexDirection:'column', gap:'2px' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => goto(s.id)} className={`snav ${active === s.id ? 'act' : ''}`}>
              <span className="snav-ic">{s.icon}</span>{s.label}
            </button>
          ))}
        </nav>

        {/* open to work */}
        <div style={{ padding:'12px 14px', background:'rgba(63,185,80,.05)',
          border:'1px solid rgba(63,185,80,.15)', borderRadius:'8px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#3fb950', animation:'glow 2s infinite' }} />
            <span style={{ fontSize:'9.5px', fontWeight:700, color:'#3fb950', letterSpacing:'.1em' }}>AVAILABLE</span>
          </div>
          <div style={{ fontSize:'11px', color:'#7d8590' }}>Open to opportunities</div>
        </div>
      </aside>

      {/* ════ CONTENT ════ */}
      <main style={{ marginLeft:'216px', flex:1 }}>

        {/* ── HOME ── */}
        <section id="home" className="sec" style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0,
            backgroundImage:'linear-gradient(rgba(88,166,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(88,166,255,.03) 1px,transparent 1px)',
            backgroundSize:'44px 44px', zIndex:0 }} />
          <div style={{ position:'absolute', top:'20%', right:'-5%', width:'440px', height:'360px', zIndex:0,
            background:'radial-gradient(ellipse,rgba(88,166,255,.06) 0%,transparent 70%)' }} />

          <div style={{ position:'relative', zIndex:1, maxWidth:'680px' }}>
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'24px',
                background:'rgba(63,185,80,.07)', border:'1px solid rgba(63,185,80,.2)',
                borderRadius:'4px', padding:'5px 13px' }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#3fb950', animation:'glow 2s infinite' }} />
                <span style={{ fontSize:'11px', color:'#3fb950', fontWeight:600, letterSpacing:'.08em' }}>Available for Opportunities</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.65, delay:.08 }}
              style={{ fontSize:'clamp(36px,5vw,66px)', fontWeight:800, lineHeight:1.06,
                letterSpacing:'-.025em', marginBottom:'14px', color:'#e6edf3' }}>
              {(pi.name || 'Your Name').split(' ').map((word, wi) => (
                <span key={wi} style={{ display:'block' }}>{word}</span>
              ))}
            </motion.h1>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.28 }}
              style={{ fontSize:'clamp(15px,2vw,22px)', color:'#58a6ff', fontWeight:500, marginBottom:'20px', minHeight:'1.5em' }}>
              <span style={{ color:'#7d8590' }}>// </span>{typed}
              <span style={{ opacity: cursor ? 1 : 0 }}>█</span>
            </motion.div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.42 }}
              style={{ fontSize:'15px', color:'#7d8590', lineHeight:1.85, maxWidth:'520px', marginBottom:'32px' }}>
              {pi.bio}
            </motion.p>

            <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.56 }}
              style={{ display:'flex', flexWrap:'wrap', gap:'10px', marginBottom:'48px' }}>
              {projects.length > 0 && (
                <button onClick={() => goto('projects')} style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                  background:'#58a6ff', color:'#0d1117', border:'none', borderRadius:'6px',
                  padding:'11px 22px', fontSize:'13.5px', fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#79c0ff'} onMouseLeave={e=>e.currentTarget.style.background='#58a6ff'}>
                  View My Work ↓
                </button>
              )}
              <button onClick={() => goto('contact')} style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                background:'transparent', color:'#7d8590', border:'1px solid #30363d',
                borderRadius:'6px', padding:'11px 22px', fontSize:'13.5px', fontWeight:600,
                cursor:'pointer', fontFamily:'inherit', transition:'all .2s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#58a6ff';e.currentTarget.style.color='#58a6ff'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#30363d';e.currentTarget.style.color='#7d8590'}}>
                Get In Touch
              </button>
            </motion.div>

            {/* skill ticker */}
            {tickerItems.length > 0 && (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.7 }}
                style={{ borderTop:'1px solid #21262d', borderBottom:'1px solid #21262d',
                  padding:'14px 0', overflow:'hidden', marginBottom:'36px' }}>
                <div style={{ fontSize:'10px', color:'#58a6ff', fontWeight:700, letterSpacing:'.12em', marginBottom:'10px' }}>✦ TECH STACK</div>
                <div style={{ overflow:'hidden' }}>
                  <div className="ticker-track">
                    {[...tickerItems, ...tickerItems].map((s, i) => (
                      <span key={i} className="ticker-item">{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* stats */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.85 }}
              style={{ display:'flex', gap:'36px', flexWrap:'wrap' }}>
              {[
                [experience.length + '+', 'Roles'],
                [projects.length + '+', 'Projects'],
                [skills.length + '+', 'Skills'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize:'28px', fontWeight:800, color:'#e6edf3', letterSpacing:'-.02em', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:'11px', color:'#7d8590', marginTop:'4px', fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* terminal */}
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.0 }}
            style={{ position:'absolute', bottom:'60px', right:'64px', width:'380px', zIndex:1 }}
            className="term">
            <div className="term-bar">
              <div className="term-dot" style={{ background:'#ff5f57' }} />
              <div className="term-dot" style={{ background:'#febc2e' }} />
              <div className="term-dot" style={{ background:'#28c840' }} />
              <span style={{ marginLeft:'8px', fontSize:'11px', color:'#7d8590' }}>bash — portfolio</span>
            </div>
            <div style={{ padding:'16px 20px', minHeight:'110px' }}>
              {termLines.map((l, i) => (
                <div key={i} className={`term-line ${l.startsWith('$') ? 'cmd' : l.includes('✓') ? 'ok' : 'dim'}`}>{l}</div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <section id="skills" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.15 }} transition={{ duration:.6 }}>
              <div className="sec-label">Technical Skills</div>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, letterSpacing:'-.02em',
                color:'#e6edf3', marginBottom:'12px', lineHeight:1.1 }}>
                What I<br /><span style={{ color:'#58a6ff' }}>work with</span>
              </h2>
              <p style={{ fontSize:'14px', color:'#7d8590', marginBottom:'40px', maxWidth:'480px', lineHeight:1.7 }}>
                A hands-on toolkit — not buzzwords. Each skill I've used in real projects.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'16px', maxWidth:'860px' }}>
                {groups.map((g, gi) => (
                  <motion.div key={gi} className="sg-card"
                    initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: gi * .1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                      <span style={{ fontSize:'20px' }}>{g.icon}</span>
                      <span style={{ fontSize:'12px', fontWeight:700, color:'#e6edf3', letterSpacing:'.04em' }}>{g.label}</span>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>
                      {g.items.map((s, i) => <span key={i} className="sg-tag">{s}</span>)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* certs / langs / achievements inline */}
              {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'36px', display:'flex', flexDirection:'column', gap:'16px', maxWidth:'600px' }}>
                  {certifications.length > 0 && (
                    <div style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'14px 18px', background:'rgba(255,255,255,.02)', border:'1px solid #21262d', borderRadius:'8px' }}>
                      <span style={{ fontSize:'11px', fontWeight:700, color:'#58a6ff', letterSpacing:'.1em', minWidth:'110px', paddingTop:'1px' }}>CERTIFICATIONS</span>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {certifications.map((c,i) => <span key={i} style={{ fontSize:'12px', color:'#7d8590', background:'rgba(255,255,255,.03)', border:'1px solid #21262d', borderRadius:'4px', padding:'3px 10px' }}>{c}</span>)}
                      </div>
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'14px 18px', background:'rgba(255,255,255,.02)', border:'1px solid #21262d', borderRadius:'8px' }}>
                      <span style={{ fontSize:'11px', fontWeight:700, color:'#58a6ff', letterSpacing:'.1em', minWidth:'110px', paddingTop:'1px' }}>LANGUAGES</span>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {languages.map((l,i) => <span key={i} style={{ fontSize:'12px', color:'#7d8590', border:'1px solid rgba(88,166,255,.2)', borderRadius:'4px', padding:'3px 10px', color:'#58a6ff' }}>{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div style={{ display:'flex', gap:'16px', alignItems:'flex-start', padding:'14px 18px', background:'rgba(255,255,255,.02)', border:'1px solid #21262d', borderRadius:'8px' }}>
                      <span style={{ fontSize:'11px', fontWeight:700, color:'#58a6ff', letterSpacing:'.1em', minWidth:'110px', paddingTop:'1px' }}>ACHIEVEMENTS</span>
                      <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                        {achievements.map((a,i) => <span key={i} style={{ fontSize:'12px', color:'#7d8590' }}>🏆 {a}</span>)}
                      </div>
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
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="sec-label">Work History</div>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, letterSpacing:'-.02em',
                color:'#e6edf3', marginBottom:'48px', lineHeight:1.1 }}>
                Where I've<br /><span style={{ color:'#58a6ff' }}>worked</span>
              </h2>

              <div style={{ maxWidth:'700px', display:'flex', flexDirection:'column', gap:'0' }}>
                {experience.map((e, i) => (
                  <motion.div key={i} className="tl"
                    initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i * .12 }}>
                    <div className="tl-dot" />
                    <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'24px', alignItems:'start' }}>
                      {/* left: date + company */}
                      <div>
                        <div style={{ fontSize:'11px', fontWeight:700, color:'#7d8590', marginBottom:'4px', letterSpacing:'.04em' }}>{e.duration}</div>
                        <div style={{ fontSize:'13.5px', fontWeight:700, color:'#58a6ff' }}>{e.company}</div>
                      </div>
                      {/* right: role + bullets */}
                      <div>
                        <div style={{ fontSize:'18px', fontWeight:700, color:'#e6edf3', marginBottom:'12px', letterSpacing:'-.01em' }}>{e.role}</div>
                        <div style={{ display:'flex', flexDirection:'column' }}>
                          {/* split description into bullet points on · or newline or just show as single bullet */}
                          {(e.description || '').split(/[·\n]/).map(s => s.trim()).filter(Boolean).map((bullet, bi) => (
                            <div key={bi} className="tl-bullet">{bullet}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <section id="projects" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="sec-label">Selected Work</div>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, letterSpacing:'-.02em',
                color:'#e6edf3', marginBottom:'12px', lineHeight:1.1 }}>
                Projects I've<br /><span style={{ color:'#58a6ff' }}>been building</span>
              </h2>
              <p style={{ fontSize:'14px', color:'#7d8590', marginBottom:'44px', maxWidth:'460px', lineHeight:1.7 }}>
                From side-projects to production systems — here's what I've shipped.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'20px', maxWidth:'860px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="proj-card"
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .1 }}>
                    {/* visual block */}
                    <div style={{ borderRadius:'8px', aspectRatio:'16/9', minHeight:'140px',
                      background:`linear-gradient(135deg, ${['rgba(88,166,255,.12)','rgba(63,185,80,.1)','rgba(210,153,34,.1)','rgba(248,81,73,.1)'][i%4]}, rgba(0,0,0,.3))`,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px',
                      border:'1px solid #21262d' }}>
                      <div style={{ fontSize:'40px' }}>{'⚡🚀🔧💡🧩🎯🌐📱'[i % 8]}</div>
                      <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,.25)', letterSpacing:'.12em' }}>
                        {String(i+1).padStart(2,'0')}
                      </div>
                    </div>
                    {/* info */}
                    <div>
                      <div style={{ fontSize:'10px', color:'#3fb950', fontWeight:700, letterSpacing:'.1em', marginBottom:'10px' }}>
                        PROJECT_{String(i+1).padStart(2,'0')}
                      </div>
                      <h3 style={{ fontSize:'clamp(18px,2vw,24px)', fontWeight:700, color:'#e6edf3',
                        letterSpacing:'-.02em', marginBottom:'12px', lineHeight:1.15 }}>
                        {p.title.includes(' ')
                          ? <>{p.title.split(' ').slice(0, Math.ceil(p.title.split(' ').length/2)).join(' ')}<br />{p.title.split(' ').slice(Math.ceil(p.title.split(' ').length/2)).join(' ')}</>
                          : p.title}
                      </h3>
                      <p style={{ fontSize:'13.5px', color:'#7d8590', lineHeight:1.78, marginBottom:'18px' }}>{p.description}</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'20px' }}>
                        {p.tags?.map((t, j) => (
                          <span key={j} style={{ background:'rgba(88,166,255,.07)', border:'1px solid rgba(88,166,255,.16)',
                            borderRadius:'4px', padding:'3px 10px', fontSize:'11px', color:'#58a6ff', fontWeight:500 }}>{t}</span>
                        ))}
                      </div>
                      {p.link && (
                        <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer"
                          style={{ fontSize:'13px', color:'#58a6ff', fontWeight:600, textDecoration:'none',
                            display:'inline-flex', alignItems:'center', gap:'4px', transition:'gap .2s' }}
                          onMouseEnter={e=>e.currentTarget.style.gap='8px'} onMouseLeave={e=>e.currentTarget.style.gap='4px'}>
                          View Project →
                        </a>
                      )}
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
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.6 }}>
              <div className="sec-label">Education</div>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,42px)', fontWeight:800, letterSpacing:'-.02em',
                color:'#e6edf3', marginBottom:'40px', lineHeight:1.1 }}>
                Academic<br /><span style={{ color:'#58a6ff' }}>Background</span>
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px', maxWidth:'720px' }}>
                {education.map((e, i) => (
                  <motion.div key={i} className="edu-card"
                    initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .1 }}>
                    {e.year && <div style={{ fontSize:'10.5px', color:'#3fb950', fontWeight:700, letterSpacing:'.08em', marginBottom:'10px' }}>{e.year}</div>}
                    <div style={{ fontSize:'16px', fontWeight:700, color:'#e6edf3', marginBottom:'4px' }}>{e.degree}</div>
                    <div style={{ fontSize:'13px', color:'#7d8590' }}>{e.school}</div>
                    {e.description && <p style={{ fontSize:'12px', color:'#7d8590', marginTop:'10px', lineHeight:1.65, paddingTop:'10px', borderTop:'1px solid #21262d' }}>{e.description}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section id="contact" className="sec" style={{ background:'rgba(255,255,255,.012)' }}>
          <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.6 }}
            style={{ maxWidth:'640px' }}>
            <div className="sec-label">Let's Work Together</div>
            <h2 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:800, letterSpacing:'-.025em',
              color:'#e6edf3', marginBottom:'16px', lineHeight:1.08 }}>
              Got a project<br /><span style={{ color:'#58a6ff' }}>in mind?</span>
            </h2>
            <p style={{ fontSize:'15px', color:'#7d8590', lineHeight:1.82, marginBottom:'36px', maxWidth:'460px' }}>
              Whether it's a product to build, a problem to solve, or just a conversation — my inbox is open.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'48px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`} className="clink">✉ {pi.email}</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="clink">🔗 LinkedIn ↗</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="clink">⌨ GitHub ↗</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="clink">🌐 Website ↗</a>}
            </div>
            <div style={{ fontSize:'11px', color:'#30363d', letterSpacing:'.07em' }}>
              © {new Date().getFullYear()} {pi.name} · Built with Portfolify AI
            </div>
          </motion.div>
        </section>

      </main>
    </div>
  );
};

export default DeveloperTemplate;