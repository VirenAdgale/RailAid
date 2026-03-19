import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Driver = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Register driver when page loads
    socket.emit("registerDriver", "driver123");

    // Listen for new bookings
    socket.on("newBooking", (data) => {
      setBookings((prev) => [...prev, data]);
    });

    return () => {
      socket.off("newBooking");
    };
  }, []);

  const handleAccept = (index) => {
    alert("Booking Accepted ✅");
    removeBooking(index);
  };

  const handleReject = (index) => {
    alert("Booking Rejected ❌");
    removeBooking(index);
  };

  const removeBooking = (index) => {
    const updated = [...bookings];
    updated.splice(index, 1);
    setBookings(updated);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Driver Dashboard 🚢</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet...</p>
        ) : (
          bookings.map((booking, index) => (
            <div key={index} style={styles.bookingCard}>
              <h3>New Ferry Booking</h3>
              <p><strong>Name:</strong> {booking.passengerName}</p>
              <p><strong>From:</strong> {booking.source}</p>
              <p><strong>To:</strong> {booking.destination}</p>
              <p><strong>Date:</strong> {booking.journeyDate}</p>
              <p><strong>Seats:</strong> {booking.seats}</p>

              <div style={styles.buttonGroup}>
                <button
                  style={styles.acceptBtn}
                  onClick={() => handleAccept(index)}
                >
                  Accept
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => handleReject(index)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #000000, #0f2027, #1f4e79)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    background: "#111",
    padding: "30px",
    borderRadius: "12px",
    width: "450px",
    color: "white",
    boxShadow: "0 0 20px rgba(0,0,255,0.4)"
  },
  bookingCard: {
    background: "#1c1c1c",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px solid #2a2a2a"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  acceptBtn: {
    background: "#00c853",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  },
  rejectBtn: {
    background: "#d50000",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
  }
};

export default Driver;
