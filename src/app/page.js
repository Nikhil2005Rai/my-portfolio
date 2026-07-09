'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import portfolioData from '@/data/portfolio.json';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Achievements from '@/components/Achievements';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Chatbot from '@/components/Chatbot';
import CommandPalette from '@/components/CommandPalette';
import TerminalConsole from '@/components/TerminalConsole';

export default function Home() {
  const { personal, sections, about, skills, projects, achievements, certifications, contact } = portfolioData;
  
  // Track active tab/section page
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const handleNav = (e) => {
      const targetTab = e.detail.tab;
      setActiveTab(targetTab);
    };
    window.addEventListener('portfolio-navigate', handleNav);
    return () => window.removeEventListener('portfolio-navigate', handleNav);
  }, []);

  // Scroll to top of the page when activeTab changes to prevent scrolling stickiness
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Render components dynamically based on section IDs
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return <Hero key="hero" personalData={personal} setActiveTab={setActiveTab} />;
      case 'about':
        return <About key="about" aboutData={about} personalData={personal} />;
      case 'projects':
        return <Projects key="projects" projectsData={projects} />;
      case 'skills':
        return <Skills key="skills" skillsData={skills} />;
      case 'achievements':
        return <Achievements key="achievements" achievementsData={achievements} />;
      case 'certifications':
        return <Certifications key="certifications" certificationsData={certifications} />;
      case 'contact':
        return <Contact key="contact" contactData={contact} personalData={personal} />;
      default:
        return null;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        personalData={personal}
        sections={sections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Content wrapper: pushed left on desktop to clear the 290px fixed sidebar */}
      <div style={{
        flexGrow: 1,
        transition: 'var(--transition-smooth)'
      }} className="content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderSection(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>

      <Chatbot />
      <CommandPalette setActiveTab={setActiveTab} />
      <TerminalConsole />
    </div>
  );
}
