import { useState, useEffect, useRef } from 'react';

const TrostAgent = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  
  useEffect(() => {
    const trostOption = document.querySelector('.trost-option');
    
    const handleMouseEnter = (e) => {
      const rect = trostOption.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.right + window.scrollX + 20
      });
      setVisible(true);
    };
    
    const handleMouseLeave = () => {
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
  
  if (!visible) {
    return null;
  }
  
  return (
    <div 
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        width: '300px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ 
          backgroundColor: '#3182ce', 
          color: 'white', 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginRight: '10px' 
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div style={{ fontWeight: 600, color: '#3182ce' }}>Trost Assistant</div>
      </div>
      <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
        Trost provides secure package tracking with RFID technology and blockchain verification.
      </p>
      <p style={{ margin: 0, fontSize: '14px' }}>
        After receiving your product, you can list it for resale within our marketplace or track its sustainability impact.
      </p>
    </div>
  );
};

export default TrostAgent;