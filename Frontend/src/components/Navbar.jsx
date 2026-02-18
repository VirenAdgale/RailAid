import { useState } from "react";
import { Menu, X, Home, Info, ShieldQuestionMark, Settings, BaggageClaim, UserStar, Forklift, Plus, Minus, RotateCcw } from "lucide-react";
import React from "react";
import { useTextSize } from "../context/TextSizeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { textSize, increaseTextSize, decreaseTextSize, resetTextSize } = useTextSize();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    // Passenger Section
    { name: "Book Assistance", path: "/booking", icon: <BaggageClaim size={18} /> },
 
    // Admin/Staff Section
    { name: "Staff Login", path: "/staff-login", icon: <Forklift size={18} /> },
    { name: "Admin Login", path: "/admin-login", icon: <UserStar size={18} /> },

    // Services & Info
    { name: "Our Services", path: "/services", icon: <Settings size={18} /> },
    { name: "About RailAid", path: "/about", icon: <ShieldQuestionMark size={18} /> },
    { name: "Support & Help", path: "/support", icon: <Info size={18} /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <h1 className="text-white text-2xl font-bold tracking-wide">
            RailAid
          </h1>

          {/* Text Size Controls and Menu Button */}
          <div className="flex items-center gap-2">
            {/* Text Size Controls */}
            <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
              <button
                onClick={decreaseTextSize}
                className="text-gray-200 p-1.5 rounded hover:bg-slate-700 transition-all duration-200 focus:outline-none"
                title="Decrease text size"
                disabled={textSize <= 0.8}
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <span className="text-gray-300 text-xs px-2 min-w-[3rem] text-center">
                Text Size
              </span>
              
              <button
                onClick={increaseTextSize}
                className="text-gray-200 p-1.5 rounded hover:bg-slate-700 transition-all duration-200 focus:outline-none"
                title="Increase text size"
                disabled={textSize >= 1.5}
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <button
                onClick={resetTextSize}
                className="text-gray-200 p-1.5 rounded hover:bg-slate-700 transition-all duration-200 focus:outline-none"
                title="Reset text size"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-gray-200 p-2 rounded-lg hover:bg-slate-800 transition-all duration-200 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Sidebar (Reduced Blur & Subtle Colors) */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-slate-900/80 backdrop-blur-[6px] border-l border-slate-700/40 shadow-2xl text-gray-100 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-700/40">
          <h2 className="text-lg font-semibold text-gray-100">Menu</h2>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col mt-4 space-y-2 px-4">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800/70 transition-all duration-200"
              onClick={toggleMenu}
            >
              {link.icon}
              <span className="text-sm tracking-wide">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full text-center text-xs text-gray-500 p-4 border-t border-slate-700/40">
          © 2025 RailAid
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
