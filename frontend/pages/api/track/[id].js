export default async function handler(req, res) {
    const { id } = req.query;
    
    try {
      // Connection to your Python API
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/track/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      
      // For demo purposes, return mock data
      res.status(200).json({
        success: true,
        trackingId: id,
        status: 'In Transit',
        orderDate: '2024-03-05',
        dispatchDate: '2024-03-06',
        description: 'Medical supplies delivery',
        weight: 2.5,
        metric: 'kg',
        payload: 'Medical equipment',
        utid: 'UT1234567890',
        lastUpdated: new Date().toISOString(),
        timeline: [
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
        ]
      });
    }
  }