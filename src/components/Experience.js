'use client';

import { motion } from 'framer-motion';
import { BriefcaseBusiness, Calendar, CheckCircle2 } from 'lucide-react';
import styles from './Experience.module.css';

export default function Experience({ experienceData }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {experienceData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            Professional roles where I apply AI engineering and production software development.
          </motion.p>
        </div>

        <motion.div
          className={styles.timeline}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {experienceData.items.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.role}`}
              variants={itemVariants}
              className={`${styles.card} glass-card`}
            >
              <div className={styles.marker}>
                <BriefcaseBusiness size={22} className={styles.markerIcon} />
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <div>
                    <span className={styles.company}>{item.company}</span>
                    <h3 className={styles.role}>{item.role}</h3>
                  </div>
                  <span className={styles.period}>
                    <Calendar size={14} />
                    {item.period}
                  </span>
                </div>

                <p className={styles.description}>{item.description}</p>

                {item.highlights?.length > 0 && (
                  <ul className={styles.highlights}>
                    {item.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className={styles.highlight}>
                        <CheckCircle2 size={15} className={styles.checkIcon} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <span className={styles.index}>0{index + 1}</span>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
