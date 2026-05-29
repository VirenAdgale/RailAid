const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationsRead,
  streamNotifications
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authMiddleware(["user"]), getNotifications);
router.patch("/read", authMiddleware(["user"]), markNotificationsRead);
router.get("/stream", streamNotifications);

module.exports = router;
