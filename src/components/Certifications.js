'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import styles from './Certifications.module.css';

export default function Certifications({ certificationsData }) {
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
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="certifications" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {certificationsData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            Professional engineering certificates and specialized domain validations.
          </motion.p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {certificationsData.items.map((cert, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`${styles.card} glass-card`}
            >
              <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                  <ShieldCheck size={22} className={styles.icon} />
                </div>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.linkButton}
                    title="Verify Certificate"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
              <h3 className={styles.certTitle}>{cert.name}</h3>
              <div className={styles.issuerRow}>
                <span className={styles.issuerName}>{cert.issuer}</span>
                <span className={styles.date}>
                  <Calendar size={12} style={{ marginRight: '4px' }} />
                  {cert.date}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
