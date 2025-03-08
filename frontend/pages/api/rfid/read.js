export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
      // Connection to your Python API
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/rfid/read`);
      
      if (!response.ok) {
        throw new Error('Failed to read RFID tag');
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error reading RFID tag:', error);
      
      // For demo purposes, return mock data
      return res.status(200).json({
        success: true,
        tagId: 'DEMO1234'
      });
    }
  }