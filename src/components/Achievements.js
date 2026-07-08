'use client';

import { motion } from 'framer-motion';
import { Award, Star, ExternalLink } from 'lucide-react';
import styles from './Achievements.module.css';

export default function Achievements({ achievementsData }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="achievements" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {achievementsData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            Competitive programming ratings, hackathon accomplishments, and engineering highlights.
          </motion.p>
        </div>

        {/* Highlight Ratings Row */}
        <motion.div
          className={styles.ratingsRow}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {achievementsData.ratings.map((rate, rIndex) => {
            const CardContent = (
              <div className={`${styles.ratingCard} glass-card`}>
                <div className={styles.ratingHeader}>
                  <span className={styles.platformName}>{rate.platform}</span>
                  <ExternalLink size={16} className={styles.ratingLinkIcon} />
                </div>
                <div className={styles.ratingValue}>{rate.value}</div>
                <p className={styles.ratingDetail}>{rate.detail}</p>
              </div>
            );

            return rate.link ? (
              <a
                key={rIndex}
                href={rate.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
              >
                <motion.div variants={cardVariants}>{CardContent}</motion.div>
              </a>
            ) : (
              <motion.div key={rIndex} variants={cardVariants}>
                {CardContent}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Achievements Timeline/List */}
        <motion.div
          className={styles.list}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {achievementsData.items.map((ach, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`${styles.item} glass-card`}
            >
              <div className={styles.itemIconContainer}>
                {ach.title.includes('Global') || ach.title.includes('Rating') ? (
                  <Star size={20} className={styles.itemIcon} />
                ) : (
                  <Award size={20} className={styles.itemIcon} />
                )}
              </div>
              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <h3 className={styles.itemTitle}>{ach.title}</h3>
                  <span className={styles.itemDate}>{ach.date}</span>
                </div>
                <p className={styles.itemDesc}>{ach.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
