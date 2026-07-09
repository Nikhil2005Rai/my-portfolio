'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VirtualPet.module.css';
import { sounds } from '@/utils/soundEffects';

export default function VirtualPet({ synthwaveActive = false }) {
  const [active, setActive] = useState(true);
  const [behavior, setBehavior] = useState('sleeping'); // 'sleeping' | 'sitting' | 'walking' | 'petting' | 'playing'
  const [nekoMode, setNekoMode] = useState('normal'); // 'normal' | 'laser' | 'catnip'
  const [hearts, setHearts] = useState([]); // [{ id, x, y }]
  const [dizzySymbols, setDizzySymbols] = useState([]); // dizzy emoji particles
  
  const petRef = useRef(null);
  const redDotRef = useRef(null);
  const posRef = useRef({ x: 200, y: 200 });
  const targetRef = useRef({ x: 200, y: 200 });
  const facingLeftRef = useRef(false);
  const idleTimerRef = useRef(0);
  const animationFrameRef = useRef(null);
  const catnipTimerRef = useRef(0);

  // Sync active state from local storage or custom events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('show_pet');
      setActive(saved !== 'false');
    }

    const handleToggle = (e) => {
      if (e.detail && 'show' in e.detail) {
        setActive(e.detail.show);
        localStorage.setItem('show_pet', e.detail.show ? 'true' : 'false');
      }
    };
    window.addEventListener('toggle-pet', handleToggle);
    return () => window.removeEventListener('toggle-pet', handleToggle);
  }, []);

  // Listen to special neko modes (laser, catnip)
  useEffect(() => {
    const handleNekoMode = (e) => {
      if (e.detail && e.detail.mode) {
        const mode = e.detail.mode;
        
        setNekoMode((prevMode) => {
          const isTogglingOff = prevMode === mode || mode === 'normal';
          const nextMode = isTogglingOff ? 'normal' : mode;

          if (isTogglingOff) {
            setDizzySymbols([]);
            return 'normal';
          }

          if (nextMode === 'laser') {
            sounds.playLaser();
          }

          if (nextMode === 'catnip') {
            sounds.playLaser();
            setTimeout(() => sounds.playLaser(), 150);
            
            // Reset catnip after 6 seconds
            setTimeout(() => {
              setNekoMode(curr => curr === 'catnip' ? 'normal' : curr);
              setDizzySymbols([]);
            }, 6000);
          }

          return nextMode;
        });
      }
    };
    window.addEventListener('neko-mode', handleNekoMode);
    return () => window.removeEventListener('neko-mode', handleNekoMode);
  }, []);

  // Set initial position once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initX = window.innerWidth - 80;
      const initY = window.innerHeight - 120;
      posRef.current = { x: initX, y: initY };
      targetRef.current = { x: initX, y: initY };
    }
  }, []);

  // Tracking cursor positions (only if active and not in catnip mode)
  useEffect(() => {
    if (!active || nekoMode === 'catnip') return;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      idleTimerRef.current = 0; // Reset idle timer
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active, nekoMode]);

  // Main physics loop (silky smooth requestAnimationFrame)
  useEffect(() => {
    if (!active) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const updatePhysics = () => {
      const pet = petRef.current;
      const redDot = redDotRef.current;

      if (!pet) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const current = posRef.current;
      const target = { ...targetRef.current };

      // 1. Catnip Mode Logic: Random chaotic targets
      if (nekoMode === 'catnip') {
        catnipTimerRef.current += 1;
        // Shift random target every 25 frames
        if (catnipTimerRef.current % 25 === 0) {
          targetRef.current = {
            x: Math.random() * (window.innerWidth - 100) + 50,
            y: Math.random() * (window.innerHeight - 150) + 50
          };
          
          // Spawn dizzy floating stars above Neko
          const symbol = {
            id: Date.now() + Math.random(),
            text: ['🌀', '💫', '⭐', '✨'][Math.floor(Math.random() * 4)],
            x: Math.random() * 24 - 12,
            y: -20
          };
          setDizzySymbols(prev => [...prev.slice(-3), symbol]);
        }
      } else {
        // Increment the idle ticks counter in normal/laser mode
        idleTimerRef.current += 1;

        // If idle for > 6 seconds, target the Chatbot button
        if (idleTimerRef.current > 360 && nekoMode === 'normal') {
          const fab = document.getElementById('chatbot-fab');
          if (fab) {
            const rect = fab.getBoundingClientRect();
            target.x = rect.left + rect.width / 2;
            target.y = rect.top + rect.height / 2;
          }
        }
      }

      // Calculate distance to target coordinate
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Speed Lerp configuration
      // Hyper speed (0.08) if laser mode, otherwise normal catchup (0.045)
      const speedFactor = nekoMode === 'laser' ? 0.085 : 0.045;
      const catchupThreshold = (idleTimerRef.current > 360 || nekoMode === 'laser') ? 15 : 55;

      if (distance > catchupThreshold) {
        // Chase target
        current.x += dx * speedFactor;
        current.y += dy * speedFactor;

        // Apply flip direction
        facingLeftRef.current = dx < 0;
        setBehavior('walking');
      } else {
        // Reached target coordinate!
        if (nekoMode === 'catnip') {
          setBehavior('playing');
        } else if (idleTimerRef.current > 360 && nekoMode === 'normal') {
          // Idle chatbot button play
          if (idleTimerRef.current > 460) {
            setBehavior('sleeping'); 
          } else {
            setBehavior('playing');
            
            // Bat the chatbot button: trigger CSS wobble
            const fab = document.getElementById('chatbot-fab');
            if (fab && !fab.classList.contains('chatbot-fab-wobble')) {
              fab.classList.add('chatbot-fab-wobble');
              setTimeout(() => fab.classList.remove('chatbot-fab-wobble'), 600);
            }
          }
        } else {
          // Normal idle at cursor
          if (idleTimerRef.current > 240) {
            setBehavior('sleeping');
          } else if (idleTimerRef.current > 40) {
            setBehavior('sitting');
          }
        }
      }

      // Update cat sprite translation Matrix directly in the DOM for efficiency
      pet.style.transform = `translate3d(${current.x - 20}px, ${current.y - 20}px, 0) scaleX(${facingLeftRef.current ? -1 : 1})`;

      // Position the glowing red laser dot if active
      if (redDot) {
        redDot.style.transform = `translate3d(${targetRef.current.x - 5}px, ${targetRef.current.y - 5}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [active, nekoMode]);

  const handlePetClick = (e) => {
    e.stopPropagation();
    setBehavior('petting');
    idleTimerRef.current = 0;
    
    // Play programmatic 8-bit purr/chime sound
    sounds.playPurr();

    // Trigger heart floating particles
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 20 - 10,
      y: -15
    };
    setHearts(prev => [...prev, newHeart]);

    // Clean up hearts particles after 1.5s
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1500);
  };

  // Color config based on Synthwave active theme props
  const catColor = synthwaveActive ? 'rgba(18, 1, 54, 0.95)' : 'var(--accent, #ffffff)';
  const catStroke = synthwaveActive ? '#ff007f' : 'none';
  const catStrokeWidth = synthwaveActive ? '1.5' : '0';
  const facialDetailsColor = synthwaveActive ? '#00f0ff' : 'var(--bg-primary, #000000)';

  return (
    <div className={styles.petContainer}>
      {/* 1. Laser Mode: Glowing red dot element */}
      {active && nekoMode === 'laser' && (
        <div ref={redDotRef} className={styles.redDot} />
      )}

      {/* 2. Cat Sprite */}
      {active && (
        <div 
          ref={petRef}
          className={`${styles.petBody} ${nekoMode === 'catnip' ? styles.dizzySpins : ''}`}
          onClick={handlePetClick}
          title={nekoMode === 'laser' ? "Lasers! Go chase! 🔴" : "Click to pet me! 🐾"}
        >
          {/* SVG cat body */}
          <svg viewBox="0 0 40 40" className={styles.catSvg}>
            {/* Sleeping Zzz bubbles */}
            {behavior === 'sleeping' && nekoMode === 'normal' && (
              <g className={styles.zzzGroup}>
                <text x="32" y="8" className={styles.zzzText}>z</text>
                <text x="36" y="2" className={styles.zzzText2}>z</text>
              </g>
            )}

            {/* Cat body shape */}
            <rect 
              x="10" y="20" width="20" height="12" rx="4" 
              fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth}
              className={styles.mainBody} 
            />
            
            {/* Paws */}
            <ellipse 
              cx="14" cy="32" rx="3" ry="2" 
              fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth}
              className={behavior === 'walking' || behavior === 'playing' ? styles.pawLeft : ''} 
            />
            <ellipse 
              cx="26" cy="32" rx="3" ry="2" 
              fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth}
              className={behavior === 'walking' || behavior === 'playing' ? styles.pawRight : ''} 
            />

            {/* Head */}
            <circle 
              cx="20" cy="15" r="7" 
              fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth}
            />

            {/* Ears */}
            <polygon points="13,10 17,14 13,15" fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth} />
            <polygon points="27,10 23,14 27,15" fill={catColor} stroke={catStroke} strokeWidth={catStrokeWidth} />

            {/* Tail */}
            <path 
              d="M 10,25 C 5,25 2,20 2,15" 
              stroke={synthwaveActive ? '#ff007f' : 'var(--accent, #ffffff)'} 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
              className={behavior === 'sitting' || behavior === 'playing' ? styles.tailWag : ''} 
            />

            {/* Facial Expressions based on behavior/mode */}
            {behavior === 'sleeping' && nekoMode === 'normal' ? (
              // Closed sleeping eyes
              <g stroke={facialDetailsColor} strokeWidth="1.2" strokeLinecap="round">
                <line x1="16" y1="15" x2="18" y2="15" />
                <line x1="22" y1="15" x2="24" y2="15" />
                <circle cx="20" cy="18" r="0.8" fill={facialDetailsColor} />
              </g>
            ) : (behavior === 'petting' || behavior === 'playing' || nekoMode === 'catnip') ? (
              // Happy squinting curves eyes (or high on catnip)
              <g stroke={facialDetailsColor} strokeWidth="1.2" fill="none" strokeLinecap="round">
                <path d="M 15.5 16.5 Q 17 15.5 18.5 16.5" />
                <path d="M 21.5 16.5 Q 23 15.5 24.5 16.5" />
                <circle cx="20" cy="18.5" r="0.8" fill={facialDetailsColor} />
              </g>
            ) : nekoMode === 'laser' ? (
              // Giant black dilated pupils when hunting the laser pointer!
              <g>
                <circle cx="17" cy="15" r="2.8" fill={facialDetailsColor} />
                <circle cx="23" cy="15" r="2.8" fill={facialDetailsColor} />
                {/* Glint highlights */}
                <circle cx="16.2" cy="14.2" r="0.6" fill="#ffffff" />
                <circle cx="22.2" cy="14.2" r="0.6" fill="#ffffff" />
                <polygon points="19.5,17.5 20.5,17.5 20,18.5" fill={facialDetailsColor} />
              </g>
            ) : (
              // Standard eyes
              <g>
                <circle cx="17" cy="15" r="1.5" fill={facialDetailsColor} />
                <circle cx="23" cy="15" r="1.5" fill={facialDetailsColor} />
                <polygon points="19.5,17.5 20.5,17.5 20,18.5" fill={facialDetailsColor} />
              </g>
            )}

            {/* Whisker lines */}
            <g stroke={synthwaveActive ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 255, 255, 0.4)'} strokeWidth="0.8">
              <line x1="10" y1="17" x2="6" y2="16" />
              <line x1="10" y1="18.5" x2="5" y2="18.5" />
              <line x1="30" y1="17" x2="34" y2="16" />
              <line x1="30" y1="18.5" x2="35" y2="18.5" />
            </g>
          </svg>

          {/* Floating Heart Particles */}
          {hearts.map(heart => (
            <div 
              key={heart.id} 
              className={styles.heartIcon}
              style={{ left: `calc(50% + ${heart.x}px)`, top: `${heart.y}px` }}
            >
              ❤️
            </div>
          ))}

          {/* Dizzy catnip emojis floating above Neko */}
          {nekoMode === 'catnip' && dizzySymbols.map(sym => (
            <div
              key={sym.id}
              className={styles.dizzySymbol}
              style={{ left: `calc(50% + ${sym.x}px)`, top: `${sym.y}px` }}
            >
              {sym.text}
            </div>
          ))}
        </div>
      )}

      {/* Floating control button at bottom-right */}
      <button 
        className={styles.toggleBtn}
        onClick={() => {
          setActive(prev => {
            const next = !prev;
            localStorage.setItem('show_pet', next ? 'true' : 'false');
            return next;
          });
        }}
        title={active ? "Dismiss Neko 🐾" : "Summon Neko 🐾"}
      >
        🐾
      </button>
    </div>
  );
}
