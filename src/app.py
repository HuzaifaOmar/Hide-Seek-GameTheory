from flask import Flask, jsonify
from flask_cors import CORS
from src.controller.game_controller import game_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(game_bp, url_prefix='/api/game')

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'Hide & Seek Game API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)