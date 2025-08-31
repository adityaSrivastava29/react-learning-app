import React, { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import SearchBar from "./SearchBar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/counter", label: "Counter" },
    { path: "/todos", label: "Todos" },
    { path: "/theme", label: "Theme" },
    { path: "/profile/1", label: "Profile" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}>
      <nav
        className={`${theme === "dark" ? "bg-gray-800" : "bg-blue-600"} p-4`}>
        <div className="container mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="text-white text-xl font-bold">
            React Learning App
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Desktop search (md and up) */}
            <div className="hidden md:block w-full max-w-xs">
              <SearchBar />
            </div>

            {/* Desktop nav (lg and up) */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded transition-colors ${
                    location.pathname === item.path ||
                    (item.path === "/todos" &&
                      location.pathname.startsWith("/todos"))
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:text-white hover:bg-blue-700"
                  }`}>
                  {item.label}
                </Link>
              ))}
              <button
                onClick={toggleTheme}
                className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>

            {/* Mobile search button (below md) */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Open search">
              🔍
            </button>

            {/* Hamburger button (visible up to lg) */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile/Tablet menu (visible below lg) */}
        {menuOpen && (
          <div
            className={`lg:hidden border-t mt-3 ${
              theme === "dark" ? "border-gray-700" : "border-blue-500"
            }`}>
            <div className="container mx-auto py-3 space-y-3">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded transition-colors ${
                      location.pathname === item.path ||
                      (item.path === "/todos" &&
                        location.pathname.startsWith("/todos"))
                        ? "bg-blue-700 text-white"
                        : "text-blue-100 hover:text-white hover:bg-blue-700"
                    }`}>
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors text-left">
                  {theme === "light" ? "🌙" : "☀️"} Toggle Theme
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setSearchOpen(false)}
          aria-modal="true"
          role="dialog">
          <div
            className="w-full flex justify-center pt-16"
            onClick={(e) => e.stopPropagation()}>
            <div
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } w-[92%] rounded shadow-xl p-3`}>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <SearchBar />
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className={`inline-flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "text-white hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  aria-label="Close search">
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto p-4 sm:p-6">{children}</main>
    </div>
  );
};

export default Layout;
