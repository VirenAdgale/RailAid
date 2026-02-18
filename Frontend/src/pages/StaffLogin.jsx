import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StaffLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Staff Login Logic Here");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white overflow-hidden">

      {/* Blue Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[140px] rounded-full"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 w-[380px]">

        <h2 className="text-3xl font-bold text-center mb-6">
          <span className="text-blue-500">Staff</span> Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="email"
            name="email"
            placeholder="Staff Email"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none transition"
          />

          <button
            type="submit"
            className="mt-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Back to{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Home
          </span>
        </p>

      </div>
    </div>
  );
};

export default StaffLogin;
