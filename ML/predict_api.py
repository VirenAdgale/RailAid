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
# LOAD TRAINED MODEL & ENCODERS
# ==========================================

model = joblib.load("ferry_recommendation_model.pkl")
passenger_encoder = joblib.load("passenger_encoder.pkl")
service_encoder = joblib.load("service_encoder.pkl")

# ==========================================
# SIMULATED DRIVER DATA (DEMO PURPOSE)
# ==========================================

drivers = [
    {"driver_id": "DRV101", "current_tasks": 1, "idle_time": 10, "status": "available"},
    {"driver_id": "DRV102", "current_tasks": 0, "idle_time": 25, "status": "available"},
    {"driver_id": "DRV103", "current_tasks": 2, "idle_time": 5, "status": "available"},
    {"driver_id": "DRV104", "current_tasks": 1, "idle_time": 15, "status": "available"},
]

# ==========================================
# PEAK TIME DETECTION FUNCTION
# ==========================================

def check_peak_time():
    current_hour = datetime.now().hour

    # Example Peak Hours: 7-10 AM and 5-9 PM
    if (7 <= current_hour <= 10) or (17 <= current_hour <= 21):
        return 1
    return 0

# ==========================================
# DRIVER ASSIGNMENT ENGINE
# ==========================================

def assign_driver():
    available_drivers = [d for d in drivers if d["status"] == "available"]

    if not available_drivers:
        return None

    # Score calculation:
    # Higher idle_time → better
    # Higher current_tasks → worse
    for driver in available_drivers:
        driver["score"] = (driver["idle_time"] * 2) - (driver["current_tasks"] * 5)

    sorted_drivers = sorted(available_drivers, key=lambda x: x["score"], reverse=True)

    selected_driver = sorted_drivers[0]

    # Update state after assignment
    selected_driver["current_tasks"] += 1
    selected_driver["idle_time"] = 0

    return selected_driver["driver_id"]

# ==========================================
# RECOMMENDATION API ENDPOINT
# ==========================================

@app.route("/recommend", methods=["POST"])
def recommend_service():

    try:
        data = request.get_json()

        # Extract input features
        passenger_type = data["passenger_type"]
        luggage_weight = data["luggage_weight"]
        number_of_bags = data["number_of_bags"]
        platform_change = data["platform_change"]
        urgency_level = data["urgency_level"]

        # Automatically detect peak time
        is_peak_time = check_peak_time()

        # Encode passenger type
        passenger_type_encoded = passenger_encoder.transform([passenger_type])[0]

        # Prepare features for model
        features = np.array([[
            passenger_type_encoded,
            luggage_weight,
            number_of_bags,
            platform_change,
            urgency_level,
            is_peak_time
        ]])

        # Predict service
        prediction = model.predict(features)
        service_name = service_encoder.inverse_transform(prediction)[0]

        # Assign driver
        assigned_driver = assign_driver()

        # Estimate wait time (simple simulation)
        if assigned_driver:
            estimated_wait = "5 minutes"
        else:
            estimated_wait = "No drivers available"

        return jsonify({
            "recommended_service": service_name,
            "assigned_driver": assigned_driver,
            "estimated_wait_time": estimated_wait,
            "peak_time": bool(is_peak_time)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True, port=5001)