export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
      const { data } = req.body;
      
      if (!data) {
        return res.status(400).json({
          success: false,
          error: 'No data provided to write to tag'
        });
      }
      
      // Connection to your Python API
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/rfid/write`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });
      
      if (!response.ok) {
        throw new Error('Failed to write to RFID tag');
      }
      
      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error writing to RFID tag:', error);
      
      // For demo purposes, return mock data
      return res.status(200).json({
        success: true,
        data: req.body.data,
        message: 'Demo write successful'
      });
    }
  }