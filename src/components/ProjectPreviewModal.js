'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, RotateCw, ExternalLink } from 'lucide-react';
import styles from './ProjectPreviewModal.module.css';

export default function ProjectPreviewModal({ isOpen, onClose, projectUrl, projectTitle }) {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      document.body.style.overflow = 'hidden'; // Lock background scroll
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`${styles.window} ${isFullscreen ? styles.fullscreen : ''}`}
        onClick={e => e.stopPropagation()} // Prevent closing
      >
        {/* Browser Chrome Header bar */}
        <div className={styles.header}>
          {/* Mock Mac-style control window dots */}
          <div className={styles.dots}>
            <button className={`${styles.dot} ${styles.close}`} onClick={onClose} title="Close window" />
            <button className={`${styles.dot} ${styles.minimize}`} onClick={onClose} title="Minimize" />
            <button className={`${styles.dot} ${styles.maximize}`} onClick={handleFullscreenToggle} title="Toggle Fullscreen" />
          </div>

          {/* Browser Address bar */}
          <div className={styles.addressBar}>
            <span className={styles.lockIcon}>🔒</span>
            <input 
              type="text" 
              readOnly 
              value={projectUrl} 
              className={styles.urlInput} 
            />
            <button className={styles.actionBtn} onClick={handleRefresh} title="Reload page">
              <RotateCw size={14} className={loading ? styles.spin : ''} />
            </button>
          </div>

          {/* Window Actions */}
          <div className={styles.actions}>
            <button className={styles.actionIconBtn} onClick={handleFullscreenToggle} title="Fullscreen">
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.actionIconBtn} title="Open in new tab">
              <ExternalLink size={16} />
            </a>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sandbox Notice Banner */}
        <div className={styles.sandboxNotice}>
          💡 Browser security locks authentication (Google OAuth, Clerk, Auth0) inside iframes. If login fails, please{' '}
          <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.noticeLink}>
            Open in a New Tab ↗
          </a>
        </div>

        {/* Viewport/Iframe Area */}
        <div className={styles.viewport}>
          {loading && (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner} />
              <div className={styles.loaderText}>Connecting to {projectTitle}...</div>
            </div>
          )}
          <iframe 
            key={iframeKey}
            src={projectUrl} 
            title={projectTitle}
            className={styles.iframe}
            onLoad={() => setLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation allow-storage-access-by-user-activation"
          />
        </div>
      </motion.div>
    </div>
  );
}
