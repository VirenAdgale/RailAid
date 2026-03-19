const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// Create booking
router.post("/", async (req, res) => {
  try {
    const { passengerName, source, destination, journeyDate, seats, serviceType } = req.body;

    const newBooking = new Booking({
      passengerName,
      source,
      destination,
      journeyDate: new Date(journeyDate), // ensure Date type
      seats: Number(seats), // ensure number
      serviceType
    });

    await newBooking.save();

    // 🔔 Send notification to driver
    const io = req.app.get("io");
    if (io) {
      io.emit("newBooking", {
        message: "New Ferry Booking!",
        passengerName,
        source,
        destination,
        journeyDate,
        seats
      });
    }

    res.status(201).json({ message: "Booking successful" });

  } catch (error) {
    console.error("Booking failed:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

module.exports = router;
