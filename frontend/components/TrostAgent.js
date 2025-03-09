import { useState, useEffect, useRef } from 'react';
import styles from './TrostAgent.module.css';

const TrostAgent = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [conversation, setConversation] = useState([
    { type: 'agent', text: 'Hello! I\'m your Trost Assistant. How can I help you with your delivery tracking today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const tooltipRef = useRef(null);
  const inputRef = useRef(null);
  
  useEffect(() => {
    const trostOption = document.querySelector('.trost-option') || document.querySelector('[data-trost-tracking]');
    
    const handleMouseEnter = (e) => {
      if (!trostOption) return;
      
      const rect = trostOption.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 20
      });
      setVisible(true);
    };
    
    const handleMouseLeave = () => {
      // Don't hide if the user is interacting with the agent
      if (document.activeElement === inputRef.current) return;
      setVisible(false);
    };
    
    if (trostOption) {
      trostOption.addEventListener('mouseenter', handleMouseEnter);
      trostOption.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (trostOption) {
        trostOption.removeEventListener('mouseenter', handleMouseEnter);
        trostOption.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  // Close the tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { type: 'user', text: userInput }]);
    
    // Process user input
    setTimeout(() => {
      let response;
      const inputLower = userInput.toLowerCase();
      
      if (inputLower.includes('track') || inputLower.includes('delivery')) {
        response = "I can help you track your delivery! Your medical supplies package is currently in transit and expected to arrive within 3-5 business days. Would you like to receive SMS notifications for updates?";
      } else if (inputLower.includes('rfid') || inputLower.includes('tag')) {
        response = "Trost uses secure RFID technology to track your packages. Each delivery has a unique RFID tag that ensures accurate and secure tracking throughout the journey.";
      } else if (inputLower.includes('resell') || inputLower.includes('after use')) {
        response = "After receiving your product, you can list it for resale on the Trost marketplace. We help connect medical equipment to secondary markets, extending product lifecycle and reducing waste.";
      } else {
        response = "Thanks for your question. Trost provides secure package tracking with RFID technology and blockchain verification. Is there something specific about your delivery you'd like to know?";
      }
      
      setConversation(prev => [...prev, { type: 'agent', text: response }]);
    }, 1000);
    
    setUserInput('');
  };
  
  if (!visible) {
    return null;
  }
  
  return (
    <div 
      ref={tooltipRef}
      className={styles.trostAgentContainer}
    >
      <div className={styles.agentHeader}>
        <div className={styles.agentAvatar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div className={styles.agentTitle}>Trost Assistant</div>
        <button className={styles.closeButton} onClick={() => setVisible(false)}>×</button>
      </div>
      
      <div className={styles.conversationContainer}>
        {conversation.map((message, index) => (
          <div key={index} className={`${styles.messageItem} ${styles[message.type]}`}>
            {message.type === 'agent' && (
              <div className={styles.agentAvatarSmall}>T</div>
            )}
            <div className={styles.messageContent}>{message.text}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about tracking, RFID, or reselling..."
          className={styles.inputField}
        />
        <button type="submit" className={styles.sendButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default TrostAgent;