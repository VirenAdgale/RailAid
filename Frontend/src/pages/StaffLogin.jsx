import React, { useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { STAFF_LOGIN_API_URL, STAFF_REGISTER_API_URL } from "../config/api";
import { hasRole, setSession } from "../utils/auth";

const StaffLogin = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    station: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const updater = mode === "login" ? setLoginForm : setRegisterForm;
    updater((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await axios.post(STAFF_REGISTER_API_URL, registerForm);
      }

      const credentials =
        mode === "login"
          ? loginForm
          : { email: registerForm.email, password: registerForm.password };

      const { data } = await axios.post(STAFF_LOGIN_API_URL, credentials);
      setSession({
        token: data.token,
        user: data.staff
      });
      navigate("/staff-dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Staff ${mode} failed.`;
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRole("staff")) {
    return <Navigate to="/staff-dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-4 py-10 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-16 h-72 w-72 rounded-full bg-cyan-500/15 blur-[120px]"></div>
        <div className="absolute bottom-8 right-[-5%] h-80 w-80 rounded-full bg-emerald-500/10 blur-[140px]"></div>
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div className="max-w-md">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
              RailAid Operations
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Staff access for live passenger assistance workflows.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Sign in to review incoming bookings, urgent assistance requests,
              and the latest ferry support activity from one workspace.
            </p>

            <div className="mt-8 space-y-4 text-sm text-slate-200">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                Secure JWT-based authentication for active staff accounts.
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                Staff dashboard includes booking stats and recent assistance queue.
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="mx-auto max-w-md">
            <h2 className="text-3xl font-semibold">Staff Login</h2>
            <p className="mt-3 text-sm text-slate-400">
              Use your RailAid staff email and password to continue, or create a
              new staff account.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-white/10 bg-slate-900/70 p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "login" ? "bg-cyan-500 text-slate-950" : "text-slate-300"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`rounded-full px-4 py-2 transition ${
                  mode === "register"
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-300"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
              {mode === "register" && (
                <>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    Full Name
                    <input
                      type="text"
                      name="name"
                      value={registerForm.name}
                      onChange={handleChange}
                      placeholder="Staff member name"
                      required
                      className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    Employee ID
                    <input
                      type="text"
                      name="employeeId"
                      value={registerForm.employeeId}
                      onChange={handleChange}
                      placeholder="RAIL-1024"
                      required
                      className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>
                </>
              )}

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                Staff Email
                <input
                  type="email"
                  name="email"
                  value={mode === "login" ? loginForm.email : registerForm.email}
                  onChange={handleChange}
                  placeholder="staff@railaid.com"
                  required
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-300">
                Password
                <input
                  type="password"
                  name="password"
                  value={
                    mode === "login" ? loginForm.password : registerForm.password
                  }
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>

              {mode === "register" && (
                <>
                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    Department
                    <input
                      type="text"
                      name="department"
                      value={registerForm.department}
                      onChange={handleChange}
                      placeholder="Passenger Assistance"
                      className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-slate-300">
                    Station
                    <input
                      type="text"
                      name="station"
                      value={registerForm.station}
                      onChange={handleChange}
                      placeholder="Central Station"
                      className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                    />
                  </label>
                </>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? mode === "login"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "login"
                    ? "Open Staff Dashboard"
                    : "Create Staff Account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-slate-400">
              Need passenger access instead?{" "}
              <Link to="/login" className="text-cyan-300 hover:text-cyan-200">
                Go to user login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
