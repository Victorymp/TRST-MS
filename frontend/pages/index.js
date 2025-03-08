import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  // Initialize Trost SDK when component mounts
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/trost-sdk.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      if (window.TrostSDK) {
        const trostSDK = new window.TrostSDK({
          apiKey: 'demo-api-key-12345',
          trackingEndpoint: 'http://localhost:5000/api/track',
          theme: 'light',
          debug: true
        });
      }
    };
    
    return () => {
      // Clean up script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Trost Integration Demo</title>
        <meta name="description" content="Track with Trost demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <div className="logo">ShopDemo</div>
      </header>
      
      <main>
        <div className="container">
          <div className="product-detail">
            <div className="product-image">
              <img src="https://via.placeholder.com/400" alt="Product Image" />
            </div>
            
            <div className="product-info">
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
              
              <button className="add-to-cart">Add to Cart</button>
              
              <div className="delivery-options">
                <div className="options-title">Delivery Options</div>
                
                <div className="option">
                  <input type="radio" name="delivery" id="standard" defaultChecked />
                  <div className="option-info">
                    <div className="option-name">Standard Delivery</div>
                    <div className="option-description">3-5 business days</div>
                  </div>
                  <div className="option-price">Free</div>
                </div>
                
                <div className="option">
                  <input type="radio" name="delivery" id="express" />
                  <div className="option-info">
                    <div className="option-name">Express Delivery</div>
                    <div className="option-description">1-2 business days</div>
                  </div>
                  <div className="option-price">$9.99</div>
                </div>
                
                <div className="option">
                  <input type="radio" name="delivery" id="same-day" />
                  <div className="option-info">
                    <div className="option-name">Same Day Delivery</div>
                    <div className="option-description">Available for orders before 2pm</div>
                  </div>
                  <div className="option-price">$19.99</div>
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
            </div>
          </div>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          // For demo purposes - simulate a previous purchase
          const orderInfo = {
            orderId: 'ORD-12345-6789',
            product: 'Medical Supplies Package',
            orderDate: '2024-03-05',
            shippingMethod: 'Express Delivery',
            trackingId: 'UT1234567890',
            status: 'Shipped'
          };
          
          // Store order info in local storage for demo
          localStorage.setItem('demo_order', JSON.stringify(orderInfo));
          
          // Add event listener to Add to Cart button
          document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.add-to-cart').addEventListener('click', function() {
              alert('Product added to cart! In a real implementation, this would add the product to your shopping cart.');
            });
          });
        `
      }} />
    </div>
  );
}