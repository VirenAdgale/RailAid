import React from "react";
import { Bot, Clock3, MoveRight, Shield, Sparkles, UsersRound } from "lucide-react";
import bookingMotion from "../assets/booking-motion.svg";

const focusAreas = [
  {
    title: "Manual booking delays",
    body: "RailAid reduces repetitive steps so passengers can request help quickly during active journeys.",
    icon: <Clock3 className="h-5 w-5 text-blue-300" />
  },
  {
    title: "Accessibility support gaps",
    body: "The product is designed around assisted mobility, visible service information, and simpler flows.",
    icon: <UsersRound className="h-5 w-5 text-cyan-300" />
  },
  {
    title: "Unclear assistance status",
    body: "The interface makes support requests feel trackable instead of disappearing after form submission.",
    icon: <Shield className="h-5 w-5 text-emerald-300" />
  }
];

const About = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-24 h-40 w-40 rounded-full bg-blue-600/12 blur-3xl"></div>
        <div className="absolute right-[10%] top-48 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <section className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 rounded-[32px] bg-blue-500/10 blur-2xl"></div>
          <img
            src={bookingMotion}
            alt="Illustration of RailAid booking flow"
            className="relative w-full rounded-[32px] border border-slate-700/70 shadow-2xl shadow-slate-950/40 animate-[drift_8s_ease-in-out_infinite]"
          />
        </div>

        <div className="order-1 space-y-6 lg:order-2">
          <span className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
            Why RailAid Exists
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            A calmer assistance layer for passengers moving through busy stations.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
            RailAid was built to remove the friction between needing help and actually
            getting it. The system combines booking, AI guidance, and clearer service
            coordination in one consistent interface.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-3 inline-flex rounded-xl bg-slate-800/80 p-3 text-blue-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Better first-run clarity</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                The flow is designed so users understand the next step immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-3 inline-flex rounded-xl bg-slate-800/80 p-3 text-cyan-300">
                <Bot className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">AI-backed support</h2>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Guidance and service suggestions stay accessible even under travel stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {focusAreas.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-slate-950/30"
              style={{ animation: `rise 700ms ease ${index * 140}ms both` }}
            >
              <div className="mb-4 inline-flex rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[32px] border border-slate-800 bg-slate-900/70 p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold">What the system is aiming to improve</h3>
              <p className="mt-3 max-w-3xl text-slate-300">
                Faster bookings, more visible support, and a more trustworthy experience
                for luggage, wheelchair, and passenger-assistance services.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm text-blue-200">
              Platform support
              <MoveRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default About;
