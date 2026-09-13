import { useState, useMemo } from "react";

const searchableContent = [
  "useState Hook",
  "useEffect Hook",
  "useCallback Hook",
  "useMemo Hook",
  "useRef Hook",
  "useReducer Hook",
  "useContext Hook",
  "Custom Hooks (useLocalStorage, useDebounce, useWindowSize)",
  "Parent-to-Child & Child-to-Parent Data Flow",
  "Unidirectional Data Flow vs Two-Way Binding",
  "React Optimization Techniques",
  "Memoization Matrix (React.memo, useMemo, useCallback)",
  "State Colocation & Pushing State Down",
  "Concurrent Rendering (useTransition & useDeferredValue)",
  "Code Splitting & Lazy Loading (React.lazy & Suspense)",
  "List Virtualization & Windowing",
  "RTK Query (Redux Toolkit Query)",
  "createApi & fetchBaseQuery",
  "Tag Invalidation & Cache Management",
  "Auto-generated Hooks (useGetPostsQuery)",
  "Tricky Question: Stale Closure in useEffect",
  "Tricky Question: Automatic Batching in React 18/19",
  "Tricky Question: Why React Has No Two-Way Binding",
  "Tricky Question: Child-to-Parent Data Communication",
  "Tricky Question: Custom Hook vs Utility Function",
  "Tricky Question: State Colocation Optimization",
  "Counter Component",
  "Todo List",
  "Theme Switcher",
  "Redux Toolkit",
  "Context API",
];

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return searchableContent.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredResults,
  };
};
