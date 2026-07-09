'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LeetCodeChart.module.css';

export default function LeetCodeChart() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Hardcoded rating progression milestones
  const milestones = [
    { contest: 'Contest #1', rating: 1480, date: 'Oct 2024', status: 'Specialist' },
    { contest: 'Contest #12', rating: 1620, date: 'Dec 2024', status: 'Specialist' },
    { contest: 'Contest #24', rating: 1785, date: 'Feb 2025', status: 'Knight Badge' },
    { contest: 'Contest #35', rating: 1910, date: 'Apr 2025', status: 'Knight Badge' },
    { contest: 'Contest #48', rating: 2015, date: 'Jun 2025', status: 'Knight Badge' },
    { contest: 'Contest #60', rating: 2110, date: 'Jul 2025', status: 'Peak Rating' }
  ];

  // SVG dimensions
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 25;

  const minRating = 1300;
  const maxRating = 2200;

  // Calculate pixel coordinates
  const getCoordinates = (rating, index) => {
    const x = paddingX + (index * (width - paddingX * 2)) / (milestones.length - 1);
    const y = height - paddingY - ((rating - minRating) * (height - paddingY * 2)) / (maxRating - minRating);
    return { x, y };
  };

  const points = milestones.map((m, idx) => getCoordinates(m.rating, idx));

  // Build SVG path strings
  const linePath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className={`${styles.chartCard} glass-card`}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h3 className={styles.chartTitle}>LeetCode Rating Progress</h3>
          <span className={styles.badge}>Peak: 2110</span>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendDot} /> Knight Milestone
        </div>
      </div>

      <div className={styles.chartBody}>
        {/* SVG Drawing */}
        <div className={styles.svgWrapper}>
          <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg}>
            <defs>
              <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent, #ffffff)" stopOpacity="0.22" />
                <stop offset="100%" stopColor="var(--accent, #ffffff)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[1400, 1800, 2100].map((ratingLevel) => {
              const y = getCoordinates(ratingLevel, 0).y;
              return (
                <g key={ratingLevel} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1">
                  <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} strokeDasharray="4 4" />
                  <text 
                    x={paddingX - 8} 
                    y={y + 4} 
                    className={styles.gridText} 
                    fill="var(--fg-secondary, rgba(255, 255, 255, 0.4))"
                    textAnchor="end"
                  >
                    {ratingLevel}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaPath} fill="url(#chartAreaGrad)" />

            {/* Path Line */}
            <path 
              d={linePath} 
              fill="none" 
              stroke="var(--accent, #ffffff)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />

            {/* Interactive Circles */}
            {points.map((p, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g key={idx}>
                  {/* Invisible larger hover trigger area */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="15" 
                    fill="transparent" 
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                  {/* Visual dot */}
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={isHovered ? 6 : 4} 
                    fill={isHovered ? "var(--accent, #ffffff)" : "var(--bg-primary, #000000)"} 
                    stroke="var(--accent, #ffffff)" 
                    strokeWidth="2" 
                    style={{ transition: 'all 0.15s ease' }}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Tooltip details panel */}
        <div className={styles.detailsCard}>
          <AnimatePresence mode="wait">
            {hoveredIndex !== null ? (
              <motion.div 
                key={hoveredIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className={styles.detailsContent}
              >
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>{milestones[hoveredIndex].contest}</span>
                  <span className={styles.detailDate}>{milestones[hoveredIndex].date}</span>
                </div>
                <div className={styles.ratingVal}>
                  {milestones[hoveredIndex].rating} <span className={styles.pts}>pts</span>
                </div>
                <div className={styles.detailStatus}>
                  🛡️ {milestones[hoveredIndex].status}
                </div>
              </motion.div>
            ) : (
              <div className={styles.placeholderDetails}>
                Hover over the chart nodes to view contest progression milestones!
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
