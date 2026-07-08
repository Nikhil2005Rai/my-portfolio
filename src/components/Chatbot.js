'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [],
  });

  // Scroll to bottom whenever messages list updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const suggestions = [
    "What is your tech stack?",
    "What is your LeetCode rating?",
    "Tell me about your projects.",
    "How can I contact you?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  return (
    <div className={styles.chatbotWrapper}>
      {/* Floating Action Button */}
      <button 
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI Assistant"
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.chatWindow}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerInfo}>
                <span className={styles.terminalIcon}>&gt;_</span>
                <div>
                  <h3 className={styles.headerTitle}>Nikhil&apos;s AI Representative</h3>
                  <span className={styles.headerStatus}>online</span>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className={styles.messagesArea}>
              {/* Initial Greeting */}
              <div className={styles.messageRowBot}>
                <span className={styles.promptLabel}>nikhil_bot:~$</span>
                <p className={styles.botText}>
                  Hi, I&apos;m Nikhil Rai&apos;s AI representative. You can ask me anything about his technical stack, projects, education, or achievements. What would you like to know?
                </p>
              </div>

              {/* Streaming Messages */}
              {messages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={msg.role === 'user' ? styles.messageRowUser : styles.messageRowBot}
                >
                  <span className={msg.role === 'user' ? styles.promptLabelUser : styles.promptLabel}>
                    {msg.role === 'user' ? 'user:~$ ' : 'nikhil_bot:~$ '}
                  </span>
                  <p className={msg.role === 'user' ? styles.userText : styles.botText}>
                    {msg.content}
                  </p>
                </div>
              ))}
              
              {/* Loader */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className={styles.messageRowBot}>
                  <span className={styles.promptLabel}>nikhil_bot:~$</span>
                  <span className={styles.cursor}>█</span>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Pre-canned Suggestions */}
            <div className={styles.suggestionsWrapper}>
              <div className={styles.suggestionsScroll}>
                {suggestions.map((sug, i) => (
                  <button 
                    key={i} 
                    className={styles.suggestionChip}
                    onClick={() => handleSuggestionClick(sug)}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                ref={chatInputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className={styles.chatInput}
              />
              <button 
                type="submit" 
                className={styles.sendBtn}
                disabled={isLoading || !input.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
