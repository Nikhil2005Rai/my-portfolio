'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import styles from './Contact.module.css';

export default function Contact({ contactData, personalData }) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || contactData.web3forms_key,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio Message from ${formState.name}`
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert(result.message || "Failed to send message. Please verify your access key.");
      }
    } catch (err) {
      alert("Something went wrong. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className="section-title-container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            {contactData.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-subtitle"
          >
            Feel free to connect for job opportunities, collaborations, or code inquiries.
          </motion.p>
        </div>

        <div className={styles.grid}>
          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.infoCard} glass-card`}
          >
            <h3 className={styles.cardTitle}>Direct Channels</h3>
            <p className={styles.infoDesc}>
              Drop me an email directly or find me on professional networking channels.
            </p>

            <div className={styles.channelRow}>
              <div className={styles.channelIcon}>
                <Mail size={20} />
              </div>
              <div>
                <h4 className={styles.channelLabel}>Email Address</h4>
                <a href={`mailto:${personalData.email}`} className={styles.channelValue}>
                  {personalData.email}
                </a>
              </div>
            </div>

            <div className={styles.channelRow}>
              <div className={styles.channelIcon}>
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className={styles.channelLabel}>Social Handles</h4>
                <div className={styles.socialLinks}>
                  <a
                    href={personalData.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    LinkedIn
                  </a>
                  <span className={styles.socialDivider}>/</span>
                  <a
                    href={personalData.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.formCard} glass-card`}
          >
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className={styles.input}
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Message</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Write your message..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className={styles.textarea}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : isSuccess ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Sent Successfully! <CheckCircle2 size={16} />
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Send Message <Send size={16} />
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
