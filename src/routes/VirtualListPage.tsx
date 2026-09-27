import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { VirtualListDemo } from "../features/lists/VirtualListDemo";
import { PaginatedListDemo } from "../features/lists/PaginatedListDemo";
import { VirtualVsPaginationGuide } from "../features/lists/VirtualVsPaginationGuide";

export const VirtualListPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<"virtual" | "paginated" | "guide">("virtual");

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
        theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HERO BANNER */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border shadow-sm relative overflow-hidden transition-colors duration-200 ${
            theme === "dark"
              ? "bg-slate-800/80 border-slate-700/80 bg-gradient-to-r from-slate-800 via-slate-800/90 to-blue-950/40"
              : "bg-white border-slate-200/80 bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/40"
          }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center gap-1.5">
                  🚀 High-Performance Data Rendering
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Interactive Demos & Deep Dive
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Virtual List & Paginated List Suite
              </h1>
              <p className={`text-base sm:text-lg ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                Experience rendering 100,000+ items with zero lag using DOM Windowing, test Client vs Server Pagination with realistic dummy data, and master the architecture through clean, annotated code.
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                className={`px-4 py-3 rounded-xl border text-center ${
                  theme === "dark" ? "bg-slate-900/60 border-slate-700" : "bg-slate-100/80 border-slate-200"
                }`}>
                <div className="text-2xl font-bold text-blue-500">100k+</div>
                <div className="text-xs text-slate-400 font-medium">Virtual Items</div>
              </div>
              <div
                className={`px-4 py-3 rounded-xl border text-center ${
                  theme === "dark" ? "bg-slate-900/60 border-slate-700" : "bg-slate-100/80 border-slate-200"
                }`}>
                <div className="text-2xl font-bold text-emerald-500">60 FPS</div>
                <div className="text-xs text-slate-400 font-medium">Smooth Scroll</div>
              </div>
              <div
                className={`px-4 py-3 rounded-xl border text-center ${
                  theme === "dark" ? "bg-slate-900/60 border-slate-700" : "bg-slate-100/80 border-slate-200"
                }`}>
                <div className="text-2xl font-bold text-purple-500">3 Modes</div>
                <div className="text-xs text-slate-400 font-medium">Client / Server / Cursor</div>
              </div>
            </div>
          </div>

          {/* MAIN NAVIGATION TABS */}
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 overflow-x-auto">
            <button
              onClick={() => setActiveTab("virtual")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "virtual"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : theme === "dark"
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}>
              <span>🪟</span>
              <span>1. Virtual List (Windowing Demo)</span>
            </button>

            <button
              onClick={() => setActiveTab("paginated")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "paginated"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : theme === "dark"
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}>
              <span>📑</span>
              <span>2. Paginated List (Client / Server / Cursor)</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === "guide"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                  : theme === "dark"
                  ? "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}>
              <span>💡</span>
              <span>3. Learn Through Code & Interview Prep</span>
            </button>
          </div>
        </div>

        {/* ACTIVE TAB CONTENT */}
        <div className="transition-opacity duration-200">
          {activeTab === "virtual" && <VirtualListDemo />}
          {activeTab === "paginated" && <PaginatedListDemo />}
          {activeTab === "guide" && <VirtualVsPaginationGuide />}
        </div>
      </div>
    </div>
  );
};

export default VirtualListPage;
