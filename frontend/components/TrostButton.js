import React, { useState } from 'react';
import styles from './TrostButton.module.css';

const TrostButton = ({ productId, trackingId }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState(null);

  const handleTrackClick = async () => {
    setIsTracking(true);
    
    try {
      // Call the tracking API
      const response = await fetch(`/api/track/${trackingId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      
      const data = await response.json();
      setTrackingData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsTracking(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={styles.trostContainer}>
      <button 
        className={styles.trostButton}
        onClick={handleTrackClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={styles.trostLogo}>TROST</span>
        Track with Trost
      </button>
      
      {isHovering && (
        <div className={styles.trostTooltip}>
          <h4>Secure Tracking with Trost</h4>
          <p>Track your delivery with RFID technology and blockchain verification</p>
          <p>Discover resale options after use</p>
        </div>
      )}
      
      {isTracking && (
        <div className={styles.loadingIndicator}>
          Loading tracking data...
        </div>
      )}
      
      {trackingData && !isTracking && (
        <div className={styles.trackingModal}>
          <div className={styles.trackingModalHeader}>
            <h3>Your Tracking Information</h3>
            <button onClick={() => setTrackingData(null)}>×</button>
          </div>
          <div className={styles.trackingModalBody}>
            <p><strong>Status:</strong> {trackingData.status}</p>
            <p><strong>Last Updated:</strong> {new Date(trackingData.lastUpdated).toLocaleString()}</p>
            <p><strong>Description:</strong> {trackingData.description}</p>
            <p><strong>Weight:</strong> {trackingData.weight} {trackingData.metric}</p>
          </div>
        </div>
      )}
      
      {error && !isTracking && (
        <div className={styles.errorMessage}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TrostButton;