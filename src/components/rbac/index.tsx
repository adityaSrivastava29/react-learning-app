import React from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import type { UserRole } from "../../store/authSlice";

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  fallbackToLogin?: () => void;
  onSwitchPersona?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackToLogin,
  onSwitchPersona,
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // 1. Not Authenticated -> 401 Equivalent on Route Level
  if (!isAuthenticated || !user) {
    return (
      <div className="p-8 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto">
          🔒
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Authentication Required (401 Guard)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            This route is guarded by React Router ProtectedRoute. No valid authenticated session was found in the Redux store.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          {fallbackToLogin && (
            <button
              onClick={fallbackToLogin}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-xs">
              Log in with a Persona
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. Check Role Authorization
  const hasRole =
    !requiredRole ||
    user.role === requiredRole ||
    user.role === "ROLE_ADMIN"; // ADMIN has superuser bypass

  // 3. Check Permission Authorization
  const hasPermission =
    !requiredPermission || user.permissions.includes(requiredPermission);

  // If missing role or permission -> 403 Forbidden Equivalent
  if (!hasRole || !hasPermission) {
    return (
      <div className="p-8 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 space-y-5 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl shrink-0">
            🚫
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200">
                HTTP 403 Forbidden
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                MethodSecurity / Route Guard
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Access Denied: Insufficient Privileges
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              You are authenticated as <strong>{user.name}</strong> (<code className="font-mono text-xs">{user.role}</code>), but this view requires elevated authorities.
            </p>
          </div>
        </div>

        {/* Diagnostic Breakdown */}
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white dark:bg-gray-900/90 border border-rose-200 dark:border-rose-900/40 space-y-1">
            <span className="font-semibold text-gray-500 dark:text-gray-400 block">Required Authority:</span>
            <div className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
              {requiredRole ? `Role: ${requiredRole}` : `Permission: ${requiredPermission}`}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white dark:bg-gray-900/90 border border-rose-200 dark:border-rose-900/40 space-y-1">
            <span className="font-semibold text-gray-500 dark:text-gray-400 block">Your Granted Authorities:</span>
            <div className="font-mono text-xs text-gray-700 dark:text-gray-300 truncate">
              [{user.permissions.join(", ")}]
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
          <strong>Architectural Note:</strong> In React, hiding or blocking this page improves UX and prevents dead ends. Even if a user bypassed this React route guard via console, Spring Security's <code className="font-mono font-semibold">@PreAuthorize</code> would reject backend requests with an HTTP 403 <code className="font-mono">AccessDeniedException</code>.
        </div>

        {onSwitchPersona && (
          <div className="pt-1">
            <button
              onClick={onSwitchPersona}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs">
              Switch Persona to Manager or Admin
            </button>
          </div>
        )}
      </div>
    );
  }

  // 4. Authorized -> Render Protected Content
  return <>{children}</>;
};

/**
 * Permission-Aware UI element: Renders content only if user has the specific permission.
 */
export const Can: React.FC<{
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ permission, children, fallback = null }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const hasPermission = user?.permissions.includes(permission) || user?.role === "ROLE_ADMIN";

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Role-Aware UI element: Renders content only if user has the specific role.
 */
export const HasRole: React.FC<{
  role: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ role, children, fallback = null }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const hasRole = user?.role === role || user?.role === "ROLE_ADMIN";

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
