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
  const inputRef = useRef(null);
  const consoleEndRef = useRef(null);
  const canvasRef = useRef(null);

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
  }, [isOpen]);

  // Handle auto-focus and auto-scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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

  // Listen to global custom events (e.g. from navbar clicks)
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

    // Stop matrix after 5 seconds
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
    const cleanCmd = rawCmd.toLowerCase();

    if (!cleanCmd) return;

    // Add command to log history
    setHistory(prev => [...prev, { text: `guest@nikhilrai.me:~$ ${rawCmd}`, type: 'input' }]);

    switch (cleanCmd) {
      case 'help':
        setHistory(prev => [
          ...prev,
          { text: 'Available commands:', type: 'output' },
          { text: '  about    - Print personal biography & location info', type: 'output' },
          { text: '  skills   - View core technical stack breakdown', type: 'output' },
          { text: '  projects - List technical engineering projects', type: 'output' },
          { text: '  matrix   - Enter the matrix (Easter Egg)', type: 'output' },
          { text: '  clear    - Flush console outputs history', type: 'output' },
          { text: '  exit     - Shutdown console session', type: 'output' }
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
    executeCommand(input);
    setInput('');
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
              className={`${styles.consoleModal} ${matrixActive ? styles.matrixHide : ''}`}
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
              <div className={styles.screen} onClick={() => inputRef.current?.focus()}>
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
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.inputField}
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck="false"
                  />
                </form>
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
