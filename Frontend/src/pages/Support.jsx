import React from "react";
import { Bot, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import Chatbot from "../components/Chatbot";
import supportPulse from "../assets/support-pulse.svg";

const Support = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[7%] top-24 h-44 w-44 rounded-full bg-blue-500/12 blur-3xl"></div>
        <div className="absolute right-[8%] top-36 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <section className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
            Support Center
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Help should feel immediate, not buried behind a long queue.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
            The support space combines AI responses with a calmer visual rhythm so
            passengers can ask, scan, and act without extra friction.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "Quick answers", icon: <MessageSquareText className="h-5 w-5 text-blue-300" /> },
              { title: "Safe guidance", icon: <ShieldCheck className="h-5 w-5 text-emerald-300" /> },
              { title: "Always available", icon: <Sparkles className="h-5 w-5 text-cyan-300" /> }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                <div className="mb-3 inline-flex rounded-xl bg-slate-800/80 p-3">{item.icon}</div>
                <p className="text-sm font-medium text-slate-200">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-cyan-500/10 blur-2xl"></div>
          <img
            src={supportPulse}
            alt="Support assistant interface illustration"
            className="relative w-full rounded-[32px] border border-slate-700/70 shadow-2xl shadow-slate-950/50 animate-[hoverPulse_7s_ease-in-out_infinite]"
          />
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/75 p-6 shadow-xl shadow-slate-950/30">
            <div className="mb-4 inline-flex rounded-2xl bg-slate-800/80 p-3 text-blue-300">
              <Bot className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold">AI Assistant</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Ask about services, station support, booking flow, or general help.
              The chatbot stays embedded in the page so users do not lose context.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
            <Chatbot />
          </div>
        </div>
      </section>

      <style>{`
        @keyframes hoverPulse {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.01); }
        }
      `}</style>
    </div>
  );
};

export default Support;
