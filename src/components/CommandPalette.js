'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, FileText, MessageSquare, Terminal } from 'lucide-react';
import portfolioData from '@/data/portfolio.json';
import styles from './CommandPalette.module.css';

export default function CommandPalette({ setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Define static actions and navigation routes
  const navigationItems = [
    { id: 'hero', label: 'Navigate to Home', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'about', label: 'Navigate to About', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'skills', label: 'Navigate to Skills', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'projects', label: 'Navigate to Projects', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'achievements', label: 'Navigate to Achievements', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'certifications', label: 'Navigate to Certifications', category: 'Navigation', icon: <Terminal size={14} /> },
    { id: 'contact', label: 'Navigate to Contact', category: 'Navigation', icon: <Terminal size={14} /> },
  ];

  const quickActions = [
    { id: 'action-resume', label: 'Preview Resume (PDF)', category: 'Quick Actions', icon: <FileText size={14} /> },
    { id: 'action-chat', label: 'Open AI Representative Chat', category: 'Quick Actions', icon: <MessageSquare size={14} /> },
  ];

  // Convert project database records to searchable items
  const projectItems = (portfolioData.projects?.items || []).map(proj => ({
    id: `project-${proj.title.toLowerCase().replace(/\s+/g, '-')}`,
    label: `Project: ${proj.title}`,
    description: proj.description,
    tags: proj.tech || [],
    category: 'Projects',
    icon: <ArrowRight size={14} />,
    action: () => {
      setActiveTab('projects');
      // Dispatch event to scroll to this specific project if needed
      setTimeout(() => {
        const elem = document.getElementById(`project-${proj.title.toLowerCase().replace(/\s+/g, '-')}`);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          elem.classList.add(styles.highlightFlash);
          setTimeout(() => elem.classList.remove(styles.highlightFlash), 2000);
        }
      }, 300);
    }
  }));

  // Combine items
  const allItems = [...navigationItems, ...quickActions, ...projectItems];

  // Filter items based on search query
  const filteredItems = allItems.filter(item => {
    const query = search.toLowerCase();
    const matchesLabel = item.label.toLowerCase().includes(query);
    const matchesDesc = item.description?.toLowerCase().includes(query) || false;
    const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query)) || false;
    return matchesLabel || matchesDesc || matchesTags;
  });

  // Listen to command palette toggle trigger events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleOpenTrigger = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('command-palette-open', handleOpenTrigger);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('command-palette-open', handleOpenTrigger);
    };
  }, []);

  // Reset index when search input changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle keyboard list navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
      scrollSelectedIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      scrollSelectedIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeAction(filteredItems[selectedIndex]);
    }
  };

  const scrollSelectedIntoView = () => {
    setTimeout(() => {
      const listEl = listRef.current;
      const activeEl = listEl?.querySelector(`.${styles.activeItem}`);
      if (listEl && activeEl) {
        const listHeight = listEl.clientHeight;
        const activeTop = activeEl.offsetTop;
        const activeHeight = activeEl.clientHeight;

        if (activeTop + activeHeight > listEl.scrollTop + listHeight) {
          listEl.scrollTop = activeTop + activeHeight - listHeight;
        } else if (activeTop < listEl.scrollTop) {
          listEl.scrollTop = activeTop;
        }
      }
    }, 10);
  };

  const executeAction = (item) => {
    if (!item) return;

    if (item.action) {
      item.action();
    } else if (item.category === 'Navigation') {
      setActiveTab(item.id);
    } else if (item.id === 'action-resume') {
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
    } else if (item.id === 'action-chat') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('chatbot-toggle', { detail: { open: true } }));
      }, 150);
    }

    setIsOpen(false);
  };

  // Group items by category to render section headers
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Order categories logically
  const categoryOrder = ['Navigation', 'Projects', 'Quick Actions'];

  // Flattened index mapping helper to sync indices of grouped render structures
  let currentFlatIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects, navigation tabs, or quick actions..."
                className={styles.input}
              />
              <div className={styles.cmdKey}>ESC</div>
            </div>

            {/* List Results */}
            <div ref={listRef} className={styles.resultsList}>
              {filteredItems.length === 0 ? (
                <div className={styles.noResults}>
                  <Command className={styles.noResultsIcon} size={24} />
                  <p>No results found for &ldquo;{search}&rdquo;</p>
                </div>
              ) : (
                categoryOrder.map(category => {
                  const items = groupedItems[category];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category} className={styles.categoryGroup}>
                      <div className={styles.categoryTitle}>{category}</div>
                      {items.map(item => {
                        const itemIndex = currentFlatIndex++;
                        const isActive = itemIndex === selectedIndex;

                        return (
                          <div
                            key={item.id}
                            className={`${styles.item} ${isActive ? styles.activeItem : ''}`}
                            onClick={() => executeAction(item)}
                            onMouseEnter={() => setSelectedIndex(itemIndex)}
                          >
                            <span className={styles.itemIcon}>{item.icon}</span>
                            <div className={styles.itemTextContent}>
                              <span className={styles.itemLabel}>{item.label}</span>
                              {item.description && (
                                <span className={styles.itemDesc}>
                                  {item.description.length > 70
                                    ? `${item.description.slice(0, 67)}...`
                                    : item.description}
                                </span>
                              )}
                            </div>
                            {isActive && (
                              <span className={styles.enterHint}>
                                ENTER <ArrowRight size={10} />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Palette Footer Help-bar */}
            <div className={styles.footer}>
              <div className={styles.helpText}>
                <span>
                  <kbd className={styles.kbd}>↑↓</kbd> to navigate
                </span>
                <span>
                  <kbd className={styles.kbd}>↵</kbd> to select
                </span>
                <span>
                  <kbd className={styles.kbd}>esc</kbd> to close
                </span>
              </div>
              <div className={styles.logoLabel}>
                <Command size={10} style={{ marginRight: 4 }} /> Command Palette
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
