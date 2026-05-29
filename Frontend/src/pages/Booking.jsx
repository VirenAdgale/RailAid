import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  IndianRupee,
  Luggage,
  MapPin,
  Navigation,
  RadioTower,
  ShieldCheck,
  Ship,
  Smartphone,
  TrainFront,
  WalletCards
} from "lucide-react";

import "./Booking.css";
import { BOOKING_API_URL } from "../config/api";
import { clearSession, getStoredToken, getStoredUser } from "../utils/auth";

const paymentOptions = [
  { value: "upi", label: "UPI", icon: Smartphone, hint: "Instant confirmation" },
  { value: "card", label: "Card", icon: CreditCard, hint: "Debit or credit card" },
  { value: "cash", label: "Pay at Station", icon: WalletCards, hint: "Confirm now, pay later" }
];

const Booking = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    passengerName: "",
    source: "",
    destination: "",
    journeyDate: "",
    arrivalMode: "train",
    arrivalCode: "",
    arrivalTime: "",
    pickupPoint: "",
    dropPoint: "",
    seats: "",
    passenger_type: "",
    luggage_weight: "",
    number_of_bags: "",
    platform_change: 0,
    urgency_level: 0,
    paymentMethod: "upi",
    payerName: "",
    paymentContact: ""
  });

  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUser = getStoredUser();

  const fare = useMemo(() => {
    const seats = Math.max(Number(form.seats) || 1, 1);
    const luggage = Math.max(Number(form.luggage_weight) || 0, 0);
    const bags = Math.max(Number(form.number_of_bags) || 0, 0);

    const baseFare = seats * 149 + luggage * 8 + bags * 25;

    const assistanceFee =
      form.passenger_type === "senior" ||
      form.passenger_type === "differently_abled"
        ? 40
        : 0;

    const platformFee = Number(form.platform_change) ? 60 : 0;
    const urgentFee = Number(form.urgency_level) ? 90 : 0;

    const serviceFee = assistanceFee + platformFee + urgentFee;

    return {
      baseFare,
      serviceFee,
      totalAmount: baseFare + serviceFee
    };
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    }));
  };

  const handlePaymentSelect = (paymentMethod) => {
    setForm((current) => ({
      ...current,
      paymentMethod
    }));
  };

  const handleArrivalModeSelect = (arrivalMode) => {
    setForm((current) => ({
      ...current,
      arrivalMode
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const token = getStoredToken();

      if (!token) {
        alert("Please log in before creating a booking.");
        navigate("/login");
        return;
      }

      const res = await axios.post(
        BOOKING_API_URL,
        {
          ...form,
          seats: Number(form.seats),
          luggage_weight: Number(form.luggage_weight),
          number_of_bags: Number(form.number_of_bags),
          baseFare: fare.baseFare,
          serviceFee: fare.serviceFee,
          totalAmount: fare.totalAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      
setTimeout(() => {
  setResult(res.data.booking);
}, 3000);

    } catch (error) {
      const message =
        error.response?.status === 401
          ? "Your session is invalid or expired. Please log in again."
          : error.response?.data?.message ||
            error.response?.data?.error ||
            "Booking failed.";

      if (error.response?.status === 401) {
        clearSession();
        navigate("/login");
      }

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-page">
      <section className="booking-shell">
        <div className="booking-hero">
          <span className="booking-eyebrow">
            RailAid assistance booking
          </span>

          <h1>
            Book station help and settle payment in one simple flow.
          </h1>

          <p>
            Choose the journey details, review the fare, and confirm through
            UPI, card, or pay at station.
          </p>

          <div className="booking-trust">
            <span>
              <ShieldCheck size={17} /> Verified staff
            </span>

            <span>
              <BadgeCheck size={17} /> Transparent fare
            </span>

            <span>
              <CalendarDays size={17} /> Same-day support
            </span>
          </div>
        </div>

        <form className="booking-layout" onSubmit={handleSubmit}>
          <div className="booking-panel">
            <div className="panel-heading">
              <Luggage className="h-5 w-5" />

              <div>
                <h2>Passenger Details</h2>

                {currentUser && (
                  <p>
                    Booking for {currentUser.name} ({currentUser.email})
                  </p>
                )}
              </div>
            </div>

            <div className="booking-grid">
              <input
                className="input"
                type="text"
                name="passengerName"
                placeholder="Passenger name"
                value={form.passengerName}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="source"
                placeholder="Source station"
                value={form.source}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="destination"
                placeholder="Destination station"
                value={form.destination}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="date"
                name="journeyDate"
                value={form.journeyDate}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="datetime-local"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="number"
                name="seats"
                placeholder="Passengers"
                min="1"
                value={form.seats}
                onChange={handleChange}
                required
              />

              <select
                className="input"
                name="passenger_type"
                value={form.passenger_type}
                onChange={handleChange}
                required
              >
                <option value="">Passenger type</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior citizen</option>
                <option value="differently_abled">
                  Differently abled
                </option>
              </select>

              <input
                className="input"
                type="number"
                name="luggage_weight"
                placeholder="Luggage weight (kg)"
                min="0"
                value={form.luggage_weight}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="number"
                name="number_of_bags"
                placeholder="Number of bags"
                min="0"
                value={form.number_of_bags}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="arrivalCode"
                placeholder="Train or ferry number"
                value={form.arrivalCode}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="pickupPoint"
                placeholder="Pickup point at station"
                value={form.pickupPoint}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="text"
                name="dropPoint"
                placeholder="Drop point or gate"
                value={form.dropPoint}
                onChange={handleChange}
                required
              />
            </div>

            <div className="arrival-mode">
              <button
                className={form.arrivalMode === "train" ? "selected" : ""}
                type="button"
                onClick={() => handleArrivalModeSelect("train")}
              >
                <TrainFront size={18} />
                Train arrival
              </button>

              <button
                className={form.arrivalMode === "ferry" ? "selected" : ""}
                type="button"
                onClick={() => handleArrivalModeSelect("ferry")}
              >
                <Ship size={18} />
                Ferry arrival
              </button>
            </div>

            <div className="service-toggles">
              <label>
                <input
                  type="checkbox"
                  name="platform_change"
                  checked={Boolean(form.platform_change)}
                  onChange={handleChange}
                />
                Platform change support
              </label>

              <label>
                <input
                  type="checkbox"
                  name="urgency_level"
                  checked={Boolean(form.urgency_level)}
                  onChange={handleChange}
                />
                Urgent travel
              </label>
            </div>
          </div>

          <aside className="payment-panel">
            <div className="panel-heading">
              <IndianRupee className="h-5 w-5" />

              <div>
                <h2>Payment</h2>
                <p>No gateway setup needed for demo use.</p>
              </div>
            </div>

            <div className="fare-card">
              <div>
                <span>Base fare</span>
                <strong>INR {fare.baseFare}</strong>
              </div>

              <div>
                <span>Service fee</span>
                <strong>INR {fare.serviceFee}</strong>
              </div>

              <div className="total-row">
                <span>Total payable</span>
                <strong>INR {fare.totalAmount}</strong>
              </div>
            </div>

            <div className="payment-options">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = form.paymentMethod === option.value;

                return (
                  <button
                    key={option.value}
                    className={`payment-option ${
                      isSelected ? "selected" : ""
                    }`}
                    type="button"
                    onClick={() => handlePaymentSelect(option.value)}
                  >
                    <Icon size={19} />

                    <span>
                      <strong>{option.label}</strong>
                      <small>{option.hint}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="payment-inputs">
              <input
                className="input"
                type="text"
                name="payerName"
                placeholder="Payer name"
                value={form.payerName}
                onChange={handleChange}
                required
              />

              <input
                className="input"
                type="tel"
                name="paymentContact"
                placeholder="UPI ID, phone, or card contact"
                value={form.paymentContact}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Confirming..."
                : `Confirm Booking - INR ${fare.totalAmount}`}
            </button>
          </aside>
        </form>

        {result && (
          <div className="result-card">
            <div>
              <BadgeCheck className="h-6 w-6 text-emerald-300" />
              <h3>Realtime Assignment Confirmed</h3>
            </div>

            <p>
              <strong>Service:</strong> {result.serviceType}
            </p>

            <p>
              <strong>Arrival:</strong>{" "}
              <RadioTower size={15} />{" "}
              {result.arrivalMode?.toUpperCase()}{" "}
              {result.arrivalCode} - {result.arrivalStatus}
            </p>

            <p>
              <strong>Route:</strong>{" "}
              <MapPin size={15} /> {result.source} to {result.destination}
            </p>

            <p>
              <strong>Vehicle:</strong>{" "}
              {result.assignedVehicle || "Vehicle pending"}
            </p>

            <p>
              <strong>Driver:</strong>{" "}
              {result.assignedDriver || "Not assigned yet"}
            </p>

            <p>
              <strong>Wait Time:</strong> {result.estimatedWaitTime}
            </p>

            <p>
              <strong>Navigation:</strong>{" "}
              <Navigation size={15} />{" "}
              {result.driverNavigation?.currentStep}
            </p>

            <p>
              <strong>Optimized Route:</strong>{" "}
              {result.optimizedRoute?.routeSummary || "Route pending"}
            </p>

            <p>
              <strong>Total Assist Time:</strong>{" "}
              {result.optimizedRoute?.totalMinutes ||
                result.driverNavigation?.etaMinutes}{" "}
              min
            </p>

            <p>
              <strong>Tracking:</strong>{" "}
              <Clock3 size={15} />{" "}
              {result.mobilityStatus?.replaceAll("_", " ")}
            </p>

            <p>
              <strong>Payment:</strong>{" "}
              {result.paymentStatus} via{" "}
              {result.paymentMethod?.toUpperCase()} - INR{" "}
              {result.totalAmount}
            </p>

            <p>
              <strong>Transaction:</strong>{" "}
              {result.transactionId}
            </p>

            <div className="tracking-steps">
              {(result.passengerTracking || []).map((step) => (
                <span key={step.label} className={step.status}>
                  {step.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Booking;