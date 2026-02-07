import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { NotificationDropdown } from "./NotificationDropdown.jsx";

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
    ? "bg-primary-600 text-white shadow-sm"
    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const Layout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow">
                EN
              </span>
              <span className="font-bold text-xl text-slate-900 group-hover:text-primary-600 transition-colors">
                EventNest
              </span>
            </Link>
            <nav className="flex items-center gap-2 flex-wrap">
              <NavLink to="/" className={navLinkClass} end>
                Home
              </NavLink>
              <NavLink to="/events" className={navLinkClass}>
                Events
              </NavLink>
              {user && (
                <NavLink to="/bookings" className={navLinkClass}>
                  My Bookings
                </NavLink>
              )}
              {isAdmin && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </nav>
            <div className="flex items-center gap-3 flex-shrink-0">
              {user ? (
                <>
                  <NotificationDropdown />
                  <span className="hidden sm:inline text-sm text-slate-600">
                    Hi, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium rounded-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center bg-slate-100 rounded-lg p-1 gap-1">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
                        ? "bg-white text-primary-600 shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${isActive
                        ? "bg-white text-primary-600 shadow-md"
                        : "text-slate-600 hover:text-slate-900"
                      }`
                    }
                  >
                    Sign up
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
      </main>
      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-500 flex justify-between items-center">
          <span>© {new Date().getFullYear()} EventNest. All rights reserved.</span>
          <span className="text-xs">Built with MERN & Stripe</span>
        </div>
      </footer>
    </div>
  );
};