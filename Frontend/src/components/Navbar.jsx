import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BaggageClaim,
  Forklift,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Settings,
  ShieldQuestionMark,
  Contrast,
  Accessibility,
  UserPlus,
  UserStar,
  X
} from "lucide-react";
import { useTextSize } from "../context/TextSizeContext";
import { useAccessibility } from "../context/AccessibilityContext";
import NotificationCenter from "./NotificationCenter";
import { clearSession, getStoredUser, isAuthenticated } from "../utils/auth";

const navLinks = [
  { name: "Home", path: "/", icon: <Home size={18} /> },
  { name: "Book Assistance", path: "/booking", icon: <BaggageClaim size={18} /> },
  { name: "Staff Login", path: "/staff-login", icon: <Forklift size={18} /> },
  { name: "Admin Login", path: "/admin-login", icon: <UserStar size={18} /> },
  { name: "Our Services", path: "/services", icon: <Settings size={18} /> },
  { name: "About RailAid", path: "/about", icon: <ShieldQuestionMark size={18} /> },
  { name: "Support & Help", path: "/support", icon: <Info size={18} /> }
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState(getStoredUser());
  const { textSize, increaseTextSize, decreaseTextSize, resetTextSize } = useTextSize();
  const { highContrast, reducedMotion, toggleHighContrast, toggleReducedMotion } =
    useAccessibility();

  useEffect(() => {
    setSessionUser(getStoredUser());
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const syncSession = () => setSessionUser(getStoredUser());
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, []);

  const handleLogout = () => {
    clearSession();
    setSessionUser(null);
    navigate("/");
  };

  const authActions = isAuthenticated()
    ? [{ name: "Logout", action: handleLogout, icon: <LogOut size={18} /> }]
    : [
        { name: "Login", path: "/login", icon: <LogIn size={18} /> },
        { name: "Register", path: "/register", icon: <UserPlus size={18} /> }
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-wide text-white">
          RailAid
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-lg bg-slate-800/60 p-1 sm:flex">
            <button
              onClick={decreaseTextSize}
              className="rounded p-1.5 text-gray-200 transition-all duration-200 hover:bg-slate-700 disabled:opacity-50"
              title="Decrease text size"
              disabled={textSize <= 0.8}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[3rem] px-2 text-center text-xs text-gray-300">
              Text Size
            </span>
            <button
              onClick={increaseTextSize}
              className="rounded p-1.5 text-gray-200 transition-all duration-200 hover:bg-slate-700 disabled:opacity-50"
              title="Increase text size"
              disabled={textSize >= 1.5}
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={resetTextSize}
              className="rounded p-1.5 text-gray-200 transition-all duration-200 hover:bg-slate-700"
              title="Reset text size"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {sessionUser && (
            <span className="hidden rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-sm text-slate-200 md:inline-flex">
              {sessionUser.name} - {sessionUser.role}
            </span>
          )}

          <NotificationCenter />

          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-gray-200 transition-all duration-200 hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div
        className={`fixed right-0 top-0 z-50 h-full w-72 transform border-l border-slate-700/40 bg-slate-900/90 text-gray-100 shadow-2xl backdrop-blur-[6px] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-700/40 p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-100">Menu</h2>
            {sessionUser && (
              <p className="mt-1 text-sm text-slate-400">{sessionUser.email}</p>
            )}
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg p-2 transition-all hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>
        </div>

        <div className="mt-4 flex flex-col space-y-2 px-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm tracking-wide transition-all duration-200 ${
                  isActive ? "bg-slate-800 text-white" : "hover:bg-slate-800/70"
                }`
              }
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}

          <div className="mt-4 border-t border-slate-700/40 pt-4">
            <div className="mb-4 grid gap-2">
              <button
                type="button"
                onClick={toggleHighContrast}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 hover:bg-slate-800/70"
                aria-pressed={highContrast}
              >
                <span className="flex items-center gap-3">
                  <Contrast size={18} />
                  High contrast
                </span>
                <span>{highContrast ? "On" : "Off"}</span>
              </button>

              <button
                type="button"
                onClick={toggleReducedMotion}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 hover:bg-slate-800/70"
                aria-pressed={reducedMotion}
              >
                <span className="flex items-center gap-3">
                  <Accessibility size={18} />
                  Reduce motion
                </span>
                <span>{reducedMotion ? "On" : "Off"}</span>
              </button>
            </div>

            {authActions.map((action) =>
              action.path ? (
                <NavLink
                  key={action.name}
                  to={action.path}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm tracking-wide transition-all duration-200 hover:bg-slate-800/70"
                >
                  {action.icon}
                  <span>{action.name}</span>
                </NavLink>
              ) : (
                <button
                  key={action.name}
                  onClick={action.action}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 hover:bg-slate-800/70"
                >
                  {action.icon}
                  <span>{action.name}</span>
                </button>
              )
            )}
          </div>
        </div>

        <div className="absolute bottom-0 w-full border-t border-slate-700/40 p-4 text-center text-xs text-gray-500">
          Copyright 2026 RailAid
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
