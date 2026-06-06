import React, { useState } from 'react'
import { LayoutTemplate, Upload, FileText, User, Settings, LogOut, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Sidebar navigation configuration
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutTemplate },
    { id: 'profile', label: 'My Portfolio', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // File Upload Handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const uploadedFile = e.dataTransfer.files[0]
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile)
    } else {
      alert('Please upload a PDF file.')
    }
  }

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0]
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="text-xl font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
            <LayoutTemplate className="w-6 h-6" />
            Portfolify AI
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back! 👋</h1>
          <p className="text-gray-500 mt-1">Let's build or update your professional presence.</p>
        </header>

        {activeTab === 'dashboard' && (
          <div className="max-w-4xl bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Your Resume</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Our AI engine will parse your PDF resume to instantly map out sections for your new portfolio website.
            </p>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition flex flex-col items-center justify-center ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50/50' 
                  : file 
                  ? 'border-green-400 bg-green-50/10' 
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
              }`}
            >
              {file ? (
                <>
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <p className="text-md font-bold text-gray-800 mb-1">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</p>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 hover:underline mt-4 font-semibold"
                  >
                    Remove and upload another
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-md font-bold text-gray-700 mb-1">
                    Drag and drop your resume here, or <label className="text-blue-600 cursor-pointer hover:underline">browse<input type="file" accept=".pdf" className="hidden" onChange={handleFileChange}/></label>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Supports PDF format up to 10MB</p>
                </>
              )}
            </div>

            {/* Action Button */}
            {file && (
              <button className="w-full mt-6 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                Generate Portfolio Structure ✨
              </button>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="text-gray-500">Your generated portfolios will be manageable here once a resume is uploaded.</div>
        )}

        {activeTab === 'settings' && (
          <div className="text-gray-500">Account and general system configuration preferences.</div>
        )}
      </main>

    </div>
  )
}

export default Dashboard