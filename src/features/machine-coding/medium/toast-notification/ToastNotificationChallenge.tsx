import React, { useState } from "react";


interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export const ToastNotificationChallenge: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => addToast("Changes saved successfully!", "success")}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-bold">
          Trigger Success Toast
        </button>

        <button
          onClick={() => addToast("Failed to connect to backend server!", "error")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold">
          Trigger Error Toast
        </button>

        <button
          onClick={() => addToast("New software update available.", "info")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold">
          Trigger Info Toast
        </button>
      </div>

      {/* Floating Toast Notification Container (Top Right Stack) */}
      <div className="fixed top-20 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl shadow-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium animate-in slide-in-from-right-10 duration-200 ${
              toast.type === "success"
                ? "bg-emerald-600 border-emerald-500 text-white"
                : toast.type === "error"
                ? "bg-red-600 border-red-500 text-white"
                : "bg-blue-600 border-blue-500 text-white"
            }`}>
            <div className="flex items-center gap-2">
              <span>{toast.type === "success" ? "✓" : toast.type === "error" ? "⚠️" : "ℹ️"}</span>
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:opacity-75 font-bold ml-2">
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToastNotificationChallenge;
