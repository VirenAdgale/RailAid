import React, { useState } from "react";
import axios from "axios";
import "./Booking.css";

const Booking = () => {

  const [form, setForm] = useState({
    passengerName: "",
    source: "",
    destination: "",
    journeyDate: "",
    seats: "",
    passenger_type: "",
    luggage_weight: "",
    number_of_bags: "",
    platform_change: 0,
    urgency_level: 0
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://10.169.75.44:5000/api/bookings",
        {
          ...form,
          seats: Number(form.seats),
          luggage_weight: Number(form.luggage_weight),
          number_of_bags: Number(form.number_of_bags)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setResult(res.data.booking);

    } catch (error) {
      console.error(error);
      alert("Booking failed!");
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">

        <h2 className="title">Ferry Booking</h2>

        <form onSubmit={handleSubmit}>

          <div className="grid">

            <input className="input" type="text" name="passengerName" placeholder="Passenger Name" onChange={handleChange} required />
            <input className="input" type="text" name="source" placeholder="Source" onChange={handleChange} required />

            <input className="input" type="text" name="destination" placeholder="Destination" onChange={handleChange} required />
            <input className="input" type="date" name="journeyDate" onChange={handleChange} required />

            <input className="input" type="number" name="seats" placeholder="Seats" onChange={handleChange} required />

            <select className="input" name="passenger_type" onChange={handleChange} required>
              <option value="">Passenger Type</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
              <option value="differently_abled">Differently Abled</option>
            </select>

            <input className="input" type="number" name="luggage_weight" placeholder="Luggage Weight (kg)" onChange={handleChange} required />
            <input className="input" type="number" name="number_of_bags" placeholder="Number of Bags" onChange={handleChange} required />

          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="platform_change" onChange={handleChange} />
              Platform Change
            </label>

            <label>
              <input type="checkbox" name="urgency_level" onChange={handleChange} />
              Urgent Travel
            </label>
          </div>

          <button className="btn" type="submit">Book Ferry</button>

        </form>

        {result && (
          <div className="result-card">
            <h3>Booking Confirmed 🎉</h3>
            <p><strong>Service:</strong> {result.serviceType}</p>
            <p><strong>Driver:</strong> {result.assignedDriver || "N/A"}</p>
            <p><strong>Wait Time:</strong> {result.estimatedWaitTime}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;