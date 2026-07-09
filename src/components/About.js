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

  // Generate mock contributions if real data hasn't loaded yet
  const getDisplayContributions = () => {
    if (stats.githubContributions && stats.githubContributions.length > 0) {
      // Use the last 364 days to fit exactly 52 weeks
      return stats.githubContributions.slice(-364);
    }
    // Fallback Mock data
    const list = [];
    const now = new Date();
    for (let i = 363; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const rand = Math.random();
      let level = 'NONE';
      if (rand > 0.9) level = 'FOURTH_QUARTILE';
      else if (rand > 0.8) level = 'THIRD_QUARTILE';
      else if (rand > 0.7) level = 'SECOND_QUARTILE';
      else if (rand > 0.5) level = 'FIRST_QUARTILE';

      list.push({
        date: date.toISOString().split('T')[0],
        contributionLevel: level,
        contributionCount: level === 'NONE' ? 0 : Math.floor(Math.random() * 5) + 1
      });
    }
    return list;
  };

  const chunkContributions = (arr) => {
    const weeks = [];
    let currentWeek = [];
    arr.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === arr.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  };

  const contributionsList = getDisplayContributions();
  const weeksGrid = chunkContributions(contributionsList);

  const getLevelClass = (level) => {
    switch (level) {
      case 'FIRST_QUARTILE': return styles.levelFirst;
      case 'SECOND_QUARTILE': return styles.levelSecond;
      case 'THIRD_QUARTILE': return styles.levelThird;
      case 'FOURTH_QUARTILE': return styles.levelFourth;
      default: return styles.levelNone;
    }
  };

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

          {/* GitHub Activity Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${styles.analyticsCard} glass-card`}
          >
            <div className={styles.heatmapHeader}>
              <h3 className={styles.analyticsTitle} style={{ margin: 0 }}>GitHub Activity Calendar</h3>
              <div className={styles.heatmapStats}>
                Total Contributions: <span className={styles.heatmapCount}>{stats.githubTotalContributions || '500+'}</span>
              </div>
            </div>
            <div className={styles.heatmapContainer}>
              <div className={styles.heatmapGrid}>
                {weeksGrid.map((week, wIndex) => (
                  <div key={wIndex} className={styles.heatmapColumn}>
                    {week.map((day, dIndex) => (
                      <div
                        key={dIndex}
                        className={`${styles.heatmapCell} ${getLevelClass(day.contributionLevel)}`}
                        title={`${day.date}: ${day.contributionCount} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <div className={styles.heatmapLegend}>
                <span>Less</span>
                <div className={`${styles.heatmapCell} ${styles.levelNone}`} style={{ margin: 0 }} />
                <div className={`${styles.heatmapCell} ${styles.levelFirst}`} style={{ margin: 0 }} />
                <div className={`${styles.heatmapCell} ${styles.levelSecond}`} style={{ margin: 0 }} />
                <div className={`${styles.heatmapCell} ${styles.levelThird}`} style={{ margin: 0 }} />
                <div className={`${styles.heatmapCell} ${styles.levelFourth}`} style={{ margin: 0 }} />
                <span>More</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
