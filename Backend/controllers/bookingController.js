const Booking = require("../models/Booking");

// CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { passengerName, source, destination, journeyDate, seats } = req.body;

    const booking = await Booking.create({
      userId: req.user.id,
      passengerName,
      source,
      destination,
      journeyDate,
      seats
    });

    res.status(201).json({
      message: "Booking Successful",
      booking
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BOOKINGS
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ADMIN: GET ALL BOOKINGS
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name email");

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
