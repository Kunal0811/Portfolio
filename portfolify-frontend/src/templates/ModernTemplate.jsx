import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

/*
  Lumière — Modern Template
  Light + dark split. Fixed top nav. Skills as capability cards with icon + name + tag list.
  Projects: numbered list with visual + two-line title. Experience: left/right grid.
*/

const ModernTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [active, setActive]       = useState('home');
  const [scrolled, setScrolled]   = useState(false);
  const [mousePos, setMousePos]   = useState({ x: -999, y: -999 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const NAV = ['home', 'about', 'skills', 'work', 'projects', 'contact'].filter(id => {
    if (id === 'work')     return experience.length > 0;
    if (id === 'projects') return projects.length > 0;
    if (id === 'skills')   return skills.length > 0;
    return true;
  });
  const NAV_LABELS = { home:'Home', about:'About', skills:'Skills', work:'Work', projects:'Projects', contact:"Let's Talk" };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    const onMouse  = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.25, rootMargin: '0px 0px -50% 0px' }
    );
    NAV.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [NAV.length]);

  const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const initial = (pi.name || 'U')[0].toUpperCase();

  /* skill capability groups */
  const CAPS = [
    { icon:'🎨', label:'Frontend',   keys:['react','vue','angular','next','svelte','html','css','tailwind','bootstrap','figma','ui','ux','design'] },
    { icon:'⚙️', label:'Backend',    keys:['node','express','django','flask','spring','laravel','fastapi','rails','api','rest','graphql'] },
    { icon:'🗄️', label:'Data',       keys:['sql','postgres','mysql','mongo','redis','firebase','supabase','elasticsearch','database'] },
    { icon:'☁️', label:'Cloud/DevOps',keys:['aws','azure','gcp','docker','kubernetes','linux','ci','cd','devops','terraform','nginx','git'] },
    { icon:'📱', label:'Mobile',     keys:['react native','flutter','swift','kotlin','android','ios','mobile','expo'] },
    { icon:'🤖', label:'AI/ML',      keys:['python','machine learning','deep learning','tensorflow','pytorch','nlp','llm','openai','gemini','ml','ai'] },
  ];
  const capGroups = CAPS.map(c => ({
    ...c,
    items: skills.filter(s => c.keys.some(k => s.toLowerCase().includes(k)))
  })).filter(c => c.items.length > 0);
  const usedSkills = capGroups.flatMap(c => c.items);
  const otherSkills = skills.filter(s => !usedSkills.includes(s));
  if (otherSkills.length > 0) capGroups.push({ icon:'✦', label:'Other', items: otherSkills });

  const ACCENT = '#8b5cf6';

  return (
    <div style={{ background:'#fafaf9', color:'#111', fontFamily:"'Outfit','DM Sans',sans-serif", minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#e0ddd8}

        @keyframes gradient-anim { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes float-blob { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-20px) scale(1.04)} }
        @keyframes pulse-dot { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes fadein { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        .l-nav a, .l-nav button { font-size:13.5px; font-weight:600; color:#888; cursor:pointer;
          border:none; background:none; font-family:inherit; padding:5px 0; position:relative;
          text-decoration:none; transition:color .2s; }
        .l-nav a::after, .l-nav button::after { content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:2px; background:#8b5cf6; border-radius:1px; transition:width .22s; }
        .l-nav a:hover, .l-nav button:hover,
        .l-nav a.act, .l-nav button.act { color:#111; }
        .l-nav a.act::after, .l-nav button.act::after { width:100%; }

        .l-sec { padding:108px 80px; max-width:1060px; margin:0 auto; }
        @media(max-width:768px){ .l-sec{ padding:80px 24px; } }

        .l-eyebrow { font-size:11px; font-weight:700; color:#8b5cf6; letter-spacing:.16em; margin-bottom:14px; }
        .l-h2 { font-size:clamp(28px,4vw,50px); font-weight:800; letter-spacing:-.025em;
          line-height:1.06; margin-bottom:52px; color:#111; }

        /* skill capability card */
        .cap-card { background:#fff; border:1px solid #ebe8e0; border-radius:16px; padding:24px 26px;
          transition:all .25s; cursor:default; }
        .cap-card:hover { border-color:#8b5cf6; box-shadow:0 8px 32px rgba(139,92,246,.1); transform:translateY(-3px); }
        .cap-tag { display:inline-block; background:#f4f0ff; border:1px solid #e4daff;
          border-radius:6px; padding:4px 11px; font-size:12px; color:#7c3aed; font-weight:600;
          margin:3px; transition:all .18s; }
        .cap-tag:hover { background:#ede9fe; }

        /* experience grid */
        .exp-row { display:grid; grid-template-columns:180px 1fr; gap:32px;
          border-top:1px solid #ebe8e0; padding:28px 0; transition:background .2s; }
        .exp-row:hover { background:rgba(139,92,246,.02); }
        .exp-bullet { font-size:14px; color:#555; line-height:1.78; padding-left:14px;
          position:relative; margin-bottom:4px; }
        .exp-bullet::before { content:'→'; position:absolute; left:0; color:#8b5cf6; font-size:11px; top:3px; font-weight:700; }

        /* project row */
        .proj-row { background:#fff; border:1px solid #ebe8e0; border-radius:20px; overflow:hidden;
          display:grid; grid-template-columns:300px 1fr; transition:all .28s; }
        .proj-row:hover { border-color:#8b5cf6; box-shadow:0 12px 40px rgba(139,92,246,.1); }
        @media(max-width:700px){ .proj-row{ grid-template-columns:1fr; } }
        .proj-tag { background:#f4f0ff; border:1px solid #e4daff; border-radius:5px;
          padding:4px 10px; font-size:11.5px; color:#7c3aed; font-weight:600; }

        /* contact */
        .c-primary { display:inline-flex; align-items:center; gap:8px; background:#111;
          color:#fff; border:none; border-radius:100px; padding:14px 32px; font-size:15px;
          font-weight:700; cursor:pointer; text-decoration:none; font-family:inherit;
          transition:all .22s; }
        .c-primary:hover { background:#8b5cf6; transform:translateY(-2px); box-shadow:0 12px 30px rgba(139,92,246,.3); }
        .c-ghost { display:inline-flex; align-items:center; gap:8px; border:1.5px solid #d5d0ca;
          color:#555; border-radius:100px; padding:14px 32px; font-size:15px; font-weight:700;
          text-decoration:none; transition:all .22s; }
        .c-ghost:hover { border-color:#111; color:#111; transform:translateY(-2px); }

        /* edu card */
        .edu-card { background:#fff; border:1px solid #ebe8e0; border-radius:14px; padding:24px; transition:border-color .2s; }
        .edu-card:hover { border-color:#8b5cf6; }
      `}</style>

      {/* mouse glow */}
      <div style={{ position:'fixed', width:'360px', height:'360px', borderRadius:'50%', pointerEvents:'none', zIndex:0,
        background:'radial-gradient(circle,rgba(139,92,246,.05) 0%,transparent 70%)',
        left: mousePos.x - 180, top: mousePos.y - 180,
        transition:'left .3s ease, top .3s ease' }} />

      {/* ── TOP NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:'56px',
        display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px',
        background: scrolled ? 'rgba(250,250,249,.94)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,.06)' : 'none', transition:'all .35s' }}>
        <span style={{ fontWeight:900, fontSize:'18px', letterSpacing:'-.03em', color:'#111' }}>
          {(pi.name || 'Portfolio').split(' ').map(w=>w[0]).join('')}<span style={{ color:'#8b5cf6' }}>.</span>
        </span>
        <div className="l-nav" style={{ display:'flex', gap:'28px', alignItems:'center' }}>
          {NAV.map(id => (
            <button key={id} onClick={() => goto(id)} className={active === id ? 'act' : ''}>{NAV_LABELS[id]}</button>
          ))}
        </div>
      </nav>

      {/* ── HOME HERO ── */}
      <section id="home" ref={heroRef}
        style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:'56px' }}>
        {/* gradient blobs */}
        <div style={{ position:'absolute', top:'5%', right:'-5%', width:'600px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(139,92,246,.1) 0%,transparent 65%)',
          filter:'blur(60px)', animation:'float-blob 9s ease infinite', pointerEvents:'none', zIndex:0 }} />
        <div style={{ position:'absolute', bottom:'0', left:'-10%', width:'400px', height:'400px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(236,72,153,.06) 0%,transparent 70%)',
          filter:'blur(40px)', animation:'float-blob 12s ease infinite 4s', pointerEvents:'none', zIndex:0 }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY, position:'relative', zIndex:1 }}
          className="l-sec" style={{ width:'100%', padding:'100px 80px' }}>
          <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8 }}>

            {/* avatar + available */}
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'36px' }}>
              <div style={{ width:'72px', height:'72px', borderRadius:'50%', flexShrink:0,
                background:'linear-gradient(135deg,#8b5cf6,#ec4899)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'28px', fontWeight:800, color:'#fff',
                boxShadow:'0 0 0 4px #fff, 0 0 0 5px rgba(139,92,246,.25)' }}>
                {initial}
              </div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'8px',
                background:'rgba(139,92,246,.08)', border:'1px solid rgba(139,92,246,.2)',
                borderRadius:'100px', padding:'7px 16px' }}>
                <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#22c55e', animation:'pulse-dot 2s infinite' }} />
                <span style={{ fontSize:'13px', fontWeight:700, color:'#8b5cf6', letterSpacing:'.04em' }}>Available for Opportunities</span>
              </div>
            </div>

            {/* name */}
            <h1 style={{ fontSize:'clamp(46px,7.5vw,96px)', fontWeight:900, lineHeight:.97,
              letterSpacing:'-.035em', marginBottom:'24px' }}>
              <span style={{ display:'block', color:'#111' }}>
                {(pi.name || 'Your Name').split(' ')[0]}
              </span>
              <span style={{ display:'block', background:'linear-gradient(135deg,#8b5cf6 0%,#ec4899 50%,#3b82f6 100%)',
                backgroundSize:'200% 200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', animation:'gradient-anim 5s ease infinite' }}>
                {(pi.name || 'Your Name').split(' ').slice(1).join(' ') || 'Portfolio'}
              </span>
            </h1>

            <div style={{ fontSize:'clamp(15px,2vw,20px)', fontWeight:600, color:'#555',
              marginBottom:'20px', letterSpacing:'-.01em' }}>
              {pi.role || 'Professional'}
            </div>

            <p style={{ fontSize:'clamp(15px,1.5vw,18px)', color:'#777', lineHeight:1.85,
              maxWidth:'520px', marginBottom:'40px' }}>
              {pi.bio}
            </p>

            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'64px' }}>
              {projects.length > 0 && (
                <button onClick={() => goto('projects')} className="c-primary">View My Work →</button>
              )}
              <button onClick={() => goto('contact')} className="c-ghost">Get In Touch</button>
            </div>

            {/* stats strip */}
            <div style={{ display:'flex', gap:'48px', borderTop:'1px solid #ebe8e0', paddingTop:'32px', flexWrap:'wrap' }}>
              {[
                [experience.length+'+'  , 'Years Designing'],
                [projects.length+'+'    , 'Projects'],
                [skills.length          , 'Skills'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize:'clamp(28px,3vw,40px)', fontWeight:900, color:'#111', letterSpacing:'-.03em', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:'12px', color:'#aaa', fontWeight:600, marginTop:'5px', letterSpacing:'.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background:'#111', padding:'108px 80px' }}>
        <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.65 }}>
            <div className="l-eyebrow" style={{ color:'#666' }}>About Me</div>
            <h2 style={{ fontSize:'clamp(32px,5vw,64px)', fontWeight:900, letterSpacing:'-.03em', lineHeight:1.0,
              color:'#fff', marginBottom:'0' }}>
              Design is how<br />
              <em style={{ fontStyle:'italic', color:'#8b5cf6' }}>things work</em>
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', marginTop:'48px', alignItems:'start' }}>
              <div>
                <p style={{ fontSize:'17px', color:'#bbb', lineHeight:1.85, marginBottom:'24px' }}>{pi.bio}</p>
                {pi.location && <div style={{ fontSize:'14px', color:'#666', marginBottom:'8px' }}>📍 {pi.location}</div>}
                {pi.email    && <div style={{ fontSize:'14px', color:'#666', marginBottom:'8px' }}>✉ {pi.email}</div>}
                {pi.phone    && <div style={{ fontSize:'14px', color:'#666', marginBottom:'8px' }}>📞 {pi.phone}</div>}
              </div>
              {/* quote block */}
              <div>
                <blockquote style={{ borderLeft:'3px solid #8b5cf6', paddingLeft:'24px', margin:0 }}>
                  <p style={{ fontSize:'19px', fontStyle:'italic', color:'#ddd', lineHeight:1.7, marginBottom:'16px' }}>
                    "Good design is invisible. Great design makes people feel something."
                  </p>
                  <cite style={{ fontSize:'13px', color:'#555', fontStyle:'normal', fontWeight:600 }}>
                    — {pi.name || 'Developer'}
                  </cite>
                </blockquote>
                {certifications.length > 0 && (
                  <div style={{ marginTop:'28px', padding:'18px 22px', border:'1px solid #2a2a2a', borderRadius:'12px' }}>
                    <div style={{ fontSize:'10px', fontWeight:700, color:'#555', letterSpacing:'.12em', marginBottom:'10px' }}>CERTIFICATIONS</div>
                    {certifications.map((c,i) => <div key={i} style={{ fontSize:'13px', color:'#888', padding:'4px 0' }}>✓ {c}</div>)}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section id="skills">
          <div className="l-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.15 }} transition={{ duration:.65 }}>
              <div className="l-eyebrow">Capabilities</div>
              <h2 className="l-h2">
                What I bring<br />
                <span style={{ color:'#8b5cf6' }}>to the table</span>
              </h2>
              <p style={{ fontSize:'16px', color:'#777', marginBottom:'40px', marginTop:'-36px', maxWidth:'480px', lineHeight:1.7 }}>
                A blend of craft and user empathy — end to end.
              </p>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
                {capGroups.map((g, gi) => (
                  <motion.div key={gi} className="cap-card"
                    initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: gi * .08 }}>
                    <div style={{ fontSize:'26px', marginBottom:'10px' }}>{g.icon}</div>
                    <div style={{ fontSize:'15px', fontWeight:700, color:'#111', marginBottom:'14px' }}>{g.label}</div>
                    <div style={{ display:'flex', flexWrap:'wrap', margin:'-3px' }}>
                      {g.items.map((s, i) => <span key={i} className="cap-tag">{s}</span>)}
                    </div>
                  </motion.div>
                ))}
              </div>

              {(languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'36px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px' }}>
                  {languages.length > 0 && (
                    <div style={{ background:'#fff', border:'1px solid #ebe8e0', borderRadius:'12px', padding:'20px 24px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#8b5cf6', letterSpacing:'.12em', marginBottom:'12px' }}>LANGUAGES</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {languages.map((l,i) => <span key={i} className="cap-tag">{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div style={{ background:'#fff', border:'1px solid #ebe8e0', borderRadius:'12px', padding:'20px 24px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#8b5cf6', letterSpacing:'.12em', marginBottom:'12px' }}>ACHIEVEMENTS</div>
                      {achievements.map((a,i) => <div key={i} style={{ fontSize:'13px', color:'#555', padding:'5px 0' }}>🏆 {a}</div>)}
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
        <section id="work" style={{ background:'#faf9f7' }}>
          <div className="l-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.65 }}>
              <div className="l-eyebrow">Experience</div>
              <h2 className="l-h2">
                Where I've<br />
                <span style={{ color:'#8b5cf6' }}>worked</span>
              </h2>

              {experience.map((e, i) => (
                <motion.div key={i} className="exp-row"
                  initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .11 }}>
                  <div>
                    <div style={{ fontSize:'12px', fontWeight:700, color:'#aaa', marginBottom:'5px', letterSpacing:'.04em' }}>{e.duration}</div>
                    <div style={{ fontSize:'15px', fontWeight:800, color:'#8b5cf6' }}>{e.company}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:'20px', fontWeight:800, color:'#111', marginBottom:'14px', letterSpacing:'-.015em' }}>{e.role}</div>
                    <div>
                      {(e.description || '').split(/[·\n]/).map(s=>s.trim()).filter(Boolean).map((b, bi) => (
                        <div key={bi} className="exp-bullet">{b}</div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div style={{ borderTop:'1px solid #ebe8e0' }} />
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects">
          <div className="l-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.1 }} transition={{ duration:.65 }}>
              <div className="l-eyebrow">Selected Work</div>
              <h2 className="l-h2">
                Projects I've<br />
                <span style={{ color:'#8b5cf6' }}>been building</span>
              </h2>
              <p style={{ fontSize:'16px', color:'#777', marginBottom:'44px', marginTop:'-36px', maxWidth:'480px', lineHeight:1.7 }}>
                From ideas to shipped products — here's a slice of what I've built.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {projects.map((p, i) => (
                  <motion.div key={i} className="proj-row"
                    initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .09 }}>
                    {/* visual */}
                    <div style={{ background:`linear-gradient(135deg,${['rgba(139,92,246,.15)','rgba(236,72,153,.12)','rgba(59,130,246,.12)','rgba(16,185,129,.12)'][i%4]},rgba(0,0,0,.04))`,
                      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                      gap:'10px', minHeight:'180px', borderRight:'1px solid #ebe8e0' }}>
                      <div style={{ fontSize:'44px' }}>{'🚀⚡🎯💡🔧🎨🧩🌐📱'[i%9]}</div>
                      <div style={{ fontSize:'10px', fontWeight:800, color:'#ccc', letterSpacing:'.14em' }}>
                        {String(i+1).padStart(2,'0')}
                      </div>
                    </div>
                    {/* info */}
                    <div style={{ padding:'28px 32px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#8b5cf6', letterSpacing:'.1em', marginBottom:'10px' }}>
                        PROJECT_{String(i+1).padStart(2,'0')}
                      </div>
                      <h3 style={{ fontSize:'clamp(20px,2.5vw,28px)', fontWeight:800, color:'#111',
                        letterSpacing:'-.02em', marginBottom:'12px', lineHeight:1.1 }}>
                        {p.title.includes(' ')
                          ? <>{p.title.split(' ').slice(0,Math.ceil(p.title.split(' ').length/2)).join(' ')}&nbsp;<span style={{color:'#8b5cf6'}}>{p.title.split(' ').slice(Math.ceil(p.title.split(' ').length/2)).join(' ')}</span></>
                          : p.title}
                      </h3>
                      <p style={{ fontSize:'14px', color:'#666', lineHeight:1.78, marginBottom:'18px' }}>{p.description}</p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'22px' }}>
                        {p.tags?.map((t,j) => <span key={j} className="proj-tag">{t}</span>)}
                      </div>
                      {p.link && (
                        <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`}
                          target="_blank" rel="noreferrer"
                          style={{ display:'inline-flex', alignItems:'center', gap:'5px', fontSize:'13.5px',
                            fontWeight:700, color:'#8b5cf6', textDecoration:'none', transition:'gap .2s' }}
                          onMouseEnter={e=>e.currentTarget.style.gap='9px'} onMouseLeave={e=>e.currentTarget.style.gap='5px'}>
                          View Case Study →
                        </a>
                      )}
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
        <section id="education" style={{ background:'#faf9f7' }}>
          <div className="l-sec">
            <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:.65 }}>
              <div className="l-eyebrow">Education</div>
              <h2 className="l-h2">Academic Background</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'16px' }}>
                {education.map((e,i) => (
                  <motion.div key={i} className="edu-card"
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i * .1 }}>
                    {e.year && <div style={{ fontSize:'11px', fontWeight:700, color:'#8b5cf6', letterSpacing:'.1em', marginBottom:'10px' }}>{e.year}</div>}
                    <div style={{ fontSize:'17px', fontWeight:700, color:'#111', marginBottom:'4px' }}>{e.degree}</div>
                    <div style={{ fontSize:'13px', color:'#888' }}>{e.school}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background:'#111', padding:'108px 80px' }}>
        <div style={{ maxWidth:'1060px', margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div className="l-eyebrow" style={{ color:'#555' }}>Let's Work Together</div>
            <h2 style={{ fontSize:'clamp(36px,6vw,76px)', fontWeight:900, letterSpacing:'-.035em',
              color:'#fff', lineHeight:1.0, marginBottom:'28px' }}>
              Got a project<br />
              <em style={{ fontStyle:'italic', color:'#8b5cf6' }}>in mind?</em>
            </h2>
            <p style={{ fontSize:'17px', color:'#777', lineHeight:1.8, maxWidth:'460px', marginBottom:'44px' }}>
              Whether it's a full build, a collaboration, or just a chat — I'm all ears.
            </p>
            <div style={{ display:'flex', gap:'14px', flexWrap:'wrap', marginBottom:'72px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`} className="c-primary">Start a Conversation →</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="c-ghost">LinkedIn ↗</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="c-ghost">GitHub ↗</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="c-ghost">Website ↗</a>}
            </div>
            <div style={{ borderTop:'1px solid #222', paddingTop:'28px', display:'flex', justifyContent:'space-between',
              flexWrap:'wrap', gap:'12px', fontSize:'12px', color:'#444' }}>
              <span>© {new Date().getFullYear()} {pi.name}</span>
              <span>Built with Portfolify AI</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernTemplate;