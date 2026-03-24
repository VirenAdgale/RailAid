const Booking = require("../models/Booking");
const axios = require("axios");

exports.createBooking = async (req, res) => {
  try {
    const {
      passengerName,
      source,
      destination,
      journeyDate,
      seats,
      passenger_type,
      luggage_weight,
      number_of_bags,
      platform_change,
      urgency_level
    } = req.body;

    console.log("REQ BODY:", req.body);

    let serviceType = "Standard Ferry"; // ✅ fallback (IMPORTANT)
    let assignedDriver = "Not Assigned";
    let estimatedWaitTime = "Unknown";

    try {
      const mlResponse = await axios.post("http://127.0.0.1:5000/predict", {
        passenger_type,
        luggage_weight,
        number_of_bags,
        platform_change,
        urgency_level
      });

      console.log("ML DATA:", mlResponse.data);

      // ✅ Safe extraction
      if (mlResponse.data && mlResponse.data.recommendation) {
        serviceType = mlResponse.data.recommendation;
        assignedDriver = mlResponse.data.assigned_driver || assignedDriver;
        estimatedWaitTime = mlResponse.data.estimated_wait_time || estimatedWaitTime;
      } else {
        console.log("⚠️ ML response missing recommendation, using fallback");
      }

    } catch (err) {
      console.log("⚠️ Flask not working, using fallback:", err.message);
    }

    // 🔥 Save booking ALWAYS (no crash)
    const booking = await Booking.create({
      userId:  "demoUser",

      passengerName,
      source,
      destination,
      journeyDate,
      seats,

      passenger_type,
      luggage_weight,
      number_of_bags,
      platform_change,
      urgency_level,

      serviceType,
      assignedDriver,
      estimatedWaitTime
    });

    res.status(201).json({
      message: "Booking Successful",
      booking
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};