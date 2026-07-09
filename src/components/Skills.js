'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Skills.module.css';

export default function Skills({ skillsData }) {
  const [activeCategory, setActiveCategory] = useState(null);

  // Radar categories mapping and default static skill level scores (0 to 1)
  const radarCategories = [
    { name: 'Languages', value: 0.95, desc: 'C++, TypeScript, JavaScript, Python' },
    { name: 'Frontend', value: 0.82, desc: 'React, Next.js, State Management' },
    { name: 'Backend', value: 0.95, desc: 'Node.js, Postgres, Convex, Prisma' },
    { name: 'DevOps & Cloud', value: 0.85, desc: 'Docker, AWS, Cloudflare Workers' },
    { name: 'Core CS', value: 0.92, desc: 'Data Structures, Algorithms, System Design' },
  ];

  // SVG trigonometry setup for regular pentagon (5 vertices)
  const width = 340;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 100;
  const numVertices = 5;

  const getVertexCoordinates = (index, scale = 1) => {
    // Offset by -90 deg to set the first vertex pointing straight up
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numVertices;
    return {
      x: cx + radius * scale * Math.cos(angle),
      y: cy + radius * scale * Math.sin(angle),
    };
  };

  // Generate coordinate strings for concentric pentagon mesh guides
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const levelPolygonPoints = levels.map((lvl) => {
    const points = [];
    for (let i = 0; i < numVertices; i++) {
      const coord = getVertexCoordinates(i, lvl);
      points.push(`${coord.x},${coord.y}`);
    }
    return points.join(' ');
  });

  // Calculate actual proficiency polygon vertices
  const dataPoints = radarCategories.map((cat, index) => {
    const coord = getVertexCoordinates(index, cat.value);
    return `${coord.x},${coord.y}`;
  }).join(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const itemVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  };

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {skillsData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            My technical toolbox categorized by domain.
          </motion.p>
        </div>

        {/* Dynamic Skill Radar Card Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`${styles.radarWrapper} glass-card`}
        >
          <div className={styles.radarLeft}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className={styles.radarSvg}>
              {/* Concentric Guide Rings */}
              {levelPolygonPoints.map((pts, idx) => (
                <polygon
                  key={idx}
                  points={pts}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              ))}

              {/* Spoke Axis Lines */}
              {Array.from({ length: numVertices }).map((_, idx) => {
                const outerCoord = getVertexCoordinates(idx, 1);
                return (
                  <line
                    key={idx}
                    x1={cx}
                    y1={cy}
                    x2={outerCoord.x}
                    y2={outerCoord.y}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Actual Skill Data Polygon Area */}
              <polygon
                points={dataPoints}
                fill="var(--accent-glow, rgba(255, 255, 255, 0.08))"
                stroke="var(--accent, #ffffff)"
                strokeWidth="2.5"
                style={{
                  filter: 'drop-shadow(0 0 8px var(--accent-glow, rgba(255, 255, 255, 0.2)))',
                  transition: 'all 0.3s ease'
                }}
              />

              {/* Data Vertex Nodes */}
              {radarCategories.map((cat, index) => {
                const coord = getVertexCoordinates(index, cat.value);
                const isHovered = activeCategory === index;
                return (
                  <circle
                    key={index}
                    cx={coord.x}
                    cy={coord.y}
                    r={isHovered ? 6 : 4}
                    fill="var(--accent, #ffffff)"
                    stroke="#000000"
                    strokeWidth="1.5"
                    style={{ transition: 'r 0.15s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setActiveCategory(index)}
                    onMouseLeave={() => setActiveCategory(null)}
                  />
                );
              })}

              {/* Category Labels */}
              {radarCategories.map((cat, index) => {
                const coord = getVertexCoordinates(index, 1.22);
                const isHovered = activeCategory === index;
                return (
                  <text
                    key={index}
                    x={coord.x}
                    y={coord.y + 4}
                    textAnchor="middle"
                    fill={isHovered ? 'var(--accent, #ffffff)' : 'var(--fg-secondary, #969494)'}
                    className={styles.radarLabel}
                    onMouseEnter={() => setActiveCategory(index)}
                    onMouseLeave={() => setActiveCategory(null)}
                    style={{
                      fontWeight: isHovered ? 700 : 500,
                      transition: 'fill 0.15s ease',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.name}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Dynamic Radar Info Panel */}
          <div className={styles.radarRight}>
            <AnimatePresence mode="wait">
              {activeCategory !== null ? (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className={styles.radarInfoCard}
                >
                  <span className={styles.infoLabel}>Active Dimension</span>
                  <h3 className={styles.infoTitle}>
                    {radarCategories[activeCategory].name}
                  </h3>
                  <div className={styles.infoBarContainer}>
                    <div 
                      className={styles.infoBarFill} 
                      style={{ width: `${radarCategories[activeCategory].value * 100}%` }}
                    />
                  </div>
                  <span className={styles.infoPercentage}>
                    Proficiency: {Math.round(radarCategories[activeCategory].value * 100)}%
                  </span>
                  <p className={styles.infoDesc}>
                    {radarCategories[activeCategory].desc}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={styles.radarInfoCard}
                >
                  <span className={styles.infoLabel}>Interactive Analytics</span>
                  <h3 className={styles.infoTitle}>Radar Overview</h3>
                  <p className={styles.infoDesc} style={{ marginTop: '16px', color: 'var(--fg-secondary)' }}>
                    Hover over any vertex node or label in the pentagon graph on the left to reveal specialized competence metrics and detailed stack breakdowns.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Detailed Skills Cards Grid */}
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {skillsData.categories.map((category, catIndex) => (
            <motion.div
              key={catIndex}
              variants={cardVariants}
              className={`${styles.categoryCard} glass-card`}
            >
              <h3 className={styles.categoryTitle}>{category.name}</h3>
              <div className={styles.skillsList}>
                {category.items.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    variants={itemVariants}
                    whileHover={{ scale: 1.03 }}
                    className={styles.skillItem}
                  >
                    <span className={styles.skillName}>{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
