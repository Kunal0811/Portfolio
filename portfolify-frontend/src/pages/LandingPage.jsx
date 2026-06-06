import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutTemplate, Zap, Shield, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100">
        <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-2 tracking-tight">
          <LayoutTemplate className="w-8 h-8" />
          Portfolify AI
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 transition">
            Sign In
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 mt-16 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8 border border-blue-100">
          <Sparkles className="w-4 h-4" />
          Powered by Google Gemini AI
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl leading-tight mb-6">
          Turn your PDF resume into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">stunning portfolio</span> in seconds.
        </h1>
        
        <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
          Stop struggling with website builders. Upload your resume, and let our AI instantly extract your skills, experience, and projects into a beautiful, shareable developer portfolio.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
            Build My Portfolio <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="px-8 py-4 text-lg font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition flex items-center justify-center">
            See How It Works
          </a>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Everything you need to stand out</h2>
            <p className="mt-4 text-lg text-gray-500">Built specifically for developers and tech professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Generation</h3>
              <p className="text-gray-600 leading-relaxed">No drag-and-drop. No typing. Our AI reads your PDF and structures your entire professional history instantly.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Beautiful Templates</h3>
              <p className="text-gray-600 leading-relaxed">Choose from modern, developer-focused templates that look incredible on desktop, tablet, and mobile.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">Your data is secured with enterprise-grade encryption. You have full control over what goes public.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-center text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LayoutTemplate className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-white tracking-tight">Portfolify AI</span>
        </div>
        <p className="text-sm">© {new Date().getFullYear()} Portfolify AI. Built with React & Node.js.</p>
      </footer>
    </div>
  );
};

export default LandingPage;