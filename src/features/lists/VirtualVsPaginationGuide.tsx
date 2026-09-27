import React, { useState } from "react";
import CodeBlock from "../../hooks/CodeBlock";
import { LearningNote } from "../../components/LearningNote";
import { useTheme } from "../../hooks/useTheme";

export const VirtualVsPaginationGuide: React.FC = () => {
  const { theme } = useTheme();
  const [activeCodeTab, setActiveCodeTab] = useState<"virtualizer" | "offset" | "cursor" | "infinite">("virtualizer");

  return (
    <div className="space-y-8">
      {/* HOW TO MAKE A VIRTUALIZER - BLUEPRINT & TUTORIAL */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border transition-colors ${
          theme === "dark" ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200"
        }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            🛠️ Architecture Blueprint
          </span>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Step-by-Step Tutorial
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          How to Build a React Virtualizer from Scratch
        </h2>
        <p className={`text-sm mt-1 mb-6 leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Virtualization (windowing) is one of the most frequently asked React senior frontend interview questions. Here is the complete mental model, mathematical formulas, and step-by-step construction blueprint.
        </p>

        {/* 5 STEPS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              theme === "dark" ? "bg-slate-900/60 border-slate-700/80" : "bg-slate-50 border-slate-200"
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-xs sm:text-sm">The Scroll Container</h4>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Create a viewport container with fixed dimensions (e.g. <code>height: 480px</code>) and <code>overflow-y: auto</code>. This captures the user's scroll gestures.
            </p>
            <div className="p-2 rounded bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono text-blue-500">
              overflow-y: auto; height: 480px;
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              theme === "dark" ? "bg-slate-900/60 border-slate-700/80" : "bg-slate-50 border-slate-200"
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-xs sm:text-sm">The Phantom Canvas</h4>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Render an empty inner element with height set to <code>totalCount * itemHeight</code>. This tricks the browser into rendering the native scrollbar thumb at the exact proportion!
            </p>
            <div className="p-2 rounded bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono text-emerald-500">
              totalHeight = count * itemHeight
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              theme === "dark" ? "bg-slate-900/60 border-slate-700/80" : "bg-slate-50 border-slate-200"
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-xs sm:text-sm">60 FPS Scroll RAF</h4>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Listen to the scroll event, but throttle updates using <code>requestAnimationFrame</code>. This prevents layout thrashing and synchronizes re-renders with the display's refresh rate.
            </p>
            <div className="p-2 rounded bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono text-purple-500">
              rafId = requestAnimationFrame(...)
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              theme === "dark" ? "bg-slate-900/60 border-slate-700/80" : "bg-slate-50 border-slate-200"
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-xs sm:text-sm">Window Math & Overscan</h4>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Calculate which items overlap the visible box using simple division. Add an <code>overscan</code> buffer (+3 to +5 items) to prevent blank flashing during rapid scrolling.
            </p>
            <div className="p-2 rounded bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono text-amber-500">
              start = floor(scrollTop / h) - overscan
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 md:col-span-2 lg:col-span-2 ${
              theme === "dark" ? "bg-slate-900/60 border-slate-700/80" : "bg-slate-50 border-slate-200"
            }`}>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h4 className="font-bold text-xs sm:text-sm">Positioning with Phantom Spacers or translateY</h4>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              Because you only render items <code>[startIndex .. endIndex]</code>, they must be pushed down to their true visual location. Wrap them in a div translated down by <code>startIndex * itemHeight</code> (or use <code>paddingTop</code>).
            </p>
            <div className="p-2 rounded bg-slate-200/50 dark:bg-slate-800 text-[11px] font-mono text-indigo-500">
              transform: translateY(startIndex * itemHeight px)
            </div>
          </div>
        </div>

        {/* MENTAL MODEL DIAGRAM (ASCII / SCHEMATIC) */}
        <div
          className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${
            theme === "dark" ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-300 text-slate-800"
          }`}>
          <div className="text-[11px] font-bold text-blue-500 mb-2">
            📐 Mental Model Diagram: The Virtual Window in Action
          </div>
          <pre className="leading-relaxed select-none text-[11px] sm:text-xs">
{`┌────────────────────────────────────────────────────────┐  ◄── Total Canvas Top (0px)
│                                                        │
│   [Top Phantom Spacer: paddingTop = startIndex * H]    │  (Unrendered items: 0 to startIndex-1)
│                                                        │
├────────────────────────────────────────────────────────┤  ◄── scrollTop: Visible Viewport Starts
│ ░░░░░░░░░░░ [Overscan Buffer: -3 items] ░░░░░░░░░░░░░ │
│ ┌────────────────────────────────────────────────────┐ │
│ │  Item #142 (Mounted DOM Node)                      │ │
│ │  Item #143 (Mounted DOM Node)                      │ │
│ │  Item #144 (Mounted DOM Node)                      │ │  ◄── Only ~10-15 DOM nodes mounted!
│ │  Item #145 (Mounted DOM Node)                      │ │
│ └────────────────────────────────────────────────────┘ │
│ ░░░░░░░░░░░ [Overscan Buffer: +3 items] ░░░░░░░░░░░░░ │
├────────────────────────────────────────────────────────┤  ◄── scrollTop + containerHeight: Viewport Ends
│                                                        │
│   [Bottom Phantom Spacer: paddingBottom = after * H]   │  (Unrendered items: endIndex+1 to Total)
│                                                        │
└────────────────────────────────────────────────────────┘  ◄── Total Height = 100,000 * H (~7.6M px)`}
          </pre>
        </div>
      </div>
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          theme === "dark" ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200"
        }`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
            ⚖️ Architecture Decision Matrix
          </span>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            Frontend & Backend Trade-offs
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">
          When to Choose Virtualization vs Pagination vs Infinite Scroll
        </h2>
        <p className={`text-sm mt-1 mb-6 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          Choosing the wrong list architecture leads to UI freezing, database slowdowns, or bad user experience. Here is the decision matrix:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr
                className={`border-b text-[11px] uppercase tracking-wider ${
                  theme === "dark"
                    ? "bg-slate-900/60 border-slate-700 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}>
                <th className="py-3 px-4 font-bold">Strategy</th>
                <th className="py-3 px-4 font-bold">Best For</th>
                <th className="py-3 px-4 font-bold">DOM Footprint</th>
                <th className="py-3 px-4 font-bold">Deep Linking / URL</th>
                <th className="py-3 px-4 font-bold">Database Impact</th>
                <th className="py-3 px-4 font-bold">Trade-offs & Gotchas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className={theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-50"}>
                <td className="py-3.5 px-4 font-bold text-blue-500">
                  🪟 Virtual List (Windowing)
                </td>
                <td className="py-3.5 px-4">
                  10,000+ items that must exist in a single continuous scrollable view (e.g. log viewers, stock tickers, spreadsheets).
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-500 font-bold">
                  Fixed ~15-25 nodes (Recycled)
                </td>
                <td className="py-3.5 px-4 text-amber-500">
                  Requires scroll position / index restoration
                </td>
                <td className="py-3.5 px-4">
                  Can be client-side cached or paired with chunked streaming
                </td>
                <td className="py-3.5 px-4 opacity-80">
                  Dynamic row heights require ResizeObserver measurement; Native browser Find (Ctrl+F) won't find off-screen items.
                </td>
              </tr>

              <tr className={theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-50"}>
                <td className="py-3.5 px-4 font-bold text-indigo-500">
                  📑 Offset Pagination
                </td>
                <td className="py-3.5 px-4">
                  Admin tables, search engines, catalog stores where users need to jump to arbitrary pages (`?page=7`).
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-500 font-bold">
                  Small (Only page size: 10-50 nodes)
                </td>
                <td className="py-3.5 px-4 text-emerald-500 font-bold">
                  Excellent (Shareable `?page=3`)
                </td>
                <td className="py-3.5 px-4 text-rose-500">
                  Heavy at high offsets (`OFFSET 100000` scans 100,010 rows)
                </td>
                <td className="py-3.5 px-4 opacity-80">
                  Prone to "Pagination Drift" if new records are inserted while user is flipping pages.
                </td>
              </tr>

              <tr className={theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-50"}>
                <td className="py-3.5 px-4 font-bold text-emerald-500">
                  🎯 Cursor Pagination
                </td>
                <td className="py-3.5 px-4">
                  High-velocity social feeds (Twitter/X, Instagram, Slack messages), real-time audit logs.
                </td>
                <td className="py-3.5 px-4 font-mono text-emerald-500 font-bold">
                  Small (Only current batch)
                </td>
                <td className="py-3.5 px-4 opacity-75">
                  Cursor tokens (`?cursor=eyJpZCI6...`)
                </td>
                <td className="py-3.5 px-4 text-emerald-500 font-bold">
                  Instant (Indexed B-Tree `WHERE id &gt; cursor`)
                </td>
                <td className="py-3.5 px-4 opacity-80">
                  Cannot jump to arbitrary page 42; only "Next" and "Previous" navigation.
                </td>
              </tr>

              <tr className={theme === "dark" ? "hover:bg-slate-700/30" : "hover:bg-slate-50"}>
                <td className="py-3.5 px-4 font-bold text-amber-500">
                  ♾️ Infinite Scroll (Unvirtualized)
                </td>
                <td className="py-3.5 px-4">
                  Casual browsing e-commerce or mobile feeds up to ~200 items.
                </td>
                <td className="py-3.5 px-4 text-rose-500 font-bold">
                  Grows continuously (Can reach 5,000+ nodes)
                </td>
                <td className="py-3.5 px-4 text-amber-500">
                  Poor (Back button loses scroll state unless persisted)
                </td>
                <td className="py-3.5 px-4 text-emerald-500">
                  Efficient cursor or offset batch queries
                </td>
                <td className="py-3.5 px-4 opacity-80">
                  Reaching the footer is impossible; mobile browsers crash when DOM nodes exceed thousands.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* LEARN THROUGH CODE TABS */}
      <div
        className={`p-6 rounded-2xl border transition-colors ${
          theme === "dark" ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200"
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold">Learn Through the Code</h3>
            <p className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
              Production-ready TypeScript implementations with annotated code comments.
            </p>
          </div>

          <div className="flex flex-wrap rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 p-0.5 bg-slate-100 dark:bg-slate-900">
            <button
              onClick={() => setActiveCodeTab("virtualizer")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCodeTab === "virtualizer"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              1. Virtualizer Hook
            </button>
            <button
              onClick={() => setActiveCodeTab("offset")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCodeTab === "offset"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              2. Offset Pagination Hook
            </button>
            <button
              onClick={() => setActiveCodeTab("cursor")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCodeTab === "cursor"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              3. Cursor SQL & React
            </button>
            <button
              onClick={() => setActiveCodeTab("infinite")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeCodeTab === "infinite"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              4. Virtualized Infinite Feed
            </button>
          </div>
        </div>

        {/* TAB 1: VIRTUALIZER HOOK */}
        {activeCodeTab === "virtualizer" && (
          <div className="space-y-4">
            <div className="text-xs space-y-1 opacity-90">
              <p>
                <strong>How the Windowing algorithm works:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Total scrollable canvas is calculated as: <code>totalHeight = count * itemHeight</code>.
                </li>
                <li>
                  The scroll listener captures <code>scrollTop</code> on every frame via <code>requestAnimationFrame</code>.
                </li>
                <li>
                  <code>startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)</code>
                </li>
                <li>
                  <code>endIndex = Math.min(count - 1, Math.floor((scrollTop + containerHeight) / itemHeight) + overscan)</code>
                </li>
                <li>
                  We translate the rendered container downwards by <code>startIndex * itemHeight</code> using CSS <code>transform: translateY()</code> or <code>paddingTop</code>.
                </li>
              </ul>
            </div>

            <CodeBlock
              language="tsx"
              code={`// useVirtualizer.ts - Complete zero-dependency Virtualization Hook
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface VirtualizerConfig {
  count: number;                       // Total items in dataset (e.g. 100,000)
  itemHeight: number;                  // Height in px of each row
  overscan?: number;                   // Extra items to render off-screen (prevents flickering)
  scrollElementRef: React.RefObject<HTMLElement | null>;
}

export function useVirtualizer({
  count,
  itemHeight,
  overscan = 3,
  scrollElementRef,
}: VirtualizerConfig) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(400);
  const rafId = useRef<number | null>(null);

  // 1. Measure viewport container height with ResizeObserver
  useEffect(() => {
    const el = scrollElementRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      setContainerHeight(el.clientHeight || 400);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollElementRef]);

  // 2. Throttle scroll updates with requestAnimationFrame for 60 FPS
  useEffect(() => {
    const el = scrollElementRef.current;
    if (!el) return;

    const onScroll = () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setScrollTop(el.scrollTop);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [scrollElementRef]);

  // 3. Calculate visible window index bounds
  const { startIndex, endIndex } = useMemo(() => {
    if (count === 0) return { startIndex: 0, endIndex: -1 };

    const firstVisible = Math.floor(scrollTop / itemHeight);
    const lastVisible = Math.floor((scrollTop + containerHeight) / itemHeight);

    return {
      startIndex: Math.max(0, firstVisible - overscan),
      endIndex: Math.min(count - 1, lastVisible + overscan),
    };
  }, [scrollTop, containerHeight, itemHeight, count, overscan]);

  // 4. Construct virtual items array to mount in DOM
  const virtualItems = useMemo(() => {
    if (endIndex < startIndex || count === 0) return [];
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({ index: i, offsetTop: i * itemHeight, height: itemHeight });
    }
    return items;
  }, [startIndex, endIndex, itemHeight, count]);

  const totalHeight = count * itemHeight;
  const topPadding = startIndex * itemHeight;

  return { virtualItems, totalHeight, topPadding, startIndex, endIndex };
}`}
            />
          </div>
        )}

        {/* TAB 2: OFFSET PAGINATION */}
        {activeCodeTab === "offset" && (
          <div className="space-y-4">
            <div className="text-xs space-y-1 opacity-90">
              <p>
                <strong>Offset Pagination Pattern:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Client calculates <code>startIndex = (page - 1) * pageSize</code>.
                </li>
                <li>
                  API calls send <code>?page={2}&limit={10}</code> or <code>?offset={10}&limit={10}</code>.
                </li>
                <li>
                  Always use <code>AbortController</code> to prevent race conditions when a user rapidly clicks page 2 then page 3!
                </li>
              </ul>
            </div>

            <CodeBlock
              language="tsx"
              code={`// usePaginatedQuery.ts - Async Pagination with AbortController & Cache
import { useState, useEffect, useRef } from "react";

interface PaginatedResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export function usePaginatedQuery<T>(
  fetchFn: (page: number, limit: number, signal: AbortSignal) => Promise<{ items: T[]; total: number }>,
  page: number,
  limit: number
): PaginatedResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-memory cache map: key = 'page-limit'
  const cacheRef = useRef<Map<string, { items: T[]; total: number }>>(new Map());

  useEffect(() => {
    const key = \`\${page}-\${limit}\`;
    if (cacheRef.current.has(key)) {
      const cached = cacheRef.current.get(key)!;
      setData(cached.items);
      setTotal(cached.total);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchFn(page, limit, controller.signal)
      .then((res) => {
        cacheRef.current.set(key, res);
        setData(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to fetch paginated data");
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      // Cancels stale in-flight request when user clicks another page!
      controller.abort();
    };
  }, [page, limit, fetchFn]);

  return {
    data,
    total,
    totalPages: Math.ceil(total / limit),
    loading,
    error,
  };
}`}
            />
          </div>
        )}

        {/* TAB 3: CURSOR SQL & REACT */}
        {activeCodeTab === "cursor" && (
          <div className="space-y-4">
            <div className="text-xs space-y-1 opacity-90">
              <p>
                <strong>Why Cursor Pagination is superior for massive databases:</strong>
              </p>
              <p>
                In SQL, <code>OFFSET 500000 LIMIT 20</code> forces the DB engine to scan 500,020 rows from disk and discard the first 500,000. In contrast, <code>WHERE id &gt; 500000 LIMIT 20</code> jumps directly to the B-Tree index pointer in O(log N) time!
              </p>
            </div>

            <CodeBlock
              language="tsx"
              code={`// Backend SQL comparison: Offset vs Keyset/Cursor

-- ❌ BAD: Slow at high offsets (Full index scan of 1,000,020 rows!)
SELECT id, name, created_at
FROM users
ORDER BY id ASC
LIMIT 20 OFFSET 1000000; -- Takes seconds!

-- ✅ GOOD: Blazing fast cursor query (Indexed B-Tree Seek!)
SELECT id, name, created_at
FROM users
WHERE id > 1000000
ORDER BY id ASC
LIMIT 20; -- Takes < 2 milliseconds!

// --- React Cursor Pagination Hook ---
export function useCursorPagination<T extends { id: number }>() {
  const [cursorHistory, setCursorHistory] = useState<number[]>([0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCursor = cursorHistory[currentIndex] || 0;

  const goToNextPage = (lastItemId: number) => {
    setCursorHistory((prev) => [...prev.slice(0, currentIndex + 1), lastItemId]);
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return { currentCursor, currentIndex, goToNextPage, goToPrevPage };
}`}
            />
          </div>
        )}

        {/* TAB 4: VIRTUALIZED INFINITE FEED */}
        {activeCodeTab === "infinite" && (
          <div className="space-y-4">
            <div className="text-xs space-y-1 opacity-90">
              <p>
                <strong>The Ultimate Combination: Virtualized Infinite Feed</strong>
              </p>
              <p>
                Infinite scroll without virtualization crashes the browser tab after loading 2,000 items. When you combine <code>IntersectionObserver</code> to fetch new batches with <code>useVirtualizer</code> to mount only visible nodes, you can scroll through millions of items endlessly!
              </p>
            </div>

            <CodeBlock
              language="tsx"
              code={`// Combining Infinite Scroll with Virtualization
import { useVirtualizer } from "./useVirtualizer";
import { useEffect, useRef } from "react";

export function VirtualizedInfiniteList({ items, hasMore, loadMore, isFetching }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, topPadding, endIndex } = useVirtualizer({
    count: items.length,
    itemHeight: 80,
    scrollElementRef: parentRef,
  });

  // Trigger next batch fetch when user scrolls within 5 items of the end
  useEffect(() => {
    if (endIndex >= items.length - 5 && hasMore && !isFetching) {
      loadMore();
    }
  }, [endIndex, items.length, hasMore, isFetching, loadMore]);

  return (
    <div ref={parentRef} className="h-[500px] overflow-y-auto relative">
      <div style={{ height: \`\${totalHeight}px\`, position: "relative" }}>
        <div style={{ transform: \`translateY(\${topPadding}px)\` }}>
          {virtualItems.map(({ index }) => (
            <RowCard key={items[index].id} item={items[index]} />
          ))}
        </div>
      </div>
      {isFetching && <LoadingSpinner />}
    </div>
  );
}`}
            />
          </div>
        )}
      </div>

      {/* SENIOR INTERVIEW Q&A ACCORDIONS */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold">Frontend Interview Masterclass: Lists & Pagination</h3>

        <LearningNote title="1. How do you handle Dynamic Row Heights in a Virtualized List?">
          <div className="space-y-2">
            <p>
              Fixed row heights (e.g. <code>itemHeight = 76px</code>) make math trivial: <code>offset = index * height</code>. But in real apps (like tweet cards or variable text length), items have unpredictable heights!
            </p>
            <p>
              <strong>The Solution (Estimated Heights + ResizeObserver Cache):</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Maintain an estimated default height (e.g. <code>estimatedHeight = 80px</code>).
              </li>
              <li>
                Store measured heights in a <code>measuredHeightsMap = new Map&lt;number, number&gt;()</code>.
              </li>
              <li>
                Attach a <code>ResizeObserver</code> or measure <code>element.getBoundingClientRect().height</code> in <code>useLayoutEffect</code> when the card mounts.
              </li>
              <li>
                Update the map and recompute the prefix sum array (running total of offsets).
              </li>
            </ol>
          </div>
        </LearningNote>

        <LearningNote title="2. What is the 'Pagination Drift' Bug and how does it happen?">
          <div className="space-y-2">
            <p>
              Imagine an e-commerce catalog sorted by newest first:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>User loads Page 1 (Items #1 to #10).</li>
              <li>While the user is reading, another user creates 2 new products (pushed to the top).</li>
              <li>User clicks 'Page 2' (Query: <code>OFFSET 10 LIMIT 10</code>).</li>
              <li>
                Because 2 new items pushed all records down by 2 positions, the old items #9 and #10 are now at positions #11 and #12.
              </li>
              <li>
                <strong>Result:</strong> The user sees items #9 and #10 repeated on Page 2!
              </li>
            </ul>
            <p>
              <strong>Fix:</strong> Use Cursor-based pagination (e.g. <code>WHERE created_at &lt; page1_last_item_time LIMIT 10</code>). The cursor anchors to the timestamp, completely immune to newly inserted rows.
            </p>
          </div>
        </LearningNote>

        <LearningNote title="3. How do you make Virtual Lists accessible (A11y) to Screen Readers?">
          <div className="space-y-2">
            <p>
              Because unrendered items are literally missing from the DOM tree, screen readers (VoiceOver, NVDA) may announce: <em>"Table: 10 items total"</em> instead of 100,000 items!
            </p>
            <p>
              <strong>Best Practices for A11y:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Add <code>aria-rowcount=&#123;100000&#125;</code> to the table or list container.
              </li>
              <li>
                Add <code>aria-rowindex=&#123;index + 1&#125;</code> to each mounted item card so the screen reader correctly announces: <em>"Item 4,520 of 100,000"</em>.
              </li>
              <li>
                Ensure keyboard tab focus does not jump unexpectedly off-screen when scrolling; scroll the focused element into view programmatically if navigating via ArrowUp/ArrowDown.
              </li>
            </ul>
          </div>
        </LearningNote>

        <LearningNote title="4. What is 'Overscan' and why is it necessary?">
          <div className="space-y-2">
            <p>
              If you only render the exact items inside the visible box, rapid scrolling on mobile touch screens or fast mouse-wheel momentum will outpace React's render cycle, causing the user to see a <strong>blank white area</strong> for a split second before the elements mount.
            </p>
            <p>
              <strong>Overscan</strong> renders a buffer of 3 to 5 extra items above and below the viewport. While off-screen, they are already mounted in the DOM, so when fast scrolling occurs, the content is already painted with zero blank flickering!
            </p>
          </div>
        </LearningNote>
      </div>
    </div>
  );
};
