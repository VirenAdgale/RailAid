const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// ✅ IMPORT ALL ROUTES (FIXED)
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
const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

<<<<<<< HEAD
// ✅ Socket.IO setup (ALLOW ALL ORIGINS)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ Store connected drivers
let drivers = {};
=======
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
};

const io = new Server(server, { cors: corsOptions });
>>>>>>> 1d6a0e4 (Normalize line endings)

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

<<<<<<< HEAD
  // Driver registration
=======
>>>>>>> 1d6a0e4 (Normalize line endings)
  socket.on("registerDriver", (driverId) => {
    console.log("Driver registered:", driverId);
  });

  socket.on("registerUser", (userId) => {
    socket.join(`user:${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

<<<<<<< HEAD
// ✅ Make io accessible in routes
=======
>>>>>>> 1d6a0e4 (Normalize line endings)
app.set("io", io);
app.set("mobilitySubscribers", mobilitySubscribers);
app.set("notificationSubscribers", notificationSubscribers);
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

<<<<<<< HEAD
// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));
=======
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
>>>>>>> 1d6a0e4 (Normalize line endings)

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

<<<<<<< HEAD
// ✅ RUN SERVER ON NETWORK (IMPORTANT FIX)
server.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:5000");
});
=======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
>>>>>>> 1d6a0e4 (Normalize line endings)
