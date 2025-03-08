import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  useEffect(() => {
    // Initialize Trost SDK
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = '/trost-sdk.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        if (window.TrostSDK) {
          const trostSDK = new window.TrostSDK({
            apiKey: 'demo-api-key-12345',
            trackingEndpoint: '/api/track',
            theme: 'light',
            debug: true
          });
        }
      };
    }
  }, []);

  return (
    <div>
      <Head>
        <title>Trost Integration Demo</title>
        <meta name="description" content="Track with Trost demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* Paste the main content of your e-commerce demo page here */}
        <div className="product-detail">
          {/* Product information */}
          {/* Delivery options with Trost integration */}
        </div>
      </main>
    </div>
  );
}