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
  const [glitchActive, setGlitchActive] = useState(false);
  const [isDestructed, setIsDestructed] = useState(false);
  const [showTrollMessage, setShowTrollMessage] = useState(false);
  
  // Custom interactive easter eggs states
  const [synthwaveActive, setSynthwaveActive] = useState(false);
  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('has_booted') !== 'true';
    }
    return true;
  });
  const [bootStep, setBootStep] = useState(0);

  const bootLogs = [
    '[BOOT] Initialising NikhilRai OS v1.2.0...',
    '[SYS] Syncing Next.js Turbopack cache directories... [OK]',
    '[SYS] Connecting to Vercel global edge routers... [OK]',
    '[SYS] Fetching LeetCode & GitHub stats queries... [OK]',
    '[SYS] Injecting chatbot configurations for bot_nik... [OK]',
    '[SYS] Welcome guest. Boot sequence complete.'
  ];

  // Run boot screen ticks
  useEffect(() => {
    if (!isBooting) return;

    const timer = setInterval(() => {
      setBootStep((prev) => {
        if (prev >= bootLogs.length - 1) {
          clearInterval(timer);
          setTimeout(() => {
            setIsBooting(false);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('has_booted', 'true');
            }
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [isBooting]);

  // Konami Code Sequence Listener
  useEffect(() => {
    const konamiSequence = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let pressedKeys = [];

    const handleKeyDown = (e) => {
      pressedKeys.push(e.key);
      pressedKeys = pressedKeys.slice(-konamiSequence.length);

      if (pressedKeys.join(',').toLowerCase() === konamiSequence.join(',').toLowerCase()) {
        setSynthwaveActive(prev => !prev);
        pressedKeys = []; // Reset sequence key history
      }

      if (e.key === 'Escape') {
        setSynthwaveActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleNav = (e) => {
      const targetTab = e.detail.tab;
      setActiveTab(targetTab);
    };
    window.addEventListener('portfolio-navigate', handleNav);
    return () => window.removeEventListener('portfolio-navigate', handleNav);
  }, []);

  // Listen to critical website destruction trigger
  useEffect(() => {
    const handleSelfDestruct = () => {
      setGlitchActive(true);
      setTimeout(() => {
        setIsDestructed(true);
        setGlitchActive(false);
      }, 2500);
    };
    window.addEventListener('website-self-destruct', handleSelfDestruct);
    return () => window.removeEventListener('website-self-destruct', handleSelfDestruct);
  }, []);

  // Check if visitor has returned from being Rickrolled (Troll Callback, supporting bfcache)
  useEffect(() => {
    const handleTrollCallback = () => {
      if (typeof window !== 'undefined' && localStorage.getItem('user_trolled') === 'true') {
        setShowTrollMessage(true);
        localStorage.removeItem('user_trolled');
      }
    };
    handleTrollCallback();
    window.addEventListener('pageshow', handleTrollCallback);
    return () => window.removeEventListener('pageshow', handleTrollCallback);
  }, []);

  // Scroll to top of the page when activeTab changes to prevent scrolling stickiness
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const handleRestore = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_trolled', 'true');
      setIsDestructed(false); // Reset state before navigation so Back cache loads normal page
      window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    }
  };

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

  // 1. Render system boot screen loading logs
  if (isBooting) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#39ff14', // Neon Green matrix accents
        fontFamily: 'Courier New, monospace',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        zIndex: 999999
      }}>
        <div style={{ maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bootLogs.slice(0, bootStep + 1).map((log, idx) => (
            <div key={idx} style={{ fontSize: '0.88rem', lineHeight: '1.5', letterSpacing: '0.02em' }}>
              {log}
            </div>
          ))}
          <div style={{
            width: '8px',
            height: '14px',
            backgroundColor: '#39ff14',
            animation: 'blink 0.8s infinite',
            marginTop: '8px'
          }} />
        </div>
        <style jsx>{`
          @keyframes blink {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // 2. Render destroyed website view override
  if (isDestructed) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0c0c0c',
        color: '#ff3333',
        fontFamily: 'Courier New, monospace',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        zIndex: 99999,
        userSelect: 'none'
      }}>
        <div style={{ maxWidth: '600px', width: '100%', border: '1px solid rgba(255, 51, 51, 0.3)', padding: '32px', borderRadius: '8px', backgroundColor: '#000000', boxShadow: '0 0 30px rgba(255, 51, 51, 0.15)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', letterSpacing: '0.05em' }}>[ SYSTEM CRITICAL DESTRUCTION ]</h1>
          <p style={{ color: '#888888', lineHeight: '1.6', marginBottom: '12px' }}>guest@nikhilrai.me:~$ sudo rm -rf /</p>
          <p style={{ color: '#ff3333', lineHeight: '1.6', marginBottom: '8px' }}>- Deleting database caches... [DELETED]</p>
          <p style={{ color: '#ff3333', lineHeight: '1.6', marginBottom: '8px' }}>- Deleting layout assets... [DELETED]</p>
          <p style={{ color: '#ff3333', lineHeight: '1.6', marginBottom: '8px' }}>- Deleting portfolio routing... [DELETED]</p>
          <p style={{ color: '#888888', marginTop: '24px', marginBottom: '32px' }}>System offline. Port connections severed.</p>
          
          <button
            onClick={handleRestore}
            style={{
              background: 'none',
              border: '2px solid #ff3333',
              color: '#ff3333',
              padding: '12px 24px',
              fontFamily: 'inherit',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              boxShadow: '0 0 10px rgba(255, 51, 51, 0.2)',
              textTransform: 'uppercase',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff3333';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff3333';
            }}
          >
            [ Restore System Caches ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`${glitchActive ? 'website-critical-glitch' : ''} ${synthwaveActive ? 'synthwave-theme' : ''}`} 
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'filter 0.3s ease' }}
    >
      {/* Troll Return Success Toast */}
      <AnimatePresence>
        {showTrollMessage && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              x: '-50%',
              zIndex: 10000,
              background: 'rgba(12, 12, 12, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '20px 28px',
              borderRadius: '8px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
              maxWidth: '460px',
              width: '90%',
              fontFamily: 'Courier New, monospace',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: '#39ff14', fontWeight: 'bold', fontSize: '0.85rem' }}>[ SYSTEM RESTORED ]</span>
              <button 
                onClick={() => setShowTrollMessage(false)}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.9rem', padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <p style={{ color: '#ffffff', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Ah, back from the Rickroll? 😂 Did you really think you could delete my portfolio? Nice try!
            </p>
            <p style={{ color: 'var(--fg-secondary)', fontSize: '0.78rem', marginTop: '12px', marginBottom: 0 }}>
              - bot_nik is fully active. Please behave! 🤖
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill for Unlocked Synthwave Mode */}
      <AnimatePresence>
        {synthwaveActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'rgba(255, 0, 127, 0.95)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '99px',
              boxShadow: '0 0 20px rgba(255, 0, 127, 0.6)',
              fontFamily: 'Courier New, monospace',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              zIndex: 99999,
              letterSpacing: '0.05em',
              userSelect: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setSynthwaveActive(false)}
            title="Click or press ESC to exit Synthwave mode"
          >
            ⚡ SYNTHWAVE UNLOCKED (ESC to exit)
          </motion.div>
        )}
      </AnimatePresence>

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
