import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const ModernTemplate = ({ data }) => {
  if (!data) return null;
  const {
    personalInfo: pi = {},
    skills = [], experience = [], projects = [],
    education = [], certifications = [], languages = [], achievements = []
  } = data;

  const [activeSection, setActiveSection] = useState('about');
  const [navScrolled, setNavScrolled]     = useState(false);
  const [activeProj, setActiveProj]       = useState(0);
  const [mousePos, setMousePos]           = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const navIds = ['about', 'skills', 'work', 'projects', 'education', 'contact'].filter(s => {
    if (s === 'work')      return experience.length > 0;
    if (s === 'projects')  return projects.length > 0;
    if (s === 'education') return education.length > 0;
    if (s === 'skills')    return skills.length > 0;
    return true;
  });

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    const onMouse  = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('scroll', onScroll);
    window.addEventListener('mousemove', onMouse);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3, rootMargin: '0px 0px -40% 0px' }
    );
    navIds.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [navIds.length]);

  const goto = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const initial = (pi.name || 'U')[0].toUpperCase();

  const PROJ_ICONS = ['🚀','⚡','🎯','💡','🔧','🎨','🧩','🌐','📱','🛰️'];

  return (
    <div style={{ background:'#0a0a0f', color:'#e8e8f0', fontFamily:"'Outfit','DM Sans',sans-serif", minHeight:'100vh', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#2d2d3d;border-radius:2px}

        @keyframes gradient-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-16px) rotate(3deg)} }

        .m-nav-link { font-size:13px; font-weight:500; color:#555570; cursor:pointer; padding:6px 0;
          border:none; background:none; font-family:inherit; transition:all .2s; position:relative; }
        .m-nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px;
          background:#c084fc; border-radius:1px; transition:width .2s; }
        .m-nav-link:hover { color:#e8e8f0; }
        .m-nav-link.act { color:#e8e8f0; }
        .m-nav-link.act::after { width:100%; }

        .m-sec { padding:108px 80px; max-width:1020px; margin:0 auto; }
        @media(max-width:768px){ .m-sec{ padding:80px 24px; } }

        .m-eyebrow { font-size:11px; font-weight:700; color:#c084fc; letter-spacing:.14em; margin-bottom:12px; }
        .m-h2 { font-size:clamp(28px,4vw,46px); font-weight:800; letter-spacing:-.025em; margin-bottom:52px; line-height:1.08; }

        .m-skill-tile { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
          border-radius:12px; padding:14px 16px; text-align:center; font-size:13px; font-weight:600;
          color:#ccc; cursor:default; transition:all .22s; }
        .m-skill-tile:hover { border-color:rgba(192,132,252,.32); color:#e8e8f0;
          background:rgba(192,132,252,.06); transform:translateY(-2px); }

        .m-tl { border-left:2px solid rgba(192,132,252,.18); padding-left:26px;
          padding-bottom:38px; position:relative; }
        .m-tl:last-child { padding-bottom:0; }
        .m-tl-dot { position:absolute; left:-7px; top:4px; width:12px; height:12px; border-radius:50%;
          background:#c084fc; box-shadow:0 0 0 4px rgba(192,132,252,.12), 0 0 18px rgba(192,132,252,.38); }

        .m-tag { background:rgba(192,132,252,.1); border:1px solid rgba(192,132,252,.22);
          border-radius:6px; padding:4px 10px; font-size:12px; color:#c084fc; font-weight:500; }

        .m-proj-tab { padding:8px 18px; border-radius:8px; border:1px solid; cursor:pointer;
          font-size:13px; font-weight:600; transition:all .2s; font-family:inherit; }

        .m-edu-card { background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.07);
          border-radius:20px; padding:28px; transition:border-color .2s; }
        .m-edu-card:hover { border-color:rgba(192,132,252,.28); }

        .m-cta-primary { display:inline-flex; align-items:center; gap:8px;
          background:linear-gradient(135deg,#c084fc,#818cf8); border-radius:12px;
          padding:14px 28px; color:#fff; font-size:15px; font-weight:700; text-decoration:none;
          box-shadow:0 10px 28px rgba(192,132,252,.28); transition:all .2s; border:none; font-family:inherit; cursor:pointer; }
        .m-cta-primary:hover { transform:translateY(-2px); box-shadow:0 16px 36px rgba(192,132,252,.38); }
        .m-cta-ghost { display:inline-flex; align-items:center; gap:8px;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.11);
          border-radius:12px; padding:14px 28px; color:#e8e8f0; font-size:15px;
          font-weight:600; text-decoration:none; transition:all .2s; }
        .m-cta-ghost:hover { border-color:rgba(255,255,255,.22); transform:translateY(-2px); }
      `}</style>

      {/* mouse glow */}
      <div style={{ position:'fixed', width:'380px', height:'380px', borderRadius:'50%', pointerEvents:'none', zIndex:0,
        background:'radial-gradient(circle,rgba(192,132,252,.055) 0%,transparent 70%)',
        left: mousePos.x - 190, top: mousePos.y - 190,
        transition:'left .35s ease,top .35s ease' }} />

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200,
        padding:'0 48px', height:'58px', display:'flex', alignItems:'center', justifyContent:'space-between',
        background: navScrolled ? 'rgba(10,10,15,.93)' : 'transparent',
        backdropFilter: navScrolled ? 'blur(20px)' : 'none',
        borderBottom: navScrolled ? '1px solid rgba(255,255,255,.06)' : 'none',
        transition:'all .4s' }}>
        <div style={{ fontWeight:800, fontSize:'15px', letterSpacing:'-.02em' }}>
          {(pi.name || 'Portfolio').split(' ')[0]}<span style={{ color:'#c084fc' }}>.</span>
        </div>
        <div style={{ display:'flex', gap:'28px' }}>
          {navIds.map(id => (
            <button key={id} onClick={() => goto(id)}
              className={`m-nav-link ${activeSection === id ? 'act' : ''}`}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HERO / ABOUT ── */}
      <section id="about" ref={heroRef}
        style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', overflow:'hidden', paddingTop:'58px' }}>
        {/* orbs */}
        <div style={{ position:'absolute', top:'12%', right:'6%', width:'520px', height:'520px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(192,132,252,.11) 0%,transparent 70%)',
          filter:'blur(44px)', animation:'float 9s ease infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'8%', left:'2%', width:'320px', height:'320px', borderRadius:'50%',
          background:'radial-gradient(circle,rgba(129,140,248,.07) 0%,transparent 70%)',
          filter:'blur(32px)', animation:'float 12s ease infinite 4s', pointerEvents:'none' }} />

        <motion.div style={{ opacity: heroOpacity, y: heroY }}
          className="m-sec" style={{ width:'100%', padding:'80px' }}>
          <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:.8 }}>
            {/* avatar */}
            <div style={{ width:'78px', height:'78px', borderRadius:'50%',
              background:'linear-gradient(135deg,#c084fc,#818cf8)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'30px', fontWeight:800, color:'#fff', marginBottom:'32px',
              boxShadow:'0 0 44px rgba(192,132,252,.3)' }}>
              {initial}
            </div>

            {/* pill badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:'8px',
              background:'rgba(192,132,252,.1)', border:'1px solid rgba(192,132,252,.26)',
              borderRadius:'100px', padding:'5px 16px', marginBottom:'24px' }}>
              <span style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#c084fc',
                boxShadow:'0 0 7px #c084fc' }} />
              <span style={{ fontSize:'12px', fontWeight:600, color:'#c084fc', letterSpacing:'.06em' }}>
                {pi.role || 'Professional'}
              </span>
            </div>

            {/* name */}
            <h1 style={{ fontSize:'clamp(48px,7vw,92px)', fontWeight:800, lineHeight:1.0,
              letterSpacing:'-.03em', marginBottom:'24px' }}>
              <span>Hi, I'm </span>
              <span style={{ background:'linear-gradient(135deg,#c084fc 0%,#818cf8 50%,#38bdf8 100%)',
                backgroundSize:'200% 200%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundClip:'text', animation:'gradient-shift 4s ease infinite' }}>
                {(pi.name || 'Alex').split(' ')[0]}
              </span>
              <span>.</span>
            </h1>

            <p style={{ fontSize:'clamp(15px,2vw,19px)', color:'#555570', lineHeight:1.85,
              maxWidth:'560px', marginBottom:'40px' }}>{pi.bio}</p>

            {/* CTA row */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', marginBottom:'64px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`}    className="m-cta-primary">✉ Say Hello</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="m-cta-ghost">⌨ GitHub</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="m-cta-ghost">🔗 LinkedIn</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="m-cta-ghost">🌐 Website</a>}
            </div>

            {/* stats strip */}
            <div style={{ display:'flex', gap:'44px', flexWrap:'wrap' }}>
              {[[experience.length, 'Roles'], [projects.length, 'Projects'], [skills.length, 'Skills'], [education.length, 'Degrees']].map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize:'30px', fontWeight:800, letterSpacing:'-.02em' }}>{v || '—'}</div>
                  <div style={{ fontSize:'12px', color:'#555570', fontWeight:500, marginTop:'2px' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section id="skills" style={{ background:'rgba(255,255,255,.012)' }}>
          <div className="m-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.15 }} transition={{ duration:.6 }}>
              <div className="m-eyebrow">EXPERTISE</div>
              <h2 className="m-h2">Skills & Tools</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',
                gap:'10px', maxWidth:'820px' }}>
                {skills.map((s,i) => (
                  <motion.div key={i} className="m-skill-tile"
                    initial={{ opacity:0, scale:.9 }} whileInView={{ opacity:1, scale:1 }}
                    viewport={{ once:true }} transition={{ delay: i * .028 }}
                    whileHover={{ scale:1.05, y:-2 }}>
                    {s}
                  </motion.div>
                ))}
              </div>

              {(certifications.length > 0 || languages.length > 0 || achievements.length > 0) && (
                <div style={{ marginTop:'56px', display:'grid',
                  gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'20px' }}>
                  {certifications.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'16px', padding:'24px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#c084fc', letterSpacing:'.12em', marginBottom:'14px' }}>CERTIFICATIONS</div>
                      {certifications.map((c,i) => <div key={i} style={{ fontSize:'13px', color:'#888', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>• {c}</div>)}
                    </div>
                  )}
                  {languages.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'16px', padding:'24px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#c084fc', letterSpacing:'.12em', marginBottom:'14px' }}>LANGUAGES</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                        {languages.map((l,i) => <span key={i} className="m-tag">{l}</span>)}
                      </div>
                    </div>
                  )}
                  {achievements.length > 0 && (
                    <div style={{ background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.07)', borderRadius:'16px', padding:'24px' }}>
                      <div style={{ fontSize:'10.5px', fontWeight:700, color:'#c084fc', letterSpacing:'.12em', marginBottom:'14px' }}>ACHIEVEMENTS</div>
                      {achievements.map((a,i) => <div key={i} style={{ fontSize:'13px', color:'#888', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>🏆 {a}</div>)}
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
        <section id="work">
          <div className="m-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="m-eyebrow">CAREER</div>
              <h2 className="m-h2">Work History</h2>
              <div style={{ maxWidth:'700px' }}>
                {experience.map((e, i) => (
                  <motion.div key={i} className="m-tl"
                    initial={{ opacity:0, x:-18 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .14 }}>
                    <div className="m-tl-dot" />
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start',
                      flexWrap:'wrap', gap:'8px', marginBottom:'8px' }}>
                      <div>
                        <div style={{ fontSize:'19px', fontWeight:700, color:'#e8e8f0', marginBottom:'3px' }}>{e.role}</div>
                        <div style={{ fontSize:'14px', color:'#c084fc', fontWeight:600 }}>{e.company}</div>
                      </div>
                      <span style={{ background:'rgba(192,132,252,.08)', border:'1px solid rgba(192,132,252,.17)',
                        borderRadius:'6px', padding:'4px 12px', fontSize:'12px', color:'#888', whiteSpace:'nowrap' }}>{e.duration}</span>
                    </div>
                    <p style={{ fontSize:'14px', color:'#555570', lineHeight:1.85 }}>{e.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section id="projects" style={{ background:'rgba(255,255,255,.012)' }}>
          <div className="m-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.1 }} transition={{ duration:.6 }}>
              <div className="m-eyebrow">WORK</div>
              <h2 className="m-h2">Featured Projects</h2>

              {/* project tab switcher */}
              <div style={{ display:'flex', gap:'8px', marginBottom:'36px', flexWrap:'wrap' }}>
                {projects.map((p,i) => (
                  <button key={i} onClick={() => setActiveProj(i)}
                    className="m-proj-tab"
                    style={{ borderColor: activeProj===i ? '#c084fc' : 'rgba(255,255,255,.09)',
                      background: activeProj===i ? 'rgba(192,132,252,.12)' : 'transparent',
                      color: activeProj===i ? '#c084fc' : '#555570' }}>
                    {p.title.length > 18 ? p.title.slice(0,18)+'…' : p.title}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {projects[activeProj] && (
                  <motion.div key={activeProj}
                    initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-18 }} transition={{ duration:.32 }}
                    style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px',
                      alignItems:'center', background:'rgba(255,255,255,.025)',
                      border:'1px solid rgba(255,255,255,.07)', borderRadius:'24px',
                      padding:'40px', minHeight:'260px' }}>

                    {/* visual */}
                    <div style={{ borderRadius:'16px', aspectRatio:'4/3',
                      background:`linear-gradient(135deg,rgba(192,132,252,.14),rgba(129,140,248,.1))`,
                      display:'flex', flexDirection:'column', alignItems:'center',
                      justifyContent:'center', gap:'12px' }}>
                      <div style={{ fontSize:'52px' }}>{PROJ_ICONS[activeProj % PROJ_ICONS.length]}</div>
                      <div style={{ fontSize:'11px', fontWeight:700, color:'#555570', letterSpacing:'.1em' }}>
                        PROJECT {String(activeProj+1).padStart(2,'0')}
                      </div>
                    </div>

                    {/* info */}
                    <div>
                      <h3 style={{ fontSize:'24px', fontWeight:800, color:'#e8e8f0',
                        marginBottom:'12px', letterSpacing:'-.01em' }}>
                        {projects[activeProj].title}
                      </h3>
                      <p style={{ fontSize:'15px', color:'#555570', lineHeight:1.8, marginBottom:'20px' }}>
                        {projects[activeProj].description}
                      </p>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'24px' }}>
                        {projects[activeProj].tags?.map((t,j) => <span key={j} className="m-tag">{t}</span>)}
                      </div>
                      {projects[activeProj].link && (
                        <a href={projects[activeProj].link.startsWith('http') ? projects[activeProj].link : `https://${projects[activeProj].link}`}
                          target="_blank" rel="noreferrer" className="m-cta-primary" style={{ fontSize:'13px', padding:'10px 20px' }}>
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
        <section id="education">
          <div className="m-sec">
            <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:.2 }} transition={{ duration:.6 }}>
              <div className="m-eyebrow">BACKGROUND</div>
              <h2 className="m-h2">Education</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px' }}>
                {education.map((e,i) => (
                  <motion.div key={i} className="m-edu-card"
                    initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }}
                    viewport={{ once:true }} transition={{ delay: i * .11 }}>
                    <div style={{ background:'rgba(192,132,252,.1)', border:'1px solid rgba(192,132,252,.22)',
                      borderRadius:'6px', padding:'3px 10px', fontSize:'11px', color:'#c084fc',
                      fontWeight:700, display:'inline-block', marginBottom:'14px' }}>{e.year}</div>
                    <div style={{ fontSize:'17px', fontWeight:700, color:'#e8e8f0', marginBottom:'4px' }}>{e.degree}</div>
                    <div style={{ fontSize:'14px', color:'#555570' }}>{e.school}</div>
                    {e.description && <div style={{ fontSize:'13px', color:'#444', marginTop:'10px', lineHeight:1.6 }}>{e.description}</div>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background:'rgba(255,255,255,.012)' }}>
        <div style={{ maxWidth:'1020px', margin:'0 auto', padding:'108px 80px', textAlign:'center' }}>
          <motion.div initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
            <div className="m-eyebrow" style={{ textAlign:'center' }}>REACH OUT</div>
            <h2 style={{ fontSize:'clamp(32px,5vw,56px)', fontWeight:800, letterSpacing:'-.025em',
              marginBottom:'16px', lineHeight:1.05 }}>Let's Work Together</h2>
            <p style={{ color:'#555570', fontSize:'17px', marginBottom:'40px', maxWidth:'420px', margin:'0 auto 40px' }}>
              Open to new opportunities, collaborations, and interesting projects.
            </p>
            <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap', marginBottom:'64px' }}>
              {pi.email    && <a href={`mailto:${pi.email}`} className="m-cta-primary">✉ {pi.email}</a>}
              {pi.linkedin && <a href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`} target="_blank" rel="noreferrer" className="m-cta-ghost">🔗 LinkedIn</a>}
              {pi.github   && <a href={pi.github.startsWith('http')   ? pi.github   : `https://${pi.github}`}   target="_blank" rel="noreferrer" className="m-cta-ghost">⌨ GitHub</a>}
              {pi.website  && <a href={pi.website.startsWith('http')  ? pi.website  : `https://${pi.website}`}  target="_blank" rel="noreferrer" className="m-cta-ghost">🌐 Website</a>}
            </div>
            <div style={{ fontSize:'12px', color:'#2d2d3d', letterSpacing:'.08em' }}>
              © {new Date().getFullYear()} {pi.name} · Built with Portfolify AI
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ModernTemplate;