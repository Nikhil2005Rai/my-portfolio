'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import styles from './TerminalConsole.module.css';

export default function TerminalConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [matrixActive, setMatrixActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [consoleTheme, setConsoleTheme] = useState('classic');
  const [isRebooting, setIsRebooting] = useState(false);
  const [isHacking, setIsHacking] = useState(false);

  const inputRef = useRef(null);
  const consoleEndRef = useRef(null);
  const canvasRef = useRef(null);

  // Detect mobile viewports to adjust layout and keyboard input prompts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize terminal command welcome logs
  useEffect(() => {
    if (isOpen && history.length === 0) {
      setHistory([
        { text: 'NikhilRai OS v1.2.0 (Type "help" for options)', type: 'system' },
        { text: 'Initialising terminal shell components... [OK]', type: 'system' },
        { text: 'Loading live database caches... [OK]', type: 'system' },
        { text: 'Active session: guest@nikhilrai.me', type: 'system' },
        { text: '---', type: 'divider' }
      ]);
    }
  }, [isOpen, history]);

  // Handle auto-focus and auto-scroll
  useEffect(() => {
    if (isOpen && !isRebooting && !isHacking) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isRebooting, isHacking]);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Listen to keyboard shortcut (Ctrl + `) to toggle terminal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`' && e.ctrlKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Listen to global custom events
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };
    window.addEventListener('terminal-toggle', handleToggle);
    return () => window.removeEventListener('terminal-toggle', handleToggle);
  }, []);

  // Matrix falling code animation effect
  useEffect(() => {
    if (!matrixActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const alphabet = katakana.split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 30);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      setMatrixActive(false);
      setHistory(prev => [...prev, { text: 'Matrix mode terminated. Welcome back.', type: 'system' }]);
    }, 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [matrixActive]);

  const executeCommand = (cmd) => {
    const rawCmd = cmd.trim();
    if (!rawCmd) return;

    // Add command to log history
    setHistory(prev => [...prev, { text: `guest@nikhilrai.me:~$ ${rawCmd}`, type: 'input' }]);

    const tokens = rawCmd.split(/\s+/);
    const command = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    // Block commands if system is busy rebooting
    if (isRebooting || isHacking) return;

    switch (command) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { text: 'Available commands:', type: 'output' },
          { text: '  about        - Print personal biography & location info', type: 'output' },
          { text: '  skills       - View core technical stack breakdown', type: 'output' },
          { text: '  projects     - List technical engineering projects', type: 'output' },
          { text: '  theme <color>- Accent themes (green, amber, classic)', type: 'output' },
          { text: '  matrix       - Enter the matrix (Easter Egg)', type: 'output' },
          { text: '  hack         - Execute mock terminal exploit sequence', type: 'output' },
          { text: '  sudo         - Simulated system directories purge', type: 'output' },
          { text: '  rickroll     - Launch auditory visual stream', type: 'output' },
          { text: '  github       - Link to GitHub profile', type: 'output' },
          { text: '  linkedin     - Link to LinkedIn profile', type: 'output' },
          { text: '  leetcode     - Link to LeetCode profile', type: 'output' },
          { text: '  clear        - Flush console outputs history', type: 'output' },
          { text: '  exit         - Shutdown console session', type: 'output' }
        ]);
        break;

      case 'about':
        setHistory(prev => [
          ...prev,
          { text: `Name: ${portfolioData.personal.name}`, type: 'output' },
          { text: `Title: ${portfolioData.personal.title}`, type: 'output' },
          { text: `Location: ${portfolioData.personal.location}`, type: 'output' },
          { text: `Bio: ${portfolioData.personal.bio}`, type: 'output' },
          { text: `Email: ${portfolioData.personal.email}`, type: 'output' }
        ]);
        break;

      case 'skills':
        setHistory(prev => [...prev, { text: '--- Technical Stack Tree ---', type: 'output' }]);
        portfolioData.skills.categories.forEach(cat => {
          setHistory(prev => [
            ...prev,
            { text: `[${cat.name}]`, type: 'output-highlight' },
            { text: `  ${cat.items.join(' | ')}`, type: 'output' }
          ]);
        });
        break;

      case 'projects':
        setHistory(prev => [...prev, { text: '--- Projects Catalog ---', type: 'output' }]);
        portfolioData.projects.items.forEach(proj => {
          setHistory(prev => [
            ...prev,
            { text: `* ${proj.title} - ${proj.subtitle}`, type: 'output-highlight' },
            { text: `  Tech: ${proj.tech.join(', ')}`, type: 'output' },
            { text: `  GitHub: ${proj.github}`, type: 'output' }
          ]);
        });
        break;

      case 'theme':
        const themeChoice = args[0]?.toLowerCase();
        if (themeChoice === 'classic' || themeChoice === 'green' || themeChoice === 'amber') {
          setConsoleTheme(themeChoice);
          setHistory(prev => [...prev, { text: `Theme changed to: ${themeChoice} accent modes.`, type: 'system' }]);
        } else {
          setHistory(prev => [...prev, { text: 'Usage: theme <green | amber | classic>', type: 'error' }]);
        }
        break;

      case 'sudo':
      case 'sudo rm -rf /':
        setIsRebooting(true);
        setHistory(prev => [...prev, { text: '[CRITICAL WARNING] INITIATING DIRECTORY DESTRUCT BYPASS...', type: 'error' }]);
        
        setTimeout(() => {
          // Trigger the global site shake & glitch effect
          window.dispatchEvent(new CustomEvent('website-self-destruct'));
          setIsOpen(false);
          setIsRebooting(false);
          setHistory([]); // Flush history logs for a clean restart later
        }, 1000);
        break;

      case 'hack':
        setIsHacking(true);
        setHistory(prev => [...prev, { text: 'Launching secure decryption scripts...', type: 'system' }]);
        
        setTimeout(() => {
          setHistory(prev => [...prev, { text: 'Overriding local port gateways ... [OK]', type: 'system' }]);
        }, 600);
        setTimeout(() => {
          setHistory(prev => [...prev, { text: 'Decrypting credentials package database... [OK]', type: 'system' }]);
        }, 1200);
        setTimeout(() => {
          setHistory(prev => [...prev, { text: 'Access granted. Fetching secret repository credentials...', type: 'output-highlight' }]);
        }, 1800);
        setTimeout(() => {
          setHistory(prev => [
            ...prev,
            { text: '        /\\_/\\', type: 'output-highlight' },
            { text: '       ( o.o )   "Access Granted. You are now a certified hacker."', type: 'output-highlight' },
            { text: '        > ^ <', type: 'output-highlight' }
          ]);
          setIsHacking(false);
        }, 2500);
        break;

      case 'rick':
      case 'rickroll':
        setHistory(prev => [
          ...prev,
          { text: "We're no strangers to love...", type: 'output-highlight' },
          { text: "You know the rules and so do I...", type: 'output-highlight' },
          { text: "Opening visual payload stream...", type: 'system' }
        ]);
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener,noreferrer');
        break;

      case 'github':
        setHistory(prev => [...prev, { text: 'Opening GitHub profile: https://github.com/Nikhil2005Rai', type: 'system' }]);
        window.open(portfolioData.personal.socials.github, '_blank', 'noopener,noreferrer');
        break;

      case 'linkedin':
        setHistory(prev => [...prev, { text: 'Opening LinkedIn profile: https://linkedin.com/in/nikhil-rai-dev', type: 'system' }]);
        window.open(portfolioData.personal.socials.linkedin, '_blank', 'noopener,noreferrer');
        break;

      case 'leetcode':
        setHistory(prev => [...prev, { text: 'Opening LeetCode profile: https://leetcode.com/u/NikhilRai2005/', type: 'system' }]);
        window.open(portfolioData.personal.socials.leetcode, '_blank', 'noopener,noreferrer');
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'exit':
        setIsOpen(false);
        break;

      case 'matrix':
        setMatrixActive(true);
        break;

      default:
        setHistory(prev => [
          ...prev,
          { text: `Command not found: "${rawCmd}". Type "help" for options.`, type: 'error' }
        ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRebooting || isHacking) return;
    executeCommand(input);
    setInput('');
  };

  const getThemeClass = () => {
    if (consoleTheme === 'amber') return styles.themeAmber;
    if (consoleTheme === 'green') return styles.themeGreen;
    return styles.themeClassic;
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className={styles.overlay} onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`${styles.consoleModal} ${getThemeClass()} ${matrixActive ? styles.matrixHide : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.headerTitle}>
                  <Terminal size={14} className={styles.terminalIcon} />
                  <span>Developer Console Terminal (guest@nikhilrai.me)</span>
                </div>
                <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              {/* Console Screen Body */}
              <div className={styles.screen} onClick={() => !isMobile && inputRef.current?.focus()}>
                {isMobile ? (
                  <div className={styles.mobileWarning}>
                    <div className={styles.warningTitle}>[SYSTEM NOTIFICATION]</div>
                    <div className={styles.warningDesc}>
                      The Developer Console Terminal requires a physical keyboard and is optimized for desktop browsers.
                    </div>
                    <div className={styles.warningDesc} style={{ marginTop: '12px', color: 'var(--fg-muted)' }}>
                      Please access this console from a computer or desktop layout to input CLI commands.
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.logsArea}>
                      {history.map((log, index) => {
                        if (log.type === 'divider') {
                          return <div key={index} className={styles.divider} />;
                        }
                        let logClass = styles.logText;
                        if (log.type === 'system') logClass = styles.systemText;
                        if (log.type === 'input') logClass = styles.inputText;
                        if (log.type === 'output-highlight') logClass = styles.outputHighlight;
                        if (log.type === 'error') logClass = styles.errorText;

                        return (
                          <div key={index} className={logClass}>
                            {log.text}
                          </div>
                        );
                      })}
                      <div ref={consoleEndRef} />
                    </div>

                    {/* Input Prompt Form */}
                    <form onSubmit={handleSubmit} className={styles.promptForm}>
                      <span className={styles.promptIndicator}>guest@nikhilrai.me:~$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        disabled={isRebooting || isHacking}
                        onChange={(e) => setInput(e.target.value)}
                        className={styles.inputField}
                        autoComplete="off"
                        autoCapitalize="none"
                        spellCheck="false"
                      />
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Matrix Canvas Screen */}
      <AnimatePresence>
        {matrixActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.matrixContainer}
          >
            <canvas ref={canvasRef} className={styles.matrixCanvas} />
            <div className={styles.matrixInstruction}>
              Press ESC or wait to return...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
