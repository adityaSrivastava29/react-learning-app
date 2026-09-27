import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "ROLE_USER" | "ROLE_MANAGER" | "ROLE_ADMIN";

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export interface AuthLogEntry {
  id: string;
  timestamp: string;
  type: "INFO" | "SUCCESS" | "WARN" | "ERROR" | "REFRESH";
  title: string;
  detail: string;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null; // epoch timestamp ms
  isRefreshing: boolean;
  logs: AuthLogEntry[];
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  tokenExpiresAt: null,
  isRefreshing: false,
  logs: [
    {
      id: "init-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "INFO",
      title: "RBAC System Initialized",
      detail: "Ready. Select a persona to simulate authentication and token lifecycle.",
    },
  ],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; expiresInSeconds: number }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.tokenExpiresAt = Date.now() + action.payload.expiresInSeconds * 1000;
      state.isRefreshing = false;
      state.logs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: "SUCCESS",
        title: `Logged in as ${action.payload.user.name}`,
        detail: `Role: ${action.payload.user.role} | Permissions: [${action.payload.user.permissions.join(", ")}]`,
      });
    },

    logout: (state, action: PayloadAction<{ reason?: string } | undefined>) => {
      const prevUser = state.user?.username || "Guest";
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.tokenExpiresAt = null;
      state.isRefreshing = false;
      state.logs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: "WARN",
        title: `Session Cleared (${prevUser})`,
        detail: action?.payload?.reason || "User logged out or refresh token expired.",
      });
    },

    tokenRefreshed: (
      state,
      action: PayloadAction<{ accessToken: string; expiresInSeconds: number }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.tokenExpiresAt = Date.now() + action.payload.expiresInSeconds * 1000;
      state.isRefreshing = false;
      state.logs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: "REFRESH",
        title: "Access Token Refreshed",
        detail: `New JWT issued. Extended validity by ${action.payload.expiresInSeconds}s. Pending requests dispatched.`,
      });
    },

    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
      if (action.payload) {
        state.logs.unshift({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          type: "INFO",
          title: "Refresh Mutex Locked",
          detail: "Refreshing access token via simulated HttpOnly cookie. Subsequent requests queued.",
        });
      }
    },

    expireAccessTokenLocally: (state) => {
      state.tokenExpiresAt = Date.now() - 5000;
      state.logs.unshift({
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: "WARN",
        title: "Access Token Expired Manually",
        detail: "Next API request will receive 401 Unauthorized and test the refresh mutex queue.",
      });
    },

    addAuthLog: (state, action: PayloadAction<Omit<AuthLogEntry, "id" | "timestamp">>) => {
      state.logs.unshift({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toLocaleTimeString(),
        ...action.payload,
      });
      // Keep up to 25 logs
      if (state.logs.length > 25) {
        state.logs = state.logs.slice(0, 25);
      }
    },

    clearAuthLogs: (state) => {
      state.logs = [];
    },
  },
});

export const {
  loginSuccess,
  logout,
  tokenRefreshed,
  setRefreshing,
  expireAccessTokenLocally,
  addAuthLog,
  clearAuthLogs,
} = authSlice.actions;

export default authSlice.reducer;
