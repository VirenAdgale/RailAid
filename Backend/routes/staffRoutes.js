const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerStaff,
  loginStaff,
  getStaffProfile,
  getStaffDashboard,
  streamMobilityUpdates
} = require("../controllers/staffController");

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/me", authMiddleware(["staff"]), getStaffProfile);
router.get("/dashboard", authMiddleware(["staff"]), getStaffDashboard);
router.get("/mobility-stream", streamMobilityUpdates);

module.exports = router;
