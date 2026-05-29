const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// ✅ IMPORT ALL ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const staffRoutes = require("./routes/staffRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const mobilitySubscribers = new Set();
const notificationSubscribers = new Map();

const allowedOrigins = (
  process.env.CORS_ORIGIN ||
  process.env.FRONTEND_ORIGIN ||
  ""
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ✅ CORS CONFIGURATION

const corsOptions = {
  origin(origin, callback) {

    if (
      !origin ||
      allowedOrigins.length === 0 ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  },

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS"
  ],

  credentials: true
};

// ✅ SOCKET.IO

const io = new Server(server, {
  cors: corsOptions
});

io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // Driver registration
  socket.on("registerDriver", (driverId) => {
    console.log("Driver registered:", driverId);
  });

  // User registration
  socket.on("registerUser", (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

});

// ✅ MAKE IO ACCESSIBLE IN ROUTES

app.set("io", io);
app.set("mobilitySubscribers", mobilitySubscribers);
app.set("notificationSubscribers", notificationSubscribers);

// ✅ MIDDLEWARE

app.use(cors(corsOptions));

app.use(express.json({
  limit: "1mb"
}));

// ✅ HEALTH ROUTE

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// ✅ ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

// ✅ MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("Mongo Error:", err);
  });

// ✅ START SERVER

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});