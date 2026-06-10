import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'

// ─── Mini components ──────────────────────────────────────────────────────────
const TagInput = ({ values = [], onChange, placeholder }) => {
  const [input, setInput] = useState('')
  const add = () => { const v = input.trim(); if (v && !values.includes(v)) { onChange([...values, v]); setInput('') } }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 12px', minHeight: '48px' }}>
      {values.map((v, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '3px 10px', fontSize: '13px', color: '#a5b4fc' }}>
          {v}<button onClick={() => onChange(values.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={values.length ? '' : placeholder}
        style={{ flex: 1, minWidth: '100px', background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit' }} />
    </div>
  )
}

const Input = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>{label}</label>}
    <input {...props} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', ...(props.style || {}) }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
  </div>
)

const Textarea = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>{label}</label>}
    <textarea {...props} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box', ...(props.style || {}) }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }} />
  </div>
)

// ─── Templates config ──────────────────────────────────────────────────────────
const TEMPLATES = [
  { id: 'developer', name: 'Dark Terminal', desc: 'Bold dark theme for developers', preview: { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#38bdf8', text: '#f1f5f9', sub: '#64748b', tag: 'DARK' } },
  { id: 'modern',    name: 'Glass Modern',  desc: 'Glassmorphism for creatives',   preview: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#fff',     text: '#fff',    sub: 'rgba(255,255,255,0.7)', tag: 'GLASS' } },
  { id: 'creative',  name: 'Bold Editorial', desc: 'Clean editorial for leaders',   preview: { bg: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)', accent: '#1a1a1a',  text: '#1a1a1a', sub: '#666', tag: 'PRO' } },
]

const ACCENT_COLORS = [
  { label: 'Indigo',   hex: '#6366f1' },
  { label: 'Sky',      hex: '#0ea5e9' },
  { label: 'Emerald',  hex: '#10b981' },
  { label: 'Rose',     hex: '#f43f5e' },
  { label: 'Amber',    hex: '#f59e0b' },
  { label: 'Violet',   hex: '#8b5cf6' },
]

const emptyForm = {
  personalInfo: { name: '', role: '', bio: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
  skills: [], experience: [{ role: '', company: '', duration: '', description: '' }],
  projects: [{ title: '', description: '', tags: [], link: '' }],
  education: [{ degree: '', school: '', year: '', description: '' }],
  certifications: [], languages: [], achievements: [],
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('build')
  const [buildMode, setBuildMode] = useState('resume')
  const [formStep, setFormStep] = useState(0)
  const [manualForm, setManualForm] = useState(emptyForm)

  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [portfolio, setPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [portfolioError, setPortfolioError] = useState('')

  const [selectedTemplate, setSelectedTemplate] = useState('developer')
  const [selectedAccent, setSelectedAccent] = useState('#6366f1')
  const [templateSaving, setTemplateSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const [analytics, setAnalytics] = useState(null)
  const [regeneratingBio, setRegeneratingBio] = useState(false)

  // Get stored user info
  const storedUser = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}') } catch { return {} } })()

  const navItems = [
    { id: 'build',     icon: '✦',  label: 'Build Portfolio' },
    { id: 'portfolio', icon: '👤', label: 'My Portfolio' },
    { id: 'templates', icon: '🎨', label: 'Templates' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'settings',  icon: '⚙️', label: 'Settings' },
  ]

  useEffect(() => {
    if (['portfolio', 'templates', 'analytics'].includes(activeTab)) fetchPortfolio()
    if (activeTab === 'analytics') fetchAnalytics()
  }, [activeTab])

  const fetchPortfolio = async () => {
    setLoadingPortfolio(true); setPortfolioError('')
    try {
      const { data } = await api.get('/api/portfolios/me')
      setPortfolio(data)
      setSelectedTemplate(data.template || 'developer')
      setSelectedAccent(data.accentColor || '#6366f1')
      if (data) {
        setManualForm({
          personalInfo: data.personalInfo || emptyForm.personalInfo,
          skills: data.skills || [],
          experience: data.experience?.length ? data.experience : emptyForm.experience,
          projects: data.projects?.length ? data.projects : emptyForm.projects,
          education: data.education?.length ? data.education : emptyForm.education,
          certifications: data.certifications || [],
          languages: data.languages || [],
          achievements: data.achievements || [],
        })
      }
    } catch (err) {
      if (err.response?.status === 404) setPortfolioError("No portfolio yet. Go to Build Portfolio to get started!")
      else setPortfolioError("Failed to load portfolio.")
    } finally { setLoadingPortfolio(false) }
  }

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/api/portfolios/analytics')
      setAnalytics(data)
    } catch { /* ignore */ }
  }

  // ── Resume upload ──
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') { setFile(f); setUploadError('') } else setUploadError('Please upload a PDF file.')
  }
  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f?.type === 'application/pdf') { setFile(f); setUploadError('') } else setUploadError('Please upload a PDF file.')
  }
  const handleGenerateFromResume = async () => {
    if (!file) return
    setIsProcessing(true); setUploadError('')
    try {
      const fd = new FormData(); fd.append('resume', file)
      const { data } = await api.post('/api/portfolios/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setPortfolio(data.portfolio); setFile(null); setActiveTab('portfolio')
    } catch (err) { setUploadError(err.response?.data?.message || 'AI processing failed. Try again.') }
    finally { setIsProcessing(false) }
  }

  // ── AI bio regen ──
  const handleRegenerateBio = async () => {
    setRegeneratingBio(true)
    try {
      const { data } = await api.post('/api/portfolios/regenerate-bio')
      setPortfolio(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, bio: data.bio } }))
    } catch { /* silent */ }
    finally { setRegeneratingBio(false) }
  }

  // ── Manual form helpers ──
  const updatePI = (field, val) => setManualForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [field]: val } }))
  const updateExpItem = (i, field, val) => setManualForm(f => { const exp = [...f.experience]; exp[i] = { ...exp[i], [field]: val }; return { ...f, experience: exp } })
  const addExp = () => setManualForm(f => ({ ...f, experience: [...f.experience, { role: '', company: '', duration: '', description: '' }] }))
  const removeExp = (i) => setManualForm(f => ({ ...f, experience: f.experience.filter((_, j) => j !== i) }))
  const updateProjItem = (i, field, val) => setManualForm(f => { const p = [...f.projects]; p[i] = { ...p[i], [field]: val }; return { ...f, projects: p } })
  const addProj = () => setManualForm(f => ({ ...f, projects: [...f.projects, { title: '', description: '', tags: [], link: '' }] }))
  const removeProj = (i) => setManualForm(f => ({ ...f, projects: f.projects.filter((_, j) => j !== i) }))
  const updateEduItem = (i, field, val) => setManualForm(f => { const ed = [...f.education]; ed[i] = { ...ed[i], [field]: val }; return { ...f, education: ed } })
  const addEdu = () => setManualForm(f => ({ ...f, education: [...f.education, { degree: '', school: '', year: '', description: '' }] }))
  const removeEdu = (i) => setManualForm(f => ({ ...f, education: f.education.filter((_, j) => j !== i) }))

  const handleManualSubmit = async () => {
    setIsProcessing(true); setUploadError('')
    try {
      const { data } = await api.post('/api/portfolios/manual', manualForm)
      setPortfolio(data.portfolio); setActiveTab('portfolio')
    } catch (err) { setUploadError(err.response?.data?.message || 'Failed to save. Try again.') }
    finally { setIsProcessing(false) }
  }

  // ── Template/accent update ──
  const handleTemplateUpdate = async (tId, accent) => {
    const tpl = tId || selectedTemplate
    const acc = accent || selectedAccent
    setSelectedTemplate(tpl); setTemplateSaving(true)
    try {
      const { data } = await api.patch('/api/portfolios/template', { template: tpl, accentColor: acc })
      setPortfolio(data.portfolio)
    } catch { /* silent */ }
    finally { setTemplateSaving(false) }
  }

  // ── Sharing ──
  const getPortfolioURL = () => {
    if (!portfolio) return ''
    const user = storedUser
    if (user?.username) return `${window.location.origin}/u/${user.username}`
    return `${window.location.origin}/portfolio/${portfolio.user}`
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPortfolioURL())
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    navigate('/login')
  }

  const STEPS = ['Personal Info', 'Skills', 'Experience', 'Projects', 'Education', 'Extras']
  const pi = manualForm.personalInfo

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#06061a', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: '#e2e8f0', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 600; color: #64748b; border: none; background: transparent; width: 100%; text-align: left; font-family: inherit; }
        .nav-item:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
        .nav-item.active { background: rgba(99,102,241,0.15); color: #818cf8; }
        .tab-btn { padding: 8px 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; font-family: inherit; }
        .tab-btn.active { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; color: #fff; }
        .tab-btn:not(.active) { background: transparent; color: #64748b; }
        .tab-btn:not(.active):hover { border-color: rgba(255,255,255,0.2); color: #94a3b8; }
        .step-dot { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; transition: all 0.3s; cursor: pointer; border: 2px solid; flex-shrink: 0; }
        .template-option { border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform 0.25s, box-shadow 0.25s; }
        .template-option:hover { transform: translateY(-4px); }
        .template-option.selected { box-shadow: 0 0 0 3px #6366f1, 0 20px 40px rgba(0,0,0,0.4); }
        .add-btn { display: flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.1); border: 1px dashed rgba(99,102,241,0.3); border-radius: 10px; padding: 10px 16px; color: #818cf8; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; width: 100%; justify-content: center; }
        .add-btn:hover { background: rgba(99,102,241,0.2); }
        .remove-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 4px 10px; color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .remove-btn:hover { background: rgba(239,68,68,0.2); }
        .primary-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; padding: 13px 24px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(99,102,241,0.4); }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .accent-dot { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; border: 2px solid transparent; }
        .accent-dot:hover { transform: scale(1.15); }
        .accent-dot.selected { transform: scale(1.15); box-shadow: 0 0 0 3px rgba(255,255,255,0.3); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px 24px; }
        @keyframes slide-in { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slide-in 0.4s ease; }
        .fade-in { animation: fade-in 0.4s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; width: 16px; height: 16px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .pulse { animation: pulse 1.5s ease infinite; }
      `}</style>

      {/* ── Sidebar ── */}
      <aside style={{ width: '240px', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '20px 12px', flexShrink: 0, background: 'rgba(255,255,255,0.01)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '4px 14px', marginBottom: '28px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>✦</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', fontSize: '16px' }}>Portfolify AI</span>
        </Link>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`nav-item ${activeTab === item.id ? 'active' : ''}`}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        {portfolio && (
          <div style={{ margin: '12px 0', padding: '12px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#34d399', letterSpacing: '0.06em', marginBottom: '6px' }}>● PORTFOLIO LIVE</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', wordBreak: 'break-all' }}>{getPortfolioURL().replace('http://localhost:3000', '')}</div>
            <button onClick={handleCopyLink} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
              {copied ? '✓ Copied!' : 'Copy share link →'}
            </button>
          </div>
        )}
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#64748b', border: 'none', background: 'transparent', fontFamily: 'inherit', transition: 'all 0.2s', width: '100%' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}>
          <span>↩</span> Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', backgroundColor: activeTab === 'portfolio' ? '#f9fafb' : '#06061a' }}>

        {/* ════ BUILD TAB ════ */}
        {activeTab === 'build' && (
          <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Build Your Portfolio</h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Upload a resume for instant AI magic, or fill in your details manually.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              <button className={`tab-btn ${buildMode === 'resume' ? 'active' : ''}`} onClick={() => setBuildMode('resume')}>⚡ AI Resume Upload</button>
              <button className={`tab-btn ${buildMode === 'form' ? 'active' : ''}`} onClick={() => setBuildMode('form')}>📝 Manual Form</button>
            </div>

            {/* Resume upload */}
            {buildMode === 'resume' && (
              <div className="slide-in" style={{ maxWidth: '640px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Upload Your Resume PDF</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Gemini AI extracts your skills, experience, and projects in seconds.</p>
                  {uploadError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '20px' }}>{uploadError}</div>}
                  <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                    style={{ border: `2px dashed ${isDragging ? '#6366f1' : file ? '#10b981' : 'rgba(255,255,255,0.1)'}`, borderRadius: '18px', padding: '48px 24px', textAlign: 'center', transition: 'all 0.2s', background: isDragging ? 'rgba(99,102,241,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                    {file ? (
                      <div>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                        <div style={{ fontWeight: 700, color: '#10b981', fontSize: '16px', marginBottom: '4px' }}>{file.name}</div>
                        <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB · Ready to process</div>
                        <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Remove ×</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>☁️</div>
                        <p style={{ fontWeight: 600, color: '#94a3b8', fontSize: '15px', marginBottom: '6px' }}>
                          Drag & drop your PDF, or{' '}
                          <label style={{ color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}>
                            browse<input type="file" accept=".pdf" style={{ display: 'none' }} onChange={handleFileChange} />
                          </label>
                        </p>
                        <p style={{ color: '#475569', fontSize: '13px' }}>PDF only · Max 10MB</p>
                      </div>
                    )}
                  </div>
                  {file && (
                    <button onClick={handleGenerateFromResume} disabled={isProcessing} className="primary-btn" style={{ width: '100%', marginTop: '20px' }}>
                      {isProcessing ? <><span className="spin" /> AI is processing your resume...</> : '✦ Generate Portfolio with AI'}
                    </button>
                  )}
                </div>
                <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.07em', marginBottom: '12px' }}>WHAT AI EXTRACTS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['👤 Personal info', '💼 Work experience', '🚀 Projects', '🧠 Skills', '🎓 Education', '🏆 Certifications', '🌍 Languages', '⭐ Achievements'].map(item => (
                      <div key={item} style={{ fontSize: '13px', color: '#64748b' }}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Manual form */}
            {buildMode === 'form' && (
              <div className="slide-in" style={{ maxWidth: '720px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div className="step-dot" onClick={() => setFormStep(i)}
                          style={{ borderColor: i < formStep ? '#10b981' : i === formStep ? '#6366f1' : 'rgba(255,255,255,0.1)', background: i < formStep ? '#10b981' : i === formStep ? '#6366f1' : 'transparent', color: i <= formStep ? '#fff' : '#475569' }}>
                          {i < formStep ? '✓' : i + 1}
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 600, color: i === formStep ? '#818cf8' : '#475569', whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>{s.toUpperCase()}</span>
                      </div>
                      {i < STEPS.length - 1 && <div style={{ flex: 1, height: '2px', background: i < formStep ? '#10b981' : 'rgba(255,255,255,0.07)', marginBottom: '20px', transition: 'background 0.3s' }} />}
                    </React.Fragment>
                  ))}
                </div>
                {uploadError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '20px' }}>{uploadError}</div>}
                <div key={formStep} className="slide-in" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px', marginBottom: '20px' }}>
                  {formStep === 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Personal Information</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <Input label="Full Name *" placeholder="Jane Doe" value={pi.name} onChange={e => updatePI('name', e.target.value)} />
                        <Input label="Job Title / Role *" placeholder="Frontend Engineer" value={pi.role} onChange={e => updatePI('role', e.target.value)} />
                        <Input label="Email" placeholder="jane@example.com" value={pi.email} onChange={e => updatePI('email', e.target.value)} />
                        <Input label="Phone" placeholder="+91 98765 43210" value={pi.phone} onChange={e => updatePI('phone', e.target.value)} />
                        <Input label="Location" placeholder="Mumbai, India" value={pi.location} onChange={e => updatePI('location', e.target.value)} />
                        <Input label="LinkedIn URL" placeholder="linkedin.com/in/..." value={pi.linkedin} onChange={e => updatePI('linkedin', e.target.value)} />
                        <Input label="GitHub URL" placeholder="github.com/..." value={pi.github} onChange={e => updatePI('github', e.target.value)} />
                        <Input label="Personal Website" placeholder="yoursite.com" value={pi.website} onChange={e => updatePI('website', e.target.value)} />
                      </div>
                      <Textarea label="Professional Bio" placeholder="Write a 2-3 sentence summary of your professional story..." value={pi.bio} onChange={e => updatePI('bio', e.target.value)} rows={3} />
                    </div>
                  )}
                  {formStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Skills</h2>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>Type a skill and press Enter to add it.</p>
                      <TagInput values={manualForm.skills} onChange={v => setManualForm(f => ({ ...f, skills: v }))} placeholder="e.g. React, Node.js, Python..." />
                      {manualForm.skills.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#475569' }}>{manualForm.skills.length} skills added</div>
                      )}
                    </div>
                  )}
                  {formStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Work Experience</h2>
                      {manualForm.experience.map((exp, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>Experience #{i + 1}</span>
                            {manualForm.experience.length > 1 && <button className="remove-btn" onClick={() => removeExp(i)}>Remove</button>}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="Job Title" placeholder="Software Engineer" value={exp.role} onChange={e => updateExpItem(i, 'role', e.target.value)} />
                            <Input label="Company" placeholder="Google" value={exp.company} onChange={e => updateExpItem(i, 'company', e.target.value)} />
                          </div>
                          <Input label="Duration" placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExpItem(i, 'duration', e.target.value)} />
                          <Textarea label="Description" placeholder="What did you achieve? Mention impact and technologies." value={exp.description} onChange={e => updateExpItem(i, 'description', e.target.value)} rows={2} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={addExp}>+ Add Another Experience</button>
                    </div>
                  )}
                  {formStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Projects</h2>
                      {manualForm.projects.map((proj, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#8b5cf6' }}>Project #{i + 1}</span>
                            {manualForm.projects.length > 1 && <button className="remove-btn" onClick={() => removeProj(i)}>Remove</button>}
                          </div>
                          <Input label="Project Name" placeholder="E-Commerce Platform" value={proj.title} onChange={e => updateProjItem(i, 'title', e.target.value)} />
                          <Textarea label="Description" placeholder="What does it do? What problem does it solve?" value={proj.description} onChange={e => updateProjItem(i, 'description', e.target.value)} rows={2} />
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Technologies (press Enter)</label>
                            <TagInput values={proj.tags} onChange={v => updateProjItem(i, 'tags', v)} placeholder="React, Node.js..." />
                          </div>
                          <Input label="Project Link" placeholder="https://github.com/..." value={proj.link} onChange={e => updateProjItem(i, 'link', e.target.value)} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={addProj}>+ Add Another Project</button>
                    </div>
                  )}
                  {formStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Education</h2>
                      {manualForm.education.map((edu, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>Education #{i + 1}</span>
                            {manualForm.education.length > 1 && <button className="remove-btn" onClick={() => removeEdu(i)}>Remove</button>}
                          </div>
                          <Input label="Degree / Certification" placeholder="B.Tech in Computer Science" value={edu.degree} onChange={e => updateEduItem(i, 'degree', e.target.value)} />
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="School / University" placeholder="IIT Bombay" value={edu.school} onChange={e => updateEduItem(i, 'school', e.target.value)} />
                            <Input label="Year" placeholder="2024" value={edu.year} onChange={e => updateEduItem(i, 'year', e.target.value)} />
                          </div>
                        </div>
                      ))}
                      <button className="add-btn" onClick={addEdu}>+ Add Another Education</button>
                    </div>
                  )}
                  {formStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Extras</h2>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Certifications (press Enter)</label>
                        <TagInput values={manualForm.certifications} onChange={v => setManualForm(f => ({ ...f, certifications: v }))} placeholder="AWS Solutions Architect, Google Cloud..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Languages Spoken (press Enter)</label>
                        <TagInput values={manualForm.languages} onChange={v => setManualForm(f => ({ ...f, languages: v }))} placeholder="English, Hindi, Marathi..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Achievements (press Enter)</label>
                        <TagInput values={manualForm.achievements} onChange={v => setManualForm(f => ({ ...f, achievements: v }))} placeholder="Hackathon winner, 1M+ downloads..." />
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => setFormStep(s => Math.max(0, s - 1))} disabled={formStep === 0}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 20px', color: formStep === 0 ? '#475569' : '#94a3b8', cursor: formStep === 0 ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'inherit' }}>
                    ← Back
                  </button>
                  {formStep < STEPS.length - 1 ? (
                    <button onClick={() => setFormStep(s => s + 1)} className="primary-btn">Continue →</button>
                  ) : (
                    <button onClick={handleManualSubmit} disabled={isProcessing || !pi.name} className="primary-btn">
                      {isProcessing ? 'Saving...' : '✦ Save & Publish Portfolio'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ PORTFOLIO TAB ════ */}
        {activeTab === 'portfolio' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>Live Portfolio Preview</h1>
                <p style={{ color: '#4b5563', fontSize: '15px' }}>Exactly what recruiters see at your public link.</p>
              </div>
              {portfolio && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copied ? '#d1fae5' : '#fff', border: `1px solid ${copied ? '#34d399' : '#e5e7eb'}`, borderRadius: '10px', padding: '9px 16px', color: copied ? '#065f46' : '#4b5563', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    {copied ? '✓ Copied!' : '🔗 Copy Link'}
                  </button>
                  <a href={getPortfolioURL()} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', padding: '9px 16px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 6px rgba(99,102,241,0.2)' }}>
                    ↗ View Live
                  </a>
                  <button onClick={() => setActiveTab('build')} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '9px 16px', color: '#4b5563', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    ✏️ Edit
                  </button>
                </div>
              )}
            </div>
            {loadingPortfolio ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', color: '#4b5563' }}>
                <div className="spin" style={{ border: '2px solid rgba(0,0,0,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', width: '24px', height: '24px' }} />
                Loading...
              </div>
            ) : portfolioError ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</div>
                <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '8px' }}>No Portfolio Yet</h3>
                <p style={{ color: '#4b5563', marginBottom: '24px' }}>{portfolioError}</p>
                <button onClick={() => setActiveTab('build')} className="primary-btn">Build My Portfolio →</button>
              </div>
            ) : portfolio && (
              <div className="slide-in fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px' }}>
                {/* Hero card */}
                <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{portfolio.personalInfo?.name}</h2>
                      <p style={{ fontSize: '17px', fontWeight: 600, color: '#818cf8' }}>{portfolio.personalInfo?.role}</p>
                    </div>
                    <span style={{ background: portfolio.inputMethod === 'resume' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)', border: `1px solid ${portfolio.inputMethod === 'resume' ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.25)'}`, borderRadius: '8px', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: portfolio.inputMethod === 'resume' ? '#34d399' : '#818cf8', letterSpacing: '0.06em' }}>
                      {portfolio.inputMethod === 'resume' ? '⚡ AI GENERATED' : '📝 MANUAL'}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '15px', marginBottom: '12px' }}>{portfolio.personalInfo?.bio}</p>
                  {/* AI Bio Regen */}
                  <button onClick={handleRegenerateBio} disabled={regeneratingBio}
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '6px 14px', color: '#818cf8', fontSize: '12px', fontWeight: 600, cursor: regeneratingBio ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: '20px', transition: 'all 0.2s', opacity: regeneratingBio ? 0.6 : 1 }}>
                    {regeneratingBio ? '✦ Regenerating...' : '✦ Regenerate Bio with AI'}
                  </button>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {portfolio.personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}>✉ {portfolio.personalInfo.email}</span>}
                    {portfolio.personalInfo?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}>📍 {portfolio.personalInfo.location}</span>}
                    {portfolio.personalInfo?.github && <a href={portfolio.personalInfo.github.startsWith('http') ? portfolio.personalInfo.github : `https://${portfolio.personalInfo.github}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}>⌨ GitHub ↗</a>}
                    {portfolio.personalInfo?.linkedin && <a href={portfolio.personalInfo.linkedin.startsWith('http') ? portfolio.personalInfo.linkedin : `https://${portfolio.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8', textDecoration: 'none' }}>🔗 LinkedIn ↗</a>}
                  </div>
                </div>
                {/* Skills */}
                {portfolio.skills?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '14px' }}>SKILLS — {portfolio.skills.length} total</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {portfolio.skills.map((s, i) => (
                        <span key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', color: '#a5b4fc', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Experience + Projects */}
                <div style={{ display: 'grid', gridTemplateColumns: portfolio.experience?.length > 0 && portfolio.projects?.length > 0 ? '1fr 1fr' : '1fr', gap: '20px' }}>
                  {portfolio.experience?.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '16px' }}>EXPERIENCE</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {portfolio.experience.map((e, i) => (
                          <div key={i} style={{ borderLeft: '2px solid rgba(99,102,241,0.3)', paddingLeft: '14px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{e.role}</div>
                            <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600, marginBottom: '4px' }}>{e.company} <span style={{ color: '#475569', fontWeight: 400 }}>· {e.duration}</span></div>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>{e.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {portfolio.projects?.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '16px' }}>PROJECTS</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {portfolio.projects.map((p, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px', marginBottom: '4px' }}>{p.title}</div>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '8px' }}>{p.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: p.link ? '8px' : 0 }}>
                              {p.tags?.map((t, j) => <span key={j} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{t}</span>)}
                            </div>
                            {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none' }}>View Project ↗</a>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Education */}
                {portfolio.education?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '16px' }}>EDUCATION</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {portfolio.education.map((e, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{e.degree}</div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>{e.school}</div>
                          </div>
                          {e.year && <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#34d399', fontWeight: 600 }}>{e.year}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Certifications */}
                {portfolio.certifications?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '14px' }}>CERTIFICATIONS</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {portfolio.certifications.map((c, i) => <span key={i} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', color: '#fbbf24', fontWeight: 500 }}>🏆 {c}</span>)}
                    </div>
                  </div>
                )}
                {/* Achievements + Languages */}
                {(portfolio.achievements?.length > 0 || portfolio.languages?.length > 0) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {portfolio.achievements?.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '14px' }}>ACHIEVEMENTS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {portfolio.achievements.map((a, i) => <div key={i} style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '8px' }}><span style={{ color: '#f59e0b' }}>⭐</span>{a}</div>)}
                        </div>
                      </div>
                    )}
                    {portfolio.languages?.length > 0 && (
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                        <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.1em', marginBottom: '14px' }}>LANGUAGES</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {portfolio.languages.map((l, i) => <span key={i} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', color: '#34d399', fontWeight: 500 }}>🌍 {l}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════ TEMPLATES TAB ════ */}
        {activeTab === 'templates' && (
          <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Choose a Template</h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Style changes apply to your public portfolio instantly.</p>
              {templateSaving && <span style={{ fontSize: '13px', color: '#818cf8', marginLeft: '8px' }} className="pulse">Saving...</span>}
            </div>
            {!portfolio && !loadingPortfolio && (
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '14px 20px', color: '#fbbf24', fontSize: '14px', marginBottom: '24px' }}>
                ⚠ Create a portfolio first before applying a template.
              </div>
            )}
            {/* Accent color picker */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px', maxWidth: '600px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', marginBottom: '14px' }}>ACCENT COLOR</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                {ACCENT_COLORS.map(ac => (
                  <button key={ac.hex} title={ac.label} className={`accent-dot ${selectedAccent === ac.hex ? 'selected' : ''}`}
                    onClick={() => { setSelectedAccent(ac.hex); portfolio && handleTemplateUpdate(selectedTemplate, ac.hex) }}
                    style={{ background: ac.hex, border: selectedAccent === ac.hex ? `3px solid ${ac.hex}` : '3px solid transparent', outline: selectedAccent === ac.hex ? `2px solid ${ac.hex}` : 'none', outlineOffset: '2px' }} />
                ))}
                <span style={{ fontSize: '13px', color: '#475569', marginLeft: '4px' }}>Selected: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{ACCENT_COLORS.find(a => a.hex === selectedAccent)?.label || selectedAccent}</span></span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '900px' }}>
              {TEMPLATES.map(t => (
                <div key={t.id} className={`template-option ${selectedTemplate === t.id ? 'selected' : ''}`}
                  onClick={() => portfolio && handleTemplateUpdate(t.id, selectedAccent)}
                  style={{ border: `1px solid ${selectedTemplate === t.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, opacity: portfolio ? 1 : 0.5, cursor: portfolio ? 'pointer' : 'not-allowed' }}>
                  <div style={{ height: '180px', background: t.preview.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '20px', color: t.preview.text }}>Your Name</div>
                      <div style={{ fontSize: '13px', color: t.preview.sub, marginTop: '4px' }}>Your Role Here</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['React', 'Node', 'TypeScript'].map(sk => (
                          <span key={sk} style={{ background: `${t.preview.accent === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: t.preview.accent === '#fff' ? '#fff' : t.preview.accent, fontWeight: 700 }}>{sk}</span>
                        ))}
                      </div>
                      {/* Accent preview dot */}
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedAccent, margin: '10px auto 0' }} />
                    </div>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: t.preview.accent === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', borderRadius: '5px', padding: '3px 7px', fontSize: '9px', fontWeight: 800, color: t.preview.accent === '#fff' ? '#fff' : '#333', letterSpacing: '0.06em' }}>{t.preview.tag}</div>
                    {selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#6366f1', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700 }}>✓</div>
                    )}
                  </div>
                  <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '15px' }}>{t.name}</div>
                        <div style={{ color: '#64748b', fontSize: '13px', marginTop: '2px' }}>{t.desc}</div>
                      </div>
                      {selectedTemplate === t.id && <span style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '6px', padding: '2px 8px' }}>ACTIVE</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {portfolio && (
              <div style={{ marginTop: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={getPortfolioURL()} target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: 'none' }}>↗ Preview Live Portfolio</a>
                <button onClick={handleCopyLink} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '13px 24px', color: '#94a3b8', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════ ANALYTICS TAB ════ */}
        {activeTab === 'analytics' && (
          <div className="fade-in">
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Analytics</h1>
            <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Track how many people are viewing your portfolio.</p>
            {!analytics ? (
              <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <p style={{ color: '#64748b' }}>Create a portfolio first to see analytics.</p>
                <button onClick={() => setActiveTab('build')} className="primary-btn" style={{ marginTop: '16px' }}>Build Portfolio →</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '800px' }}>
                <div className="stat-card">
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Total Views</div>
                  <div style={{ fontSize: '42px', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Syne, sans-serif' }}>{analytics.visitCount || 0}</div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Portfolio visits</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Last Viewed</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
                    {analytics.lastVisited ? new Date(analytics.lastVisited).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not yet viewed'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Most recent visit</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>Portfolio Age</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
                    {analytics.createdAt ? Math.floor((Date.now() - new Date(analytics.createdAt)) / 86400000) + ' days' : '—'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>Since creation</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}> Your Public URL</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8', wordBreak: 'break-all' }}>
                    {getPortfolioURL().replace(window.location.origin, '') || '—'}
                  </div>
                  <button onClick={handleCopyLink} style={{ marginTop: '8px', background: 'none', border: 'none', color: '#6366f1', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                    {copied ? '✓ Copied!' : 'Copy link →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ SETTINGS TAB ════ */}
        {activeTab === 'settings' && (
          <div className="fade-in">
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>Settings</h1>
            <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '16px' }}>Your Profile</h3>
                <SettingsProfile onLogout={handleLogout} />
              </div>
              {/* Share link */}
              {portfolio && (
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Your Public URL</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '12px' }}>Share this with recruiters and clients.</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 14px' }}>
                    <span style={{ flex: 1, fontSize: '13px', color: '#94a3b8', wordBreak: 'break-all' }}>{getPortfolioURL()}</span>
                    <button onClick={handleCopyLink} style={{ background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)'}`, borderRadius: '8px', padding: '6px 14px', color: copied ? '#34d399' : '#818cf8', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
              {/* Danger zone */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Danger Zone</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>These actions cannot be undone.</p>
                <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '10px 20px', color: '#f87171', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Sign Out
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Coming Soon</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Custom domain, dark/light mode toggle, LinkedIn import, GitHub sync — all in the roadmap.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── Settings Profile sub-component ──────────────────────────────────────────
const SettingsProfile = ({ onLogout }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      setName(u.name || '')
      setUsername(u.username || '')
    } catch {}
  }, [])

  const handleSave = async () => {
    setSaving(true); setMsg('')
    try {
      const { data } = await api.patch('/api/auth/profile', { name, username })
      localStorage.setItem('user', JSON.stringify({ ...data.user }))
      setMsg('✓ Profile updated!')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to update.')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <Input label="Display Name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>Username (your public URL slug)</label>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
          <span style={{ padding: '12px 10px 12px 14px', fontSize: '14px', color: '#475569', background: 'rgba(255,255,255,0.02)' }}>/u/</span>
          <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} placeholder="kunal" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit', padding: '12px 14px 12px 4px' }} />
        </div>
        <div style={{ fontSize: '12px', color: '#475569' }}>Only lowercase letters, numbers, _ and - allowed</div>
      </div>
      {msg && <div style={{ fontSize: '13px', color: msg.startsWith('✓') ? '#34d399' : '#f87171' }}>{msg}</div>}
      <button onClick={handleSave} disabled={saving} className="primary-btn" style={{ alignSelf: 'flex-start' }}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

export default Dashboard