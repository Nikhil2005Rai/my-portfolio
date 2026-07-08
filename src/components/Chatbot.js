'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    initialMessages: [],
    maxSteps: 5,
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'navigateToTab') {
        const targetTab = toolCall.args.tab;
        window.dispatchEvent(new CustomEvent('portfolio-navigate', { detail: { tab: targetTab } }));
        return `Successfully navigated to the ${targetTab} section.`;
      }
      if (toolCall.toolName === 'downloadResume') {
        window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
        return 'Successfully opened the resume preview in a new tab.';
      }
    }
  });

  const isLoading = status === 'streaming' || status === 'submitting';

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

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  const suggestions = [
    "What is your tech stack?",
    "What is your LeetCode rating?",
    "Tell me about your projects.",
    "How can I contact you?"
  ];

  const handleSuggestionClick = (suggestion) => {
    if (isLoading) return;
    sendMessage({ text: suggestion });
    setInput('');
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
                  <div className={msg.role === 'user' ? styles.userText : styles.botText}>
                    {msg.parts && msg.parts.length > 0 
                      ? msg.parts.map((part, pIdx) => {
                          if (part.type === 'text') return <div key={pIdx}>{parseMarkdown(part.text)}</div>;
                          if (part.type === 'reasoning') {
                            return (
                              <span key={pIdx} style={{ opacity: 0.5, fontStyle: 'italic', display: 'block', marginBottom: '8px' }}>
                                [Thinking: {part.reasoning}]
                              </span>
                            );
                          }
                          return null;
                        })
                      : parseMarkdown(msg.content)}
                  </div>
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
                value={input || ''}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className={styles.chatInput}
              />
              <button 
                type="submit" 
                className={styles.sendBtn}
                disabled={isLoading || !input?.trim()}
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

// Lightweight markdown and URL parser for Chatbot messages
function parseMarkdown(text) {
  if (!text) return '';

  const lines = text.split('\n');
  const renderedElements = [];
  let currentListItems = [];

  const flushList = (key) => {
    if (currentListItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className={styles.bulletList}>
          {currentListItems}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, lineIndex) => {
    const trimmed = line.trim();
    const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');

    if (isBullet) {
      const cleanLine = trimmed.slice(2);
      const parts = parseLineContent(cleanLine);
      currentListItems.push(
        <li key={`li-${lineIndex}`} className={styles.bulletItem}>
          {parts}
        </li>
      );
    } else {
      flushList(lineIndex);
      if (trimmed.length > 0) {
        const parts = parseLineContent(line);
        renderedElements.push(
          <p key={`p-${lineIndex}`} className={styles.paragraph}>
            {parts}
          </p>
        );
      }
    }
  });

  flushList('end');
  return renderedElements;
}

function parseLineContent(text) {
  const parts = [];
  let currentIndex = 0;

  // Regex matches:
  // 1: Bold: **bold text**
  // 3: Markdown Link: [label](url)
  // 6: Bare URL: https://...
  const elementRegex = /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\(([^)]+)\))|((https?:\/\/[^\s,)]+))/g;
  let match;

  while ((match = elementRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Add preceding plain text if any
    if (matchIndex > currentIndex) {
      parts.push(text.slice(currentIndex, matchIndex));
    }

    if (match[1]) {
      // Bold text
      parts.push(<strong key={matchIndex} className={styles.boldText}>{match[2]}</strong>);
    } else if (match[3]) {
      // Markdown link
      parts.push(
        <a
          key={matchIndex}
          href={match[5]}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
          title={match[5]}
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      // Bare URL
      const url = match[6];
      let displayUrl = url.replace(/https?:\/\/(www\.)?/, '');
      if (displayUrl.length > 30) {
        displayUrl = displayUrl.slice(0, 27) + '...';
      }
      parts.push(
        <a
          key={matchIndex}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkButton}
          title={url}
        >
          {displayUrl}
        </a>
      );
    }

    currentIndex = elementRegex.lastIndex;
  }

  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }

  return parts;
}
