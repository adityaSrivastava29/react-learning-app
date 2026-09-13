import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const ModalChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Close on ESC keypress
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-semibold">
        Open Dialog Modal
      </button>

      {/* Backdrop & Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md p-6 rounded-xl border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 ${
              theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold">Interactive Modal Dialog</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              This modal handles closing on <strong>ESC keypress</strong>, clicking on the <strong>backdrop overlay</strong>, or pressing the <strong>close button</strong>.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-xs font-semibold rounded">
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
