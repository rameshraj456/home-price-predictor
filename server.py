from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import util

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    locations = util.get_location_names()
    return jsonify({'locations': locations})

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    data = request.get_json()
    total_sqft = float(data['total_sqft'])
    location = data['location']
    bhk = int(data['bhk'])
    bath = int(data['bath'])

    estimated_price = util.get_estimated_price(location, total_sqft, bhk, bath)
    return jsonify({'estimated_price': estimated_price})

if __name__ == "__main__":
    import os

    util.load_saved_artifacts()
    port = int(os.environ.get("PORT", 5000))  # Use Render's PORT or default to 5000
    app.run(host='0.0.0.0', port=port)
