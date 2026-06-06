import React from 'react'

// Dummy data
const portfolioData = {
  name: "Alex Developer",
  role: "Full Stack Software Engineer",
  bio: "Passionate developer specializing in building exceptional digital experiences. Currently focused on building accessible, human-centered products using React and Node.js.",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  skills: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript", "Tailwind CSS", "Git", "Docker"],
  projects: [
    {
      title: "E-Commerce API",
      description: "A robust RESTful API built with Node.js, Express, and MongoDB. Features secure JWT authentication and Stripe payment integration.",
      tags: ["Node.js", "Express", "MongoDB"],
      link: "#"
    },
    {
      title: "Task Management App",
      description: "A drag-and-drop Kanban board application built with React and Redux. Includes real-time updates via WebSockets.",
      tags: ["React", "Redux", "WebSockets"],
      link: "#"
    }
  ],
  experience: [
    {
      role: "Software Engineer",
      company: "Tech Solutions Inc.",
      duration: "2021 - Present",
      description: "Developed and maintained highly scalable web applications. Reduced database query load times by 40%."
    }
  ]
}

const DeveloperTemplate = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Header Section */}
      <header className="max-w-4xl mx-auto px-6 py-20 md:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-mono mb-6">
          <span className="font-bold">{">_"}</span>
          <span>Hello, World!</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6">
          I'm {portfolioData.name}.
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-400 mb-8">
          {portfolioData.role}
        </h2>
        <p className="text-lg md:text-xl max-w-2xl text-slate-400 leading-relaxed mb-10">
          {portfolioData.bio}
        </p>
        
        {/* Social Links */}
        <div className="flex gap-4">
          <a href={portfolioData.github} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-semibold text-white rounded-lg transition">
            GitHub
          </a>
          <a href={portfolioData.linkedin} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 font-semibold text-white rounded-lg transition">
            LinkedIn
          </a>
          <a href={`mailto:${portfolioData.email}`} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-white rounded-lg transition shadow-lg shadow-blue-500/20">
            Email Me
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pb-32 space-y-32">
        
        {/* Skills Section */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-2xl font-bold text-blue-500">{"{ / }"}</span>
            <h3 className="text-3xl font-bold text-white">Technical Skills</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {portfolioData.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 bg-slate-800 text-blue-300 rounded-md font-mono text-sm border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-2xl font-bold text-blue-500">{"< >"}</span>
            <h3 className="text-3xl font-bold text-white">Featured Projects</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {portfolioData.projects.map((project, index) => (
              <div key={index} className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition">{project.title}</h4>
                  <a href={project.link} className="text-slate-400 hover:text-white transition font-bold text-xl">
                    ↗
                  </a>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="text-xs font-mono text-slate-300">#{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <span className="text-2xl font-bold text-blue-500">💼</span>
            <h3 className="text-3xl font-bold text-white">Experience</h3>
          </div>
          <div className="space-y-8">
            {portfolioData.experience.map((exp, index) => (
              <div key={index} className="relative pl-8 border-l-2 border-slate-700">
                <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 ring-4 ring-slate-900"></div>
                <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                <div className="text-blue-400 font-medium mb-2">{exp.company} <span className="text-slate-500 mx-2">•</span> {exp.duration}</div>
                <p className="text-slate-400 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

export default DeveloperTemplate