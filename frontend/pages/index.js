import Head from 'next/head'
import { useEffect, useState } from 'react'
import TrostButton from '../components/TrostButton'
import ImprovedTrostAgent from '../components/ImprovedTrostAgent'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

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
        setIsSDKLoaded(true);
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
    <div className={styles.container}>
      <Head>
        <title>Medical Supplies Package | ShopDemo</title>
        <meta name="description" content="Premium quality medical supplies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>ShopDemo</div>
          <nav className={styles.mainNav}>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
          <div className={styles.headerControls}>
            <button className={styles.searchButton}>Search</button>
            <button className={styles.accountButton}>Account</button>
            <button className={styles.cartButton}>Cart (0)</button>
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <div className={styles.productContainer}>
          <div className={styles.productGallery}>
            <div className={styles.mainImage}>
              <img src="https://via.placeholder.com/600x800" alt="Medical Supplies Package" />
            </div>
            <div className={styles.thumbnailImages}>
              <div className={styles.thumbnail}><img src="https://via.placeholder.com/100x100" alt="Thumbnail 1" /></div>
              <div className={styles.thumbnail}><img src="https://via.placeholder.com/100x100" alt="Thumbnail 2" /></div>
              <div className={styles.thumbnail}><img src="https://via.placeholder.com/100x100" alt="Thumbnail 3" /></div>
            </div>
          </div>
          
          <div className={styles.productDetails}>
            <h1 className={styles.productTitle}>Medical Supplies Package</h1>
            <div className={styles.productPrice}>$129.99</div>
            
            <div className={styles.productDescription}>
              <p>Premium quality medical supplies including first aid equipment, masks, gloves, and essential medications. Perfect for hospitals, clinics, and medical professionals.</p>
            </div>
            
            <div className={styles.productMeta}>
              <p><strong>SKU:</strong> MED-SUP-2023-001</p>
              <p><strong>Category:</strong> Medical Supplies</p>
              <p><strong>Weight:</strong> 2.5 kg</p>
              <p><strong>Stock:</strong> In Stock</p>
            </div>
            
            <div className={styles.productActions}>
              <button className={styles.addToCartButton}>Add to Cart</button>
              <button className={styles.wishlistButton}>♡</button>
            </div>
            
            <div className={styles.deliveryOptions}>
              <h3>Delivery Options</h3>
              
              <div className={styles.option}>
                <input type="radio" name="delivery" id="standard" defaultChecked />
                <label htmlFor="standard">
                  <div className={styles.optionInfo}>
                    <div className={styles.optionName}>Standard Delivery</div>
                    <div className={styles.optionDescription}>3-5 business days</div>
                  </div>
                  <div className={styles.optionPrice}>Free</div>
                </label>
              </div>
              
              <div className={styles.option}>
                <input type="radio" name="delivery" id="express" />
                <label htmlFor="express">
                  <div className={styles.optionInfo}>
                    <div className={styles.optionName}>Express Delivery</div>
                    <div className={styles.optionDescription}>1-2 business days</div>
                  </div>
                  <div className={styles.optionPrice}>$9.99</div>
                </label>
              </div>
              
              <div className={styles.option}>
                <input type="radio" name="delivery" id="same-day" />
                <label htmlFor="same-day">
                  <div className={styles.optionInfo}>
                    <div className={styles.optionName}>Same Day Delivery</div>
                    <div className={styles.optionDescription}>Available for orders before 2pm</div>
                  </div>
                  <div className={styles.optionPrice}>$19.99</div>
                </label>
              </div>
              
              <div className={styles.trostOption}>
                <div className={styles.trostInfo}>
                  <div className={styles.trostTitle}>TROST</div>
                  <div className={styles.trostDescription}>Secure tracking, delivery notifications, and reselling options after use</div>
                </div>
                <div className={styles.trostButtonContainer}>
                  <TrostButton 
                    productId="MED-SUP-2023-001" 
                    trackingId="UT1234567890" 
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.productAdditionalInfo}>
              <div className={styles.infoSection}>
                <h3>Product Details</h3>
                <div className={styles.sectionContent}>
                  <p>This comprehensive medical supplies package contains essential items for medical professionals, including PPE, diagnostic tools, and first aid supplies.</p>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3>Shipping Information</h3>
                <div className={styles.sectionContent}>
                  <p>Free delivery on orders over $100. Standard delivery $4.50.</p>
                  <p>Free returns on qualifying orders.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>About Us</h3>
            <p>ShopDemo is a premium provider of medical supplies for healthcare professionals.</p>
          </div>
          
          <div className={styles.footerSection}>
            <h3>Customer Service</h3>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Refunds</a></li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3>Follow Us</h3>
            <div className={styles.socialLinks}>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>&copy; 2024 ShopDemo. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Add the TrostAgent component for hovering */}
      <ImprovedTrostAgent />
    </div>
  );
}