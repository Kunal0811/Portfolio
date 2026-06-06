import React from 'react'
import { Wand2, FileText, LayoutTemplate, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
          <LayoutTemplate className="w-7 h-7 text-blue-600" />
          Portfolify AI
        </div>
        <div className="space-x-6">
        {/* Replace the old buttons in the nav with these: */}
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-semibold transition">
            Login
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm">
            Get Started
            </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-8 pt-24 pb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Build Your Professional <br /> Portfolio in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Minutes</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Upload your resume and let AI generate a stunning, responsive portfolio website. No coding or design skills required.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            <Wand2 className="w-5 h-5" />
            Generate Portfolio Now
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-50 text-gray-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition border border-gray-200">
            View Templates
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Smart Resume Parsing</h3>
            <p className="text-gray-600 leading-relaxed">Upload your PDF resume and our AI extracts your skills, experience, and projects instantly.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <LayoutTemplate className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Beautiful Templates</h3>
            <p className="text-gray-600 leading-relaxed">Choose from modern, developer, or creative themes designed to make you stand out.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-md transition">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Publishing</h3>
            <p className="text-gray-600 leading-relaxed">Deploy your portfolio instantly to a public URL and share it with recruiters worldwide.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage