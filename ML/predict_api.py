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

<<<<<<< HEAD
# ==========================================
# LOAD MODEL AND ENCODERS
# ==========================================

model = joblib.load("ferry_recommendation_model.pkl")
passenger_encoder = joblib.load("passenger_encoder.pkl")
service_encoder = joblib.load("service_encoder.pkl")

# ==========================================
# DRIVER DATA (SIMULATION)
# ==========================================
=======
model = joblib.load(BASE_DIR / "ferry_recommendation_model.pkl")
passenger_encoder = joblib.load(BASE_DIR / "passenger_encoder.pkl")
service_encoder = joblib.load(BASE_DIR / "service_encoder.pkl")
>>>>>>> 1d6a0e4 (Normalize line endings)

drivers = [
    {"driver_id": "DRV101", "current_tasks": 1, "idle_time": 10, "status": "available"},
    {"driver_id": "DRV102", "current_tasks": 0, "idle_time": 25, "status": "available"},
    {"driver_id": "DRV103", "current_tasks": 2, "idle_time": 5, "status": "available"},
    {"driver_id": "DRV104", "current_tasks": 1, "idle_time": 15, "status": "available"},
]

<<<<<<< HEAD
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
=======

@app.get("/health")
def health():
    return jsonify({"status": "ok", "model": "ferry_recommendation"})


def check_peak_time():
    hour = datetime.now().hour
    return int((7 <= hour <= 10) or (17 <= hour <= 21))


def assign_driver():
    available = [driver for driver in drivers if driver["status"] == "available"]

    if not available:
        return None

    for driver in available:
        driver["score"] = (driver["idle_time"] * 2) - (driver["current_tasks"] * 5)

    best_driver = sorted(available, key=lambda driver: driver["score"], reverse=True)[0]
    best_driver["current_tasks"] += 1
    best_driver["idle_time"] = 0

    return best_driver["driver_id"]

>>>>>>> 1d6a0e4 (Normalize line endings)

@app.post("/predict")
def predict():
    try:
<<<<<<< HEAD

        data = request.json

        passenger_type = data["passenger_type"]
        luggage_weight = int(data["luggage_weight"])
        number_of_bags = int(data["number_of_bags"])
        platform_change = int(data["platform_change"])
        urgency_level = int(data["urgency_level"])

        is_peak_time = check_peak_time()

        passenger_encoded = passenger_encoder.transform([passenger_type])[0]

=======
        data = request.get_json(silent=True) or {}
        required_fields = [
            "passenger_type",
            "luggage_weight",
            "number_of_bags",
            "platform_change",
            "urgency_level",
        ]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

        passenger_type = str(data["passenger_type"]).strip()
        luggage_weight = max(int(data["luggage_weight"]), 0)
        number_of_bags = max(int(data["number_of_bags"]), 0)
        platform_change = 1 if int(data["platform_change"]) else 0
        urgency_level = 1 if int(data["urgency_level"]) else 0
        is_peak_time = check_peak_time()

        passenger_encoded = passenger_encoder.transform([passenger_type])[0]
>>>>>>> 1d6a0e4 (Normalize line endings)
        features = np.array([[
            passenger_encoded,
            luggage_weight,
            number_of_bags,
            platform_change,
            urgency_level,
            is_peak_time,
        ]])

        prediction = model.predict(features)
<<<<<<< HEAD

        service = service_encoder.inverse_transform(prediction)[0]

        driver = assign_driver()

        wait_time = "5 minutes" if driver else "No drivers available"
=======
        service = service_encoder.inverse_transform(prediction)[0]
        driver = assign_driver()
>>>>>>> 1d6a0e4 (Normalize line endings)

        return jsonify({
            "recommendation": service,
            "assigned_driver": driver,
<<<<<<< HEAD
            "estimated_wait_time": wait_time,
            "peak_time": bool(is_peak_time)
=======
            "estimated_wait_time": "5 minutes" if driver else "No drivers available",
            "peak_time": bool(is_peak_time),
>>>>>>> 1d6a0e4 (Normalize line endings)
        })
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception as error:
        return jsonify({"error": str(error)}), 500

<<<<<<< HEAD
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":
   app.run(debug=True, host="0.0.0.0", port=5000)
=======

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))
>>>>>>> 1d6a0e4 (Normalize line endings)
