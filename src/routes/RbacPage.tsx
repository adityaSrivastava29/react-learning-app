import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import {
  loginSuccess,
  logout,
  expireAccessTokenLocally,
  clearAuthLogs,
} from "../store/authSlice";
import {
  PRESET_PERSONAS,
  mockAuthBackend,
  type MockOrder,
  type MockPersona,
} from "../services/mockAuthBackend";
import { apiClient } from "../services/apiClient";
import { ProtectedRoute, Can } from "../components/rbac";
import CodeBlock from "../hooks/CodeBlock";

export const RbacPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user, accessToken, isAuthenticated, tokenExpiresAt, isRefreshing, logs } =
    useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "reports" | "admin" | "notes">("orders");
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [metrics, setMetrics] = useState<{ jvmMemory: string; dbConnections: number; activeThreads: number; uptime: string } | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [stressTesting, setStressTesting] = useState(false);

  // Auto-login as regular user on initial mount if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      handleLogin(PRESET_PERSONAS[0]);
    }
  }, []);

  // Timer countdown for Access Token expiration display
  useEffect(() => {
    const interval = setInterval(() => {
      if (tokenExpiresAt) {
        const remaining = Math.max(0, Math.ceil((tokenExpiresAt - Date.now()) / 1000));
        setSecondsRemaining(remaining);
      } else {
        setSecondsRemaining(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  const handleLogin = async (persona: MockPersona) => {
    const res = await mockAuthBackend.login(persona.id, 30);
    if (res.status === 200 && res.data) {
      dispatch(
        loginSuccess({
          user: res.data.user,
          accessToken: res.data.accessToken,
          expiresInSeconds: res.data.expiresInSeconds,
        })
      );
    }
  };

  const handleLogout = async () => {
    await mockAuthBackend.logout();
    dispatch(logout({ reason: "User initiated logout." }));
    setOrders([]);
    setMetrics(null);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const res = await apiClient.getOrders();
    setOrdersLoading(false);
    if (res.status === 200 && res.data) {
      setOrders(res.data);
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    const res = await apiClient.approveOrder(orderId);
    if (res.status === 200) {
      fetchOrders();
    }
  };

  const fetchMetrics = async () => {
    setMetricsLoading(true);
    const res = await apiClient.getSystemMetrics();
    setMetricsLoading(false);
    if (res.status === 200 && res.data) {
      setMetrics(res.data);
    }
  };

  // Stress-test: Trigger 5 concurrent calls with expired access token
  const handleConcurrentStressTest = async () => {
    setStressTesting(true);
    dispatch(expireAccessTokenLocally());

    // Fire 5 asynchronous calls simultaneously
    await Promise.all([
      apiClient.getOrders(),
      apiClient.getOrders(),
      apiClient.getSystemMetrics(),
      apiClient.approveOrder("ORD-101"),
      apiClient.getOrders(),
    ]);

    fetchOrders();
    setStressTesting(false);
  };

  // Fetch orders whenever entering orders tab if authenticated
  useEffect(() => {
    if (activeTab === "orders" && isAuthenticated) {
      fetchOrders();
    }
    if (activeTab === "admin" && isAuthenticated) {
      fetchMetrics();
    }
  }, [activeTab, isAuthenticated]);

  const cookieInfo = mockAuthBackend.getHttpOnlyCookieInfo();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                Enterprise Architecture
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
                Spring Security & RBAC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              🛡️ Protected Routes, RBAC & Token Lifecycle Lab
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Complete production architectural simulation: Redux auth state, route-level permission guards, permission-aware UI buttons, HttpOnly refresh cookies, and a <strong>concurrency-safe mutex refresh queue</strong> that prevents redundant refresh calls.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("notes")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-1.5">
              <span>📖</span> Architecture Notes & Code
            </button>
          </div>
        </div>
      </div>

      {/* TOP CONTROLS: PERSONA SWITCHER & TOKEN STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persona Switcher Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>🎭</span> 1. Select Active Persona (Test RBAC Roles)
            </h3>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1">
                <span>🚪</span> Sign Out (Guest)
              </button>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {PRESET_PERSONAS.map((p) => {
              const isSelected = user?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleLogin(p)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/80 dark:bg-blue-950/30 ring-2 ring-blue-500 shadow-xs"
                      : "border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 hover:border-gray-300 dark:hover:border-gray-700"
                  }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{p.avatar}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.role === "ROLE_ADMIN"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200"
                          : p.role === "ROLE_MANAGER"
                          ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-200"
                          : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}>
                      {p.role.replace("ROLE_", "")}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white truncate">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {p.email}
                  </div>
                  <div className="text-[11px] text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                    {p.description}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current Active Permissions Badges */}
          {isAuthenticated && user && (
            <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-850/60 border border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-gray-500 dark:text-gray-400">Granted Authorities:</span>
              {user.permissions.map((perm) => (
                <span
                  key={perm}
                  className="px-2 py-0.5 rounded font-mono text-[11px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                  {perm}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Token Lifecycle & Security Inspector */}
        <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>🔐</span> 2. Token Security State
            </h3>

            {/* Access Token Health */}
            <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Access Token (Redux Memory):</span>
                <span
                  className={`font-mono font-bold ${
                    secondsRemaining === null || secondsRemaining <= 0
                      ? "text-rose-600 dark:text-rose-400"
                      : secondsRemaining < 8
                      ? "text-amber-600 dark:text-amber-400 animate-pulse"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                  {secondsRemaining !== null && secondsRemaining > 0
                    ? `Valid: ${secondsRemaining}s left`
                    : "EXPIRED (401)"}
                </span>
              </div>
              <div className="font-mono text-[11px] text-gray-700 dark:text-gray-300 truncate bg-white dark:bg-gray-900 p-1.5 rounded border border-gray-200 dark:border-gray-700">
                {accessToken ? `Bearer ${accessToken.substring(0, 32)}...` : "None (Unauthenticated)"}
              </div>
            </div>

            {/* HttpOnly Cookie Health */}
            <div className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-850/50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Refresh Token (HttpOnly Cookie):</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    cookieInfo.hasCookie && cookieInfo.isValid
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
                  }`}>
                  {cookieInfo.hasCookie && cookieInfo.isValid ? "ACTIVE COOKIE" : "REVOKED / EMPTY"}
                </span>
              </div>
              <div className="font-mono text-[10px] text-gray-600 dark:text-gray-400 truncate">
                {cookieInfo.cookieValuePreview || "No HttpOnly cookie present"}
              </div>
            </div>
          </div>

          {/* Manual Testing Actions */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(expireAccessTokenLocally())}
                disabled={!isAuthenticated}
                className="flex-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                ⚡ Expire Token (Force 401)
              </button>
              <button
                onClick={() => mockAuthBackend.invalidateRefreshToken()}
                disabled={!isAuthenticated}
                className="flex-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                🛑 Revoke Refresh Cookie
              </button>
            </div>
            <button
              onClick={handleConcurrentStressTest}
              disabled={stressTesting || !isAuthenticated}
              className="w-full px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5">
              <span>🚀</span>
              {stressTesting ? "Dispatching 5 Requests..." : "Test Concurrency Mutex Queue (5 Calls)"}
            </button>
          </div>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>🛒</span>
          <span>Orders Management (Permission RBAC)</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "reports"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>📊</span>
          <span>Manager Reports (Role: Manager+)</span>
        </button>

        <button
          onClick={() => setActiveTab("admin")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "admin"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>⚙️</span>
          <span>Super Admin Console (Role: Admin)</span>
        </button>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === "dashboard"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>🌐</span>
          <span>Public Overview (Unrestricted)</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ml-auto ${
            activeTab === "notes"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-purple-600 dark:text-purple-400 hover:text-purple-700"
          }`}>
          <span>📚</span>
          <span>Complete Architecture Notes</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ORDERS (PERMISSION-BASED RBAC) */}
      {activeTab === "orders" && (
        <ProtectedRoute
          requiredPermission="orders:read"
          fallbackToLogin={() => handleLogin(PRESET_PERSONAS[0])}
          onSwitchPersona={() => handleLogin(PRESET_PERSONAS[1])}>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>🛒</span> Enterprise Order Processing
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Protected by <code className="font-mono text-xs">orders:read</code> permission. Notice how the <strong>Approve Order</strong> button conditionally displays or disables based on <code className="font-mono text-xs">orders:approve</code> authority.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => mockAuthBackend.resetOrders()}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                  Reset Orders
                </button>
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs">
                  {ordersLoading ? "Refreshing..." : "Refresh Orders"}
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50/80 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="p-3.5">Order ID</th>
                    <th className="p-3.5">Customer & Items</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">RBAC Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-gray-900 dark:text-white">
                        {ord.id}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-gray-900 dark:text-white">{ord.customer}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ord.item}</div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-gray-900 dark:text-white">
                        ${ord.amount.toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300"
                          }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {ord.status === "APPROVED" ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ Approved
                          </span>
                        ) : (
                          /* Permission-Aware UI: Check orders:approve */
                          <Can
                            permission="orders:approve"
                            fallback={
                              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                <span>🔒</span> Requires Manager+
                              </span>
                            }>
                            <button
                              onClick={() => handleApproveOrder(ord.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs">
                              Approve Order
                            </button>
                          </Can>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Architecture Insight Callout */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 text-xs sm:text-sm text-blue-900 dark:text-blue-200 space-y-1">
              <strong>💡 Senior RBAC Principle:</strong> Hiding the 'Approve Order' button from Alex (User) is for <em>User Experience (UX)</em> so they don't see buttons they cannot use. However, Spring Security is the <em>true security boundary</em>: even if an attacker manually calls <code className="font-mono">POST /api/orders/approve</code>, Spring Security's <code className="font-mono">@PreAuthorize("hasAuthority('orders:approve')")</code> intercepts the JWT and returns <strong>HTTP 403 Forbidden</strong>.
            </div>
          </div>
        </ProtectedRoute>
      )}

      {/* TAB CONTENT 2: MANAGER REPORTS (ROLE_MANAGER GUARD) */}
      {activeTab === "reports" && (
        <ProtectedRoute
          requiredRole="ROLE_MANAGER"
          fallbackToLogin={() => handleLogin(PRESET_PERSONAS[0])}
          onSwitchPersona={() => handleLogin(PRESET_PERSONAS[1])}>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>📊</span> Executive & Department Performance Reports
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Guarded by <code className="font-mono text-xs">requiredRole="ROLE_MANAGER"</code>. Only Managers and Admins can view this route.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Monthly Revenue:</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">$184,290</div>
                <span className="text-[11px] text-emerald-600 font-semibold">+14.2% vs last month</span>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Order Approval SLA:</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">1.8 hrs</div>
                <span className="text-[11px] text-emerald-600 font-semibold">98.4% within policy</span>
              </div>
              <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Escalated Tickets:</span>
                <div className="text-2xl font-bold text-amber-600 font-mono">3</div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">Assigned to manager</span>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      )}

      {/* TAB CONTENT 3: ADMIN CONSOLE (ROLE_ADMIN GUARD) */}
      {activeTab === "admin" && (
        <ProtectedRoute
          requiredRole="ROLE_ADMIN"
          requiredPermission="settings:admin"
          fallbackToLogin={() => handleLogin(PRESET_PERSONAS[0])}
          onSwitchPersona={() => handleLogin(PRESET_PERSONAS[2])}>
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>⚙️</span> Super Admin Infrastructure Console
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Guarded strictly by <code className="font-mono text-xs">requiredRole="ROLE_ADMIN"</code>.
              </p>
            </div>

            {metricsLoading ? (
              <div className="p-8 text-center text-sm text-gray-500">Querying Spring Boot actuator metrics...</div>
            ) : metrics ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">JVM Memory Heap:</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">{metrics.jvmMemory}</span>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">HikariCP Pool Connections:</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">{metrics.dbConnections} active</span>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">Worker Threads:</span>
                  <span className="text-sm font-bold font-mono text-gray-900 dark:text-white">{metrics.activeThreads} threads</span>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">Service Uptime:</span>
                  <span className="text-sm font-bold font-mono text-emerald-600">{metrics.uptime}</span>
                </div>
              </div>
            ) : null}
          </div>
        </ProtectedRoute>
      )}

      {/* TAB CONTENT 4: PUBLIC OVERVIEW (ACCESSIBLE TO GUEST & ALL) */}
      {activeTab === "dashboard" && (
        <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>🌐</span> Public Portal (No ProtectedRoute Guard)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            This route is accessible by everyone, including unauthenticated guests. Public routes typically host landing pages, registration, login screens, and open catalog views.
          </p>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-xs text-gray-700 dark:text-gray-300">
            Current Status: <strong>{isAuthenticated ? `Logged in as ${user?.name}` : "Unauthenticated Guest"}</strong>
          </div>
        </div>
      )}

      {/* REAL-TIME SECURITY LOG INSPECTOR */}
      <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>📡</span> Real-Time Spring Security Filter Chain & Token Logs
          </h3>
          <div className="flex items-center gap-3">
            {isRefreshing && (
              <span className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Mutex Refreshing Active...
              </span>
            )}
            <button
              onClick={() => dispatch(clearAuthLogs())}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              Clear Logs
            </button>
          </div>
        </div>

        <div className="space-y-1.5 max-h-56 overflow-y-auto font-mono text-xs p-3 rounded-xl bg-gray-950 text-gray-200 border border-gray-800">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 py-1 border-b border-gray-800/60 last:border-b-0">
              <span className="text-gray-500 select-none text-[11px]">{log.timestamp}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  log.type === "SUCCESS"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : log.type === "ERROR"
                    ? "bg-rose-950 text-rose-400 border border-rose-800"
                    : log.type === "WARN"
                    ? "bg-amber-950 text-amber-400 border border-amber-800"
                    : log.type === "REFRESH"
                    ? "bg-purple-950 text-purple-400 border border-purple-800"
                    : "bg-blue-950 text-blue-400 border border-blue-800"
                }`}>
                {log.type}
              </span>
              <div className="flex-1">
                <span className="font-semibold text-white">{log.title}: </span>
                <span className="text-gray-300">{log.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMPLETE ARCHITECTURAL NOTES & STEP-BY-STEP IMPLEMENTATION GUIDE */}
      <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 shadow-sm space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Enterprise RBAC & Token Architecture Reference
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            How to structure Protected Routes, RBAC UI checks, HttpOnly cookies, and Spring Security method validation in real-world production projects.
          </p>
        </div>

        {/* 1. Core Principles Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 space-y-2">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
              <span>🎯</span> Principle 1: Frontend RBAC is UX, Backend is Security
            </h4>
            <p className="text-xs text-blue-950/80 dark:text-blue-200/80 leading-relaxed">
              Never rely on React to protect sensitive data. A malicious user can alter JavaScript memory in DevTools or craft arbitrary HTTP requests. Frontend route guards and conditional buttons exist purely to provide a seamless user experience. Spring Security independently verifies every JWT and authorization rule on every request.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/20 space-y-2">
            <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-2">
              <span>🍪</span> Principle 2: Where Tokens Belong
            </h4>
            <ul className="text-xs text-purple-950/80 dark:text-purple-200/80 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li><strong>Access Token (Short-lived, ~15m):</strong> Stored in memory (Redux state). Inaccessible to XSS scrapers after page reload.</li>
              <li><strong>Refresh Token (Long-lived, ~7d):</strong> Stored in an <code className="font-mono font-bold">HttpOnly; Secure; SameSite=Strict</code> cookie. JavaScript CANNOT read it, immunizing it against XSS theft.</li>
            </ul>
          </div>
        </div>

        {/* 2. 401 vs 403 Deep Breakdown */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <span>⚖️</span> Understanding HTTP 401 Unauthorized vs 403 Forbidden
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-amber-900 dark:text-amber-200 font-bold">HTTP 401 Unauthorized</strong>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                  Authentication Issue
                </span>
              </div>
              <p className="text-amber-950/80 dark:text-amber-200/80 leading-relaxed text-xs">
                "I do not know who you are, or your credentials have expired."
              </p>
              <ul className="text-xs list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Access token is missing from <code className="font-mono">Authorization: Bearer</code> header.</li>
                <li>Access token signature is invalid or expired.</li>
                <li><strong>Frontend Action:</strong> Trigger token refresh workflow. If refresh token is also invalid, purge Redux auth and redirect to <code className="font-mono">/login</code>.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-rose-900 dark:text-rose-200 font-bold">HTTP 403 Forbidden</strong>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-200 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                  Authorization Issue
                </span>
              </div>
              <p className="text-rose-950/80 dark:text-rose-200/80 leading-relaxed text-xs">
                "I know who you are, but you do NOT have permission for this resource."
              </p>
              <ul className="text-xs list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                <li>The user is successfully authenticated, but lacks the required Role or Authority.</li>
                <li>Spring Security <code className="font-mono">@PreAuthorize</code> threw <code className="font-mono">AccessDeniedException</code>.</li>
                <li><strong>Frontend Action:</strong> Do NOT refresh token. Render an Access Denied view or toast notification.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Concurrency-Safe Interceptor Code */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Production Axios / Fetch Concurrency Interceptor Pattern
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            When multiple API requests trigger at the same time and find an expired token, you must NOT fire multiple <code className="font-mono">/refresh</code> requests. Use a mutex flag with a queue of unresolved promises:
          </p>
          <CodeBlock
            language="typescript"
            code={`// Concurrency-Safe Axios Response Interceptor
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue concurrent requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // HttpOnly refresh cookie is sent automatically by the browser withCredentials
        const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const newAccessToken = data.accessToken;
        
        // Update Redux state
        store.dispatch(tokenRefreshed({ accessToken: newAccessToken }));
        
        // Flush all queued requests
        processQueue(null, newAccessToken);
        
        // Re-execute original request
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);`}
          />
        </div>

        {/* 4. Spring Security Configuration Snippet */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
            <span>☕</span> Equivalent Spring Security 6 / Spring Boot 3 Backend Setup
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            On the Spring Boot backend, define stateless session management and method security:
          </p>
          <CodeBlock
            language="java"
            code={`// Spring Security 6 SecurityFilterChain
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize("hasRole('ADMIN')")
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Stateless JWT does not require CSRF for Bearer headers
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}

// Controller with Fine-Grained Authority Checking
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping
    @PreAuthorize("hasAuthority('orders:read')")
    public List<OrderDto> getOrders() {
        return orderService.findAll();
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('orders:approve')")
    public ResponseEntity<Void> approveOrder(@PathVariable String id) {
        orderService.approve(id);
        return ResponseEntity.ok().build();
    }
}`}
          />
        </div>
      </div>
    </div>
  );
};

export default RbacPage;
