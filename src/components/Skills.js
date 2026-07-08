'use client';

import { motion } from 'framer-motion';
import styles from './Skills.module.css';

export default function Skills({ skillsData }) {
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
