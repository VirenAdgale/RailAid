const Booking = require("../models/Booking");
const { createNotification } = require("./notificationController");
const { buildOptimizedRoute } = require("../utils/routeOptimizer");

const vehiclePool = [
  { vehicle: "Cart A1", driver: "Amit Sharma", bay: "North concourse", minutesAway: 3 },
  { vehicle: "Cart B2", driver: "Priya Nair", bay: "Platform bridge", minutesAway: 5 },
  { vehicle: "Cart C3", driver: "Rahul Mehta", bay: "Ferry gate", minutesAway: 4 },
  { vehicle: "Cart D4", driver: "Neha Singh", bay: "Main entrance", minutesAway: 6 }
];

const pickNearestVehicle = (source = "", arrivalMode = "train") => {
  const seed = [...`${source}${arrivalMode}`].reduce(
    (total, character) => total + character.charCodeAt(0),
    0
  );

  return vehiclePool[seed % vehiclePool.length];
};

const getArrivalStatus = (arrivalTime) => {
  if (!arrivalTime) {
    return "scheduled";
  }

  const minutesUntilArrival = Math.round((arrivalTime.getTime() - Date.now()) / 60000);

  if (minutesUntilArrival < -10) {
    return "arrived";
  }

  if (minutesUntilArrival <= 15) {
    return "approaching";
  }

  return "scheduled";
};

const buildMobilityPriority = ({ passenger_type, urgency_level, arrivalStatus }) => {
  if (Number(urgency_level) || arrivalStatus === "approaching") {
    return "critical";
  }

  if (passenger_type === "senior" || passenger_type === "differently_abled") {
    return "priority";
  }

  return "standard";
};

const buildPassengerTracking = (now) => [
  { label: "Train/Ferry arrival data received", status: "done", timestamp: now },
  { label: "Realtime mobility engine synced", status: "done", timestamp: now },
  { label: "Senior citizen request checked", status: "done", timestamp: now },
  { label: "Nearest vehicle assigned", status: "done", timestamp: now },
  { label: "Driver navigation and passenger tracking active", status: "active", timestamp: now }
];

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

const broadcastMobilityUpdate = (req, booking) => {
  const payload = buildMobilityPayload(booking);
  const io = req.app.get("io");
  const subscribers = req.app.get("mobilitySubscribers");

  if (io) {
    io.emit("newBooking", {
      message: "New Mobility Assignment!",
      ...payload,
      journeyDate: booking.journeyDate,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      paymentStatus: booking.paymentStatus
    });
    io.emit("mobilityUpdate", payload);
  }

  if (subscribers) {
    subscribers.forEach((client) => {
      client.write(`event: mobilityUpdate\n`);
      client.write(`data: ${JSON.stringify(payload)}\n\n`);
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
   const {
  passengerName,
  source,
  destination,
  journeyDate,
  seats,
  passenger_type,
  luggage_weight,
  number_of_bags,
  platform_change,
  urgency_level,
  arrivalMode,
  arrivalCode,
  arrivalTime,
  pickupPoint,
  dropPoint,
  baseFare,
  serviceFee,
  totalAmount,
  paymentMethod
} = req.body;

   
    const seatsCount = Math.max(Number(seats) || 1, 1);
    const luggageKg = Math.max(Number(luggage_weight) || 0, 0);
    const bagsCount = Math.max(Number(number_of_bags) || 0, 0);
    const hasPlatformChange = Number(platform_change) ? 1 : 0;
    const isUrgent = Number(urgency_level) ? 1 : 0;
    const safeArrivalMode = arrivalMode === "ferry" ? "ferry" : "train";
    const parsedArrivalTime = arrivalTime ? new Date(arrivalTime) : new Date(journeyDate);
    const hasValidArrivalTime = !Number.isNaN(parsedArrivalTime.getTime());
    const arrivalDateTime = hasValidArrivalTime ? parsedArrivalTime : new Date(journeyDate);
    const arrivalStatus = getArrivalStatus(arrivalDateTime);
    const resolvedPickupPoint = pickupPoint?.trim() || source;
    const resolvedDropPoint = dropPoint?.trim() || destination;
    const nearestVehicle = pickNearestVehicle(source, safeArrivalMode);
    const mobilityPriority = buildMobilityPriority({
      passenger_type,
      urgency_level: isUrgent,
      arrivalStatus
    });
    const calculatedBaseFare = 149 * seatsCount + luggageKg * 8 + bagsCount * 25;
    const calculatedServiceFee =
      (passenger_type === "senior" || passenger_type === "differently_abled" ? 40 : 0) +
      (hasPlatformChange ? 60 : 0) +
      (isUrgent ? 90 : 0);
    const calculatedTotal = calculatedBaseFare + calculatedServiceFee;
    const safePaymentMethod = ["upi", "card", "cash"].includes(paymentMethod)
      ? paymentMethod
      : "upi";
    const paymentStatus = safePaymentMethod === "cash" ? "Pay at Station" : "Paid";
    const transactionId =
      paymentStatus === "Paid"
        ? `RA-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`
        : "Pending at station";

    let serviceType = "Standard Ferry";
    let assignedDriver = "Not Assigned";
    let estimatedWaitTime = "Unknown";
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:5001/predict";

    try {
      const mlResponse = await fetch(mlServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          passenger_type,
          luggage_weight: luggageKg,
          number_of_bags: bagsCount,
          platform_change: hasPlatformChange,
          urgency_level: isUrgent
        })
      });
      const mlData = await mlResponse.json();

      if (mlResponse.ok && mlData && mlData.recommendation) {
        serviceType = mlData.recommendation;
        assignedDriver = mlData.assigned_driver || assignedDriver;
        estimatedWaitTime = mlData.estimated_wait_time || estimatedWaitTime;
      } else {
        console.warn("ML response missing recommendation, using fallback");
      }
    } catch (err) {
      console.warn("ML service not reachable, using fallback:", err.message);
    }

    if (!assignedDriver || assignedDriver === "Not Assigned") {
      assignedDriver = nearestVehicle.driver;
    }

    if (!estimatedWaitTime || estimatedWaitTime === "Unknown") {
      estimatedWaitTime = `${nearestVehicle.minutesAway} min`;
    }

    const now = new Date();
    const optimizedRoute = buildOptimizedRoute({
      vehicleBay: nearestVehicle.bay,
      pickupPoint: resolvedPickupPoint,
      dropPoint: resolvedDropPoint,
      mobilityPriority
    });
    const routeSteps = [
      `Start from ${optimizedRoute.startNode}`,
      `Follow optimized path: ${optimizedRoute.routeSummary}`,
      `Pickup passenger at ${resolvedPickupPoint}`,
      `Assist passenger to ${resolvedDropPoint}`,
      "Keep passenger tracking active until handoff"
    ];

    const booking = await Booking.create({
      userId: req.user.id,
      passengerName,
      source,
      destination,
      journeyDate: new Date(journeyDate),
      arrivalMode: safeArrivalMode,
      arrivalCode: arrivalCode?.trim() || `${safeArrivalMode.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      arrivalTime: arrivalDateTime,
      arrivalStatus,
      pickupPoint: resolvedPickupPoint,
      dropPoint: resolvedDropPoint,
      seats: seatsCount,
      passenger_type,
      luggage_weight: luggageKg,
      number_of_bags: bagsCount,
      platform_change: hasPlatformChange,
      urgency_level: isUrgent,
      serviceType,
      assignedDriver,
      assignedVehicle: nearestVehicle.vehicle,
      estimatedWaitTime,
      mobilityPriority,
      mobilityStatus: "driver_en_route",
      driverNavigation: {
        etaMinutes: optimizedRoute.etaMinutes,
        pickupPoint: resolvedPickupPoint,
        dropPoint: resolvedDropPoint,
        currentStep: routeSteps[1],
        routeSteps
      },
      optimizedRoute,
      passengerTracking: buildPassengerTracking(now),
      baseFare: Number(baseFare) || calculatedBaseFare,
      serviceFee: Number(serviceFee) || calculatedServiceFee,
      totalAmount: Number(totalAmount) || calculatedTotal,
      paymentMethod: safePaymentMethod,
      paymentStatus,
      transactionId
    });

    try {
      await createNotification(req, {
        userId: req.user.id,
        bookingId: booking._id,
        title: "Driver assigned",
        message: `${booking.assignedDriver} is assigned with ${booking.assignedVehicle}. ETA ${booking.driverNavigation.etaMinutes} min via ${booking.optimizedRoute.routeSummary}.`,
        type: "driver"
      });
    } catch (notificationError) {
      console.warn("Notification delivery failed:", notificationError.message);
    }

    broadcastMobilityUpdate(req, booking);

   res.status(201).json({
  message: "Booking Successful",
  booking
});

} catch (error) {

  console.error("Booking Error:", error);

  res.status(500).json({
    error: error.message
  });

} finally {

  console.log("Booking process completed for request:", req.body);

}
};

