import React, { useState, useEffect } from "react";
import CodeBlock from "../CodeBlock";
import { useTheme } from "../useTheme";

// Custom Hook 1: useLocalStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Custom Hook 2: useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom Hook 3: useWindowSize
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const CustomHooksExample: React.FC = () => {
  const { theme } = useTheme();

  // Demo 1: useLocalStorage
  const [name, setName] = useLocalStorage<string>("demo_user_name", "Aditya");

  // Demo 2: useDebounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Demo 3: useWindowSize
  const { width, height } = useWindowSize();

  const codeBadgeClass = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-700 text-amber-300 border border-gray-600"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 text-purple-900 border border-gray-300";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Creating Custom React Hooks</h2>
        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          A <strong>Custom Hook</strong> is a JavaScript function whose name starts with <code className={codeBadgeClass}>use</code> and that may call other React hooks. Custom hooks allow you to extract component logic into reusable functions.
        </p>
      </div>

      {/* Deep-Dive Guide Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-lg border space-y-2 ${
            theme === "dark"
              ? "bg-blue-950/40 border-blue-800 text-blue-200"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}>
          <h3 className="font-bold flex items-center gap-1.5 text-sm">
            <span>❓</span> When to Create a Custom Hook?
          </h3>
          <ul className="text-xs sm:text-sm space-y-1 list-disc pl-4 leading-relaxed opacity-95">
            <li><strong>Reusing Stateful Logic:</strong> When components need identical stateful behavior (e.g. form validation, data fetching).</li>
            <li><strong>Separating UI from Business Logic:</strong> Keep UI components clean by offloading async/event setups.</li>
            <li><strong>Abstracting Effects:</strong> Wrap complex <code className={codeBadgeClass}>useEffect</code> hooks into a simple single-line hook call.</li>
          </ul>
        </div>

        <div
          className={`p-4 rounded-lg border space-y-2 ${
            theme === "dark"
              ? "bg-purple-950/40 border-purple-800 text-purple-200"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}>
          <h3 className="font-bold flex items-center gap-1.5 text-sm">
            <span>⚙️</span> Rules & Conventions for Custom Hooks
          </h3>
          <ul className="text-xs sm:text-sm space-y-1 list-disc pl-4 leading-relaxed opacity-95">
            <li><strong>Must start with "use":</strong> React uses the <code className={codeBadgeClass}>use</code> prefix to check hook rules automatically.</li>
            <li><strong>State logic sharing, NOT state syncing:</strong> Custom hooks share logic, not state instance between calls.</li>
            <li><strong>Top-level invocation:</strong> Never call custom hooks inside loops, conditions, or nested callbacks.</li>
          </ul>
        </div>
      </div>

      {/* Demo 1: useLocalStorage */}
      <div
        className={`p-4 rounded-lg border space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}>
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>💾</span> 1. Real-World Hook: <code>useLocalStorage</code>
        </h3>
        <p className="text-xs sm:text-sm opacity-80">
          Persists state to browser <code className={codeBadgeClass}>localStorage</code> automatically. Refresh the page and your input value remains saved!
        </p>

        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            className={`px-3 py-1.5 border rounded text-xs sm:text-sm flex-1 max-w-xs ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type name to persist..."
          />
          <span className="text-xs font-mono opacity-90">
            LocalStorage: <strong>{name}</strong>
          </span>
        </div>

        <CodeBlock
          language="ts"
          code={`function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}`}
        />
      </div>

      {/* Demo 2: useDebounce */}
      <div
        className={`p-4 rounded-lg border space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}>
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>⏱️</span> 2. Real-World Hook: <code>useDebounce</code>
        </h3>
        <p className="text-xs sm:text-sm opacity-80">
          Delays updating state until user stops typing for 500ms (essential for search inputs to prevent API spamming).
        </p>

        <div className="space-y-2">
          <input
            type="text"
            className={`w-full px-3 py-1.5 border rounded text-xs sm:text-sm ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
            placeholder="Type rapidly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className={`p-2 rounded border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              Immediate Input: <strong className="text-blue-600 dark:text-blue-400">{searchQuery || "(empty)"}</strong>
            </div>
            <div className={`p-2 rounded border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
              Debounced Output (500ms): <strong className="text-emerald-600 dark:text-emerald-400">{debouncedQuery || "(empty)"}</strong>
            </div>
          </div>
        </div>

        <CodeBlock
          language="ts"
          code={`function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}`}
        />
      </div>

      {/* Demo 3: useWindowSize */}
      <div
        className={`p-4 rounded-lg border space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}>
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>📐</span> 3. Real-World Hook: <code>useWindowSize</code>
        </h3>
        <p className="text-xs sm:text-sm opacity-80">
          Listens to window resize events and returns responsive screen dimensions.
        </p>

        <div className={`p-3 rounded border text-xs sm:text-sm font-mono flex items-center justify-between ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <span>Current Screen Bounds:</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {width}px × {height}px
          </span>
        </div>

        <CodeBlock
          language="ts"
          code={`function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}`}
        />
      </div>
    </div>
  );
};

export default CustomHooksExample;
