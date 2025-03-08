from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add the path to your original RFID code
# Replace with the actual path to your RFID code
sys.path.append("C:/Users/NewStart/RFID")

# Now import your existing modules
import TRST_API_requests
import rfid_reader
import enviroment_variables

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize our API and RFID reader
env = enviroment_variables.enviroment_variables()
api = TRST_API_requests.TRST_API_requests()
rfid = rfid_reader.RFIDReader()

@app.route('/api/track/<tracking_id>', methods=['GET'])
def track_delivery(tracking_id):
    """Get tracking information by tracking ID"""
    try:
        # Call your existing delivery API
        delivery_data = api.getDelivery(tracking_id)
        
        # Format the response for the frontend
        response = {
            'success': True,
            'trackingId': tracking_id,
            'status': delivery_data.get('status', 'In Transit'),
            'orderDate': delivery_data.get('orderDate', ''),
            'confirmationDate': delivery_data.get('confirmationDate', ''),
            'dispatchDate': delivery_data.get('dispatchDate', ''),
            'description': delivery_data.get('description', ''),
            'weight': delivery_data.get('weight', 0),
            'metric': delivery_data.get('metric', 'kg'),
            'payload': delivery_data.get('payload', ''),
            'utid': delivery_data.get('UTID', ''),
            'lastUpdated': delivery_data.get('dispatchDate', '')
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(f"Error tracking delivery: {str(e)}")
        # For demo purposes, return mock data if the real API fails
        mock_data = {
            'success': True,
            'trackingId': tracking_id,
            'status': 'In Transit',
            'orderDate': '2024-03-05',
            'dispatchDate': '2024-03-06',
            'description': 'Medical supplies delivery',
            'weight': 2.5,
            'metric': 'kg',
            'payload': 'Medical equipment',
            'utid': 'UT1234567890',
            'lastUpdated': '2024-03-06T16:00:00'
        }
        return jsonify(mock_data)

@app.route('/api/rfid/read', methods=['GET'])
def read_rfid():
    """Read current RFID tag"""
    try:
        tag_data = rfid.get3MTagdata()
        
        if tag_data:
            return jsonify({
                'success': True,
                'tagId': tag_data
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No RFID tag detected'
            }), 404
            
    except Exception as e:
        print(f"Error reading RFID: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/rfid/write', methods=['POST'])
def write_rfid():
    """Write data to RFID tag"""
    try:
        data = request.json
        tag_data = data.get('data')
        
        if not tag_data:
            return jsonify({
                'success': False,
                'error': 'No data provided to write to tag'
            }), 400
            
        result = rfid.writeTo3MTag(tag_data)
        
        return jsonify({
            'success': True,
            'data': tag_data,
            'result': result
        })
        
    except Exception as e:
        print(f"Error writing to RFID tag: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/delivery/complete', methods=['POST'])
def complete_delivery():
    """Mark a delivery as complete via RFID tag"""
    try:
        data = request.json
        tag_id = data.get('tagId')
        
        if not tag_id:
            # If no tag ID provided, try to read from RFID reader
            rfid_result = rfid.get3MTagdata()
            if rfid_result:
                result = api.completeDeliveryViaTag(rfid_result)
                return jsonify({
                    'success': True,
                    'tagId': rfid_result,
                    'result': result
                })
            else:
                return jsonify({
                    'success': False,
                    'error': 'Failed to read RFID tag'
                }), 400
        else:
            # Complete delivery with provided tag ID
            result = api.completeDeliveryViaTag(tag_id)
            return jsonify({
                'success': True,
                'tagId': tag_id,
                'result': result
            })
            
    except Exception as e:
        print(f"Error completing delivery: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Trost API is running'
    })

if __name__ == '__main__':
    print("Starting Trost API server on port 5000...")
    app.run(debug=True, port=5000, host='0.0.0.0')