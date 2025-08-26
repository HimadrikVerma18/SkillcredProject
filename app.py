from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Dummy price prediction formula
    base_price = 100
    predicted_price = base_price + (float(data['brand_rating']) * 10) \
                      + (float(data['weight']) * 5) \
                      + (float(data['dimensions']) * 0.05) \
                      + (int(data['warranty']) * 2) \
                      + (float(data['seller_rating']) * 8)

    # Confidence simulation
    confidence = 0.85

    # Simple anomaly detection
    is_anomaly = predicted_price < 50 or predicted_price > 10000
    explanation = "Predicted price seems unusual." if is_anomaly else ""

    return jsonify({
        "predicted_price": round(predicted_price, 2),
        "confidence": confidence,
        "is_anomaly": is_anomaly,
        "explanation": explanation
    })

if __name__ == "__main__":
    app.run(debug=True)
