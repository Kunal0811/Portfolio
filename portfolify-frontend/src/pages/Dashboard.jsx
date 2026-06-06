import React, { useState, useEffect } from 'react'
import { LayoutTemplate, Upload, User, Settings, LogOut, CheckCircle, Loader2, Briefcase, Code, ExternalLink, Mail, Globe, Terminal, Share2, Copy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // File Upload & AI State
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Portfolio Data State
  const [portfolioData, setPortfolioData] = useState(null)
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutTemplate },
    { id: 'profile', label: 'My Portfolio', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // --- NEW: Fetch Portfolio Data when switching to the Profile Tab ---
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchPortfolio()
    }
  }, [activeTab])

  const fetchPortfolio = async () => {
    setIsLoadingPortfolio(true)
    setFetchError('')
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/portfolios/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPortfolioData(response.data)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setFetchError("You haven't generated a portfolio yet. Upload a resume first!")
      } else {
        setFetchError('Failed to load portfolio data. Please try again.')
      }
    } finally {
      setIsLoadingPortfolio(false)
    }
  }

  // File Upload Handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); }
  const handleDragLeave = () => { setIsDragging(false); }
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const uploadedFile = e.dataTransfer.files[0]
    if (uploadedFile && uploadedFile.type === 'application/pdf') { setFile(uploadedFile); setError(''); } 
    else { setError('Please upload a valid PDF file.'); }
  }
  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile && uploadedFile.type === 'application/pdf') { setFile(uploadedFile); setError(''); } 
    else { setError('Please upload a valid PDF file.'); }
  }

  // Send the File to the AI Backend
  const handleGeneratePortfolio = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file); 

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/portfolios/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      // Update state instantly with the AI's response and switch tabs!
      setPortfolioData(response.data.portfolio);
      setActiveTab('profile');
      setFile(null); // Clear the file input
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process resume with AI. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  }

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    // portfolioData.user contains your unique MongoDB User ID!
    const url = `${window.location.origin}/portfolio/${portfolioData.user}`;
    navigator.clipboard.writeText(url);
    setCopied(true);

    // Reset the button text after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="text-xl font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
            <LayoutTemplate className="w-6 h-6" /> Portfolify AI
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              )
            })}
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'dashboard' ? 'Welcome Back! 👋' : activeTab === 'profile' ? 'Your AI Portfolio 🚀' : 'Settings'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'dashboard' ? "Let's build or update your professional presence." : activeTab === 'profile' ? "Here is what the AI extracted from your resume." : "Manage your preferences."}
          </p>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="max-w-4xl bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Our AI engine will parse your PDF resume to instantly map out sections for your new portfolio website.
            </p>

            {error && <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-xl">{error}</div>}

            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl p-12 text-center transition flex flex-col items-center justify-center ${isDragging ? 'border-blue-500 bg-blue-50/50' : file ? 'border-green-400 bg-green-50/10' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'}`}>
              {file ? (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 animate-bounce"><CheckCircle className="w-8 h-8" /></div>
                  <p className="text-md font-bold text-gray-800 mb-1">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                  <button onClick={() => setFile(null)} disabled={isProcessing} className="text-xs text-red-500 hover:underline mt-4 font-semibold disabled:opacity-50">Remove and upload another</button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"><Upload className="w-7 h-7" /></div>
                  <p className="text-md font-bold text-gray-700 mb-1">Drag and drop your resume here, or <label className="text-blue-600 cursor-pointer hover:underline">browse<input type="file" accept=".pdf" className="hidden" onChange={handleFileChange}/></label></p>
                  <p className="text-xs text-gray-400 mt-1">Supports PDF format up to 10MB</p>
                </>
              )}
            </div>

            {file && (
              <button onClick={handleGeneratePortfolio} disabled={isProcessing} className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg flex justify-center items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed">
                {isProcessing ? <><Loader2 className="w-5 h-5 animate-spin" /> AI is processing your resume...</> : 'Generate Portfolio Structure ✨'}
              </button>
            )}
          </div>
        )}

        {/* PROFILE / PORTFOLIO TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-5xl space-y-6">
            {isLoadingPortfolio ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                <p className="font-semibold">Fetching your portfolio data...</p>
              </div>
            ) : fetchError ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4"><User className="w-8 h-8" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Portfolio Found</h3>
                <p className="text-gray-500 mb-6">{fetchError}</p>
                <button onClick={() => setActiveTab('dashboard')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">Upload a Resume</button>
              </div>
            ) : portfolioData ? (


              <>

                {/* Share Banner */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-6 shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between text-white">
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="p-3 bg-white/20 rounded-2xl"><Share2 className="w-6 h-6" /></div>
                    <div>
                      <h3 className="font-bold text-lg">Your portfolio is live!</h3>
                      <p className="text-blue-100 text-sm">Anyone with the link can view your AI-generated profile.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm w-full sm:w-auto justify-center"
                  >
                    {copied ? <><CheckCircle className="w-5 h-5 text-green-500" /> Copied!</> : <><Copy className="w-5 h-5" /> Copy Public Link</>}
                  </button>
                </div>
                
                {/* Personal Info Card */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{portfolioData.personalInfo.name}</h2>
                  <p className="text-xl text-blue-600 font-semibold mt-1 mb-4">{portfolioData.personalInfo.role}</p>
                  <p className="text-gray-600 leading-relaxed max-w-3xl">{portfolioData.personalInfo.bio}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-6">
                    {portfolioData.personalInfo.email && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"><Mail className="w-4 h-4"/> {portfolioData.personalInfo.email}</div>}
                    {portfolioData.personalInfo.linkedin && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"><Globe className="w-4 h-4"/> LinkedIn</div>}
                    {portfolioData.personalInfo.github && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100"><Terminal className="w-4 h-4"/> GitHub</div>}
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-blue-600"/> Core Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolioData.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Experience Section */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600"/> Experience</h3>
                    <div className="space-y-6">
                      {portfolioData.experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-blue-100 pl-4 relative">
                          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                          <h4 className="font-bold text-gray-900">{exp.role}</h4>
                          <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company} <span className="text-gray-400 font-normal">• {exp.duration}</span></p>
                          <p className="text-sm text-gray-600">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects Section */}
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-blue-600"/> Featured Projects</h3>
                    <div className="space-y-4">
                      {portfolioData.projects.map((project, index) => (
                        <div key={index} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition hover:shadow-sm">
                          <h4 className="font-bold text-gray-900 mb-1">{project.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, tIndex) => (
                              <span key={tIndex} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold">{tag}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm max-w-4xl">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h2>
            <p className="text-gray-500">Feature coming soon. Here you will be able to manage your account details and update your password.</p>
          </div>
        )}
      </main>

    </div>
  )
}

export default Dashboard