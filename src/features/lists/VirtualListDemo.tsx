import React, { useState, useRef, useMemo } from "react";
import { useVirtualizer } from "./useVirtualizer";
import { generateMockItem, type MockListItem } from "./mockData";
import { useTheme } from "../../hooks/useTheme";

export const VirtualListDemo: React.FC = () => {
  const { theme } = useTheme();
  const scrollElementRef = useRef<HTMLDivElement | null>(null);

  // Configuration State
  const [totalCount, setTotalCount] = useState<number>(10000);
  const [itemHeight, setItemHeight] = useState<number>(76);
  const [overscan, setOverscan] = useState<number>(4);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isVirtualized, setIsVirtualized] = useState<boolean>(true);
  const [jumpIndexInput, setJumpIndexInput] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<MockListItem | null>(null);
  const [unvirtualizedWarning, setUnvirtualizedWarning] = useState<string>("");

  // Virtualizer hook
  const {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    renderedCount,
    scrollTop,
    containerHeight,
    scrollToIndex,
    topPadding,
    bottomPadding,
  } = useVirtualizer({
    count: totalCount,
    itemHeight,
    overscan,
    scrollElementRef,
  });

  // Calculate memory / DOM node efficiency
  const domReductionPercent = totalCount > 0 
    ? (((totalCount - renderedCount) / totalCount) * 100).toFixed(2)
    : "0";

  // Generate or retrieve item on demand
  const getItem = useMemo(() => {
    return (index: number) => generateMockItem(index);
  }, []);

  // Quick jump handler
  const handleJump = (targetIndex: number) => {
    scrollToIndex(targetIndex, "smooth");
  };

  const handleCustomJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idx = parseInt(jumpIndexInput, 10);
    if (!isNaN(idx) && idx >= 0 && idx < totalCount) {
      handleJump(idx);
    }
  };

  // Toggle virtualization with safety guard
  const handleToggleVirtualized = (val: boolean) => {
    if (!val && totalCount > 1500) {
      setUnvirtualizedWarning(
        `Rendering ${totalCount.toLocaleString()} raw DOM nodes will severely freeze the browser! Reduced to 1,000 items for safety.`
      );
      setTotalCount(1000);
    } else {
      setUnvirtualizedWarning("");
    }
    setIsVirtualized(val);
  };

  return (
    <div className="space-y-6">
      {/* DEMO HEADER */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          theme === "dark"
            ? "bg-slate-800/80 border-slate-700/80"
            : "bg-white border-slate-200"
        }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                ⚡ Windowing Engine
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Zero External Dependencies
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">
              React Virtualized List (DOM Windowing)
            </h2>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Render <strong>100,000+ items</strong> at a buttery-smooth 60 FPS by recycling only the DOM elements visible in the viewport.
            </p>
          </div>

          {/* Quick Dataset Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium opacity-70">Dataset Size:</span>
            {[1000, 10000, 50000, 100000].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setTotalCount(size);
                  if (!isVirtualized && size > 1500) {
                    setIsVirtualized(true);
                    setUnvirtualizedWarning("");
                  }
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  totalCount === size
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : theme === "dark"
                    ? "bg-slate-700/70 hover:bg-slate-700 text-slate-200"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}>
                {size.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-5 border-t ${
            theme === "dark" ? "border-slate-700/60" : "border-slate-100"
          }`}>
          {/* Virtualized vs Standard DOM Toggle */}
          <div>
            <label className="text-xs font-medium block mb-1.5 opacity-80">
              Rendering Strategy:
            </label>
            <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600 p-0.5">
              <button
                onClick={() => handleToggleVirtualized(true)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isVirtualized
                    ? "bg-blue-600 text-white font-semibold"
                    : "opacity-70 hover:opacity-100"
                }`}>
                🪟 Virtualized
              </button>
              <button
                onClick={() => handleToggleVirtualized(false)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !isVirtualized
                    ? "bg-rose-600 text-white font-semibold"
                    : "opacity-70 hover:opacity-100"
                }`}>
                🧱 Standard DOM
              </button>
            </div>
          </div>

          {/* Row Height Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium opacity-80">Row Height:</label>
              <span className="text-xs font-mono font-bold text-blue-500">{itemHeight}px</span>
            </div>
            <input
              type="range"
              min={60}
              max={110}
              value={itemHeight}
              onChange={(e) => setItemHeight(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Overscan Buffer Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium opacity-80">Overscan Buffer:</label>
              <span className="text-xs font-mono font-bold text-emerald-500">+{overscan} items</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={overscan}
              disabled={!isVirtualized}
              onChange={(e) => setOverscan(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer disabled:opacity-30"
            />
          </div>

          {/* Quick Jump Input */}
          <div>
            <label className="text-xs font-medium block mb-1.5 opacity-80">
              Jump to Item #:
            </label>
            <form onSubmit={handleCustomJumpSubmit} className="flex gap-2">
              <input
                type="number"
                min={0}
                max={totalCount - 1}
                placeholder={`0 - ${(totalCount - 1).toLocaleString()}`}
                value={jumpIndexInput}
                onChange={(e) => setJumpIndexInput(e.target.value)}
                className={`w-full px-2.5 py-1 text-xs rounded border transition-colors ${
                  theme === "dark"
                    ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
                }`}
              />
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors whitespace-nowrap">
                Go
              </button>
            </form>
          </div>
        </div>

        {/* Quick jump anchor buttons */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs">
          <span className="opacity-60 text-[11px] mr-1">Quick Jump:</span>
          <button
            onClick={() => handleJump(0)}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition-opacity">
            Top (0%)
          </button>
          <button
            onClick={() => handleJump(Math.floor(totalCount * 0.25))}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition-opacity">
            25%
          </button>
          <button
            onClick={() => handleJump(Math.floor(totalCount * 0.5))}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition-opacity">
            50%
          </button>
          <button
            onClick={() => handleJump(Math.floor(totalCount * 0.75))}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition-opacity">
            75%
          </button>
          <button
            onClick={() => handleJump(totalCount - 1)}
            className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 transition-opacity">
            Bottom (100%)
          </button>
        </div>

        {/* Warning if unvirtualized */}
        {unvirtualizedWarning && (
          <div className="mt-3 p-3 text-xs rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <span>⚠️</span>
            <span>{unvirtualizedWarning}</span>
          </div>
        )}
      </div>

      {/* REAL-TIME DIAGNOSTIC HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">Dataset Total</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-blue-500">
            {totalCount.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Total elements</div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">DOM Nodes Mounted</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-500">
            {isVirtualized ? renderedCount : totalCount}
          </div>
          <div className="text-[10px] text-slate-400">
            {isVirtualized ? "Recycled window" : "Heavy standard tree"}
          </div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">DOM Reduction</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-purple-500">
            {isVirtualized ? `${domReductionPercent}%` : "0%"}
          </div>
          <div className="text-[10px] text-slate-400">Memory saved</div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">Visible Window</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-500">
            {isVirtualized && countValid(totalCount)
              ? `[${startIndex}..${endIndex}]`
              : "All"}
          </div>
          <div className="text-[10px] text-slate-400">Active index slice</div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">Scroll Top</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-indigo-500">
            {Math.round(scrollTop).toLocaleString()}px
          </div>
          <div className="text-[10px] text-slate-400">Container scroll</div>
        </div>

        <div
          className={`p-3 rounded-xl border text-center ${
            theme === "dark" ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200"
          }`}>
          <div className="text-xs text-slate-400 font-medium">Virtual Canvas</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-500">
            {(totalHeight / 1000).toFixed(1)}k px
          </div>
          <div className="text-[10px] text-slate-400">Total phantom height</div>
        </div>
      </div>

      {/* VISUAL ARCHITECTURE SCHEMATIC */}
      <div
        className={`p-4 rounded-xl border text-xs ${
          theme === "dark"
            ? "bg-slate-900/60 border-slate-700/80 text-slate-300"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
        <div className="flex items-center justify-between font-semibold mb-2">
          <span className="flex items-center gap-1.5 text-blue-500">
            <span>📐</span> Viewport Window Architecture (Phantom Spacers)
          </span>
          <span className="font-mono text-[11px] opacity-70">
            Total Height: {totalHeight.toLocaleString()}px
          </span>
        </div>

        <div className="space-y-1 font-mono text-[11px]">
          {/* Top spacer bar */}
          <div
            className="p-1.5 rounded bg-slate-300/40 dark:bg-slate-800 border border-dashed border-slate-400 dark:border-slate-600 flex justify-between items-center"
            style={{ minHeight: "26px" }}>
            <span className="text-slate-500 dark:text-slate-400">
              ⬆️ Top Phantom Spacer (paddingTop)
            </span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {topPadding.toLocaleString()}px ({startIndex} items before)
            </span>
          </div>

          {/* Active viewport bar */}
          <div className="p-2.5 rounded bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/40 flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold shadow-inner">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Mounted Viewport Window [{startIndex} .. {endIndex}]
            </span>
            <span>
              {renderedCount} DOM Nodes (Height: ~{renderedCount * itemHeight}px)
            </span>
          </div>

          {/* Bottom spacer bar */}
          <div
            className="p-1.5 rounded bg-slate-300/40 dark:bg-slate-800 border border-dashed border-slate-400 dark:border-slate-600 flex justify-between items-center"
            style={{ minHeight: "26px" }}>
            <span className="text-slate-500 dark:text-slate-400">
              ⬇️ Bottom Phantom Spacer (paddingBottom)
            </span>
            <span className="font-bold text-slate-600 dark:text-slate-300">
              {bottomPadding.toLocaleString()}px ({Math.max(0, totalCount - endIndex - 1)} items after)
            </span>
          </div>
        </div>
      </div>

      {/* VIRTUAL SCROLL CONTAINER */}
      <div
        className={`rounded-2xl border shadow-inner overflow-hidden relative ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-slate-100 border-slate-300"
        }`}>
        {/* Container Header */}
        <div
          className={`px-4 py-2.5 border-b flex items-center justify-between text-xs ${
            theme === "dark"
              ? "bg-slate-800/90 border-slate-700 text-slate-300"
              : "bg-slate-200/80 border-slate-300 text-slate-700"
          }`}>
          <div className="flex items-center gap-2 font-medium">
            <span>📜 Scroll Viewport</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold">
              Height: 480px
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] opacity-80">
            <span>Scroll with mouse wheel or trackpad</span>
          </div>
        </div>

        {/* Scrollable Box */}
        <div
          ref={scrollElementRef}
          className="h-[480px] overflow-y-auto relative outline-none select-none"
          tabIndex={0}
          style={{ willChange: "transform" }}>
          {isVirtualized ? (
            /* Virtualized Rendering with Phantom Spacers */
            <div
              style={{
                height: `${totalHeight}px`,
                position: "relative",
                width: "100%",
              }}>
              <div
                style={{
                  transform: `translateY(${topPadding}px)`,
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                }}>
                {virtualItems.map((virtualItem) => {
                  const item = getItem(virtualItem.index);
                  return (
                    <VirtualRowCard
                      key={virtualItem.index}
                      item={item}
                      height={virtualItem.height}
                      index={virtualItem.index}
                      theme={theme}
                      onSelect={() => setSelectedItem(item)}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            /* Unvirtualized (Standard DOM) Rendering */
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {Array.from({ length: totalCount }).map((_, idx) => {
                const item = getItem(idx);
                return (
                  <VirtualRowCard
                    key={idx}
                    item={item}
                    height={itemHeight}
                    index={idx}
                    theme={theme}
                    onSelect={() => setSelectedItem(item)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* QUICK DETAIL MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setSelectedItem(null)}>
          <div
            className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
              theme === "dark" ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedItem.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-md`}>
                  {selectedItem.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedItem.name}</h3>
                  <p className="text-xs opacity-75">{selectedItem.role}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:opacity-80">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <span className="opacity-70 block">Record ID</span>
                <span className="font-bold font-mono">#{selectedItem.id}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <span className="opacity-70 block">Department</span>
                <span className="font-bold">{selectedItem.department}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <span className="opacity-70 block">Performance Score</span>
                <span className="font-bold text-emerald-500">{selectedItem.performanceScore} / 100</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <span className="opacity-70 block">Tasks Completed</span>
                <span className="font-bold text-blue-500">{selectedItem.tasksCompleted} tasks</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 col-span-2">
                <span className="opacity-70 block">Email Address</span>
                <span className="font-mono">{selectedItem.email}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 col-span-2">
                <span className="opacity-70 block">Location</span>
                <span>{selectedItem.location}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Row Card Component
interface VirtualRowCardProps {
  item: MockListItem;
  height: number;
  index: number;
  theme: string;
  onSelect: () => void;
}

const VirtualRowCard: React.FC<VirtualRowCardProps> = React.memo(
  ({ item, height, index, theme, onSelect }) => {
    return (
      <div
        style={{ height: `${height}px` }}
        onClick={onSelect}
        className={`px-4 flex items-center justify-between border-b cursor-pointer transition-colors group ${
          theme === "dark"
            ? "border-slate-800/80 hover:bg-slate-800/50 text-slate-100"
            : "border-slate-200/80 hover:bg-white text-slate-800"
        }`}>
        {/* Left: Avatar & Name & Role */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs sm:text-sm truncate">
                {item.name}
              </span>
              <span className="text-[10px] font-mono opacity-50">#{item.id}</span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  item.status === "Active"
                    ? "bg-emerald-500"
                    : item.status === "Away"
                    ? "bg-amber-500"
                    : item.status === "Busy"
                    ? "bg-rose-500"
                    : "bg-slate-400"
                }`}
                title={`Status: ${item.status}`}
              />
            </div>
            <div className="flex items-center gap-2 text-[11px] opacity-75 truncate">
              <span className="truncate">{item.role}</span>
              <span>•</span>
              <span className="font-medium text-blue-500">{item.department}</span>
            </div>
          </div>
        </div>

        {/* Right: Performance Score & Metric */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <div className="text-xs font-semibold flex items-center gap-1">
              <span className="text-emerald-500">★</span>
              <span>{item.performanceScore}%</span>
            </div>
            <span className="text-[10px] opacity-60">
              {item.tasksCompleted} tasks
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors opacity-80 group-hover:opacity-100 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200"
                : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
            }`}>
            View
          </button>
        </div>
      </div>
    );
  }
);

function countValid(c: number): boolean {
  return c > 0;
}
