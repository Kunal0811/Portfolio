import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:5000'

// ─── Mini helpers ─────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('token')
const authHeaders = () => ({ Authorization: `Bearer ${token()}` })

// ─── Tag input component ──────────────────────────────────────────────────────
const TagInput = ({ values, onChange, placeholder }) => {
  const [input, setInput] = useState('')
  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) { onChange([...values, v]); setInput('') }
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 12px', minHeight: '48px' }}>
      {values.map((v, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '3px 10px', fontSize: '13px', color: '#a5b4fc' }}>
          {v}
          <button onClick={() => onChange(values.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '14px' }}>×</button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={values.length ? '' : placeholder}
        style={{ flex: 1, minWidth: '100px', background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', fontFamily: 'inherit' }} />
    </div>
  )
}

// ─── Styled input ─────────────────────────────────────────────────────────────
const Input = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>{label}</label>}
    <input {...props} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box', ...(props.style || {}) }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
    />
  </div>
)

const Textarea = ({ label, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    {label && <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8' }}>{label}</label>}
    <textarea {...props} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 14px', color: '#e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box', ...(props.style || {}) }}
      onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
    />
  </div>
)

// ─── TEMPLATES ────────────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    id: 'developer',
    name: 'Dark Terminal',
    desc: 'Bold dark theme for developers',
    preview: { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#38bdf8', text: '#f1f5f9', sub: '#64748b', tag: 'DARK' },
  },
  {
    id: 'modern',
    name: 'Glass Modern',
    desc: 'Glassmorphism for creatives',
    preview: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#fff', text: '#fff', sub: 'rgba(255,255,255,0.7)', tag: 'GLASS' },
  },
  {
    id: 'creative',
    name: 'Bold Editorial',
    desc: 'Clean & editorial for leaders',
    preview: { bg: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)', accent: '#1a1a1a', text: '#1a1a1a', sub: '#666', tag: 'PRO' },
  },
]

// ─── Manual Form default state ────────────────────────────────────────────────
const emptyForm = {
  personalInfo: { name: '', role: '', bio: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '' },
  skills: [],
  experience: [{ role: '', company: '', duration: '', description: '' }],
  projects: [{ title: '', description: '', tags: [], link: '' }],
  education: [{ degree: '', school: '', year: '', description: '' }],
  certifications: [],
  languages: [],
  achievements: [],
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('build')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Build mode: 'resume' | 'form'
  const [buildMode, setBuildMode] = useState('resume')
  const [formStep, setFormStep] = useState(0)
  const [manualForm, setManualForm] = useState(emptyForm)

  // Resume upload state
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Portfolio state
  const [portfolio, setPortfolio] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(false)
  const [portfolioError, setPortfolioError] = useState('')

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState('developer')
  const [templateSaving, setTemplateSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const navItems = [
    { id: 'build', icon: '✦', label: 'Build Portfolio' },
    { id: 'portfolio', icon: '👤', label: 'My Portfolio' },
    { id: 'templates', icon: '🎨', label: 'Templates' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  useEffect(() => {
    if (activeTab === 'portfolio' || activeTab === 'templates') fetchPortfolio()
  }, [activeTab])

  const fetchPortfolio = async () => {
    setLoadingPortfolio(true); setPortfolioError('')
    try {
      const { data } = await axios.get(`${API}/api/portfolios/me`, { headers: authHeaders() })
      setPortfolio(data)
      setSelectedTemplate(data.template || 'developer')
    } catch (err) {
      if (err.response?.status === 404) setPortfolioError("No portfolio yet. Go to Build Portfolio to get started!")
      else setPortfolioError("Failed to load portfolio.")
    } finally { setLoadingPortfolio(false) }
  }

  // ── Resume upload ──
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') { setFile(f); setUploadError('') } else setUploadError('Please upload a PDF.')
  }
  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f?.type === 'application/pdf') { setFile(f); setUploadError('') } else setUploadError('Please upload a PDF.')
  }
  const handleGenerateFromResume = async () => {
    if (!file) return
    setIsProcessing(true); setUploadError('')
    try {
      const fd = new FormData(); fd.append('resume', file)
      const { data } = await axios.post(`${API}/api/portfolios/upload`, fd, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } })
      setPortfolio(data.portfolio); setFile(null); setActiveTab('portfolio')
    } catch (err) { setUploadError(err.response?.data?.message || 'AI processing failed. Try again.') }
    finally { setIsProcessing(false) }
  }

  // ── Manual form ──
  const updatePI = (field, val) => setManualForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [field]: val } }))
  const updateExpItem = (i, field, val) => setManualForm(f => {
    const exp = [...f.experience]; exp[i] = { ...exp[i], [field]: val }; return { ...f, experience: exp }
  })
  const addExp = () => setManualForm(f => ({ ...f, experience: [...f.experience, { role: '', company: '', duration: '', description: '' }] }))
  const removeExp = (i) => setManualForm(f => ({ ...f, experience: f.experience.filter((_, j) => j !== i) }))

  const updateProjItem = (i, field, val) => setManualForm(f => {
    const p = [...f.projects]; p[i] = { ...p[i], [field]: val }; return { ...f, projects: p }
  })
  const addProj = () => setManualForm(f => ({ ...f, projects: [...f.projects, { title: '', description: '', tags: [], link: '' }] }))
  const removeProj = (i) => setManualForm(f => ({ ...f, projects: f.projects.filter((_, j) => j !== i) }))

  const updateEduItem = (i, field, val) => setManualForm(f => {
    const ed = [...f.education]; ed[i] = { ...ed[i], [field]: val }; return { ...f, education: ed }
  })
  const addEdu = () => setManualForm(f => ({ ...f, education: [...f.education, { degree: '', school: '', year: '', description: '' }] }))
  const removeEdu = (i) => setManualForm(f => ({ ...f, education: f.education.filter((_, j) => j !== i) }))

  const handleManualSubmit = async () => {
    setIsProcessing(true); setUploadError('')
    try {
      const { data } = await axios.post(`${API}/api/portfolios/manual`, manualForm, { headers: authHeaders() })
      setPortfolio(data.portfolio); setActiveTab('portfolio')
    } catch (err) { setUploadError(err.response?.data?.message || 'Failed to save. Try again.') }
    finally { setIsProcessing(false) }
  }

  // ── Template update ──
  const handleTemplateUpdate = async (tId) => {
    setSelectedTemplate(tId); setTemplateSaving(true)
    try {
      const { data } = await axios.patch(`${API}/api/portfolios/template`, { template: tId }, { headers: authHeaders() })
      setPortfolio(data.portfolio)
    } catch (err) { console.error(err) }
    finally { setTemplateSaving(false) }
  }

  const handleCopyLink = () => {
    if (!portfolio) return
    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolio.user}`)
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login') }

  // ─── Form steps ───────────────────────────────────────────────────────────
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
        .add-btn { display: flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.1); border: 1px dashed rgba(99,102,241,0.3); borderRadius: 10px; padding: 10px 16px; color: #818cf8; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; width: 100%; justify-content: center; }
        .add-btn:hover { background: rgba(99,102,241,0.2); }
        .remove-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 4px 10px; color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .remove-btn:hover { background: rgba(239,68,68,0.2); }
        .primary-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; padding: 13px 24px; color: #fff; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .primary-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(99,102,241,0.4); }
        .primary-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .skill-bar { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-top: 6px; }
        .skill-bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 2px; transition: width 0.8s ease; }
        @keyframes slide-in { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fade-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slide-in 0.4s ease; }
        .fade-in { animation: fade-in 0.4s ease; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
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
            <button onClick={handleCopyLink} style={{ background: 'none', border: 'none', color: '#34d399', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
              {copied ? '✓ Copied!' : 'Copy share link →'}
            </button>
          </div>
        )}

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: '#64748b', border: 'none', background: 'transparent', fontFamily: 'inherit', transition: 'all 0.2s', width: '100%' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}>
          <span>↩</span> Logout
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>

        {/* ════════ BUILD TAB ════════ */}
        {activeTab === 'build' && (
          <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Build Your Portfolio</h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Upload a resume for instant AI magic, or fill in your details manually.</p>
            </div>

            {/* Mode switcher */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
              <button className={`tab-btn ${buildMode === 'resume' ? 'active' : ''}`} onClick={() => setBuildMode('resume')}>⚡ AI Resume Upload</button>
              <button className={`tab-btn ${buildMode === 'form' ? 'active' : ''}`} onClick={() => setBuildMode('form')}>📝 Manual Form</button>
            </div>

            {/* ── Resume upload mode ── */}
            {buildMode === 'resume' && (
              <div className="slide-in" style={{ maxWidth: '640px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '24px', padding: '32px' }}>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Upload Your Resume PDF</h2>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Gemini AI will extract your skills, experience, and projects in seconds.</p>

                  {uploadError && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '20px' }}>{uploadError}</div>}

                  <div onDragOver={e => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                    style={{ border: `2px dashed ${isDragging ? '#6366f1' : file ? '#10b981' : 'rgba(255,255,255,0.1)'}`, borderRadius: '18px', padding: '48px 24px', textAlign: 'center', transition: 'all 0.2s', background: isDragging ? 'rgba(99,102,241,0.05)' : file ? 'rgba(16,185,129,0.04)' : 'transparent', cursor: 'pointer' }}>
                    {file ? (
                      <div>
                        <div style={{ fontSize: '40px', marginBottom: '12px' }}>📄</div>
                        <div style={{ fontWeight: 700, color: '#10b981', fontSize: '16px', marginBottom: '4px' }}>{file.name}</div>
                        <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</div>
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
                      {isProcessing ? <><span className="spin" style={{ display: 'inline-block', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', width: '16px', height: '16px' }} /> AI is processing your resume...</> : '✦ Generate Portfolio with AI'}
                    </button>
                  )}
                </div>

                {/* What AI extracts */}
                <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '20px 24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366f1', letterSpacing: '0.07em', marginBottom: '12px' }}>WHAT AI EXTRACTS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['👤 Personal info', '💼 Work experience', '🚀 Projects', '🧠 Skills', '🎓 Education', '🏆 Certifications'].map(item => (
                      <div key={item} style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Manual form mode ── */}
            {buildMode === 'form' && (
              <div className="slide-in" style={{ maxWidth: '720px' }}>
                {/* Step progress */}
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
                  
                  {/* Step 0: Personal Info */}
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

                  {/* Step 1: Skills */}
                  {formStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Skills</h2>
                      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>Type a skill and press Enter to add it.</p>
                      <TagInput values={manualForm.skills} onChange={v => setManualForm(f => ({ ...f, skills: v }))} placeholder="e.g. React, Node.js, Python..." />
                      {manualForm.skills.length > 0 && (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#475569', marginBottom: '8px' }}>{manualForm.skills.length} skills added</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {manualForm.skills.map((s, i) => (
                              <span key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', padding: '4px 12px', fontSize: '13px', color: '#a5b4fc', fontWeight: 500 }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 2: Experience */}
                  {formStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Work Experience</h2>
                      {manualForm.experience.map((exp, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1' }}>Experience #{i + 1}</span>
                            {manualForm.experience.length > 1 && <button className="remove-btn" onClick={() => removeExp(i)}>Remove</button>}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <Input label="Job Title" placeholder="Software Engineer" value={exp.role} onChange={e => updateExpItem(i, 'role', e.target.value)} />
                            <Input label="Company" placeholder="Google" value={exp.company} onChange={e => updateExpItem(i, 'company', e.target.value)} />
                          </div>
                          <Input label="Duration" placeholder="Jan 2022 – Present" value={exp.duration} onChange={e => updateExpItem(i, 'duration', e.target.value)} />
                          <Textarea label="Description" placeholder="What did you achieve? Mention impact and technologies used." value={exp.description} onChange={e => updateExpItem(i, 'description', e.target.value)} rows={2} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={addExp}>+ Add Another Experience</button>
                    </div>
                  )}

                  {/* Step 3: Projects */}
                  {formStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Projects</h2>
                      {manualForm.projects.map((proj, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#8b5cf6' }}>Project #{i + 1}</span>
                            {manualForm.projects.length > 1 && <button className="remove-btn" onClick={() => removeProj(i)}>Remove</button>}
                          </div>
                          <Input label="Project Name" placeholder="E-Commerce Platform" value={proj.title} onChange={e => updateProjItem(i, 'title', e.target.value)} />
                          <Textarea label="Description" placeholder="What does it do? What problem does it solve?" value={proj.description} onChange={e => updateProjItem(i, 'description', e.target.value)} rows={2} />
                          <div>
                            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Technologies (press Enter to add)</label>
                            <TagInput values={proj.tags} onChange={v => updateProjItem(i, 'tags', v)} placeholder="React, Node.js..." />
                          </div>
                          <Input label="Project Link" placeholder="https://github.com/..." value={proj.link} onChange={e => updateProjItem(i, 'link', e.target.value)} />
                        </div>
                      ))}
                      <button className="add-btn" onClick={addProj}>+ Add Another Project</button>
                    </div>
                  )}

                  {/* Step 4: Education */}
                  {formStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Education</h2>
                      {manualForm.education.map((edu, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
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

                  {/* Step 5: Extras */}
                  {formStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>Extras</h2>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Certifications (press Enter)</label>
                        <TagInput values={manualForm.certifications} onChange={v => setManualForm(f => ({ ...f, certifications: v }))} placeholder="AWS Solutions Architect, Google Cloud..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Languages (press Enter)</label>
                        <TagInput values={manualForm.languages} onChange={v => setManualForm(f => ({ ...f, languages: v }))} placeholder="English, Hindi, Marathi..." />
                      </div>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Achievements (press Enter)</label>
                        <TagInput values={manualForm.achievements} onChange={v => setManualForm(f => ({ ...f, achievements: v }))} placeholder="Hackathon winner, 1M+ downloads..." />
                      </div>
                    </div>
                  )}
                </div>

                {/* Step nav buttons */}
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

        {/* ════════ PORTFOLIO TAB ════════ */}
        {activeTab === 'portfolio' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>My Portfolio</h1>
                <p style={{ color: '#64748b', fontSize: '15px' }}>Preview and manage your portfolio data.</p>
              </div>
              {portfolio && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '10px', padding: '9px 16px', color: copied ? '#34d399' : '#94a3b8', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                    {copied ? '✓ Copied!' : '🔗 Copy Link'}
                  </button>
                  <a href={`/portfolio/${portfolio.user}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', padding: '9px 16px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
                    ↗ View Live
                  </a>
                </div>
              )}
            </div>

            {loadingPortfolio ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '12px', color: '#64748b' }}>
                <div className="spin" style={{ border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', borderRadius: '50%', width: '24px', height: '24px' }} />
                Loading portfolio...
              </div>
            ) : portfolioError ? (
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗂️</div>
                <h3 style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>No Portfolio Yet</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>{portfolioError}</p>
                <button onClick={() => setActiveTab('build')} className="primary-btn">Build My Portfolio →</button>
              </div>
            ) : portfolio && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px' }}>
                {/* Hero card */}
                <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '32px' }}>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{portfolio.personalInfo?.name}</h2>
                  <p style={{ fontSize: '17px', fontWeight: 600, color: '#818cf8', marginBottom: '12px' }}>{portfolio.personalInfo?.role}</p>
                  <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '15px', marginBottom: '20px' }}>{portfolio.personalInfo?.bio}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {portfolio.personalInfo?.email && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}>✉ {portfolio.personalInfo.email}</span>}
                    {portfolio.personalInfo?.location && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}>📍 {portfolio.personalInfo.location}</span>}
                    {portfolio.personalInfo?.github && <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 12px', fontSize: '13px', color: '#94a3b8' }}>⌨ GitHub</span>}
                  </div>
                </div>

                {/* Skills */}
                {portfolio.skills?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '16px' }}>SKILLS</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {portfolio.skills.map((s, i) => (
                        <span key={i} style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', padding: '5px 12px', fontSize: '13px', color: '#a5b4fc', fontWeight: 500 }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Experience */}
                  {portfolio.experience?.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '16px' }}>EXPERIENCE</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {portfolio.experience.map((e, i) => (
                          <div key={i} style={{ borderLeft: '2px solid rgba(99,102,241,0.3)', paddingLeft: '14px', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }} />
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{e.role}</div>
                            <div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, marginBottom: '4px' }}>{e.company} <span style={{ color: '#475569', fontWeight: 400 }}>· {e.duration}</span></div>
                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{e.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {portfolio.projects?.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '16px' }}>PROJECTS</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {portfolio.projects.map((p, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px' }}>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px', marginBottom: '4px' }}>{p.title}</div>
                            <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, marginBottom: '8px' }}>{p.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {p.tags?.map((t, j) => <span key={j} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '2px 7px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{t}</span>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Education */}
                {portfolio.education?.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.07em', marginBottom: '16px' }}>EDUCATION</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {portfolio.education.map((e, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '14px' }}>{e.degree}</div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>{e.school}</div>
                          </div>
                          <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: '#34d399', fontWeight: 600 }}>{e.year}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════ TEMPLATES TAB ════════ */}
        {activeTab === 'templates' && (
          <div className="fade-in">
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Choose a Template</h1>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Pick your style. Changes apply to your public portfolio instantly.</p>
              {templateSaving && <span style={{ fontSize: '13px', color: '#818cf8', marginLeft: '8px' }} className="pulse">Saving...</span>}
            </div>

            {!portfolio && !loadingPortfolio && (
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '14px 20px', color: '#fbbf24', fontSize: '14px', marginBottom: '24px' }}>
                ⚠ You need to create a portfolio first before a template can be applied.
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', maxWidth: '900px' }}>
              {TEMPLATES.map(t => (
                <div key={t.id} className={`template-option ${selectedTemplate === t.id ? 'selected' : ''}`}
                  onClick={() => portfolio && handleTemplateUpdate(t.id)}
                  style={{ border: `1px solid ${selectedTemplate === t.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, opacity: portfolio ? 1 : 0.5, cursor: portfolio ? 'pointer' : 'not-allowed' }}>
                  {/* Preview */}
                  <div style={{ height: '180px', background: t.preview.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '20px', color: t.preview.text, letterSpacing: '-0.01em' }}>Your Name</div>
                      <div style={{ fontSize: '13px', color: t.preview.sub, marginTop: '4px' }}>Your Role Here</div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {['React', 'Node', 'TypeScript'].map(sk => (
                          <span key={sk} style={{ background: `${t.preview.accent === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', color: t.preview.accent === '#fff' ? '#fff' : t.preview.accent, fontWeight: 700 }}>{sk}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: t.preview.accent === '#fff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', borderRadius: '5px', padding: '3px 7px', fontSize: '9px', fontWeight: 800, color: t.preview.accent === '#fff' ? '#fff' : '#333', letterSpacing: '0.06em' }}>{t.preview.tag}</div>
                    {selectedTemplate === t.id && (
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#6366f1', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: 700 }}>✓</div>
                    )}
                  </div>
                  {/* Info */}
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
                <a href={`/portfolio/${portfolio.user}`} target="_blank" rel="noopener noreferrer" className="primary-btn" style={{ textDecoration: 'none' }}>↗ Preview Live Portfolio</a>
                <button onClick={handleCopyLink} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '13px 24px', color: '#94a3b8', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  {copied ? '✓ Copied!' : '🔗 Copy Share Link'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════ SETTINGS TAB ════════ */}
        {activeTab === 'settings' && (
          <div className="fade-in">
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>Settings</h1>
            <div style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>Danger Zone</h3>
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>These actions are permanent and cannot be undone.</p>
                <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '10px 20px', color: '#f87171', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                  Sign Out
                </button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '6px' }}>More Features Coming</h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Custom domain, analytics, contact form, and dark/light mode toggle — all in the roadmap.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard