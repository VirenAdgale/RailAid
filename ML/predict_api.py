import os
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np

BASE_DIR = Path(__file__).resolve().parent

app = Flask(__name__)
CORS(app)

# ==========================================
# LOAD MODEL AND ENCODERS
# ==========================================

model = joblib.load(BASE_DIR / "ferry_recommendation_model.pkl")
passenger_encoder = joblib.load(BASE_DIR / "passenger_encoder.pkl")
service_encoder = joblib.load(BASE_DIR / "service_encoder.pkl")

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
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "model": "ferry_recommendation"
    })

# ==========================================
# PEAK TIME DETECTION
# ==========================================

def check_peak_time():
    hour = datetime.now().hour
    return int((7 <= hour <= 10) or (17 <= hour <= 21))

# ==========================================
# DRIVER ASSIGNMENT
# ==========================================

def assign_driver():
    available = [driver for driver in drivers if driver["status"] == "available"]

    if not available:
        return None

    for driver in available:
        driver["score"] = (driver["idle_time"] * 2) - (driver["current_tasks"] * 5)

    best_driver = sorted(
        available,
        key=lambda driver: driver["score"],
        reverse=True
    )[0]

    best_driver["current_tasks"] += 1
    best_driver["idle_time"] = 0

    return best_driver["driver_id"]

# ==========================================
# PREDICTION API
# ==========================================

@app.post("/predict")
def predict():
    try:
        data = request.get_json(silent=True) or {}

        required_fields = [
            "passenger_type",
            "luggage_weight",
            "number_of_bags",
            "platform_change",
            "urgency_level",
        ]

        missing_fields = [
            field for field in required_fields
            if field not in data
        ]

        if missing_fields:
            return jsonify({
                "error": f"Missing fields: {', '.join(missing_fields)}"
            }), 400

        passenger_type = str(data["passenger_type"]).strip()
        luggage_weight = max(int(data["luggage_weight"]), 0)
        number_of_bags = max(int(data["number_of_bags"]), 0)
        platform_change = 1 if int(data["platform_change"]) else 0
        urgency_level = 1 if int(data["urgency_level"]) else 0

        is_peak_time = check_peak_time()

        passenger_encoded = passenger_encoder.transform([
            passenger_type
        ])[0]

        features = np.array([[
            passenger_encoded,
            luggage_weight,
            number_of_bags,
            platform_change,
            urgency_level,
            is_peak_time,
        ]])

        prediction = model.predict(features)

        service = service_encoder.inverse_transform(prediction)[0]

        driver = assign_driver()

        wait_time = (
            "5 minutes"
            if driver
            else "No drivers available"
        )

        return jsonify({
            "recommendation": service,
            "assigned_driver": driver,
            "estimated_wait_time": wait_time,
            "peak_time": bool(is_peak_time),
        })

    except ValueError as error:
        return jsonify({
            "error": str(error)
        }), 400

    except Exception as error:
        return jsonify({
            "error": str(error)
        }), 500

# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001))
    )