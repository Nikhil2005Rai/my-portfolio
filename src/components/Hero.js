'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Terminal } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { SiCodechef } from 'react-icons/si';
import styles from './Hero.module.css';

// Custom Leetcode brand icon SVG using the user's exact provided markup
const LeetcodeIcon = ({ size = 20, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    {...props}
  >
    <path d="M13.483 0a1.374 1.374 0 0 0 -0.961 0.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0 -1.209 2.104 5.35 5.35 0 0 0 -0.125 0.513 5.527 5.527 0 0 0 0.062 2.362 5.83 5.83 0 0 0 0.349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193 0.039.038c2.248 2.165 5.852 2.133 8.063 -0.074l2.396-2.392c0.54 -0.54 0.54 -1.414 0.003 -1.955a1.378 1.378 0 0 0 -1.951 -0.003l-2.396 2.392a3.021 3.021 0 0 1 -4.205 0.038l-0.02 -0.019 -4.276 -4.193c-0.652 -0.64 -0.972 -1.469 -0.948 -2.263a2.68 2.68 0 0 1 0.066 -0.523 2.545 2.545 0 0 1 0.619 -1.164L9.13 8.114c1.058 -1.134 3.204 -1.27 4.43 -0.278l3.501 2.831c0.593 0.48 1.461 0.387 1.94 -0.207a1.384 1.384 0 0 0 -0.207 -1.943l-3.5 -2.831c-0.8 -0.647 -1.766 -1.045 -2.774 -1.202l2.015 -2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0 -1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38 -1.382 1.38 1.38 0 0 0 -1.38 -1.382z" />
  </svg>
);

export default function Hero({ personalData, setActiveTab }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className={styles.section}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.content}>
          {/* Badge */}
          <motion.div variants={itemVariants} className={styles.badge}>
            <span className={styles.badgePulse} />
            <span className={styles.badgeText}>Available for Opportunities</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className={styles.title}>
            Hi, I&apos;m {personalData.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2 variants={itemVariants} className={styles.subtitle}>
            {personalData.title}
          </motion.h2>

          {/* Description */}
          <motion.p variants={itemVariants} className={styles.description}>
            {personalData.subtitle}
          </motion.p>

          {/* Actions */}
          <motion.div variants={itemVariants} className={styles.actions}>
            <button onClick={() => setActiveTab('projects')} className="btn-primary">
              View Work <ArrowRight size={18} />
            </button>
            <button onClick={() => setActiveTab('contact')} className="btn-secondary">
              Contact Me
            </button>
            <a
              href="/resume.pdf"
              download="Nikhil_Rai_Resume.pdf"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              Resume ↓
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div variants={itemVariants} className={styles.socials}>
            <a
              href={personalData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href={personalData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            {personalData.socials.codolio && (
              <a
                href={personalData.socials.codolio}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="Codolio"
              >
                <Terminal size={20} />
              </a>
            )}
            {personalData.socials.leetcode && (
              <a
                href={personalData.socials.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="LeetCode"
              >
                <LeetcodeIcon size={20} />
              </a>
            )}
            {personalData.socials.codechef && (
              <a
                href={personalData.socials.codechef}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="CodeChef"
              >
                <SiCodechef size={20} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Code Terminal Visual */}
        <motion.div
          variants={itemVariants}
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="code-terminal">
            <div className="terminal-header">
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <div className="terminal-dot" />
              <span style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', marginLeft: '12px' }}>
                nikhil_rai.json
              </span>
            </div>
            <pre className={styles.pre}>
              <code>
                {`{\n`}
                <span className={styles.key}>  &quot;name&quot;</span>: <span className={styles.string}>&quot;${personalData.name}&quot;</span>,{"\n"}
                <span className={styles.key}>  &quot;role&quot;</span>: <span className={styles.string}>&quot;Software Engineer&quot;</span>,{"\n"}
                <span className={styles.key}>  &quot;rating&quot;</span>: {"{\n"}
                <span className={styles.key}>    &quot;leetcode&quot;</span>: <span className={styles.number}>2000</span>,{"\n"}
                <span className={styles.key}>    &quot;codechef&quot;</span>: <span className={styles.string}>&quot;3-star&quot;</span>{"\n"}
                {"  },\n"}
                <span className={styles.key}>  &quot;skills&quot;</span>: [
                {"\n"}
                <span className={styles.string}>    &quot;Next.js&quot;</span>,{" "}
                <span className={styles.string}>&quot;TypeScript&quot;</span>,{" "}
                <span className={styles.string}>&quot;PostgreSQL&quot;</span>,{"\n"}
                <span className={styles.string}>    &quot;Docker&quot;</span>,{" "}
                <span className={styles.string}>&quot;Convex&quot;</span>,{" "}
                <span className={styles.string}>&quot;REST APIs&quot;</span>{"\n"}
                {"  ],\n"}
                <span className={styles.key}>  &quot;academic&quot;</span>: {"{\n"}
                <span className={styles.key}>    &quot;cgpa&quot;</span>: <span className={styles.number}>9.02</span>,{"\n"}
                <span className={styles.key}>    &quot;major&quot;</span>: <span className={styles.string}>&quot;Computer Science&quot;</span>{"\n"}
                {"  }\n"}
                {`}`}
              </code>
            </pre>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
