import Head from 'next/head'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'

const TrostAgent = dynamic(() => import('../components/TrostAgent'), { ssr: false })


export default function Home() {
  useEffect(() => {
    // Initialize Trost SDK when component mounts
    const script = document.createElement('script');
    script.src = '/trost-sdk.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.TrostSDK) {
        const trostSDK = new window.TrostSDK({
          apiKey: 'demo-api-key-12345',
          trackingEndpoint: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/track',
          theme: 'light',
          debug: true
        });
      }
    };
    
    // Clean up script when component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="ecommerce-container">
      <Head>
        <title>Medical Supplies Package | ShopDemo</title>
        <meta name="description" content="Premium quality medical supplies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="site-header">
        <div className="header-content">
          <div className="logo">ShopDemo</div>
          <nav className="main-nav">
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
          <div className="header-controls">
            <button className="search-button">Search</button>
            <button className="account-button">Account</button>
            <button className="cart-button">Cart (0)</button>
          </div>
        </div>
      </header>
      
      <main>
        <div className="product-container">
          <div className="product-gallery">
            <div className="main-image">
              <img src="https://via.placeholder.com/600x800" alt="Medical Supplies Package" />
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail"><img src="https://via.placeholder.com/100x100" alt="Thumbnail 1" /></div>
              <div className="thumbnail"><img src="https://via.placeholder.com/100x100" alt="Thumbnail 2" /></div>
              <div className="thumbnail"><img src="https://via.placeholder.com/100x100" alt="Thumbnail 3" /></div>
            </div>
          </div>
          
          <div className="product-details">
            <h1 className="product-title">Medical Supplies Package</h1>
            <div className="product-price">$129.99</div>
            
            <div className="product-description">
              <p>Premium quality medical supplies including first aid equipment, masks, gloves, and essential medications. Perfect for hospitals, clinics, and medical professionals.</p>
            </div>
            
            <div className="product-meta">
              <p><strong>SKU:</strong> MED-SUP-2023-001</p>
              <p><strong>Category:</strong> Medical Supplies</p>
              <p><strong>Weight:</strong> 2.5 kg</p>
              <p><strong>Stock:</strong> In Stock</p>
            </div>
            
            <div className="product-actions">
              <button className="add-to-cart-button">Add to Cart</button>
              <button className="wishlist-button">♡</button>
            </div>
            
            <div className="delivery-options">
              <h3>Delivery Options</h3>
              
              <div className="option">
                <input type="radio" name="delivery" id="standard" defaultChecked />
                <label htmlFor="standard">
                  <div className="option-info">
                    <div className="option-name">Standard Delivery</div>
                    <div className="option-description">3-5 business days</div>
                  </div>
                  <div className="option-price">Free</div>
                </label>
              </div>
              
              <div className="option">
                <input type="radio" name="delivery" id="express" />
                <label htmlFor="express">
                  <div className="option-info">
                    <div className="option-name">Express Delivery</div>
                    <div className="option-description">1-2 business days</div>
                  </div>
                  <div className="option-price">$9.99</div>
                </label>
              </div>
              
              <div className="option">
                <input type="radio" name="delivery" id="same-day" />
                <label htmlFor="same-day">
                  <div className="option-info">
                    <div className="option-name">Same Day Delivery</div>
                    <div className="option-description">Available for orders before 2pm</div>
                  </div>
                  <div className="option-price">$19.99</div>
                </label>
              </div>
              
              <div className="trost-option">
                <div className="trost-logo">TROST</div>
                <div className="trost-info">
                  <div className="trost-title">Track with Trost</div>
                  <div className="trost-description">Secure tracking, delivery notifications, and reselling options after use</div>
                </div>
                <div data-trost-tracking data-trost-product-id="MED-SUP-2023-001" data-trost-tracking-id="UT1234567890"></div>
              </div>
            </div>
            
            <div className="product-additional-info">
              <div className="info-section">
                <h3>Product Details</h3>
                <div className="section-content">
                  <p>This comprehensive medical supplies package contains essential items for medical professionals, including PPE, diagnostic tools, and first aid supplies.</p>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Shipping Information</h3>
                <div className="section-content">
                  <p>Free delivery on orders over $100. Standard delivery $4.50.</p>
                  <p>Free returns on qualifying orders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>ShopDemo is a premium provider of medical supplies for healthcare professionals.</p>
          </div>
          
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Refunds</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 ShopDemo. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Add the TrostAgent component here */}
      <TrostAgent />
    </div>
  );
}