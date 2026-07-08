'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Terminal, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiCodechef } from 'react-icons/si';
import styles from './Navbar.module.css';

// Custom Leetcode brand icon SVG using the user's provided SVG path
const LeetcodeIcon = ({ size = 18, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396-2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" />
  </svg>
);

export default function Navbar({ personalData, sections, activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = sections
    .filter((s) => s.enabled)
    .map((s) => ({
      id: s.id,
      label: s.id === 'hero' ? 'Home' : s.id.charAt(0).toUpperCase() + s.id.slice(1),
    }));

  const handleTabClick = (id) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return name.substring(0, 2).toUpperCase();
  };

  const SidebarContent = () => (
    <div className={styles.sidebarInner}>
      {/* Brand Header */}
      <div className={styles.profileArea}>
        <div className={styles.avatarSymbol}>
          {getInitials(personalData.name)}
        </div>
        <h2 className={styles.profileName}>{personalData.name}</h2>
        <span className={styles.profileRole}>{personalData.title.split(' & ')[0]}</span>
      </div>

      {/* Navigation List */}
      <nav className={styles.navMenu}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabClick(item.id)}
            className={`${styles.navLink} ${activeTab === item.id ? styles.active : ''}`}
          >
            <span className={styles.linkText}>{item.label}</span>
          </button>
        ))}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.navLink}
          style={{ opacity: 0.8 }}
        >
          <span className={styles.linkText}>Resume</span>
        </a>
      </nav>

      {/* Sidebar Footer with Social Links */}
      <div className={styles.sidebarFooter}>
        <div className={styles.socials}>
          <a
            href={personalData.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href={personalData.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            title="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          {personalData.socials.codolio && (
            <a
              href={personalData.socials.codolio}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="Codolio"
            >
              <Terminal size={18} />
            </a>
          )}
          {personalData.socials.leetcode && (
            <a
              href={personalData.socials.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="LeetCode"
            >
              <LeetcodeIcon size={18} />
            </a>
          )}
          {personalData.socials.codechef && (
            <a
              href={personalData.socials.codechef}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="CodeChef"
            >
              <SiCodechef size={18} />
            </a>
          )}
        </div>
        <div className={styles.footerInfo}>
          <MapPin size={12} style={{ marginRight: '4px' }} />
          <span>{personalData.location}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className={styles.desktopSidebar}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo} onClick={() => setActiveTab('hero')}>
          <span>{personalData.name}</span>
        </div>
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className={styles.mobileBackdrop}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles.mobileDrawer}
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
