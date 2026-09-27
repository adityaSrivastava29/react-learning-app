import type { AuthUser, UserRole } from "../store/authSlice";

export interface MockPersona {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  avatar: string;
  description: string;
}

export const PRESET_PERSONAS: MockPersona[] = [
  {
    id: "user-1",
    username: "alex_user",
    name: "Alex Rivera",
    email: "alex@company.com",
    role: "ROLE_USER",
    permissions: ["orders:read", "profile:edit"],
    avatar: "👤",
    description: "Standard Staff: Can view orders and edit own profile. Cannot approve orders or view admin tools.",
  },
  {
    id: "mgr-1",
    username: "sarah_mgr",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "ROLE_MANAGER",
    permissions: ["orders:read", "orders:create", "orders:approve", "reports:view"],
    avatar: "👔",
    description: "Department Manager: Can view, create, and approve orders, plus access managerial reports.",
  },
  {
    id: "admin-1",
    username: "david_admin",
    name: "David Kim",
    email: "david.kim@company.com",
    role: "ROLE_ADMIN",
    permissions: [
      "orders:read",
      "orders:create",
      "orders:approve",
      "reports:view",
      "users:manage",
      "settings:admin",
    ],
    avatar: "👑",
    description: "Super Admin: Full system access, user management, and security infrastructure configuration.",
  },
];

// Private mock storage simulating server-side session and HttpOnly secure cookie
// In a real application, JavaScript CANNOT read an HttpOnly cookie!
let simulatedHttpOnlyCookie: string | null = null;
let simulatedRefreshTokenValid = true;

// Mock database orders
export interface MockOrder {
  id: string;
  customer: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  item: string;
}

let mockOrders: MockOrder[] = [
  { id: "ORD-101", customer: "Acme Corp", amount: 4850, status: "PENDING", item: "Enterprise React Licenses (50x)" },
  { id: "ORD-102", customer: "Starlight Media", amount: 1240, status: "APPROVED", item: "Cloud Infrastructure Setup" },
  { id: "ORD-103", customer: "Nexus AI Lab", amount: 9900, status: "PENDING", item: "High-Performance GPU Cluster" },
];

interface DecodedTokenPayload {
  sub: string;
  role: UserRole;
  permissions: string[];
  exp: number; // epoch ms
}

function parseMockJwt(token: string): DecodedTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch {
    return null;
  }
}

function generateMockJwt(persona: MockPersona, lifespanSeconds = 20): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: persona.username,
      name: persona.name,
      email: persona.email,
      role: persona.role,
      permissions: persona.permissions,
      iat: Date.now(),
      exp: Date.now() + lifespanSeconds * 1000,
    })
  );
  const signature = btoa("mock_spring_security_secret_sig");
  return `${header}.${payload}.${signature}`;
}

export interface BackendResponse<T = unknown> {
  status: number;
  data?: T;
  error?: string;
  message?: string;
  springSecurityCheck?: {
    filter: string;
    authenticated: boolean;
    principal: string;
    requiredAuthority?: string;
    verdict: "PASSED" | "DENIED_401" | "DENIED_403";
  };
}

export const mockAuthBackend = {
  // Simulates inspection of HttpOnly Cookie state for educational visualization
  getHttpOnlyCookieInfo() {
    return {
      hasCookie: !!simulatedHttpOnlyCookie,
      cookieValuePreview: simulatedHttpOnlyCookie
        ? `${simulatedHttpOnlyCookie.substring(0, 15)}...[HttpOnly; Secure; SameSite=Strict]`
        : null,
      isValid: simulatedRefreshTokenValid,
    };
  },

  // POST /api/auth/login
  async login(personaId: string, lifespanSeconds = 25): Promise<BackendResponse<{ user: AuthUser; accessToken: string; expiresInSeconds: number }>> {
    await new Promise((r) => setTimeout(r, 200));
    const persona = PRESET_PERSONAS.find((p) => p.id === personaId);
    if (!persona) {
      return { status: 400, error: "BAD_REQUEST", message: "Persona not found" };
    }

    const accessToken = generateMockJwt(persona, lifespanSeconds);
    simulatedHttpOnlyCookie = `rt_${persona.id}_${Math.random().toString(36).substring(2, 10)}`;
    simulatedRefreshTokenValid = true;

    return {
      status: 200,
      data: {
        user: {
          id: persona.id,
          username: persona.username,
          name: persona.name,
          email: persona.email,
          role: persona.role,
          permissions: persona.permissions,
        },
        accessToken,
        expiresInSeconds: lifespanSeconds,
      },
      springSecurityCheck: {
        filter: "UsernamePasswordAuthenticationFilter",
        authenticated: true,
        principal: persona.username,
        verdict: "PASSED",
      },
    };
  },

  // POST /api/auth/refresh
  // The browser automatically sends the HttpOnly cookie in the Cookie request header!
  async refresh(lifespanSeconds = 25): Promise<BackendResponse<{ accessToken: string; expiresInSeconds: number }>> {
    await new Promise((r) => setTimeout(r, 350)); // realistic network latency to demonstrate concurrency queueing

    if (!simulatedHttpOnlyCookie || !simulatedRefreshTokenValid) {
      return {
        status: 401,
        error: "UNAUTHORIZED",
        message: "Refresh token is missing, expired, or revoked. Please log in again.",
        springSecurityCheck: {
          filter: "JwtAuthenticationFilter (Refresh Endpoint)",
          authenticated: false,
          principal: "anonymousUser",
          verdict: "DENIED_401",
        },
      };
    }

    // Identify which persona from cookie
    const personaId = simulatedHttpOnlyCookie.split("_")[1];
    const persona = PRESET_PERSONAS.find((p) => p.id === personaId) || PRESET_PERSONAS[0];
    const newAccessToken = generateMockJwt(persona, lifespanSeconds);

    return {
      status: 200,
      data: {
        accessToken: newAccessToken,
        expiresInSeconds: lifespanSeconds,
      },
      springSecurityCheck: {
        filter: "JwtAuthenticationFilter (Refresh)",
        authenticated: true,
        principal: persona.username,
        verdict: "PASSED",
      },
    };
  },

  // POST /api/auth/logout
  async logout(): Promise<BackendResponse> {
    await new Promise((r) => setTimeout(r, 100));
    simulatedHttpOnlyCookie = null;
    simulatedRefreshTokenValid = true;
    return {
      status: 200,
      message: "Session terminated. HttpOnly refresh cookie cleared by server Set-Cookie header.",
    };
  },

  // Manual test helpers
  invalidateRefreshToken() {
    simulatedRefreshTokenValid = false;
  },

  resetOrders() {
    mockOrders = [
      { id: "ORD-101", customer: "Acme Corp", amount: 4850, status: "PENDING", item: "Enterprise React Licenses (50x)" },
      { id: "ORD-102", customer: "Starlight Media", amount: 1240, status: "APPROVED", item: "Cloud Infrastructure Setup" },
      { id: "ORD-103", customer: "Nexus AI Lab", amount: 9900, status: "PENDING", item: "High-Performance GPU Cluster" },
    ];
  },

  // Spring Security filter chain simulator for protected endpoints
  verifyAuth(authHeader: string | null, requiredRole?: UserRole, requiredPermission?: string): {
    authorized: boolean;
    status: number;
    error?: string;
    message?: string;
    payload?: DecodedTokenPayload;
    springSecurityCheck: NonNullable<BackendResponse["springSecurityCheck"]>;
  } {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        authorized: false,
        status: 401,
        error: "UNAUTHORIZED",
        message: "Full authentication is required to access this resource. Missing Bearer token in Authorization header.",
        springSecurityCheck: {
          filter: "JwtAuthenticationFilter",
          authenticated: false,
          principal: "anonymousUser",
          verdict: "DENIED_401",
        },
      };
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = parseMockJwt(token);

    if (!payload) {
      return {
        authorized: false,
        status: 401,
        error: "UNAUTHORIZED",
        message: "JWT signature validation failed or token malformed.",
        springSecurityCheck: {
          filter: "JwtAuthenticationFilter",
          authenticated: false,
          principal: "anonymousUser",
          verdict: "DENIED_401",
        },
      };
    }

    if (Date.now() > payload.exp) {
      return {
        authorized: false,
        status: 401,
        error: "TOKEN_EXPIRED",
        message: `JWT expired at ${new Date(payload.exp).toLocaleTimeString()}. Refresh token rotation required.`,
        springSecurityCheck: {
          filter: "JwtAuthenticationFilter",
          authenticated: false,
          principal: payload.sub,
          verdict: "DENIED_401",
        },
      };
    }

    // Authentication passed! Now test Authorization (@PreAuthorize)
    if (requiredRole && payload.role !== requiredRole && payload.role !== "ROLE_ADMIN") {
      return {
        authorized: false,
        status: 403,
        error: "FORBIDDEN",
        message: `Access Denied: Principal '${payload.sub}' with role '${payload.role}' lacks required role '${requiredRole}'.`,
        payload,
        springSecurityCheck: {
          filter: "MethodSecurityInterceptor (@PreAuthorize)",
          authenticated: true,
          principal: payload.sub,
          requiredAuthority: requiredRole,
          verdict: "DENIED_403",
        },
      };
    }

    if (requiredPermission && !payload.permissions.includes(requiredPermission)) {
      return {
        authorized: false,
        status: 403,
        error: "FORBIDDEN",
        message: `Access Denied: Principal '${payload.sub}' lacks required authority '${requiredPermission}'. Granted authorities: [${payload.permissions.join(", ")}]`,
        payload,
        springSecurityCheck: {
          filter: "MethodSecurityInterceptor (@PreAuthorize)",
          authenticated: true,
          principal: payload.sub,
          requiredAuthority: requiredPermission,
          verdict: "DENIED_403",
        },
      };
    }

    return {
      authorized: true,
      status: 200,
      payload,
      springSecurityCheck: {
        filter: "MethodSecurityInterceptor & FilterSecurityInterceptor",
        authenticated: true,
        principal: payload.sub,
        requiredAuthority: requiredPermission || requiredRole || "AUTHENTICATED",
        verdict: "PASSED",
      },
    };
  },

  // GET /api/orders (Requires: orders:read)
  async getOrders(authHeader: string | null): Promise<BackendResponse<MockOrder[]>> {
    await new Promise((r) => setTimeout(r, 120));
    const auth = this.verifyAuth(authHeader, undefined, "orders:read");
    if (!auth.authorized) {
      return {
        status: auth.status,
        error: auth.error,
        message: auth.message,
        springSecurityCheck: auth.springSecurityCheck,
      };
    }

    return {
      status: 200,
      data: [...mockOrders],
      springSecurityCheck: auth.springSecurityCheck,
    };
  },

  // POST /api/orders/approve (Requires: orders:approve)
  async approveOrder(authHeader: string | null, orderId: string): Promise<BackendResponse<MockOrder>> {
    await new Promise((r) => setTimeout(r, 150));
    const auth = this.verifyAuth(authHeader, undefined, "orders:approve");
    if (!auth.authorized) {
      return {
        status: auth.status,
        error: auth.error,
        message: auth.message,
        springSecurityCheck: auth.springSecurityCheck,
      };
    }

    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) {
      return { status: 404, error: "NOT_FOUND", message: `Order ${orderId} not found.` };
    }

    order.status = "APPROVED";
    return {
      status: 200,
      data: { ...order },
      message: `Order ${orderId} approved successfully by ${auth.payload?.sub}.`,
      springSecurityCheck: auth.springSecurityCheck,
    };
  },

  // GET /api/admin/system-metrics (Requires: ROLE_ADMIN)
  async getSystemMetrics(authHeader: string | null): Promise<BackendResponse<{ jvmMemory: string; dbConnections: number; activeThreads: number; uptime: string }>> {
    await new Promise((r) => setTimeout(r, 150));
    const auth = this.verifyAuth(authHeader, "ROLE_ADMIN");
    if (!auth.authorized) {
      return {
        status: auth.status,
        error: auth.error,
        message: auth.message,
        springSecurityCheck: auth.springSecurityCheck,
      };
    }

    return {
      status: 200,
      data: {
        jvmMemory: "512MB / 2048MB (Heap Allocation)",
        dbConnections: 14,
        activeThreads: 32,
        uptime: "14 days, 6 hours, 22 minutes",
      },
      springSecurityCheck: auth.springSecurityCheck,
    };
  },
};
