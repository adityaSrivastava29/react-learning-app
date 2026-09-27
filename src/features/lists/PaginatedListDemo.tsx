import React, { useState, useMemo, useEffect, useRef } from "react";
import { PAGINATION_DATASET, type MockListItem } from "./mockData";
import { useTheme } from "../../hooks/useTheme";

type PaginationArchitecture = "client" | "server" | "cursor";

export const PaginatedListDemo: React.FC = () => {
  const { theme } = useTheme();

  // Mode Selection
  const [architecture, setArchitecture] = useState<PaginationArchitecture>("client");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Filtering & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [sortField, setSortField] = useState<keyof MockListItem>("id");
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpInput, setJumpInput] = useState<string>("");

  // Simulated Server State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkDelay, setNetworkDelay] = useState<number>(300);
  const [serverCache, setServerCache] = useState<Record<string, MockListItem[]>>({});
  const [cacheHits, setCacheHits] = useState<number>(0);
  const [serverFetches, setServerFetches] = useState<number>(0);

  // Cursor Pagination Simulation State
  const [cursorHistory, setCursorHistory] = useState<number[]>([0]); // record IDs
  const [currentCursorIndex, setCurrentCursorIndex] = useState<number>(0);
  const [datasetCopy, setDatasetCopy] = useState<MockListItem[]>([...PAGINATION_DATASET]);
  const [driftNotification, setDriftNotification] = useState<string>("");

  // Filtered and Sorted master list
  const filteredDataset = useMemo(() => {
    return datasetCopy.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = selectedDept === "All" || item.department === selectedDept;
      return matchesSearch && matchesDept;
    }).sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });
  }, [datasetCopy, searchQuery, selectedDept, sortField, sortAsc]);

  const totalItems = filteredDataset.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setCurrentCursorIndex(0);
    setCursorHistory([0]);
  }, [searchQuery, selectedDept, pageSize]);

  // Handle Simulated Server Data Fetch
  const [serverItems, setServerItems] = useState<MockListItem[]>([]);
  const fetchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (architecture !== "server") return;

    const cacheKey = `p${currentPage}_s${pageSize}_q${searchQuery}_d${selectedDept}_sf${sortField}_sa${sortAsc}`;

    if (serverCache[cacheKey]) {
      setServerItems(serverCache[cacheKey]);
      setCacheHits((prev) => prev + 1);
      return;
    }

    setIsLoading(true);
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    fetchTimeoutRef.current = setTimeout(() => {
      const start = (currentPage - 1) * pageSize;
      const sliced = filteredDataset.slice(start, start + pageSize);

      setServerItems(sliced);
      setServerCache((prev) => ({ ...prev, [cacheKey]: sliced }));
      setServerFetches((prev) => prev + 1);
      setIsLoading(false);
    }, networkDelay);

    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [currentPage, pageSize, searchQuery, selectedDept, sortField, sortAsc, architecture, filteredDataset, networkDelay, serverCache]);

  // Active items for the current page
  const displayedItems = useMemo(() => {
    if (architecture === "server") {
      return serverItems;
    }

    if (architecture === "cursor") {
      const currentCursor = cursorHistory[currentCursorIndex] || 0;
      const filteredByCursor = filteredDataset.filter((item) => item.id > currentCursor);
      return filteredByCursor.slice(0, pageSize);
    }

    // Default: Client-side slice
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDataset.slice(startIndex, startIndex + pageSize);
  }, [architecture, serverItems, cursorHistory, currentCursorIndex, filteredDataset, pageSize, currentPage]);

  // Page Numbers Array for Pagination Bar with Ellipsis
  const paginationRange = useMemo(() => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  }, [totalPages, currentPage]);

  // Handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleSort = (field: keyof MockListItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpInput("");
    }
  };

  // Cursor Next / Prev
  const handleCursorNext = () => {
    if (displayedItems.length > 0) {
      const lastItem = displayedItems[displayedItems.length - 1];
      const nextCursor = lastItem.id;
      setCursorHistory((prev) => [...prev.slice(0, currentCursorIndex + 1), nextCursor]);
      setCurrentCursorIndex((prev) => prev + 1);
    }
  };

  const handleCursorPrev = () => {
    if (currentCursorIndex > 0) {
      setCurrentCursorIndex((prev) => prev - 1);
    }
  };

  // Drift bug test: Insert new record at top
  const handleInsertRecordAtTop = () => {
    const newId = Date.now();
    const newItem: MockListItem = {
      id: newId,
      name: `⚡ Fresh Insert #${Math.floor(Math.random() * 1000)}`,
      role: "Newly Hired Principal Engineer",
      department: "Engineering",
      email: `fresh.${newId}@techstack.io`,
      status: "Active",
      performanceScore: 98,
      tasksCompleted: 1,
      joinDate: new Date().toISOString().split("T")[0],
      location: "San Francisco, CA",
      avatarBg: "from-amber-400 to-rose-500",
    };

    setDatasetCopy((prev) => [newItem, ...prev]);

    if (architecture === "client" || architecture === "server") {
      setDriftNotification(
        "⚠️ Notice the Offset Drift! Because item was inserted at index 0, Page 2's top item just shifted! If you were viewing Page 2, you'd see a duplicate from Page 1!"
      );
    } else {
      setDriftNotification(
        "✅ No Cursor Drift! Because cursor queries use `WHERE id > last_seen_id`, newly inserted top records do not shift or duplicate your current paginated view."
      );
    }
  };

  const departments = ["All", "Engineering", "Design", "DevOps", "Product", "Security", "Data"];

  const startIndexDisplay = (currentPage - 1) * pageSize + 1;
  const endIndexDisplay = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div
        className={`p-5 rounded-2xl border transition-colors ${
          theme === "dark" ? "bg-slate-800/80 border-slate-700/80" : "bg-white border-slate-200"
        }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                📑 Enterprise Pagination
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Offset vs Cursor vs SWR Caching
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-2">
              Interactive Paginated List Suite
            </h2>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              Explore Client-Side slicing, Server-Side async pagination with network skeletons, and Cursor-based pagination.
            </p>
          </div>

          {/* Architecture Selector Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 p-1 bg-slate-100 dark:bg-slate-900">
            <button
              onClick={() => setArchitecture("client")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                architecture === "client"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              💻 Client-Side Slicing
            </button>
            <button
              onClick={() => setArchitecture("server")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                architecture === "server"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              🌐 Server-Side Async
            </button>
            <button
              onClick={() => setArchitecture("cursor")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                architecture === "cursor"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "opacity-70 hover:opacity-100"
              }`}>
              🎯 Cursor-Based
            </button>
          </div>
        </div>

        {/* ARCHITECTURE EXPLANATION CALLOUT */}
        <div
          className={`mt-4 p-3 rounded-xl border text-xs leading-relaxed ${
            architecture === "client"
              ? "bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300"
              : architecture === "server"
              ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
          }`}>
          {architecture === "client" && (
            <p>
              <strong>Client-Side Pagination:</strong> All {totalItems} records are loaded into memory at once. Slicing happens instantly via <code>data.slice((page - 1) * pageSize, page * pageSize)</code>. Ideal for datasets under 2,000 items with zero server latency.
            </p>
          )}
          {architecture === "server" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p>
                <strong>Server-Side Pagination:</strong> Client sends <code>?page={currentPage}&limit={pageSize}</code>. Simulates real network delays with shimmer skeletons, plus client caching (SWR pattern).
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] opacity-80">Delay:</span>
                <select
                  value={networkDelay}
                  onChange={(e) => setNetworkDelay(Number(e.target.value))}
                  className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-xs">
                  <option value={100}>100ms (Fast)</option>
                  <option value={300}>300ms (Normal)</option>
                  <option value={800}>800ms (Slow 3G)</option>
                </select>
                <button
                  onClick={() => {
                    setServerCache({});
                    setCacheHits(0);
                    setServerFetches(0);
                  }}
                  className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 hover:opacity-80 text-[11px]">
                  Clear Cache
                </button>
              </div>
            </div>
          )}
          {architecture === "cursor" && (
            <div className="space-y-1">
              <p>
                <strong>Cursor-Based Pagination:</strong> Instead of counting page numbers with slow <code>OFFSET 10000</code>, queries fetch records using an indexed cursor: <code>WHERE id &gt; {cursorHistory[currentCursorIndex] || 0} LIMIT {pageSize}</code>. Solves pagination drift when items are inserted in real time!
              </p>
              <button
                onClick={handleInsertRecordAtTop}
                className="mt-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs transition-colors">
                + Simulate New Record Insert at Top (Test Drift)
              </button>
            </div>
          )}
        </div>

        {/* Drift Notification */}
        {driftNotification && (
          <div className="mt-3 p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 flex items-center justify-between">
            <span>{driftNotification}</span>
            <button
              onClick={() => setDriftNotification("")}
              className="text-xs opacity-75 hover:opacity-100 ml-2">
              ✕
            </button>
          </div>
        )}

        {/* CONTROLS & FILTERS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, role, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                  : "bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400"
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 text-xs opacity-50 hover:opacity-100">
                ✕
              </button>
            )}
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className={`px-3 py-2 text-xs rounded-xl border transition-colors ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700 text-white"
                : "bg-slate-50 border-slate-300 text-slate-800"
            }`}>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "🏢 All Departments" : `Department: ${dept}`}
              </option>
            ))}
          </select>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70 whitespace-nowrap">Page Size:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className={`flex-1 px-3 py-2 text-xs rounded-xl border transition-colors ${
                theme === "dark"
                  ? "bg-slate-900 border-slate-700 text-white"
                  : "bg-slate-50 border-slate-300 text-slate-800"
              }`}>
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-slate-300 dark:border-slate-600 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "opacity-70 hover:opacity-100"
              }`}>
              📊 Table View
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                viewMode === "cards"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "opacity-70 hover:opacity-100"
              }`}>
              🗂️ Cards View
            </button>
          </div>
        </div>
      </div>

      {/* METRICS & HUD BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs opacity-90 px-1">
        <div className="flex items-center gap-3">
          <span className="font-medium">
            Showing <strong className="text-indigo-500">{totalItems > 0 ? startIndexDisplay : 0}</strong> to{" "}
            <strong className="text-indigo-500">{endIndexDisplay}</strong> of{" "}
            <strong>{totalItems.toLocaleString()}</strong> results
          </span>
          {architecture === "server" && (
            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">
              Server: {serverFetches} calls • {cacheHits} cache hits
            </span>
          )}
        </div>

        {architecture !== "cursor" && (
          <div className="flex items-center gap-2">
            <span>Jump to:</span>
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder={`1-${totalPages}`}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                className={`w-16 px-2 py-1 text-xs rounded border ${
                  theme === "dark" ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300"
                }`}
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700">
                Go
              </button>
            </form>
          </div>
        )}
      </div>

      {/* LIST CONTENT (TABLE OR CARDS) */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          theme === "dark" ? "bg-slate-800/90 border-slate-700" : "bg-white border-slate-200"
        }`}>
        {isLoading ? (
          /* SKELETON LOADING STATE */
          <div className="p-4 space-y-3">
            {Array.from({ length: pageSize }).map((_, idx) => (
              <div
                key={idx}
                className="h-14 rounded-xl bg-slate-200 dark:bg-slate-700/60 animate-pulse flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-600" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-3.5 bg-slate-300 dark:bg-slate-600 rounded" />
                    <div className="w-20 h-2.5 bg-slate-300 dark:bg-slate-600 rounded" />
                  </div>
                </div>
                <div className="w-16 h-4 bg-slate-300 dark:bg-slate-600 rounded" />
              </div>
            ))}
          </div>
        ) : displayedItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="py-16 text-center space-y-2">
            <div className="text-3xl">🔍</div>
            <p className="font-semibold text-sm">No items found matching your filters</p>
            <p className="text-xs opacity-60">Try searching with a different term or resetting the department.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("All");
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium">
              Reset Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          /* TABLE VIEW */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead
                className={`border-b text-[11px] uppercase tracking-wider ${
                  theme === "dark"
                    ? "bg-slate-900/60 border-slate-700 text-slate-400"
                    : "bg-slate-50 border-slate-200 text-slate-500"
                }`}>
                <tr>
                  <th
                    onClick={() => handleSort("id")}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-500 transition-colors">
                    ID {sortField === "id" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-500 transition-colors">
                    Member {sortField === "name" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("department")}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-500 transition-colors">
                    Department {sortField === "department" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4">Status</th>
                  <th
                    onClick={() => handleSort("performanceScore")}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-500 transition-colors">
                    Score {sortField === "performanceScore" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th
                    onClick={() => handleSort("tasksCompleted")}
                    className="py-3 px-4 cursor-pointer hover:text-indigo-500 transition-colors">
                    Tasks {sortField === "tasksCompleted" && (sortAsc ? "▲" : "▼")}
                  </th>
                  <th className="py-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {displayedItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-colors ${
                      theme === "dark" ? "hover:bg-slate-700/40" : "hover:bg-indigo-50/50"
                    }`}>
                    <td className="py-3 px-4 font-mono opacity-60">#{item.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </div>
                          <div className="text-[11px] opacity-60">{item.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {item.department}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          item.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : item.status === "Away"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                        }`}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "Active"
                              ? "bg-emerald-500"
                              : item.status === "Away"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${item.performanceScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-semibold">{item.performanceScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">{item.tasksCompleted}</td>
                    <td className="py-3 px-4 opacity-75">{item.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* GRID CARDS VIEW */
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  theme === "dark"
                    ? "bg-slate-900/60 border-slate-700/80 hover:border-slate-600"
                    : "bg-slate-50 border-slate-200 hover:border-indigo-300"
                }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {item.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">{item.name}</h4>
                      <p className="text-[11px] opacity-70">{item.role}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] opacity-50">#{item.id}</span>
                </div>

                <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div className="flex justify-between">
                    <span className="opacity-60">Department:</span>
                    <span className="font-medium text-indigo-500">{item.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Score:</span>
                    <span className="font-semibold text-emerald-500">{item.performanceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Tasks Done:</span>
                    <span>{item.tasksCompleted} completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM PAGINATION CONTROLS BAR */}
        <div
          className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            theme === "dark" ? "bg-slate-900/60 border-slate-700" : "bg-slate-50 border-slate-200"
          }`}>
          {architecture === "cursor" ? (
            /* Cursor Pagination Controls */
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleCursorPrev}
                disabled={currentCursorIndex === 0}
                className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                <span>‹</span>
                <span>Previous Cursor</span>
              </button>

              <div className="text-xs font-mono opacity-80">
                Current Cursor ID: <strong>{cursorHistory[currentCursorIndex] || 0}</strong> (Step: {currentCursorIndex + 1})
              </div>

              <button
                onClick={handleCursorNext}
                disabled={displayedItems.length < pageSize}
                className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5">
                <span>Next Cursor</span>
                <span>›</span>
              </button>
            </div>
          ) : (
            /* Offset & Server Pagination Navigation */
            <>
              <div className="text-xs opacity-75">
                Page <strong className="text-indigo-500">{currentPage}</strong> of <strong>{totalPages}</strong>
              </div>

              <div className="flex items-center gap-1.5">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                  title="First Page">
                  «
                </button>

                {/* Prev Page */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                  ‹ Prev
                </button>

                {/* Page Number Pills */}
                <div className="hidden md:flex items-center gap-1">
                  {paginationRange.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span key={`ellipsis-${index}`} className="px-2 text-xs opacity-50">
                          ...
                        </span>
                      );
                    }
                    const isCurrent = page === currentPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(Number(page))}
                        className={`min-w-8 h-8 px-2 text-xs font-semibold rounded-lg transition-all ${
                          isCurrent
                            ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                            : theme === "dark"
                            ? "hover:bg-slate-700 text-slate-300"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}>
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                  Next ›
                </button>

                {/* Last Page */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                  title="Last Page">
                  »
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
