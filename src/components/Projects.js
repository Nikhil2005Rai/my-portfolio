'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Check, Code } from 'lucide-react';
import styles from './Projects.module.css';

// Inline Custom SVGs for Brands since modern Lucide React does not contain them
const GithubIcon = ({ size = 18, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects({ projectsData }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {projectsData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            A curated list of my technical engineering projects.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {projectsData.items.map((project, index) => (
            <motion.div
              key={index}
              id={`project-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className={`${styles.card} glass-card`}
            >
              <div className={styles.cardContent}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <h4 className={styles.projectSubtitle}>{project.subtitle}</h4>
                  </div>
                  <div className={styles.links}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkButton}
                      title="GitHub Repository"
                    >
                      <GithubIcon size={18} />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.linkButton}
                        title="Live Demo"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <p className={styles.description}>{project.description}</p>

                {/* Highlights List */}
                <div className={styles.highlightsContainer}>
                  <h5 className={styles.highlightsHeading}>Key Contributions:</h5>
                  <ul className={styles.highlightsList}>
                    {project.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className={styles.highlightItem}>
                        <Check size={14} className={styles.checkIcon} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Badges */}
                <div className={styles.techList}>
                  {project.tech.map((t, tIndex) => (
                    <span key={tIndex} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
