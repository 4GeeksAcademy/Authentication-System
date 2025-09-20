"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from api.app import app
from api.models import db

if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
