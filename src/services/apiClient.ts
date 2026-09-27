import { store } from "../store";
import {
  tokenRefreshed,
  logout,
  setRefreshing,
  addAuthLog,
} from "../store/authSlice";
import { mockAuthBackend, type BackendResponse } from "./mockAuthBackend";

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Concurrency-Safe API Client simulating production Axios/Fetch interceptor with Mutex Refresh Queue.
 */
export const apiClient = {
  getQueueLength() {
    return failedQueue.length;
  },

  async request<T>(
    endpointFn: (authHeader: string | null) => Promise<BackendResponse<T>>,
    endpointName: string
  ): Promise<BackendResponse<T>> {
    const state = store.getState();
    const currentToken = state.auth.accessToken;
    const authHeader = currentToken ? `Bearer ${currentToken}` : null;

    store.dispatch(
      addAuthLog({
        type: "INFO",
        title: `HTTP Call: ${endpointName}`,
        detail: `Authorization: ${authHeader ? "Bearer " + currentToken?.substring(0, 16) + "..." : "None (Anonymous)"}`,
      })
    );

    // Initial Request Execution
    const response = await endpointFn(authHeader);

    // 200 OK
    if (response.status === 200) {
      store.dispatch(
        addAuthLog({
          type: "SUCCESS",
          title: `200 OK: ${endpointName}`,
          detail: `Spring Security Verdict: PASSED | Principal: ${response.springSecurityCheck?.principal}`,
        })
      );
      return response;
    }

    // 403 Forbidden: Authenticated, but lacks authority
    if (response.status === 403) {
      store.dispatch(
        addAuthLog({
          type: "ERROR",
          title: `403 Forbidden: ${endpointName}`,
          detail: response.message || "Access Denied by Spring Security @PreAuthorize check.",
        })
      );
      return response;
    }

    // 401 Unauthorized: Access token missing, invalid or expired
    if (response.status === 401) {
      store.dispatch(
        addAuthLog({
          type: "WARN",
          title: `401 Unauthorized: ${endpointName}`,
          detail: `${response.message} Initiating token refresh workflow...`,
        })
      );

      // If another request is ALREADY refreshing the token, QUEUE this request!
      if (isRefreshing) {
        store.dispatch(
          addAuthLog({
            type: "INFO",
            title: `Queueing Request: ${endpointName}`,
            detail: `Concurrent request intercepted. Waiting in Mutex Queue (Queue size: ${failedQueue.length + 1}).`,
          })
        );

        return new Promise<BackendResponse<T>>((resolve, reject) => {
          failedQueue.push({
            resolve: async (newToken: string) => {
              store.dispatch(
                addAuthLog({
                  type: "INFO",
                  title: `Replaying Queued Request: ${endpointName}`,
                  detail: "Retrying with refreshed Access Token from resolved mutex queue.",
                })
              );
              try {
                const retryResponse = await endpointFn(`Bearer ${newToken}`);
                resolve(retryResponse);
              } catch (err) {
                reject(err as Error);
              }
            },
            reject: (err: Error) => {
              reject(err);
            },
          });
        });
      }

      // First 401 encountered: Lock the refresh mutex!
      isRefreshing = true;
      store.dispatch(setRefreshing(true));

      try {
        const refreshResponse = await mockAuthBackend.refresh(25);

        if (refreshResponse.status === 200 && refreshResponse.data) {
          const newToken = refreshResponse.data.accessToken;

          // Update Redux state with new token
          store.dispatch(
            tokenRefreshed({
              accessToken: newToken,
              expiresInSeconds: refreshResponse.data.expiresInSeconds,
            })
          );

          // Flush queued requests with the new token
          processQueue(null, newToken);

          // Retry the original request that failed
          const retryOriginalResponse = await endpointFn(`Bearer ${newToken}`);
          return retryOriginalResponse;
        } else {
          throw new Error(refreshResponse.message || "Failed to refresh token");
        }
      } catch (refreshErr) {
        const error = refreshErr instanceof Error ? refreshErr : new Error("Session expired");
        processQueue(error, null);

        store.dispatch(
          logout({
            reason: "Refresh token expired or invalid (HTTP 401 on /refresh). Redux auth cleared, redirecting to login.",
          })
        );

        return {
          status: 401,
          error: "SESSION_EXPIRED",
          message: "Session expired. Please log in again.",
          springSecurityCheck: {
            filter: "JwtAuthenticationFilter",
            authenticated: false,
            principal: "anonymousUser",
            verdict: "DENIED_401",
          },
        };
      } finally {
        isRefreshing = false;
        store.dispatch(setRefreshing(false));
      }
    }

    return response;
  },

  // Convenience API wrappers
  getOrders() {
    return this.request((header) => mockAuthBackend.getOrders(header), "GET /api/orders");
  },

  approveOrder(orderId: string) {
    return this.request(
      (header) => mockAuthBackend.approveOrder(header, orderId),
      `POST /api/orders/approve (${orderId})`
    );
  },

  getSystemMetrics() {
    return this.request(
      (header) => mockAuthBackend.getSystemMetrics(header),
      "GET /api/admin/system-metrics"
    );
  },
};
