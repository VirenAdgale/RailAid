const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const Staff = require("../models/Staff");

const buildSafeStaff = (staff) => ({
  id: staff._id,
  name: staff.name,
  email: staff.email,
  employeeId: staff.employeeId,
  department: staff.department,
  station: staff.station,
  isActive: staff.isActive,
  role: staff.role
});

const buildToken = (staff) =>
  jwt.sign(
    { id: staff._id, role: staff.role, employeeId: staff.employeeId },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

const mobilitySelect =
  "passengerName source destination journeyDate seats passenger_type serviceType assignedDriver assignedVehicle estimatedWaitTime urgency_level arrivalMode arrivalCode arrivalTime arrivalStatus pickupPoint dropPoint mobilityPriority mobilityStatus driverNavigation optimizedRoute passengerTracking createdAt";

const buildMobilityPayload = (booking) => ({
  id: booking._id,
  passengerName: booking.passengerName,
  source: booking.source,
  destination: booking.destination,
  arrivalMode: booking.arrivalMode,
  arrivalCode: booking.arrivalCode,
  arrivalTime: booking.arrivalTime,
  arrivalStatus: booking.arrivalStatus,
  pickupPoint: booking.pickupPoint,
  dropPoint: booking.dropPoint,
  passenger_type: booking.passenger_type,
  serviceType: booking.serviceType,
  assignedDriver: booking.assignedDriver,
  assignedVehicle: booking.assignedVehicle,
  estimatedWaitTime: booking.estimatedWaitTime,
  mobilityPriority: booking.mobilityPriority,
  mobilityStatus: booking.mobilityStatus,
  driverNavigation: booking.driverNavigation,
  optimizedRoute: booking.optimizedRoute,
  passengerTracking: booking.passengerTracking,
  createdAt: booking.createdAt
});

exports.registerStaff = async (req, res) => {
  try {
    const { name, email, password, employeeId, department, station } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedEmployeeId = employeeId.trim().toUpperCase();

    const existingStaff = await Staff.findOne({
      $or: [{ email: normalizedEmail }, { employeeId: normalizedEmployeeId }]
    });

    if (existingStaff) {
      return res.status(409).json({
        message:
          existingStaff.email === normalizedEmail
            ? "A staff account with this email already exists."
            : "This employee ID is already assigned."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      employeeId: normalizedEmployeeId,
      department,
      station
    });

    return res.status(201).json({
      message: "Staff account created successfully.",
      staff: buildSafeStaff(staff)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Staff account already exists." });
    }

    return res.status(500).json({ error: error.message });
  }
};

exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const staff = await Staff.findOne({ email: normalizedEmail });
    if (!staff) {
      return res.status(400).json({ message: "Staff account not found." });
    }

    if (!staff.isActive) {
      return res.status(403).json({ message: "This staff account is inactive." });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    return res.json({
      token: buildToken(staff),
      staff: buildSafeStaff(staff)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff account not found." });
    }

    return res.json({ staff: buildSafeStaff(staff) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStaffDashboard = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff account not found." });
    }

    const [totalBookings, urgentBookings, assistanceBookings, recentBookings] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ urgency_level: { $gt: 0 } }),
        Booking.countDocuments({
          serviceType: { $regex: /(priority|wheelchair|assistance|support)/i }
        }),
        Booking.find()
          .sort({ createdAt: -1 })
          .limit(8)
          .select(mobilitySelect)
      ]);

    return res.json({
      staff: buildSafeStaff(staff),
      stats: {
        totalBookings,
        urgentBookings,
        assistanceBookings,
        activeStaffStatus: staff.isActive ? "Active" : "Inactive"
      },
      recentBookings
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.streamMobilityUpdates = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "staff") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select(mobilitySelect);

    res.write(`event: mobilitySnapshot\n`);
    res.write(`data: ${JSON.stringify(recentBookings.map(buildMobilityPayload))}\n\n`);

    const subscribers = req.app.get("mobilitySubscribers");
    subscribers.add(res);

    const heartbeat = setInterval(() => {
      res.write(`event: heartbeat\n`);
      res.write(`data: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
    }, 25000);

    req.on("close", () => {
      clearInterval(heartbeat);
      subscribers.delete(res);
      res.end();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
