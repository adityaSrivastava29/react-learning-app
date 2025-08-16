import React from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import SearchBar from "./SearchBar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: "/react-learning-app", label: "Home" },
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
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/react-learning-app"
            className="text-white text-xl font-bold">
            React Learning App
          </Link>

          <SearchBar />

          <div className="flex items-center space-x-4">
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
        </div>
      </nav>

      <main className="container mx-auto p-6">{children}</main>
    </div>
  );
};

export default Layout;
