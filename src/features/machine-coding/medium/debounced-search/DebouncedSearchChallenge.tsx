import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const DebouncedSearchChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [apiLogs, setApiLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!inputValue.trim()) {
      setDebouncedValue("");
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(inputValue);
      setIsDebouncing(false);
      setApiLogs((prev) => [
        `⚡ [API Call Dispatched] Searching endpoint for: "${inputValue}"`,
        ...prev,
      ]);
    }, 500);

    return () => clearTimeout(handler);
  }, [inputValue]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-semibold opacity-80 block">
          Search Input (Debounced 500ms):
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Type rapidly to see debounce in action..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full px-3 py-2 border rounded text-xs sm:text-sm ${
              theme === "dark"
                ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
          {isDebouncing && (
            <span className="absolute right-3 top-2.5 text-xs text-amber-500 font-bold animate-pulse">
              ⏳ Waiting 500ms...
            </span>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className={`p-3 rounded border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          Immediate Input State: <strong className="text-blue-600 dark:text-blue-400">{inputValue || "(empty)"}</strong>
        </div>
        <div className={`p-3 rounded border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
          Debounced Output State: <strong className="text-emerald-600 dark:text-emerald-400">{debouncedValue || "(empty)"}</strong>
        </div>
      </div>

      <div className="p-3 bg-gray-950 text-emerald-400 rounded-lg text-xs font-mono space-y-1 max-h-32 overflow-y-auto border border-gray-800">
        <p className="text-gray-500">// Simulated Backend API Dispatch Logs:</p>
        {apiLogs.length === 0 ? (
          <p className="text-gray-600 italic">No API calls dispatched yet. Type above!</p>
        ) : (
          apiLogs.map((log, i) => <div key={i}>{log}</div>)
        )}
      </div>
    </div>
  );
};

export default DebouncedSearchChallenge;
