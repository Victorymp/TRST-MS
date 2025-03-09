// next.config.js
module.exports = {
    reactStrictMode: true,
    // Ensure CSS is handled correctly
    webpack(config) {
      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      });
      return config;
    },
    // Enable API routes to connect to your Python backend
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/:path*',
        },
      ];
    },
  }