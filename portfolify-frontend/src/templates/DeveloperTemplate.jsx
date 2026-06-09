import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, ExternalLink, Mail, Globe, Terminal, GraduationCap, Award, Languages, Trophy } from 'lucide-react';

const DeveloperTemplate = ({ data }) => {
  if (!data) return null;

  const { personalInfo, skills, experience, projects, education, certifications, languages, achievements } = data;

  // Animation variants for cascading text/card entries
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-16"
    >
      {/* 1. HERO / PERSONAL INFO CARD */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{personalInfo?.name || 'Your Name'}</h2>
        <p className="text-xl text-blue-600 font-semibold mt-1 mb-4">{personalInfo?.role || 'Software Engineer'}</p>
        <p className="text-gray-600 leading-relaxed max-w-3xl text-base">{personalInfo?.bio || 'Professional bio summary.'}</p>
        
        <div className="flex flex-wrap gap-4 mt-6">
          {personalInfo?.email && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100"><Mail className="w-4 h-4 text-gray-400"/> {personalInfo.email}</div>}
          {personalInfo?.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-xl border border-gray-100 transition"><Globe className="w-4 h-4"/> LinkedIn</a>}
          {personalInfo?.github && <a href={personalInfo.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 hover:bg-gray-900 hover:text-white px-4 py-2 rounded-xl border border-gray-100 transition"><Terminal className="w-4 h-4"/> GitHub</a>}
          {personalInfo?.website && <a href={personalInfo.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 px-4 py-2 rounded-xl border border-gray-100 transition"><ExternalLink className="w-4 h-4"/> Portfolio Website</a>}
          {personalInfo?.phone && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">📱 {personalInfo.phone}</div>}
          {personalInfo?.location && <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">📍 {personalInfo.location}</div>}
        </div>
      </motion.div>

      {/* 2. CORE SKILLS */}
      {skills && skills.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Code className="w-5 h-5 text-blue-600"/> Technical Competencies</h3>
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill, index) => (
              <motion.span 
                whileHover={{ scale: 1.05, backgroundColor: '#eff6ff' }}
                key={index} 
                className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold border border-gray-100 cursor-default transition-colors duration-200"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3. DYNAMIC WORK & PROJECT SIDE-BY-SIDE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Work Experience Section (Renders ONLY if data exists) */}
        {experience && experience.length > 0 ? (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600"/> Professional Experience</h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-100 pl-4 relative">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                  <h4 className="font-bold text-gray-900 text-base">{exp.role}</h4>
                  <p className="text-sm font-semibold text-blue-600 mb-2">{exp.company} <span className="text-gray-400 font-normal">• {exp.duration}</span></p>
                  <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Featured Projects Section */}
        {projects && projects.length > 0 ? (
          <motion.div 
            variants={itemVariants} 
            className={`bg-white rounded-3xl border border-gray-100 p-8 shadow-sm ${(!experience || experience.length === 0) ? 'lg:col-span-2' : ''}`}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-blue-600"/> Technical Engineering Projects</h3>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project, index) => (
                <motion.div 
                  whileHover={{ y: -4, shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
                  key={index} 
                  className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-white transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{project.title}</h4>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags?.map((tag, tIndex) => (
                      <span key={tIndex} className="px-2.5 py-1 bg-white text-gray-600 border border-gray-100 rounded-lg text-xs font-semibold">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </div>

      {/* 4. ACADEMIC EDUCATION HISTORY */}
      {education && education.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><GraduationCap className="w-6 h-6 text-blue-600"/> Education & Academic Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div key={index} className="p-5 border border-gray-50 rounded-2xl bg-gray-50/30">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">{edu.year}</span>
                <h4 className="font-bold text-gray-900 mt-3 text-base">{edu.degree}</h4>
                <p className="text-sm text-gray-500 font-medium mb-2">{edu.school}</p>
                {edu.description && <p className="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2 leading-relaxed">{edu.description}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. ADDITIONAL INFORMATION ACCORDION / GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Certifications Card */}
        {certifications && certifications.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm tracking-wide uppercase text-gray-400"><Award className="w-4 h-4 text-blue-500"/> Certifications</h4>
            <ul className="space-y-2">
              {certifications.map((cert, index) => (
                <li key={index} className="text-sm font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-50/50">🛡️ {cert}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Achievements Card */}
        {achievements && achievements.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm tracking-wide uppercase text-gray-400"><Trophy className="w-4 h-4 text-amber-500"/> Achievements</h4>
            <ul className="space-y-2">
              {achievements.map((ach, index) => (
                <li key={index} className="text-sm font-semibold text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-50/50">✨ {ach}</li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Languages Card */}
        {languages && languages.length > 0 && (
          <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm tracking-wide uppercase text-gray-400"><Languages className="w-4 h-4 text-emerald-500"/> Languages</h4>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang, index) => (
                <span key={index} className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">{lang}</span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default DeveloperTemplate;