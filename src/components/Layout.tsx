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

  // Top Flagship Direct Links for Desktop (Bold, Highlighted, Zero-Wrap)
  const primaryLinks = [
    { path: "/virtual-list", label: "Virtual Lists", icon: "🪟", badge: "HOT" },
    { path: "/machine-coding", label: "Machine Coding", icon: "💻", badge: "20+" },
    { path: "/optimization", label: "Optimization", icon: "🚀" },
    { path: "/rbac", label: "RBAC & Auth", icon: "🛡️" },
  ];

  // Grouped Modules for Dropdowns & Mobile
  const navGroups: NavGroup[] = [
    {
      label: "Advanced Labs",
      items: [
        {
          path: "/virtual-list",
          label: "Virtual & Paginated Lists",
          description: "100k items at 60 FPS & cursor pagination",
          icon: "🪟",
          badge: "HOT",
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
      label: "Apps & Basics",
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
      {/* HEADER / NAVBAR: Soft Medium-Dark Slate (bg-slate-800) in Light Mode, Deep Slate (bg-slate-950) in Dark Mode */}
      <header
        ref={navRef}
        className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b backdrop-blur-md text-white shadow-md ${
          theme === "dark"
            ? "bg-slate-950/95 border-slate-800 shadow-black/30"
            : "bg-slate-800/98 border-slate-700/80 shadow-slate-900/15"
        }`}>
        
        {/* TOP GLOW ACCENT STRIPE */}
        <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-cyan-400" />

        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-17 gap-3 sm:gap-6">
            
            {/* BRAND LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3 font-extrabold tracking-tight group shrink-0 select-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-indigo-600 to-cyan-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/30 group-hover:scale-105 group-hover:shadow-blue-500/50 transition-all">
                ⚛️
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-black tracking-tight leading-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  ReactLab
                </span>
                <span className="text-[10px] text-slate-300/80 font-semibold tracking-wider uppercase -mt-0.5">
                  Pro Learning App
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION (XL and up) */}
            <nav className="hidden xl:flex items-center gap-1.5 flex-1 justify-center min-w-0">
              {/* Primary Direct Links */}
              {primaryLinks.map((item) => {
                const active = isLinkActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap shrink-0 transition-all flex items-center gap-2 ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/35 ring-1 ring-blue-400/50"
                        : "text-slate-200 hover:text-white hover:bg-slate-700/70"
                    }`}>
                    <span className="text-sm">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                          item.badge === "HOT"
                            ? active
                              ? "bg-white text-blue-700"
                              : "bg-rose-500/25 text-rose-200 border border-rose-400/40"
                            : active
                            ? "bg-white text-indigo-700"
                            : "bg-indigo-500/25 text-indigo-200 border border-indigo-400/40"
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
                  <div key={group.label} className="relative shrink-0">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : group.label)}
                      onMouseEnter={() => setOpenDropdown(group.label)}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        active && !isOpen
                          ? "bg-blue-900/60 text-blue-300 border border-blue-700/60"
                          : isOpen
                          ? "bg-slate-700 text-blue-300 shadow-inner"
                          : "text-slate-200 hover:text-white hover:bg-slate-700/70"
                      }`}>
                      <span>{group.label}</span>
                      <span className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-300" : "opacity-60"}`}>
                        ▼
                      </span>
                    </button>

                    {/* Dropdown Menu Container */}
                    {isOpen && (
                      <div
                        onMouseLeave={() => setOpenDropdown(null)}
                        className={`absolute left-0 mt-2.5 rounded-2xl border p-2.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 shadow-2xl ${
                          theme === "dark"
                            ? "border-slate-700/80 bg-slate-900/98 shadow-black/80"
                            : "border-slate-600/80 bg-slate-800/98 shadow-slate-900/40"
                        } ${group.label === "Advanced Labs" ? "w-[420px]" : "w-[360px]"}`}>
                        <div className="px-3 py-1.5 border-b border-slate-700/80 mb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
                            {group.label} Catalog
                          </span>
                          <span className="text-[10px] text-blue-400 font-mono">
                            {group.items.length} Modules
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto">
                          {group.items.map((item) => {
                            const itemActive = isLinkActive(item.path);
                            return (
                              <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setOpenDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                  itemActive
                                    ? "bg-blue-600/25 text-blue-300 border border-blue-500/40"
                                    : "hover:bg-slate-700/80 text-slate-200 hover:text-white"
                                }`}>
                                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="font-bold text-xs sm:text-sm truncate">
                                      {item.label}
                                    </span>
                                    {item.badge && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-extrabold bg-blue-500/25 text-blue-300 border border-blue-400/40 shrink-0">
                                        {item.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-300/80 line-clamp-1 mt-0.5">
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

            {/* RIGHT SIDE TOOLS: SEARCH BAR, THEME TOGGLE, MOBILE BUTTONS */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Desktop Search Bar (Hidden below lg) */}
              <div className="hidden lg:block w-48 xl:w-64">
                <SearchBar />
              </div>

              {/* Mobile Search Button (below lg) */}
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-600/80 bg-slate-700/80 hover:bg-slate-600 text-slate-200 transition-colors"
                aria-label="Open search">
                🔍
              </button>

              {/* Theme Switcher Toggle (Soft Medium-Dark Button) */}
              <button
                onClick={toggleTheme}
                title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-600/80 bg-slate-700/80 hover:bg-slate-600 text-amber-400 transition-all shadow-xs flex items-center justify-center">
                <span className="text-base sm:text-lg leading-none">
                  {theme === "light" ? "🌙" : "☀️"}
                </span>
              </button>

              {/* Hamburger Button (below xl) */}
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="xl:hidden p-2 sm:p-2.5 rounded-xl border border-slate-600/80 bg-slate-700/80 hover:bg-slate-600 text-white transition-colors"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}>
                <span className="text-lg leading-none font-bold">
                  {mobileMenuOpen ? "✕" : "☰"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER (Below XL) */}
        {mobileMenuOpen && (
          <div className={`xl:hidden border-t max-h-[82vh] overflow-y-auto px-4 py-5 space-y-5 text-white shadow-2xl ${
            theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-800 border-slate-700"
          }`}>
            {/* Mobile Search Input */}
            <div className="w-full">
              <SearchBar onClose={() => setMobileMenuOpen(false)} />
            </div>

            {/* Categorized Mobile Navigation */}
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 px-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>{group.label}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {group.items.map((item) => {
                    const active = isLinkActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                          active
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/30"
                            : "hover:bg-slate-700/80 bg-slate-700/40 text-slate-200 border border-slate-600/60"
                        }`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-lg shrink-0">{item.icon}</span>
                          <span className="text-xs sm:text-sm font-bold truncate">
                            {item.label}
                          </span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                              active
                                ? "bg-white text-blue-700"
                                : "bg-blue-500/20 text-blue-300 border border-blue-400/40"
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
            <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Current Theme:</span>
              <button
                onClick={toggleTheme}
                className="px-3.5 py-2 rounded-xl bg-slate-700 border border-slate-600 text-xs font-bold text-amber-400 flex items-center gap-2 hover:bg-slate-600 transition-colors">
                <span>{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE SEARCH OVERLAY DIALOG */}
      {mobileSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 px-4"
          onClick={() => setMobileSearchOpen(false)}
          aria-modal="true"
          role="dialog">
          <div
            className={`w-full max-w-lg rounded-2xl border shadow-2xl p-4 ${
              theme === "dark" ? "border-slate-700 bg-slate-900 text-white" : "border-slate-600 bg-slate-800 text-white"
            }`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <span className="font-bold text-sm text-slate-200">Quick Search</span>
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 hover:text-white hover:bg-slate-600 transition-colors">
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
