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
  const [stats, setStats] = useState({
    leetcodeRating: '2000+',
    leetcodeSolved: '1000+',
    leetcodeEasy: 300,
    leetcodeMedium: 500,
    leetcodeHard: 200,
    cgpa: '9.02',
    githubStars: '5',
    githubFollowers: '10',
    githubTotalContributions: 0,
    githubContributions: []
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats({
            leetcodeRating: `${data.leetcode.rating}+`,
            leetcodeSolved: `${data.leetcode.solved}+`,
            leetcodeEasy: data.leetcode.easy,
            leetcodeMedium: data.leetcode.medium,
            leetcodeHard: data.leetcode.hard,
            cgpa: '9.02',
            githubStars: `${data.github.stars}`,
            githubFollowers: `${data.github.followers}`,
            githubTotalContributions: data.github.totalContributions,
            githubContributions: data.github.contributions
          });
        }
      })
      .catch(err => {
        console.error('Failed to load live metrics, using cache fallbacks:', err);
      });
  }, []);

  const statsList = [
    { label: 'LeetCode Rating', value: stats.leetcodeRating },
    { label: 'Problems Solved', value: stats.leetcodeSolved },
    { label: 'B.Tech CGPA', value: stats.cgpa },
    { label: 'GitHub Stars', value: stats.githubStars },
    { label: 'GitHub Followers', value: stats.githubFollowers }
  ];

  // Calculate percentages for difficulty distribution bar
  const totalSolved = (stats.leetcodeEasy || 0) + (stats.leetcodeMedium || 0) + (stats.leetcodeHard || 0) || 1;
  const easyPct = ((stats.leetcodeEasy || 0) / totalSolved) * 100;
  const mediumPct = ((stats.leetcodeMedium || 0) / totalSolved) * 100;
  const hardPct = ((stats.leetcodeHard || 0) / totalSolved) * 100;

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
            A look into my background, academic credentials, and live engineering performance stats.
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
          {statsList.map((stat, index) => (
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

        {/* Analytics Section */}
        <div className={styles.analyticsSection}>
          {/* LeetCode Difficulty Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`${styles.analyticsCard} glass-card`}
          >
            <h3 className={styles.analyticsTitle}>LeetCode Solve Breakdown</h3>
            <div className={styles.difficultyBarContainer}>
              <div className={styles.difficultyBar}>
                <div 
                  className={styles.barEasy} 
                  style={{ width: `${easyPct}%` }} 
                  title={`Easy: ${stats.leetcodeEasy} solved`} 
                />
                <div 
                  className={styles.barMedium} 
                  style={{ width: `${mediumPct}%` }} 
                  title={`Medium: ${stats.leetcodeMedium} solved`} 
                />
                <div 
                  className={styles.barHard} 
                  style={{ width: `${hardPct}%` }} 
                  title={`Hard: ${stats.leetcodeHard} solved`} 
                />
              </div>
              <div className={styles.difficultyLabels}>
                <div className={styles.diffLabelItem}>
                  <span className={`${styles.dot} ${styles.dotEasy}`} />
                  <span className={styles.diffName}>Easy</span>
                  <span className={styles.diffValue}>{stats.leetcodeEasy}</span>
                </div>
                <div className={styles.diffLabelItem}>
                  <span className={`${styles.dot} ${styles.dotMedium}`} />
                  <span className={styles.diffName}>Medium</span>
                  <span className={styles.diffValue}>{stats.leetcodeMedium}</span>
                </div>
                <div className={styles.diffLabelItem}>
                  <span className={`${styles.dot} ${styles.dotHard}`} />
                  <span className={styles.diffName}>Hard</span>
                  <span className={styles.diffValue}>{stats.leetcodeHard}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
