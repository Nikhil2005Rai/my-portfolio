'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import styles from './About.module.css';
import { useEffect, useState, useRef } from 'react';

// A simple local Hook for counting up to a target number
function Ticker({ value }) {
  const numberPart = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9.]/g, '');
  const isFloat = value.includes('.');
  const floatValue = isFloat ? parseFloat(value) : numberPart;
  
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const end = floatValue;
    const duration = 1500; // ms
    const increment = end / (duration / 16); // 60 fps approx

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasAnimated, floatValue]);

  return (
    <span ref={elementRef}>
      {isFloat ? count.toFixed(2) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function About({ aboutData, personalData }) {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {aboutData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            A look into my background, academic credentials, and core performance stats.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {/* Text/Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.bioCard} glass-card`}
          >
            <h3 className={styles.cardTitle}>My Story</h3>
            <p className={styles.bioText}>{personalData.bio}</p>
            <div className={styles.infoDetails}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Location:</span>
                <span className={styles.infoValue}>{personalData.location}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>
                  <a href={`mailto:${personalData.email}`} className={styles.emailLink}>
                    {personalData.email}
                  </a>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.eduCard} glass-card`}
          >
            <div className={styles.eduHeader}>
              <GraduationCap size={32} className={styles.eduIcon} />
              <div>
                <h3 className={styles.cardTitle}>Education</h3>
                <span className={styles.eduDate}>
                  <Calendar size={14} style={{ marginRight: '4px' }} />
                  {aboutData.education.period}
                </span>
              </div>
            </div>
            <h4 className={styles.instName}>{aboutData.education.institution}</h4>
            <p className={styles.degreeName}>{aboutData.education.degree}</p>
            <div className={styles.cgpaBadge}>
              <Award size={16} />
              <span>CGPA: {aboutData.education.cgpa}</span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {aboutData.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${styles.statCard} glass-card`}
            >
              <h4 className={styles.statLabel}>{stat.label}</h4>
              <div className={styles.statValue}>
                <Ticker value={stat.value} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
