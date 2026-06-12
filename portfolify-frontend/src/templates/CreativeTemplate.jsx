import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/*
  Folio — Creative Template
  Warm off-white. Floating pill nav (like Siddhant's). Serif display.
  Skills: category cards with emoji + name + tags. Projects: numbered with band color.
  Experience: two-column left/right with bullet list.
*/

const CreativeTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [activeIdx, setActiveIdx] = useState(0);
  const [scrolled, setScrolled]   = useState(false);

  const SECS = [
    { id:'intro',       label:'Home',       emoji:'🏠' },
    { id:'about',       label:'About',      emoji:'👤' },
    skills.length      > 0 && { id:'skills',      label:'Skills',     emoji:'✦' },
    experience.length  > 0 && { id:'experience',  label:'Work',       emoji:'💼' },
    projects.length    > 0 && { id:'projects',    label:'Projects',   emoji:'🚀' },
    { id:'contact',     label:"Let's Talk",  emoji:'💬' },
  ].filter(Boolean);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      let found = 0;
      SECS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 100) found = i;
      });
      setActiveIdx(found);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [SECS.length]);

  const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  /* skill groups */
  const GROUPS = [
    { emoji:'🎨', label:'Frontend',   keys:['react','vue','angular','next','svelte','html','css','tailwind','bootstrap','figma','ui','ux','design','interface'] },
    { emoji:'⚙️', label:'Backend',    keys:['node','express','django','flask','spring','laravel','fastapi','rails','api','rest','graphql','server'] },
    { emoji:'🗄️', label:'Data',       keys:['sql','postgres','mysql','mongo','redis','firebase','database','elasticsearch'] },
    { emoji:'☁️', label:'DevOps',     keys:['aws','azure','gcp','docker','kubernetes','linux','ci','cd','terraform','nginx','git'] },
    { emoji:'📱', label:'Mobile',     keys:['react native','flutter','swift','kotlin','android','ios','mobile','expo'] },
    { emoji:'🤖', label:'AI/ML',      keys:['python','machine learning','tensorflow','pytorch','nlp','llm','openai','gemini','ml','ai','deep learning'] },
    { emoji:'🔧', label:'Tools',      keys:['jira','notion','slack','postman','vscode','xcode','photoshop','illustrator','canva','sketch'] },
  ];
  const groups = GROUPS.map(g => ({
    ...g,
    items: skills.filter(s => g.keys.some(k => s.toLowerCase().includes(k)))
  })).filter(g => g.items.length > 0);
  const used = groups.flatMap(g => g.items);
  const other = skills.filter(s => !used.includes(s));
  if (other.length > 0) groups.push({ emoji:'✦', label:'Other', items: other });

  const PALETTE = ['#f97316','#8b5cf6','#06b6d4','#10b981','#ef4444','#f59e0b','#3b82f6','#ec4899'];

  return (
    <div style={{ background:'#f9f7f4', color:'#1a1a1a', fontFamily:"'Fraunces',Georgia,serif", minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,700;0,9..144,800;0,9..144,900;1,9..144,400;1,9..144,700;1,9..144,900&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#e0ddd8}

        .dm { font-family:'DM Sans',sans-serif; }

        /* pill nav */
        .fnav { background:#fff; border:1px solid #e5e0d8; border-radius:100px; padding:5px 6px;
          display:flex; gap:3px; box-shadow:0 4px 20px rgba(0,0,0,.08); }
        .fnav-btn { padding:7px 16px; border-radius:100px; border:none; background:transparent;
          font-family:'DM Sans',sans-serif; font-size:13px; font-weight:700; color:#999;
          cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:5px; }
        .fnav-btn:hover { color:#1a1a1a; background:rgba(0,0,0,.04); }
        .fnav-btn.act { background:#1a1a1a; color:#fff; }

        .f-sec { padding:104px 80px; max-width:1080px; margin:0 auto; }
        @media(max-width:768px){ .f-sec{ padding:80px 24px; } }

        /* eyebrow */
        .f-eyebrow { font-family:'DM Sans',sans-serif; font-size:11px; font-weight:700;
          letter-spacing:.16em; text-transform:uppercase; color:#f97316; margin-bottom:8px;
          display:flex; align-items:center; gap:10px; }
        .f-eyebrow::before { content:''; width:28px; height:2px; background:#f97316; border-radius:1px; }

        /* skill group card */
        .sg { background:#fff; border:1px solid #e8e3da; border-radius:16px; padding:22px 24px;
          transition:all .22s; }
        .sg:hover { border-color:#f97316; box-shadow:0 8px 28px rgba(249,115,22,.08); transform:translateY(-2px); }
        .sg-tag { display:inline-block; background:#fff7ed; border:1px solid #fed7aa;
          border-radius:6px; padding:4px 11px; font-size:12px; color:#ea580c; font-weight:600;
          font-family:'DM Sans',sans-serif; margin:3px; transition:background .18s; }
        .sg-tag:hover { background:#ffedd5; }

        /* experience */
        .exp-row { border-top:1px solid #e8e3da; padding:28px 0; display:grid;
          grid-template-columns:180px 1fr; gap:32px; transition:padding-left .2s, background .2s; }
        .exp-row:hover { background:rgba(249,115,22,.015); padding-left:6px; }
        .exp-bullet { font-family:'DM Sans',sans-serif; font-size:14.5px; color:#555; line-height:1.78;
          padding-left:16px; position:relative; margin-bottom:6px; }
        .exp-bullet::before { content:'→'; position:absolute; left:0; color:#f97316; font-size:11px; top:4px; font-weight:700; }

        /* project card */
        .proj-card { background:#fff; border:1px solid #e8e3da; border-radius:20px; overflow:hidden;
          transition:all .28s; }
        .proj-card:hover { border-color:#f97316; transform:translateY(-5px); box-shadow:0 20px 52px rgba(0,0,0,.1); }

        /* contact */
        .fc-primary { display:inline-flex; align-items:center; gap:8px; background:#1a1a1a;
          color:#fff; border-radius:100px; padding:14px 32px; font-family:'DM Sans',sans-serif;
          font-size:15px; font-weight:700; text-decoration:none; border:none; cursor:pointer;
          transition:all .22s; }
        .fc-primary:hover { background:#f97316; transform:translateY(-2px); box-shadow:0 12px 30px rgba(249,115,22,.3); }
        .fc-ghost { display:inline-flex; align-items:center; gap:8px; border:1.5px solid #d5d0c8;
          color:#555; border-radius:100px; padding:14px 32px; font-family:'DM Sans',sans-serif;
          font-size:15px; font-weight:700; text-decoration:none; transition:all .22s; }
        .fc-ghost:hover { border-color:#1a1a1a; color:#1a1a1a; transform:translateY(-2px); }

        /* edu card */
        .edu { background:#fff; border:1px solid #e8e3da; border-radius:14px; padding:24px; transition:border-color .2s; }
        .edu:hover { border-color:#f97316; }

        @keyframes fadein { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      `}</style>

      {/* ── PILL NAV ── */}
      <div style={{ position:'fixed', top:'22px', left:'50%', transform:'translateX(-50%)',
        zIndex:300, opacity: scrolled ? 1 : 0.8, transition:'opacity .3s' }}>
        <div className="fnav">
          {SECS.map((s, i) => (
            <button key={s.id} onClick={() => goto(s.id)} className={`fnav-btn ${activeIdx===i?'act':''}`}>
              <span>{s.emoji}</span><span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── INTRO ── */}
      <section id="intro" style={{ minHeight:'100vh', display:'flex', flexDirection:'column',
        justifyContent:'center', padding:'128px 80px 80px', maxWidth:'1080px', margin:'0 auto', position:'relative' }}>
        {/* deco blob */}
        <div style={{ position:'absolute', top:'8%', right:'0', width:'360px', height:'360px',
          background:'radial-gradient(circle,rgba(249,115,22,.07) 0%,transparent 70%)',
          borderRadius:'50%', pointerEvents:'none' }} />

        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:.9, ease:[0.16,1,0.3,1] }}>
          {/* available */}
          <div className="dm" style={{ display:'inline-flex', alignItems:'center', gap:'8px',
            background:'rgba(249,115,22,.08)', border:'1px solid rgba(249,115,22,.2)',
            borderRadius:'100px', padding:'7px 18px', marginBottom:'32px' }}>
            <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:'13px', fontWeight:700, color:'#f97316', letterSpacing:'.04em' }}>Available for Opportunities</span>
          </div>

          {/* big serif name */}
          <h1 style={{ fontSize:'clamp(56px,9vw,112px)', fontWeight:900, lineHeight:.92,
            letterSpacing:'-.04em', marginBottom:'32px' }}>
            {(pi.name || 'Your Name').split(' ').map((word, wi) => (
              <span key={wi} style={{ display:'block', fontStyle: wi%2===1 ? 'italic' : 'normal',
                color: wi%2===1 ? '#f97316' : '#1a1a1a' }}>
                {word}
              </span>
            ))}
          </h1>

          <div style={{ display:'flex', alignItems:'flex-start', gap:'56px', flexWrap:'wrap' }}>
            <div style={{ maxWidth:'440px' }}>
              <p className="dm" style={{ fontSize:'17px', color:'#555', lineHeight:1.85, marginBottom:'12px' }}>
                {pi.role && <strong style={{ color:'#1a1a1a' }}>{pi.role}. </strong>}
                {pi.bio}
              </p>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', marginTop:'28px' }}>
                {projects.length > 0 && <button onClick={() => goto('projects')} className="fc-primary">View My Work</button>}
                <button onClick={() => goto('contact')} className="fc-ghost">Get In Touch</button>
              </div>
            </div>

            {/* info card */}
            <div style={{ background:'#fff', border:'1px solid #e8e3da', borderRadius:'20px',
              padding:'26px 30px', minWidth:'210px', boxShadow:'0 4px 20px rgba(0,0,0,.05)' }}>
              <div className="dm" style={{ fontSize:'10px', fontWeight:700, color:'#ccc',
                letterSpacing:'.16em', marginBottom:'20px' }}>QUICK INFO</div>
              {[
                ['ROLE',     pi.role || '—'],
                ['BASED IN', pi.location || '—'],
                ['PROJECTS', `${projects.length}+ shipped`],
              ].map(([k,v]) => (
                <div key={k} style={{ marginBottom:'14px' }}>
                  <div className="dm" style={{ fontSize:'10px', color:'#ccc', marginBottom:'2px', fontWeight:700, letterSpacing:'.1em' }}>{k}</div>
                  <div className="dm" style={{ fontSize:'14px', fontWeight:700, color:'#1a1a1a' }}>{v}</div>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #f0ede8' }}>
                <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e' }} />
                <span className="dm" style={{ fontSize:'13px', fontWeight:700, color:'#22c55e' }}>Open to Work</span>
              </div>
            </div>
          </div>

          {/* stats */}
          <div style={{ display:'flex', gap:'44px', marginTop:'56px', paddingTop:'36px',
            borderTop:'1px solid #e8e3da', flexWrap:'wrap' }}>
            {[
              [experience.length+'+', 'Roles'],
              [projects.length+'+',   'Projects'],
              [skills.length,         'Skills'],
            ].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize:'clamp(28px,3.5vw,44px)', fontWeight:900, color:'#1a1a1a', letterSpacing:'-.03em', lineHeight:1 }}>{v}</div>
                <div className="dm" style={{ fontSize:'12px', color:'#aaa', fontWeight:600, marginTop:'5px' }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background:'#1a1a1a', padding:'108px 80px' }}>
        <div style={{ maxWidth:'1080px', margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.7 }}>
            <div className="f-eyebrow" style={{ color:'#555', '::before':{ background:'#555' } }}>
              <span style={{ width:'28px', height:'2px', background:'#555', borderRadius:'1px', display:'inline-block' }} />
              About Me
            </div>
            <h2 style={{ fontSize:'clamp(32px,5.5vw,72px)', fontWeight:900, letterSpacing:'-.04em',
              color:'#fff', lineHeight:.97, marginBottom:'48px' }}>
              Design is how<br />
              <em style={{ fontStyle:'italic', color:'#f97316' }}>things work</em>
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', alignItems:'start' }}>
              <p className="dm" style={{ fontSize:'17px', color:'#888', lineHeight:1.85 }}>{pi.bio}</p>
              <div>
                <blockquote style={{ borderLeft:'3px solid #f97316', paddingLeft:'22px' }}>
                  <p style={{ fontSize:'18px', fontStyle:'italic', color:'#ddd', lineHeight:1.7 }}>
                    "Good design solves problems. Great design makes people feel something."
                  </p>
                </blockquote>
                {(pi.email || pi.location || certifications.length > 0) && (
                  <div className="dm" style={{ marginTop:'28px', padding:'18px 22px', border:'1px solid #2a2a2a', borderRadius:'12px' }}>
                    {pi.email    && <div style={{ fontSize:'13px', color:'#888', padding:'5px 0' }}>✉ {pi.email}</div>}
                    {pi.location && <div style={{ fontSize:'13px', color:'#888', padding:'5px 0' }}>📍 {pi.location}</div>}
                    {certifications.map((c,i) => <div key={i} style={{ fontSize:'13px', color:'#888', padding:'5px 0' }}>🏆 {c}</div>)}
                  </div>
                )}
              </div>
            </div>

            {/* process steps */}
            {experience.length > 0 && (
              <div style={{ marginTop:'60px' }}>
                <div className="dm" style={{ fontSize:'11px', fontWeight:700, color:'#555', letterSpacing:'.14em', marginBottom:'28px' }}>MY PROCESS</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1px', background:'#2a2a2a', borderRadius:'12px', overflow:'hidden' }}>
                  {['Discover','Define','Ideate','Prototype','Test'].map((step, i) => (
                    <div key={i} style={{ background:'#1a1a1a', padding:'22px 20px' }}>
                      <div style={{ fontFamily:'DM Sans', fontSize:'11px', fontWeight:700, color:'#f97316', marginBottom:'8px' }}>0{i+1}</div>
                      <div style={{ fontSize:'15px', fontWeight:700, color:'#fff' }}>{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section id="skills">
          <div className="f-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.15 }} transition={{ duration:.7 }}>
              <div className="f-eyebrow">Capabilities</div>
              <h2 style={{ fontSize:'clamp(30px,4.5vw,58px)', fontWeight:900, letterSpacing:'-.03em',
                lineHeight:1.0, marginBottom:'14px', color:'#1a1a1a' }}>
                What I bring<br />
                <em style={{ fontStyle:'italic', color:'#f97316' }}>to the table</em>
              </h2>
              <p className="dm" style={{ fontSize:'16px', color:'#888', marginBottom:'44px', maxWidth:'480px', lineHeight:1.7 }}>
                A blend of craft and user empathy — end to end.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))', gap:'14px' }}>
                {groups.map((g, gi) => (
                  <motion.div key={gi} className="sg"
                    initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: gi * .07 }}>
                    <div style={{ fontSize:'24px', marginBottom:'10px' }}>{g.emoji}</div>
                    <div className="dm" style={{ fontSize:'14px', fontWeight:800, color:'#1a1a1a', marginBottom:'14px' }}>{g.label}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', margin:'-3px' }}>
                      {g.items.map((s, i) => <span key={i} className="sg-tag">{s}</span>)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {(languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'32px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'14px' }}>
                  {languages.length > 0 && (
                    <div className="sg">
                      <div style={{ fontSize:'24px', marginBottom:'10px' }}>🗣️</div>
                      <div className="dm" style={{ fontSize:'14px', fontWeight:800, color:'#1a1a1a', marginBottom:'14px' }}>Languages</div>
                      <div style={{ display:'flex', flexWrap:'wrap', margin:'-3px' }}>
                        {languages.map((l,i) => <span key={i} className="sg-tag">{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div className="sg">
                      <div style={{ fontSize:'24px', marginBottom:'10px' }}>🏆</div>
                      <div className="dm" style={{ fontSize:'14px', fontWeight:800, color:'#1a1a1a', marginBottom:'14px' }}>Achievements</div>
                      {achievements.map((a,i) => <div key={i} className="dm" style={{ fontSize:'13px', color:'#666', padding:'5px 0', borderBottom:'1px solid #f0ede8' }}>— {a}</div>)}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {experience.length > 0 && (
        <section id="experience" style={{ background:'#f4f1ec' }}>
          <div className="f-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.7 }}>
              <div className="f-eyebrow">Experience</div>
              <h2 style={{ fontSize:'clamp(30px,4.5vw,58px)', fontWeight:900, letterSpacing:'-.03em',
                lineHeight:1.0, marginBottom:'48px', color:'#1a1a1a' }}>
                Where I've<br />
                <em style={{ fontStyle:'italic', color:'#f97316' }}>worked</em>
              </h2>

              {experience.map((e, i) => (
                <motion.div key={i} className="exp-row"
                  initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .11 }}>
                  <div>
                    <div className="dm" style={{ fontSize:'12px', fontWeight:700, color:'#aaa', marginBottom:'5px' }}>{e.duration}</div>
                    <div className="dm" style={{ fontSize:'15px', fontWeight:800, color:'#f97316' }}>{e.company}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'22px', fontWeight:800, color:'#1a1a1a', marginBottom:'14px', letterSpacing:'-.02em' }}>{e.role}</div>
                    {(e.description||'').split(/[·\n]/).map(s=>s.trim()).filter(Boolean).map((b, bi) => (
                      <div key={bi} className="exp-bullet">{b}</div>
                    ))}
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop:'1px solid #e8e3da' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects">
          <div className="f-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.7 }}>
              <div className="f-eyebrow">Selected Work</div>
              <h2 style={{ fontSize:'clamp(30px,4.5vw,58px)', fontWeight:900, letterSpacing:'-.03em',
                lineHeight:1.0, marginBottom:'14px', color:'#1a1a1a' }}>
                Projects I've<br />
                <em style={{ fontStyle:'italic', color:'#f97316' }}>been building</em>
              </h2>
              <p className="dm" style={{ fontSize:'16px', color:'#888', marginBottom:'44px', maxWidth:'480px', lineHeight:1.7 }}>
                From concept to shipped — here's what I've been working on.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="proj-card"
                    initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .09 }}>
                    {/* color band top */}
                    <div style={{ height:'130px', borderBottom:'1px solid #e8e3da',
                      background:`linear-gradient(135deg,${PALETTE[i%PALETTE.length]}18,${PALETTE[(i+3)%PALETTE.length]}0d)`,
                      display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 32px' }}>
                      <div style={{ fontSize:'40px' }}>{'🚀⚡🎯💡🔧🎨🧩🌐'[i%8]}</div>
                      <div className="dm" style={{ fontSize:'10px', fontWeight:800, color:'#aaa', letterSpacing:'.16em' }}>
                        {String(i+1).padStart(2,'0')}
                      </div>
                    </div>
                    {/* body */}
                    <div style={{ padding:'26px 32px 30px', display:'grid', gridTemplateColumns:'1fr auto', gap:'24px', alignItems:'start' }}>
                      <div>
                        <h3 style={{ fontSize:'clamp(20px,2.5vw,28px)', fontWeight:800, color:'#1a1a1a',
                          letterSpacing:'-.025em', marginBottom:'12px', lineHeight:1.1 }}>
                          {p.title.includes(' ')
                            ? <>{p.title.split(' ').slice(0,Math.ceil(p.title.split(' ').length/2)).join(' ')}<br /><span style={{color:'#f97316'}}>{p.title.split(' ').slice(Math.ceil(p.title.split(' ').length/2)).join(' ')}</span></>
                            : p.title}
                        </h3>
                        <p className="dm" style={{ fontSize:'14px', color:'#666', lineHeight:1.75, marginBottom:'16px' }}>{p.description}</p>
                        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'20px' }}>
                          {p.tags?.map((t,j) => (
                            <span key={j} className="dm" style={{ background:'#f9f5ef', border:'1px solid #e8dfd0',
                              borderRadius:'5px', padding:'4px 10px', fontSize:'12px', color:'#666', fontWeight:700 }}>{t}</span>
                          ))}
                        </div>
                        {p.link && (
                          <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`}
                            target="_blank" rel="noreferrer"
                            style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'13.5px',
                              fontWeight:700, color:'#f97316', textDecoration:'none', transition:'gap .2s' }}
                            onMouseEnter={e=>e.currentTarget.style.gap='9px'} onMouseLeave={e=>e.currentTarget.style.gap='5px'}>
                            View Case Study →
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section id="education" style={{ background:'#f4f1ec' }}>
          <div className="f-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.7 }}>
              <div className="f-eyebrow">Education</div>
              <h2 style={{ fontSize:'clamp(30px,4.5vw,58px)', fontWeight:900, letterSpacing:'-.03em',
                lineHeight:1.0, marginBottom:'44px', color:'#1a1a1a' }}>
                Academic<br /><em style={{ fontStyle:'italic', color:'#f97316' }}>Background</em>
              </h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
                {education.map((e,i) => (
                  <motion.div key={i} className="edu"
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .1 }}>
                    {e.year && <div className="dm" style={{ fontSize:'11px', fontWeight:700, color:'#f97316', letterSpacing:'.1em', marginBottom:'10px' }}>{e.year}</div>}
                    <div style={{ fontSize:'18px', fontWeight:800, color:'#1a1a1a', marginBottom:'4px', letterSpacing:'-.015em' }}>{e.degree}</div>
                    <div className="dm" style={{ fontSize:'13px', color:'#888', fontWeight:500 }}>{e.school}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:'108px 80px', maxWidth:'1080px', margin:'0 auto', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="f-eyebrow" style={{ justifyContent:'center' }}>
            <span style={{ width:'28px', height:'2px', background:'#f97316', borderRadius:'1px', display:'inline-block' }} />
            Let's Work Together
          </div>
          <h2 style={{ fontSize:'clamp(44px,7.5vw,96px)', fontWeight:900, letterSpacing:'-.04em',
            lineHeight:.93, marginBottom:'24px', color:'#1a1a1a' }}>
            Got a project<br />
            <em style={{ fontStyle:'italic', color:'#f97316' }}>in mind?</em>
          </h2>
          <p className="dm" style={{ fontSize:'17px', color:'#888', lineHeight:1.8, maxWidth:'440px',
            margin:'0 auto 44px', }}>
            Whether it's a full product design, a redesign, or a branding project — I'm all ears.
          </p>
          <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', marginBottom:'80px' }}>
            {pi.email    && <a href={`mailto:${pi.email}`} className="fc-primary">Start a Conversation →</a>}
            {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="fc-ghost">LinkedIn ↗</a>}
            {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="fc-ghost">GitHub ↗</a>}
            {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="fc-ghost">Website ↗</a>}
          </div>
        </motion.div>
      </section>

      {/* footer */}
      <div className="dm" style={{ padding:'24px 80px', borderTop:'1px solid #e8e3da',
        display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', fontSize:'12px', color:'#bbb' }}>
        <span>© {new Date().getFullYear()} {pi.name} · Built with empathy</span>
        <span>Portfolify AI</span>
      </div>
    </div>
  );
};
export default CreativeTemplate;