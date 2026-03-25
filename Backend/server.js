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

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup (ALLOW ALL ORIGINS)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ✅ Store connected drivers
let drivers = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Driver registration
  socket.on("registerDriver", (driverId) => {
    drivers[driverId] = socket.id;
    console.log("Driver registered:", driverId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Make io accessible in routes
app.set("io", io);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Mongo Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ RUN SERVER ON NETWORK (IMPORTANT FIX)
server.listen(5000, "0.0.0.0", () => {
  console.log("Server running on http://0.0.0.0:5000");
});