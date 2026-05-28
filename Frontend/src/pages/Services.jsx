import React from "react";
import { ArrowRight, Bot, Briefcase, Luggage, ShieldCheck, Timer, Waves } from "lucide-react";
import serviceNetwork from "../assets/service-network.svg";

const services = [
  {
    title: "Luggage Ferry Booking",
    body: "Schedule luggage movement through the station with guided booking and transparent handoff.",
    icon: <Luggage className="h-6 w-6 text-blue-300" />
  },
  {
    title: "Wheelchair Coordination",
    body: "Request mobility support for seniors and disabled passengers with fewer manual steps.",
    icon: <Waves className="h-6 w-6 text-cyan-300" />
  },
  {
    title: "AI Support Assistant",
    body: "Get instant answers for bookings, service availability, and common station questions.",
    icon: <Bot className="h-6 w-6 text-indigo-300" />
  },
  {
    title: "Operational Visibility",
    body: "Track how requests are routed so the service experience stays predictable for users.",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-300" />
  }
];

const metrics = [
  { label: "Assistance windows", value: "24/7" },
  { label: "Booking flow", value: "3 steps" },
  { label: "Dispatch visibility", value: "Live" }
];

const Services = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-24 h-48 w-48 animate-pulse rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute right-[8%] top-40 h-56 w-56 animate-pulse rounded-full bg-cyan-500/10 blur-3xl [animation-delay:1200ms]"></div>
      </div>

      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
            Service Design
          </span>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            Built around the station moments where passengers need help fast.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
            RailAid combines assisted mobility, luggage movement, and support
            guidance into one dark, accessible interface that feels calm under pressure.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/30"
              >
                <div className="text-2xl font-bold text-blue-300">{metric.value}</div>
                <div className="mt-1 text-sm text-slate-400">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-blue-500/10 blur-2xl"></div>
          <img
            src={serviceNetwork}
            alt="RailAid service network illustration"
            className="relative w-full rounded-[32px] border border-slate-700/70 shadow-2xl shadow-slate-950/50 animate-[float_7s_ease-in-out_infinite]"
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="group rounded-[28px] border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-950/40 transition duration-300 hover:-translate-y-2 hover:border-blue-500/40"
              style={{ animation: `fadeUp 700ms ease ${index * 120}ms both` }}
            >
              <div className="mb-4 inline-flex rounded-2xl border border-slate-700 bg-slate-800/70 p-3">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold text-slate-100">{service.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{service.body}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm text-blue-300">
                <Briefcase className="h-4 w-4" />
                Station-ready workflow
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[32px] border border-blue-500/20 bg-gradient-to-r from-blue-900/40 via-slate-900 to-cyan-900/30 p-8 shadow-xl shadow-slate-950/40">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold text-white">Designed for fast decisions, not form fatigue.</h3>
              <p className="mt-3 max-w-3xl text-slate-300">
                Every service page keeps the same theme, same information rhythm, and
                clearer motion cues so users know where to go next.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-white/5 px-5 py-3 text-sm text-blue-200">
              <Timer className="h-4 w-4" />
              Faster first action
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(26px);
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

export default Services;
