import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Shield, Zap, Heart, Users, UserCheck } from 'lucide-react';
import StationAvailabilityCheck from '../components/StationAvailabilityCheck';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import StationCheck from './StationCheck';

const Home = () => {
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
  const [stationCheck, setStationCheck] = useState(true);
  const imageGallery = [
    "/images/luggage1.jpg",
    "/images/wheelchair1.jpg",
    "/images/train1.jpg",
    "/images/helpdesk.jpg",
    "/images/staff.jpg",
    "/images/service.jpg",
  ];   

  const reviews = [
    {
      name: "Ravi Kumar",
      text: "RailAid made my journey stress-free. The luggage pickup was on time, and the support staff were kind.",
    },
    {
      name: "Meera Joshi",
      text: "Very helpful app! My mother used the wheelchair service easily without confusion.",
    },
    {
      name: "Anil Patel",
      text: "Best app for senior citizens! Simple UI and amazing support.",
    },
  ];

  return (
    <>
    {stationCheck ? (<StationCheck setStationCheck={setStationCheck}/>) :
    (
      <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-gray-900 to-slate-800 text-gray-100">
     
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 py-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to <span className="text-blue-400">RailAid</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
          Your station partner that simplifies railway journeys — from luggage
          booking to wheelchair assistance, everything at your fingertips.
        </p>
        <div className='pt-7'>
          <StationAvailabilityCheck/>
        </div>
        
        <div className="mt-8 flex gap-4 flex-wrap justify-center">

  <button
    onClick={() => navigate("/login")}
    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium shadow-md"
  >
    Login
  </button>

  <button
    className="px-6 py-3 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-600/10 transition-all duration-200 font-medium"
  >
    Explore Services
  </button>

</div>

      </section>


      {/* Why Choose RailAid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-10">
          Why Choose RailAid?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Verified Drivers */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <UserCheck className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-blue-400">
                Verified Drivers
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              All our service providers are background-checked and trained to assist you professionally and safely.
            </p>
          </div>

          {/* Easy Access */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-600/20 rounded-lg">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-green-400">
                Easy to Access
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Large buttons and simple interface make booking services quick and hassle-free for everyone.
            </p>
          </div>

          {/* Friendly Support */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Heart className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-purple-400">
                Friendly Drivers
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Our drivers are courteous and ready to help with luggage, wheelchairs, and platform guidance.
            </p>
          </div>

          {/* Low & Fair Pricing */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <Shield className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-yellow-400">
                Low & Fair Pricing
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Affordable electric ferry services and assistance with transparent pricing — no hidden charges.
            </p>
          </div>

          {/* For People with Disabilities */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path strokeWidth="2" d="M12 8v4m0 4h.01"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-400">
                For People with Disabilities
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Dedicated wheelchair assistance and accessibility support for a comfortable and independent journey.
            </p>
          </div>

          {/* For Seniors */}
          <div className="bg-slate-800/60 rounded-xl border border-slate-700 shadow-lg p-6 hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-600/20 rounded-lg">
                <Users className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-orange-400">
                For Seniors
              </h3>
            </div>
            <p className="text-gray-300 text-sm">
              Safe and quick station access with extra care for elderly passengers who need support during travel.
            </p>
          </div>

        </div>
      </section>

      {/* Auto-Sliding Image Gallery */}
      <section className="max-w-full px-6 py-12 overflow-hidden">
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-8">
          Our Services in Action
        </h2>
        
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className={`flex gap-4 ${isPaused ? '' : 'animate-slide'}`}>
            {[...imageGallery, ...imageGallery, ...imageGallery].map((src, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-48 h-48 rounded-lg overflow-hidden shadow-lg bg-slate-700"
              >
                <img
                  src={src}
                  alt={`Service ${(idx % imageGallery.length) + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500 text-sm">Image ' + ((idx % imageGallery.length) + 1) + '</div>';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-4">
          Touch or hover to pause
        </p>
      </section>

      {/* About / What We Provide */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">
          What We Provide
        </h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto leading-relaxed mb-10">
          RailAid is an AI-powered railway support system designed to help
          passengers travel smoothly. Whether it's elderly assistance,
          luggage booking, or platform navigation — we ensure everyone travels
          safely, efficiently, and affordably.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            "Instant  Booking",
            "Affordable Service Pricing",
            "Trained Ground Staff",
            "24/7 Customer Support",
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-slate-800/60 p-5 rounded-lg border border-slate-700 hover:bg-slate-800/80 transition-all duration-200 text-center"
            >
              <p className="font-medium text-gray-200">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-slate-800/50 border-t border-slate-700 py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-8">
          What Our Passengers Say
        </h2>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-slate-900/70 p-6 rounded-lg shadow-md border border-slate-700 hover:bg-slate-800/80 transition-all duration-200"
            >
              <p className="text-gray-300 italic mb-3">"{review.text}"</p>
              <p className="text-sm text-blue-400 font-semibold">
                — {review.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-192px * 6 - 16px * 6));
          }
        }
        .animate-slide {
          animation: slide 25s linear infinite;
        }
      `}</style>
    </div>
    </>
    )}
    
    </>

    
  );
};

export default Home;