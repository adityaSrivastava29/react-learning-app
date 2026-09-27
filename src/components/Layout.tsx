import React, { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import SearchBar from "./SearchBar";

interface NavGroup {
  label: string;
  items: {
    path: string;
    label: string;
    description: string;
    icon: string;
    badge?: string;
  }[];
}

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Top Flagship Direct Links for Desktop
  const primaryLinks = [
    { path: "/virtual-list", label: "Virtual Lists", icon: "🪟", badge: "HOT" },
    { path: "/machine-coding", label: "Machine Coding", icon: "💻", badge: "20+" },
    { path: "/optimization", label: "Optimization", icon: "🚀" },
    { path: "/rbac", label: "RBAC & Auth", icon: "🛡️" },
  ];

  // Grouped Modules for Dropdowns & Mobile
  const navGroups: NavGroup[] = [
    {
      label: "Architecture & Data",
      items: [
        {
          path: "/virtual-list",
          label: "Virtual & Paginated Lists",
          description: "Windowing 100k items at 60 FPS & cursor pagination",
          icon: "🪟",
          badge: "New",
        },
        {
          path: "/optimization",
          label: "Optimization Techniques",
          description: "Colocation, React.memo, useTransition & profiler",
          icon: "🚀",
        },
        {
          path: "/rtk-query",
          label: "RTK Query Mastery",
          description: "Automated caching, polling & tag invalidation",
          icon: "⚡",
        },
        {
          path: "/rbac",
          label: "RBAC & Protected Routes",
          description: "Role-based auth, HttpOnly cookies & mutex queue",
          icon: "🛡️",
        },
      ],
    },
    {
      label: "Practice & Interview",
      items: [
        {
          path: "/machine-coding",
          label: "Machine Coding Suite",
          description: "20+ Easy and Medium frontend interview problems",
          icon: "💻",
          badge: "20+",
        },
        {
          path: "/tricky-questions",
          label: "Tricky React Questions",
          description: "Stale closures, batching, and re-render gotchas",
          icon: "🎯",
        },
        {
          path: "/hooks",
          label: "Interactive Hooks Lab",
          description: "useState, useEffect, useMemo, useCallback & useRef",
          icon: "⚓",
        },
      ],
    },
    {
      label: "Basics & Showcase",
      items: [
        {
          path: "/todos",
          label: "Todo List App",
          description: "Side effects, references, and nested route layouts",
          icon: "📝",
        },
        {
          path: "/counter",
          label: "Counter Module",
          description: "Basic hooks, useReducer and step calculation",
          icon: "🔢",
        },
        {
          path: "/theme",
          label: "Theme Switcher",
          description: "Dynamic context and CSS class manipulation",
          icon: "🎨",
        },
        {
          path: "/profile/1",
          label: "User Profile Viewer",
          description: "Dynamic route params and async loading",
          icon: "👤",
        },
        {
          path: "/settings",
          label: "App Settings",
          description: "Redux toolkit global preferences store",
          icon: "⚙️",
        },
        {
          path: "/about",
          label: "About & Docs",
          description: "Architecture breakdown and project details",
          icon: "ℹ️",
        },
        {
          path: "/github",
          label: "GitHub Stats",
          description: "Repository insights and activity metrics",
          icon: "🐙",
        },
      ],
    },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => isLinkActive(item.path));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}>
      {/* HEADER / NAVBAR */}
      <header
        ref={navRef}
        className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md ${
          theme === "dark"
            ? "bg-slate-900/85 border-slate-800/80 shadow-xs shadow-black/20"
            : "bg-white/85 border-slate-200/80 shadow-xs shadow-slate-200/40"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* BRAND LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2.5 font-extrabold tracking-tight group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all">
                ⚛️
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400 bg-clip-text text-transparent">
                  ReactLab
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-normal -mt-0.5">
                  Pro Learning App
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION (XL and up) */}
            <nav className="hidden xl:flex items-center gap-1">
              {/* Primary Direct Links */}
              {primaryLinks.map((item) => {
                const active = isLinkActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                      active
                        ? "bg-blue-600 text-white shadow-xs shadow-blue-500/30"
                        : theme === "dark"
                        ? "text-slate-300 hover:text-white hover:bg-slate-800"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400 border border-blue-500/20"
                        }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Grouped Dropdown Menus */}
              {navGroups.map((group) => {
                const isOpen = openDropdown === group.label;
                const active = isGroupActive(group);
                return (
                  <div key={group.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                      onMouseEnter={() => setOpenDropdown(group.label)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1 ${
                        active && !isOpen
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40"
                          : isOpen
                          ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400"
                          : theme === "dark"
                          ? "text-slate-300 hover:text-white hover:bg-slate-800"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}>
                      <span>{group.label}</span>
                      <span className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div
                        onMouseLeave={() => setOpenDropdown(null)}
                        className={`absolute left-0 mt-2 w-80 rounded-2xl border shadow-2xl p-2 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 ${
                          theme === "dark"
                            ? "bg-slate-900/95 border-slate-700/80 shadow-black/60 divide-slate-800"
                            : "bg-white/95 border-slate-200 shadow-slate-300/50 divide-slate-100"
                        }`}>
                        <div className="space-y-1">
                          {group.items.map((item) => {
                            const itemActive = isLinkActive(item.path);
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                  itemActive
                                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                                    : theme === "dark"
                                    ? "hover:bg-slate-800 text-slate-200"
                                    : "hover:bg-slate-50 text-slate-800"
                                }`}>
                                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="font-semibold text-xs sm:text-sm truncate">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 shrink-0">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* RIGHT SIDE TOOLS: SEARCH, THEME TOGGLE, MOBILE BUTTONS */}
            <div className="flex items-center gap-2">
              {/* Desktop Search Bar (Hidden below lg) */}
              <div className="hidden lg:block w-48 xl:w-60">
                <SearchBar />
              </div>

              {/* Mobile Search Button (below lg) */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className={`lg:hidden p-2 rounded-xl border transition-colors ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                aria-label="Open search">
                🔍
              </button>

              {/* Theme Switcher Toggle */}
              <button
                onClick={toggleTheme}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-amber-400 hover:text-amber-300"
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-indigo-600 hover:text-indigo-700"
                }`}>
                <span className="text-base leading-none">
                  {theme === "light" ? "🌙" : "☀️"}
                </span>
              </button>

              {/* Hamburger Button (below xl) */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={`xl:hidden p-2 rounded-xl border transition-colors ${
                  theme === "dark"
                    ? "border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                    : "border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}>
                <span className="text-base leading-none font-bold">
                  {mobileMenuOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER (Below XL) */}
        {mobileMenuOpen && (
          <div
            className={`xl:hidden border-t max-h-[82vh] overflow-y-auto px-4 py-4 space-y-5 transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-800"
            }`}>
            {/* Mobile Search Input */}
            <div className="w-full">
              <SearchBar onClose={() => setMobileMenuOpen(false)} />
            </div>

            {/* Categorized Mobile Navigation */}
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  {group.label}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {group.items.map((item) => {
                    const active = isLinkActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                          active
                            ? "bg-blue-600 text-white font-semibold"
                            : theme === "dark"
                            ? "hover:bg-slate-800 text-slate-200"
                            : "hover:bg-slate-100 text-slate-800"
                        }`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base shrink-0">{item.icon}</span>
                          <span className="text-xs sm:text-sm font-medium truncate">
                            {item.label}
                          </span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              active
                                ? "bg-white/20 text-white"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quick Actions Footer in Mobile Drawer */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs opacity-70">Theme</span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2">
                <span>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE SEARCH OVERLAY DIALOG */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setMobileSearchOpen(false)}
          aria-modal="true"
          role="dialog">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-4 transition-colors ${
              theme === "dark" ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm">Quick Search</span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs opacity-75 hover:opacity-100">
                ✕
              </button>
            </div>
            <div className="pt-3">
              <SearchBar autoFocus onClose={() => setMobileSearchOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default Layout;
