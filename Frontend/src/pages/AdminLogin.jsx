import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_LOGIN_API_URL } from "../config/api";
import { setSession } from "../utils/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await axios.post(ADMIN_LOGIN_API_URL, form);
      setSession({
        token: data.token,
        user: { ...data.admin, role: "admin" }
      });
      alert("Admin login successful.");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Admin login failed.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]"></div>
      </div>

      <div className="w-[380px] rounded-2xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-center text-3xl font-bold">
          <span className="text-blue-500">Admin</span> Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold shadow-lg shadow-blue-500/30 transition duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
