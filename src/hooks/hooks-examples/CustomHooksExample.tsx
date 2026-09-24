import React, { useState, useEffect } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { customHooksNotes } from "../hookNotesData";

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
  // Demo 1: useLocalStorage
  const [name, setName] = useLocalStorage<string>("demo_user_name", "Aditya");

  // Demo 2: useDebounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Demo 3: useWindowSize
  const { width, height } = useWindowSize();

  const codeBadgeClass =
    "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border border-gray-300 dark:border-gray-600";

  const cardClass =
    "bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3";

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Creating Custom React Hooks
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          A <strong className="text-gray-900 dark:text-white">Custom Hook</strong> is a JavaScript function whose name starts with <code className={codeBadgeClass}>use</code> and that may call other React hooks. Custom hooks allow you to extract component logic into reusable functions.
        </p>
      </div>

      {/* Deep-Dive Guide Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 space-y-2">
          <h3 className="font-bold flex items-center gap-1.5 text-sm">
            <span>❓</span> When to Create a Custom Hook?
          </h3>
          <ul className="text-xs sm:text-sm space-y-1.5 list-disc pl-4 leading-relaxed opacity-95">
            <li><strong>Reusing Stateful Logic:</strong> When components need identical stateful behavior (e.g. form validation, data fetching).</li>
            <li><strong>Separating UI from Business Logic:</strong> Keep UI components clean by offloading async/event setups.</li>
            <li><strong>Abstracting Effects:</strong> Wrap complex <code className={codeBadgeClass}>useEffect</code> hooks into a simple single-line hook call.</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/70 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200 space-y-2">
          <h3 className="font-bold flex items-center gap-1.5 text-sm">
            <span>⚙️</span> Rules & Conventions for Custom Hooks
          </h3>
          <ul className="text-xs sm:text-sm space-y-1.5 list-disc pl-4 leading-relaxed opacity-95">
            <li><strong>Must start with "use":</strong> React uses the <code className={codeBadgeClass}>use</code> prefix to check hook rules automatically.</li>
            <li><strong>State logic sharing, NOT state syncing:</strong> Custom hooks share logic, not state instance between calls.</li>
            <li><strong>Top-level invocation:</strong> Never call custom hooks inside loops, conditions, or nested callbacks.</li>
          </ul>
        </div>
      </div>

      {/* Demo 1: useLocalStorage */}
      <div className={cardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span>💾</span> 1. Real-World Hook: <code className="text-blue-600 dark:text-blue-400 font-mono">useLocalStorage</code>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Persists state to browser <code className={codeBadgeClass}>localStorage</code> automatically. Refresh the page and your input value remains saved!
        </p>

        <div className="flex gap-2.5 items-center flex-wrap">
          <input
            type="text"
            className="px-3 py-2 border rounded-lg text-xs sm:text-sm flex-1 max-w-xs bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type name to persist..."
          />
          <span className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
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
      <div className={cardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span>⏱️</span> 2. Real-World Hook: <code className="text-blue-600 dark:text-blue-400 font-mono">useDebounce</code>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Delays updating state until user stops typing for 500ms (essential for search inputs to prevent API spamming).
        </p>

        <div className="space-y-2.5">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type rapidly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg border bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700">
              Immediate Input: <strong className="text-blue-600 dark:text-blue-400">{searchQuery || "(empty)"}</strong>
            </div>
            <div className="p-2.5 rounded-lg border bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700">
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
      <div className={cardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span>📐</span> 3. Real-World Hook: <code className="text-blue-600 dark:text-blue-400 font-mono">useWindowSize</code>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Listens to window resize events and returns responsive screen dimensions.
        </p>

        <div className="p-3 rounded-lg border text-xs sm:text-sm font-mono flex items-center justify-between bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700">
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

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...customHooksNotes} />
    </div>
  );
};

export default CustomHooksExample;
