'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './VirtualPet.module.css';

export default function VirtualPet() {
  const [active, setActive] = useState(true);
  const [behavior, setBehavior] = useState('sleeping'); // 'sleeping' | 'sitting' | 'walking' | 'petting'
  const [facingLeft, setFacingLeft] = useState(false);
  const [hearts, setHearts] = useState([]); // [{ id, x, y }]

  const petRef = useRef(null);
  const posRef = useRef({ x: 200, y: 200 });
  const targetRef = useRef({ x: 200, y: 200 });
  const idleTimerRef = useRef(0);
  const animationFrameRef = useRef(null);

  // Sync active state from local storage or custom events
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('show_pet');
      // On by default, unless explicitly set to 'false'
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

  // Tracking cursor positions
  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active]);

  // Main physics loop (silky smooth requestAnimationFrame)
  useEffect(() => {
    if (!active) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    // Set initial position to bottom right
    posRef.current = {
      x: window.innerWidth - 80,
      y: window.innerHeight - 120
    };
    targetRef.current = { ...posRef.current };

    const updatePhysics = () => {
      const pet = petRef.current;
      if (!pet) {
        animationFrameRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const current = posRef.current;
      const target = targetRef.current;

      // Calculate distance to target (cursor)
      const dx = target.x - current.x;
      const dy = target.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Speed configuration
      const lerpFactor = 0.045; // Smooth slow catchup velocity
      const catchupThreshold = 55; // Sit if close, chase if far

      if (distance > catchupThreshold) {
        // Chase cursor
        current.x += dx * lerpFactor;
        current.y += dy * lerpFactor;

        // Apply flip direction
        setFacingLeft(dx < 0);
        setBehavior('walking');
        idleTimerRef.current = 0;
      } else {
        // Sitting/Idle or Sleeping state check
        idleTimerRef.current += 1;

        if (idleTimerRef.current > 240) {
          // Sleep after ~4 seconds of idleness (60 frames/sec)
          setBehavior('sleeping');
        } else if (idleTimerRef.current > 40) {
          setBehavior('sitting');
        }
      }

      // Directly update CSS transform matrix without React state updates for buttery smooth 60fps
      pet.style.transform = `translate3d(${current.x - 20}px, ${current.y - 20}px, 0) scaleX(${facingLeft ? -1 : 1})`;

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [active, facingLeft]);

  const handlePetClick = (e) => {
    e.stopPropagation();
    setBehavior('petting');
    idleTimerRef.current = 0;

    // Trigger heart floating particles
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 20 - 10,
      y: -15
    };
    setHearts(prev => [...prev, newHeart]);

    // Clean up hearts particles after 1.5 seconds
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1500);
  };

  return (
    <div className={styles.petContainer}>
      {active && (
        <div 
          ref={petRef}
          className={styles.petBody}
          onClick={handlePetClick}
          title="Click to pet me! 🐾"
        >
          {/* Render Cat Avatar base SVG */}
          <svg viewBox="0 0 40 40" className={styles.catSvg}>
            {/* Sleeping Zzz bubbles */}
            {behavior === 'sleeping' && (
              <g className={styles.zzzGroup}>
                <text x="32" y="8" className={styles.zzzText}>z</text>
                <text x="36" y="2" className={styles.zzzText2}>z</text>
              </g>
            )}

            {/* Cat body shape */}
            <rect x="10" y="20" width="20" height="12" rx="4" fill="var(--accent, #ffffff)" className={styles.mainBody} />
            
            {/* Paws */}
            <ellipse cx="14" cy="32" rx="3" ry="2" fill="var(--accent, #ffffff)" className={behavior === 'walking' ? styles.pawLeft : ''} />
            <ellipse cx="26" cy="32" rx="3" ry="2" fill="var(--accent, #ffffff)" className={behavior === 'walking' ? styles.pawRight : ''} />

            {/* Head */}
            <circle cx="20" cy="15" r="7" fill="var(--accent, #ffffff)" />

            {/* Ears */}
            <polygon points="13,10 17,14 13,15" fill="var(--accent, #ffffff)" />
            <polygon points="27,10 23,14 27,15" fill="var(--accent, #ffffff)" />

            {/* Tail */}
            <path 
              d="M 10,25 C 5,25 2,20 2,15" 
              stroke="var(--accent, #ffffff)" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
              className={behavior === 'sitting' ? styles.tailWag : ''} 
            />

            {/* Facial Expressions based on behavior */}
            {behavior === 'sleeping' ? (
              // Closed eyes
              <g stroke="var(--bg-primary, #000000)" strokeWidth="1.2" strokeLinecap="round">
                <line x1="16" y1="15" x2="18" y2="15" />
                <line x1="22" y1="15" x2="24" y2="15" />
                {/* Nose */}
                <circle cx="20" cy="18" r="0.8" fill="var(--bg-primary, #000000)" />
              </g>
            ) : behavior === 'petting' ? (
              // Happy closed curves eyes
              <g stroke="var(--bg-primary, #000000)" strokeWidth="1.2" fill="none" strokeLinecap="round">
                <path d="M 15.5 16.5 Q 17 15.5 18.5 16.5" />
                <path d="M 21.5 16.5 Q 23 15.5 24.5 16.5" />
                {/* Nose */}
                <circle cx="20" cy="18.5" r="0.8" fill="var(--bg-primary, #000000)" />
              </g>
            ) : (
              // Standard eyes
              <g>
                <circle cx="17" cy="15" r="1.5" fill="var(--bg-primary, #000000)" />
                <circle cx="23" cy="15" r="1.5" fill="var(--bg-primary, #000000)" />
                <polygon points="19.5,17.5 20.5,17.5 20,18.5" fill="var(--bg-primary, #000000)" />
              </g>
            )}

            {/* Whisker lines */}
            <g stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8">
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
        </div>
      )}

      {/* Floating control button at bottom-left */}
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
