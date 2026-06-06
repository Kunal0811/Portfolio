import React from 'react'

// Dummy Data for a non-developer professional
const portfolioData = {
  name: "Jordan Smith",
  role: "Senior Product Manager",
  bio: "Strategic and data-driven Product Manager with 5+ years of experience leading cross-functional teams to deliver impactful digital products. Passionate about user-centric design and agile methodologies.",
  email: "jordan@example.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  skills: ["Product Strategy", "Agile/Scrum", "User Research", "Data Analytics", "Roadmapping", "A/B Testing", "Stakeholder Management"],
  experience: [
    {
      role: "Senior Product Manager",
      company: "InnovateTech",
      duration: "2021 - Present",
      description: "Led the launch of a new SaaS platform, increasing recurring revenue by 35% in the first year. Managed a cross-functional team of 12 engineers and designers."
    },
    {
      role: "Product Owner",
      company: "Creative Solutions",
      duration: "2018 - 2021",
      description: "Prioritized product backlog and spearheaded the redesign of the core mobile app, resulting in a 50% increase in daily active users."
    }
  ],
  education: [
    {
      degree: "Master of Business Administration (MBA)",
      school: "University of Business",
      year: "2018"
    },
    {
      degree: "B.S. in Computer Science",
      school: "State University",
      year: "2016"
    }
  ]
}

const ModernTemplate = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navigation / Header */}
      <nav className="max-w-5xl mx-auto px-8 py-6 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold tracking-tight">{portfolioData.name}</div>
        <div className="flex gap-4">
          <a href={portfolioData.linkedin} className="text-gray-500 hover:text-blue-600 font-medium transition">LinkedIn</a>
          <a href={`mailto:${portfolioData.email}`} className="text-gray-500 hover:text-blue-600 font-medium transition">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-5xl mx-auto px-8 py-24 md:py-32">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Building products <br /> that <span className="text-blue-600">matter.</span>
        </h1>
        <h2 className="text-2xl font-medium text-gray-500 mb-8 max-w-2xl leading-relaxed">
          {portfolioData.bio}
        </h2>
        <a 
          href={`mailto:${portfolioData.email}`} 
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition shadow-lg"
        >
          Let's Work Together ↗
        </a>
      </header>

      {/* Main Content */}
      <main className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-8 space-y-24">
          
          {/* Core Competencies */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-8">Core Competencies</h3>
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.map((skill, index) => (
                <span key={index} className="px-5 py-3 bg-white text-gray-800 rounded-full text-sm font-medium border border-gray-200 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-8">Professional Experience</h3>
            <div className="space-y-12">
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 md:gap-8 group">
                  <div className="md:col-span-1 text-gray-500 font-medium pt-1">
                    {exp.duration}
                  </div>
                  <div className="md:col-span-3">
                    <h4 className="text-2xl font-bold text-gray-900">{exp.role}</h4>
                    <div className="text-lg text-blue-600 font-medium mb-4">{exp.company}</div>
                    <p className="text-gray-600 leading-relaxed max-w-2xl">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-8">Education</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {portfolioData.education.map((edu, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-3xl mb-4">🎓</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h4>
                  <div className="text-gray-500">{edu.school} • {edu.year}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-8 py-12 flex justify-between items-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
        <p>Generated by Portfolify AI</p>
      </footer>

    </div>
  )
}

export default ModernTemplate
