const express = require("express");
const {
  createBooking,
  getUserBookings,
  getAllBookings
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getUserBookings);
router.get("/all", authMiddleware, getAllBookings); // admin use

module.exports = router;
