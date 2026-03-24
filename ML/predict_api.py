# ==========================================
# IMPORT REQUIRED LIBRARIES
# ==========================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
from datetime import datetime

# ==========================================
# INITIALIZE FLASK APP
# ==========================================

app = Flask(__name__)
CORS(app)

# ==========================================
# LOAD MODEL AND ENCODERS
# ==========================================

model = joblib.load("ferry_recommendation_model.pkl")
passenger_encoder = joblib.load("passenger_encoder.pkl")
service_encoder = joblib.load("service_encoder.pkl")

# ==========================================
# DRIVER DATA (SIMULATION)
# ==========================================

drivers = [
    {"driver_id": "DRV101", "current_tasks": 1, "idle_time": 10, "status": "available"},
    {"driver_id": "DRV102", "current_tasks": 0, "idle_time": 25, "status": "available"},
    {"driver_id": "DRV103", "current_tasks": 2, "idle_time": 5, "status": "available"},
    {"driver_id": "DRV104", "current_tasks": 1, "idle_time": 15, "status": "available"},
]

# ==========================================
# PEAK TIME DETECTION
# ==========================================

def check_peak_time():
    hour = datetime.now().hour

    if (7 <= hour <= 10) or (17 <= hour <= 21):
        return 1
    return 0


# ==========================================
# DRIVER ASSIGNMENT
# ==========================================

def assign_driver():

    available = [d for d in drivers if d["status"] == "available"]

    if not available:
        return None

    for d in available:
        d["score"] = (d["idle_time"] * 2) - (d["current_tasks"] * 5)

    best_driver = sorted(available, key=lambda x: x["score"], reverse=True)[0]

    best_driver["current_tasks"] += 1
    best_driver["idle_time"] = 0

    return best_driver["driver_id"]


# ==========================================
# PREDICTION API
# ==========================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.json

        passenger_type = data["passenger_type"]
        luggage_weight = int(data["luggage_weight"])
        number_of_bags = int(data["number_of_bags"])
        platform_change = int(data["platform_change"])
        urgency_level = int(data["urgency_level"])

        is_peak_time = check_peak_time()

        passenger_encoded = passenger_encoder.transform([passenger_type])[0]

        features = np.array([[
            passenger_encoded,
            luggage_weight,
            number_of_bags,
            platform_change,
            urgency_level,
            is_peak_time
        ]])

        prediction = model.predict(features)

        service = service_encoder.inverse_transform(prediction)[0]

        driver = assign_driver()

        wait_time = "5 minutes" if driver else "No drivers available"

        return jsonify({
            "recommendation": service,
            "assigned_driver": driver,
            "estimated_wait_time": wait_time,
            "peak_time": bool(is_peak_time)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
   app.run(debug=True, host="0.0.0.0", port=5000)