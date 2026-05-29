import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { STAFF_DASHBOARD_API_URL, STAFF_MOBILITY_STREAM_URL } from "../config/api";
import { clearSession, getStoredToken, getStoredUser, hasRole } from "../utils/auth";

const statCards = [
  { key: "totalBookings", label: "Total Bookings" },
  { key: "urgentBookings", label: "Urgent Requests" },
  { key: "assistanceBookings", label: "Assistance Matches" }
];

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [streamStatus, setStreamStatus] = useState("Connecting");
  const storedUser = getStoredUser();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = getStoredToken();
        const { data } = await axios.get(STAFF_DASHBOARD_API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDashboard(data);
      } catch (requestError) {
        const status = requestError.response?.status;
        const message =
          requestError.response?.data?.message ||
          requestError.response?.data?.error ||
          "Unable to load the staff dashboard.";

        setError(message);

        if (status === 401 || status === 403) {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const token = getStoredToken();

    if (!token || !hasRole("staff")) {
      return undefined;
    }

    const streamUrl = `${STAFF_MOBILITY_STREAM_URL}?token=${encodeURIComponent(token)}`;
    const source = new EventSource(streamUrl);

    source.onopen = () => {
      setStreamStatus("Live");
    };

    source.onerror = () => {
      setStreamStatus("Reconnecting");
    };

    source.addEventListener("mobilitySnapshot", (event) => {
      const bookings = JSON.parse(event.data);

      setDashboard((current) =>
        current
          ? {
              ...current,
              recentBookings: bookings
            }
          : current
      );
    });

    source.addEventListener("mobilityUpdate", (event) => {
      const booking = JSON.parse(event.data);

      setDashboard((current) => {
        if (!current) {
          return current;
        }

        const existingBookings = current.recentBookings || [];
        const alreadyExists = existingBookings.some(
          (item) => (item._id || item.id) === booking.id
        );
        const recentBookings = [
          booking,
          ...existingBookings.filter((item) => (item._id || item.id) !== booking.id)
        ].slice(0, 8);

        return {
          ...current,
          stats: alreadyExists
            ? current.stats
            : {
                ...current.stats,
                totalBookings: current.stats.totalBookings + 1,
                urgentBookings:
                  booking.mobilityPriority === "critical"
                    ? current.stats.urgentBookings + 1
                    : current.stats.urgentBookings,
                assistanceBookings:
                  booking.passenger_type === "senior" ||
                  booking.passenger_type === "differently_abled"
                    ? current.stats.assistanceBookings + 1
                    : current.stats.assistanceBookings
              },
          recentBookings
        };
      });
    });

    return () => {
      source.close();
    };
  }, []);

  if (!hasRole("staff")) {
    return <Navigate to="/staff-login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-200">
        Loading staff dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-xl rounded-3xl border border-rose-500/20 bg-rose-500/10 p-8 text-center text-white">
          <h1 className="text-2xl font-semibold">Dashboard unavailable</h1>
          <p className="mt-3 text-slate-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.1),_transparent_25%),linear-gradient(180deg,_#020617,_#0f172a)] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
                Staff Command Center
              </p>
              <h1 className="mt-3 text-4xl font-bold">
                Welcome back, {dashboard?.staff?.name || storedUser?.name}
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Monitor active passenger assistance demand, recent bookings, and
                station-level workload from one place.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-sm text-slate-100">
              <div>{dashboard.staff.department}</div>
              <div className="mt-1 text-slate-300">
                {dashboard.staff.station} - {dashboard.staff.employeeId}
              </div>
              <div className="mt-2 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                Mobility stream: {streamStatus}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
              >
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-cyan-300">
                  {dashboard.stats[card.key]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Recent Assistance Queue</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Live train/ferry arrivals, senior requests, vehicle assignment,
                  driver navigation, and passenger tracking.
                </p>
              </div>
              <div className="text-sm text-slate-300">
                Account status: {dashboard.stats.activeStaffStatus}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead>
                  <tr className="text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Passenger</th>
                    <th className="pb-3 pr-4 font-medium">Arrival</th>
                    <th className="pb-3 pr-4 font-medium">Route</th>
                    <th className="pb-3 pr-4 font-medium">Vehicle</th>
                    <th className="pb-3 pr-4 font-medium">Driver Nav</th>
                    <th className="pb-3 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dashboard.recentBookings.map((booking) => (
                    <tr key={booking._id || booking.id} className="text-slate-200">
                      <td className="py-4 pr-4">{booking.passengerName}</td>
                      <td className="py-4 pr-4">
                        <div className="font-medium">
                          {booking.arrivalMode?.toUpperCase()} {booking.arrivalCode || "Pending"}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {booking.arrivalTime
                            ? new Date(booking.arrivalTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : new Date(booking.journeyDate).toLocaleDateString()}{" "}
                          - {booking.arrivalStatus || "scheduled"}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div>{booking.pickupPoint || booking.source}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          to {booking.dropPoint || booking.destination}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div>{booking.assignedVehicle || "Pending"}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          {booking.assignedDriver || "Driver pending"}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div>{booking.driverNavigation?.currentStep || booking.serviceType}</div>
                        <div className="mt-1 text-xs text-cyan-200">
                          ETA{" "}
                          {booking.driverNavigation?.etaMinutes
                            ? `${booking.driverNavigation.etaMinutes} min`
                            : booking.estimatedWaitTime || "Pending"}
                        </div>
                        {booking.optimizedRoute?.routeSummary && (
                          <div className="mt-1 max-w-xs text-xs text-slate-400">
                            {booking.optimizedRoute.routeSummary}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            booking.mobilityPriority === "critical" || booking.urgency_level > 0
                              ? "bg-amber-400/20 text-amber-200"
                              : booking.mobilityPriority === "priority"
                                ? "bg-cyan-400/20 text-cyan-200"
                              : "bg-emerald-400/20 text-emerald-200"
                          }`}
                        >
                          {booking.mobilityPriority || (booking.urgency_level > 0 ? "critical" : "standard")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {dashboard.recentBookings.length === 0 && (
                <p className="py-8 text-center text-slate-400">
                  No bookings have been created yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
