import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Register Logic Here");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-black via-slate-900 to-blue-950 text-white overflow-hidden">

      {/* Blue Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-blue-600/20 blur-[150px] rounded-full"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 w-[400px]">

        <h2 className="text-3xl font-bold text-center mb-6">
          <span className="text-blue-500">Create</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            className="mt-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default Register;
