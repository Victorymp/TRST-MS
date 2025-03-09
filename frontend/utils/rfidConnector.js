/**
 * RFID Connector - Utility for connecting to the RFID reader API
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Read current RFID tag data
 * @returns {Promise<Object>} The tag data or error
 */
export const readRFIDTag = async () => {
  try {
    const response = await fetch(`${API_BASE}/rfid/read`);
    
    if (!response.ok) {
      throw new Error(`Failed to read RFID tag: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error reading RFID tag:', error);
    throw error;
  }
};

/**
 * Write data to an RFID tag
 * @param {string} data - The data to write to the tag
 * @returns {Promise<Object>} The result of the write operation
 */
export const writeRFIDTag = async (data) => {
  try {
    const response = await fetch(`${API_BASE}/rfid/write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to write to RFID tag: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error writing to RFID tag:', error);
    throw error;
  }
};

/**
 * Complete a delivery using an RFID tag
 * @param {string} tagId - The RFID tag ID (optional, if not provided will try to read from reader)
 * @returns {Promise<Object>} The result of the delivery completion
 */
export const completeDelivery = async (tagId = null) => {
  try {
    const body = tagId ? { tagId } : {};
    
    const response = await fetch(`${API_BASE}/delivery/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to complete delivery: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error completing delivery:', error);
    throw error;
  }
};

/**
 * Track a delivery using its tracking ID
 * @param {string} trackingId - The delivery tracking ID
 * @returns {Promise<Object>} The tracking information
 */
export const trackDelivery = async (trackingId) => {
  try {
    const response = await fetch(`${API_BASE}/track/${trackingId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to track delivery: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error tracking delivery:', error);
    throw error;
  }
};

export default {
  readRFIDTag,
  writeRFIDTag,
  completeDelivery,
  trackDelivery
};