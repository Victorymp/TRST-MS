(function(window) {
    'use strict';
    
    // Main Trost SDK
    const TrostSDK = function(config) {
      this.config = {
        apiKey: config.apiKey || null,
        trackingEndpoint: config.trackingEndpoint || 'http://localhost:5000/api/track',
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
      backdrop.style.position = 'fixed';
      backdrop.style.top = '0';
      backdrop.style.left = '0';
      backdrop.style.width = '100%';
      backdrop.style.height = '100%';
      backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      backdrop.style.display = 'flex';
      backdrop.style.justifyContent = 'center';
      backdrop.style.alignItems = 'center';
      backdrop.style.zIndex = '10000';
      
      // Create modal container
      const modal = document.createElement('div');
      modal.className = 'trost-modal';
      modal.style.backgroundColor = 'white';
      modal.style.borderRadius = '8px';
      modal.style.width = '90%';
      modal.style.maxWidth = '500px';
      modal.style.maxHeight = '90%';
      modal.style.overflowY = 'auto';
      modal.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      
      // Add content
      modal.innerHTML = `
        <div class="trost-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #eee;">
          <h3 style="margin: 0; color: #2563eb;">Track with Trost</h3>
          <button class="trost-modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
        </div>
        <div class="trost-modal-body" style="padding: 20px;">
          <p>Tracking your product: ${productId}</p>
          <p>Tracking ID: ${trackingId}</p>
          <div class="trost-loading-indicator" style="text-align: center; padding: 20px; color: #666;">Loading tracking data...</div>
        </div>
        <div class="trost-modal-footer" style="padding: 15px 20px; border-top: 1px solid #eee; text-align: right;">
          <button class="trost-modal-action" style="background-color: #2563eb; color: white; border: none; border-radius: 4px; padding: 8px 16px; font-size: 14px; cursor: pointer;">Open in Trost App</button>
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
          trackingInfo.style.marginTop = '15px';
          
          if (data && data.status) {
            trackingInfo.innerHTML = `
              <div class="trost-tracking-status" style="margin-bottom: 20px;">
                <p style="margin: 5px 0;"><strong>Status:</strong> ${data.status}</p>
                <p style="margin: 5px 0;"><strong>Last Updated:</strong> ${data.lastUpdated || new Date().toLocaleDateString()}</p>
                <p style="margin: 5px 0;"><strong>Description:</strong> ${data.description || 'Product delivery'}</p>
                <p style="margin: 5px 0;"><strong>Weight:</strong> ${data.weight || 0} ${data.metric || 'kg'}</p>
              </div>
              <div class="trost-tracking-timeline">
                ${this.generateTimeline(data.timeline || this.getMockTimeline())}
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
      
      let timelineHTML = `
        <ul class="trost-timeline" style="list-style: none; padding: 0; margin: 0; position: relative;">
      `;
      
      // Add a vertical line connecting events
      timelineHTML += `
        <style>
          .trost-timeline:before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 6px;
            width: 2px;
            background-color: #eee;
          }
        </style>
      `;
      
      // Add each event
      timelineHTML += timeline.map(event => `
        <li class="trost-timeline-event" style="position: relative; padding-left: 30px; margin-bottom: 15px;">
          <div class="trost-timeline-dot" style="position: absolute; left: 0; top: 4px; width: 14px; height: 14px; border-radius: 50%; background-color: #2563eb;"></div>
          <div class="trost-timeline-content">
            <p class="trost-timeline-date" style="color: #666; font-size: 12px; margin: 0 0 5px 0;">${event.date}</p>
            <p class="trost-timeline-description" style="margin: 0 0 5px 0; font-weight: 500;">${event.description}</p>
            <p class="trost-timeline-location" style="color: #666; margin: 0; font-size: 13px;">${event.location || ''}</p>
          </div>
        </li>
      `).join('');
      
      timelineHTML += `</ul>`;
      
      return timelineHTML;
    };
    
    // Get mock timeline for demo
    TrostSDK.prototype.getMockTimeline = function() {
      return [
        {
          date: new Date(Date.now() - 86400000 * 2).toLocaleString(),
          description: 'Order placed',
          location: 'Online Store'
        },
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
      ];
    };
    
    // Fetch tracking data from API
    TrostSDK.prototype.fetchTrackingData = function(productId, trackingId) {
      return new Promise((resolve, reject) => {
        fetch(`${this.config.trackingEndpoint}/${trackingId}`, {
          method: 'GET',
          headers: {
            'Authorization': this.config.apiKey ? `Bearer ${this.config.apiKey}` : '',
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
        description: 'Medical supplies delivery',
        weight: 2.5,
        metric: 'kg',
        timeline: this.getMockTimeline()
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
      `;
      
      const styleElement = document.createElement('style');
      styleElement.type = 'text/css';
      styleElement.appendChild(document.createTextNode(styles));
      
      document.head.appendChild(styleElement);
    };
    
    // Expose the SDK to window
    window.TrostSDK = TrostSDK;
    
  })(window);