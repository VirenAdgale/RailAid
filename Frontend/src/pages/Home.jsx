import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Shield, UserCheck, Users, Zap } from "lucide-react";
import StationAvailabilityCheck from "../components/StationAvailabilityCheck";

const Home = () => {
  const navigate = useNavigate();

  const reviews = [
    {
      name: "Ravi Kumar",
      text: "RailAid made my journey stress-free. The luggage pickup was on time, and the support staff were kind."
    },
    {
      name: "Meera Joshi",
      text: "Very helpful app. My mother used the wheelchair service easily without confusion."
    },
    {
      name: "Anil Patel",
      text: "Best app for senior citizens. Simple UI and reliable support."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 text-gray-100">
      <section className="flex flex-col items-center px-6 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          Welcome to <span className="text-blue-400">RailAid</span>
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-gray-300">
          Your station partner for luggage support, assisted mobility, and
          faster on-ground help without the usual confusion.
        </p>

        <div className="pt-7">
          <StationAvailabilityCheck />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate("/booking")}
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-600"
          >
            Book Assistance
          </button>

          <button
            onClick={() => navigate("/services")}
            className="rounded-lg border border-blue-500 px-6 py-3 font-medium text-blue-400 transition-all duration-200 hover:bg-blue-600/10"
          >
            Explore Services
          </button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-10 text-center text-3xl font-bold text-blue-400">
          Why Choose RailAid?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <UserCheck className="h-6 w-6 text-blue-400" />,
              title: "Verified Drivers",
              accent: "bg-blue-600/20",
              body: "All service providers are background-checked and trained to assist safely."
            },
            {
              icon: <Zap className="h-6 w-6 text-green-400" />,
              title: "Easy to Access",
              accent: "bg-green-600/20",
              body: "Large controls and clear flows make booking quick for every passenger."
            },
            {
              icon: <Heart className="h-6 w-6 text-pink-400" />,
              title: "Friendly Support",
              accent: "bg-pink-600/20",
              body: "Drivers and support staff are trained for courteous, practical help."
            },
            {
              icon: <Shield className="h-6 w-6 text-yellow-400" />,
              title: "Fair Pricing",
              accent: "bg-yellow-600/20",
              body: "Transparent assistance and ferry pricing with no hidden surprises."
            },
            {
              icon: <Users className="h-6 w-6 text-orange-400" />,
              title: "Accessible by Design",
              accent: "bg-orange-600/20",
              body: "Built to support seniors, disabled passengers, and families carrying luggage."
            },
            {
              icon: <UserCheck className="h-6 w-6 text-cyan-400" />,
              title: "Real-Time Coordination",
              accent: "bg-cyan-600/20",
              body: "Bookings can be routed to staff and drivers without manual handoff."
            }
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 shadow-lg transition-all duration-300 hover:bg-slate-800/80"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className={`rounded-lg p-2 ${card.accent}`}>
                  {card.icon}
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {card.title}
                </h3>
              </div>

              <p className="text-sm text-gray-300">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-400">
          What We Provide
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-center leading-relaxed text-gray-300">
          RailAid is designed to reduce friction inside busy stations. Whether you
          need luggage handling, wheelchair assistance, or help reaching the right
          platform, the system keeps the journey simple.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Instant Booking",
            "Transparent Pricing",
            "Trained Ground Staff",
            "Responsive Customer Support"
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-lg border border-slate-700 bg-slate-800/60 p-5 text-center transition-all duration-200 hover:bg-slate-800/80"
            >
              <p className="font-medium text-gray-200">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-700 bg-slate-800/50 px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-blue-400">
          What Our Passengers Say
        </h2>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 md:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-lg border border-slate-700 bg-slate-900/70 p-6 shadow-md transition-all duration-200 hover:bg-slate-800/80"
            >
              <p className="mb-3 italic text-gray-300">
                "{review.text}"
              </p>

              <p className="text-sm font-semibold text-blue-400">
                - {review.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;