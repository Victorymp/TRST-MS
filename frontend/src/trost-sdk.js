// trost-sdk.js
(function(window) {
    'use strict';
    
    // Main Trost SDK
    const TrostSDK = function(config) {
      this.config = {
        apiKey: config.apiKey || null,
        trackingEndpoint: config.trackingEndpoint || 'https://api.trostdelivery.com/track',
        theme: config.theme || 'light',
        debug: config.debug || false
      };
      
      this.init();
    };
    
    // Initialize SDK
    TrostSDK.prototype.init = function() {
      if (this.config.debug) {
        console.log('Trost SDK initialized with config:', this.config);
      }
      
      // Inject required CSS
      this.injectStyles();
      
      // Add event listeners
      document.addEventListener('DOMContentLoaded', () => {
        this.scanForTrackingElements();
      });
    };
    
    // Scan page for elements with data-trost-tracking attribute
    TrostSDK.prototype.scanForTrackingElements = function() {
      const trackElements = document.querySelectorAll('[data-trost-tracking]');
      
      trackElements.forEach(element => {
        this.attachTrackingButton(element);
      });
    };
    
    // Attach tracking button to product elements
    TrostSDK.prototype.attachTrackingButton = function(element) {
      const productId = element.getAttribute('data-trost-product-id');
      const trackingId = element.getAttribute('data-trost-tracking-id');
      
      if (!productId || !trackingId) {
        console.error('Trost SDK: Missing required product or tracking ID');
        return;
      }
      
      // Create button
      const button = document.createElement('button');
      button.className = 'trost-track-button';
      button.innerHTML = 'Track with Trost';
      
      // Create tooltip container
      const tooltipContainer = document.createElement('div');
      tooltipContainer.className = 'trost-tooltip-container';
      tooltipContainer.style.display = 'none';
      
      // Create tooltip content
      tooltipContainer.innerHTML = `
        <div class="trost-tooltip">
          <h4>Track with Trost</h4>
          <p>Securely track your delivery and discover resale options after use</p>
        </div>
      `;
      
      // Add event listeners
      button.addEventListener('click', () => {
        this.handleTracking(productId, trackingId);
      });
      
      button.addEventListener('mouseenter', () => {
        tooltipContainer.style.display = 'block';
      });
      
      button.addEventListener('mouseleave', () => {
        tooltipContainer.style.display = 'none';
      });
      
      // Append elements
      const container = document.createElement('div');
      container.className = 'trost-container';
      container.appendChild(button);
      container.appendChild(tooltipContainer);
      
      element.appendChild(container);
    };
    
    // Handle tracking request
    TrostSDK.prototype.handleTracking = function(productId, trackingId) {
      // Open modal or redirect
      this.openTrackingModal(productId, trackingId);
    };
    
    // Open tracking modal
    TrostSDK.prototype.openTrackingModal = function(productId, trackingId) {
      // Create modal backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'trost-modal-backdrop';
      
      // Create modal container
      const modal = document.createElement('div');
      modal.className = 'trost-modal';
      
      // Add content
      modal.innerHTML = `
        <div class="trost-modal-header">
          <h3>Track with Trost</h3>
          <button class="trost-modal-close">&times;</button>
        </div>
        <div class="trost-modal-body">
          <p>Tracking your product: ${productId}</p>
          <p>Tracking ID: ${trackingId}</p>
          <div class="trost-loading-indicator">Loading tracking data...</div>
        </div>
        <div class="trost-modal-footer">
          <button class="trost-modal-action">Open in Trost App</button>
        </div>
      `;
      
      // Add modal to page
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);
      
      // Add event listener to close button
      modal.querySelector('.trost-modal-close').addEventListener('click', () => {
        document.body.removeChild(backdrop);
      });
      
      // Fetch tracking data
      this.fetchTrackingData(productId, trackingId)
        .then(data => {
          modal.querySelector('.trost-loading-indicator').style.display = 'none';
          
          // Display tracking information
          const trackingInfo = document.createElement('div');
          trackingInfo.className = 'trost-tracking-info';
          
          if (data && data.status) {
            trackingInfo.innerHTML = `
              <div class="trost-tracking-status">
                <p><strong>Status:</strong> ${data.status}</p>
                <p><strong>Last Updated:</strong> ${data.lastUpdated}</p>
                <p><strong>Expected Delivery:</strong> ${data.expectedDelivery}</p>
              </div>
              <div class="trost-tracking-timeline">
                ${this.generateTimeline(data.timeline)}
              </div>
            `;
          } else {
            trackingInfo.innerHTML = `
              <div class="trost-error">
                <p>Unable to fetch tracking information at this time.</p>
              </div>
            `;
          }
          
          modal.querySelector('.trost-modal-body').appendChild(trackingInfo);
        })
        .catch(error => {
          modal.querySelector('.trost-loading-indicator').style.display = 'none';
          
          const errorMsg = document.createElement('div');
          errorMsg.className = 'trost-error';
          errorMsg.innerHTML = `<p>Error fetching tracking data: ${error.message}</p>`;
          
          modal.querySelector('.trost-modal-body').appendChild(errorMsg);
        });
      
      // Add event listener to app button
      modal.querySelector('.trost-modal-action').addEventListener('click', () => {
        window.open(`https://app.trostdelivery.com/track/${trackingId}`, '_blank');
      });
    };
    
    // Generate timeline HTML
    TrostSDK.prototype.generateTimeline = function(timeline) {
      if (!timeline || !timeline.length) {
        return '<p>No tracking updates available</p>';
      }
      
      return `
        <ul class="trost-timeline">
          ${timeline.map(event => `
            <li class="trost-timeline-event">
              <div class="trost-timeline-dot"></div>
              <div class="trost-timeline-content">
                <p class="trost-timeline-date">${event.date}</p>
                <p class="trost-timeline-description">${event.description}</p>
                <p class="trost-timeline-location">${event.location || ''}</p>
              </div>
            </li>
          `).join('')}
        </ul>
      `;
    };
    
    // Fetch tracking data from API
    TrostSDK.prototype.fetchTrackingData = function(productId, trackingId) {
      return new Promise((resolve, reject) => {
        fetch(`${this.config.trackingEndpoint}?id=${trackingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch tracking data');
          }
          return response.json();
        })
        .then(data => resolve(data))
        .catch(error => {
          if (this.config.debug) {
            console.error('Trost SDK Error:', error);
          }
          // For demo purposes, return mock data
          if (this.config.debug) {
            resolve(this.getMockTrackingData(trackingId));
          } else {
            reject(error);
          }
        });
      });
    };
    
    // Get mock tracking data for demo
    TrostSDK.prototype.getMockTrackingData = function(trackingId) {
      return {
        trackingId: trackingId,
        status: 'In Transit',
        lastUpdated: new Date().toISOString(),
        expectedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString(),
        timeline: [
          {
            date: new Date(Date.now() - 86400000).toLocaleString(),
            description: 'Package picked up',
            location: 'Warehouse A'
          },
          {
            date: new Date(Date.now() - 43200000).toLocaleString(),
            description: 'Package in transit',
            location: 'Distribution Center'
          },
          {
            date: new Date().toLocaleString(),
            description: 'Out for delivery',
            location: 'Local Delivery Center'
          }
        ]
      };
    };
    
    // Inject required CSS
    TrostSDK.prototype.injectStyles = function() {
      const styles = `
        .trost-container {
          position: relative;
          display: inline-block;
          margin: 10px 0;
        }
        
        .trost-track-button {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .trost-track-button:hover {
          background-color: #1d4ed8;
        }
        
        .trost-tooltip-container {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          z-index: 1000;
        }
        
        .trost-tooltip {
          background-color: white;
          color: #333;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          padding: 10px 15px;
          min-width: 200px;
          max-width: 300px;
          font-size: 13px;
        }
        
        .trost-tooltip h4 {
          margin-top: 0;
          margin-bottom: 5px;
          font-size: 15px;
          color: #2563eb;
        }
        
        .trost-tooltip p {
          margin: 5px 0;
        }
        
        .trost-tooltip:after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 6px;
          border-style: solid;
          border-color: white transparent transparent transparent;
        }
        
        .trost-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }
        
        .trost-modal {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90%;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        
        .trost-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .trost-modal-header h3 {
          margin: 0;
          color: #2563eb;
        }
        
        .trost-modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .trost-modal-body {
          padding: 20px;
        }
        
        .trost-modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          text-align: right;
        }
        
        .trost-modal-action {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .trost-loading-indicator {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .trost-tracking-info {
          margin-top: 15px;
        }
        
        .trost-tracking-status {
          margin-bottom: 20px;
        }
        
        .trost-timeline {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
        }
        
        .trost-timeline:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 6px;
          width: 2px;
          background-color: #eee;
        }
        
        .trost-timeline-event {
          position: relative;
          padding-left: 30px;
          margin-bottom: 15px;
        }
        
        .trost-timeline-dot {
          position: absolute;
          left: 0;
          top: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #2563eb;
        }
        
        .trost-timeline-date {
          color: #666;
          font-size: 12px;
          margin: 0 0 5px 0;
        }
        
        .trost-timeline-description {
          margin: 0 0 5px 0;
          font-weight: 500;
        }
        
        .trost-timeline-location {
          color: #666;
          margin: 0;
          font-size: 13px;
        }
        
        /* Theme: Dark */
        .trost-theme-dark .trost-track-button {
          background-color: #1e293b;
        }
        
        .trost-theme-dark .trost-track-button:hover {
          background-color: #334155;
        }
        
        .trost-theme-dark .trost-tooltip {
          background-color: #1e293b;
          color: #e2e8f0;
        }
        
        .trost-theme-dark .trost-tooltip h4 {
          color: #60a5fa;
        }
        
        .trost-theme-dark .trost-tooltip:after {
          border-color: #1e293b transparent transparent transparent;
        }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(styles));
      
      document.head.appendChild(styleElement);
    };
    
    // Expose the SDK to window
    window.TrostSDK = TrostSDK;
    
  })(window);