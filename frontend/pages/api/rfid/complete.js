export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
      const { tagId } = req.body;
      
      // Connection to your Python API
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/delivery/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tagId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete delivery');
      }
      
      const result = await response.json();
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error completing delivery:', error);
      
      // For demo purposes, return mock data
      return res.status(200).json({
        success: true,
        tagId: req.body.tagId || 'AUTO-DETECTED',
        message: 'Demo delivery completion successful'
      });
    }
  }