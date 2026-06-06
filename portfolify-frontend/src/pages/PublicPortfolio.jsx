import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Briefcase, Code, ExternalLink, Mail, Globe, Terminal, LayoutTemplate } from 'lucide-react';

const PublicPortfolio = () => {
  const { userId } = useParams(); // This grabs the ID from the URL
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolios/user/${userId}`);
        setPortfolioData(response.data);
      } catch (err) {
        setError("We couldn't find a portfolio for this user.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicPortfolio();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h2 className="text-xl font-bold">Loading Portfolio...</h2>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100 max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Bar for context */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <Link to="/" className="text-lg font-extrabold text-blue-600 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5" /> Portfolify AI
        </Link>
        <Link to="/register" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">
          Build your own
        </Link>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
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
      </div>
    </div>
  );
};

export default PublicPortfolio;
