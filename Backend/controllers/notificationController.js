const jwt = require("jsonwebtoken");
const Notification = require("../models/Notification");

const buildNotificationPayload = (notification) => ({
  id: notification._id,
  bookingId: notification.bookingId,
  title: notification.title,
  message: notification.message,
  type: notification.type,
  read: notification.read,
  createdAt: notification.createdAt
});

const writeNotificationEvent = (client, notification) => {
  client.write("event: notification\n");
  client.write(`data: ${JSON.stringify(buildNotificationPayload(notification))}\n\n`);
};

exports.createNotification = async (req, notificationData) => {
  const notification = await Notification.create(notificationData);
  const io = req.app.get("io");
  const notificationSubscribers = req.app.get("notificationSubscribers");
  const payload = buildNotificationPayload(notification);

  if (io) {
    io.to(`user:${notification.userId}`).emit("notification", payload);
  }

  const subscribers = notificationSubscribers?.get(String(notification.userId));
  if (subscribers) {
    subscribers.forEach((client) => writeNotificationEvent(client, notification));
  }

  return notification;
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json({ notifications: notifications.map(buildNotificationPayload) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
    return res.json({ message: "Notifications marked as read." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.streamNotifications = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });

    const recentNotifications = await Notification.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.write("event: notificationSnapshot\n");
    res.write(`data: ${JSON.stringify(recentNotifications.map(buildNotificationPayload))}\n\n`);

    const notificationSubscribers = req.app.get("notificationSubscribers");
    const userId = String(decoded.id);
    const subscribers = notificationSubscribers.get(userId) || new Set();
    subscribers.add(res);
    notificationSubscribers.set(userId, subscribers);

    const heartbeat = setInterval(() => {
      res.write("event: heartbeat\n");
      res.write(`data: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
    }, 25000);

    req.on("close", () => {
      clearInterval(heartbeat);
      subscribers.delete(res);
      if (subscribers.size === 0) {
        notificationSubscribers.delete(userId);
      }
      res.end();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
