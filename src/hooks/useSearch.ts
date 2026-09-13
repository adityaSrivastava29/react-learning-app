import { useState, useMemo } from "react";

export interface SearchItem {
  label: string;
  path: string;
  category?: string;
}

const searchableContent: SearchItem[] = [
  { label: "useState Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "useEffect Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "useCallback Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "useMemo Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "useRef Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "useReducer Hook", path: "/hooks", category: "Hooks Lab" },
  { label: "Custom Hooks Guide", path: "/hooks", category: "Hooks Lab" },
  { label: "Data Flow & 2-Way Binding", path: "/hooks", category: "Hooks Lab" },
  { label: "RTK Query (Redux Toolkit Query)", path: "/rtk-query", category: "RTK Query" },
  { label: "createApi & fetchBaseQuery", path: "/rtk-query", category: "RTK Query" },
  { label: "Tag Invalidation & Cache Management", path: "/rtk-query", category: "RTK Query" },
  { label: "Auto-generated Hooks (useGetPostsQuery)", path: "/rtk-query", category: "RTK Query" },
  { label: "React Optimization Techniques", path: "/optimization", category: "Optimization" },
  { label: "Memoization Matrix (React.memo)", path: "/optimization", category: "Optimization" },
  { label: "State Colocation & Pushing State Down", path: "/optimization", category: "Optimization" },
  { label: "Concurrent Rendering (useTransition)", path: "/optimization", category: "Optimization" },
  { label: "Code Splitting & Lazy Loading", path: "/optimization", category: "Optimization" },
  { label: "List Virtualization & Windowing", path: "/optimization", category: "Optimization" },
  { label: "Tricky Question: Stale Closure in useEffect", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Tricky Question: Automatic Batching in React 18/19", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Tricky Question: Why React Has No Two-Way Binding", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Tricky Question: Child-to-Parent Data Communication", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Tricky Question: Custom Hook vs Utility Function", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Tricky Question: State Colocation Optimization", path: "/tricky-questions", category: "Interview Q&A" },
  { label: "Counter Component", path: "/counter", category: "Basic Module" },
  { label: "Todo List", path: "/todos", category: "Basic Module" },
  { label: "Theme Switcher", path: "/theme", category: "Basic Module" },
  { label: "Redux Toolkit Settings", path: "/settings", category: "Basic Module" },
  { label: "Profile Viewer", path: "/profile/1", category: "Basic Module" },
  { label: "About Page", path: "/about", category: "Info" },
  
  // Machine Coding Suite
  { label: "React Machine Coding Practice Suite", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Todo List (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Counter with Step Value (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Accordion Single/Multi Open (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Dynamic Tabs (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Star Rating Hover/Select (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Modal ESC & Backdrop Close (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Pagination Navigation & Size (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Image Carousel Auto-play (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: OTP Input Focus & Backspace (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Traffic Light Timer (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Chips Input Keyboard & Tags (Easy)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Searchable User List (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Debounced Search Input (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Autocomplete Dropdown (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Todo with LocalStorage Persistence (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: E-Commerce Shopping Cart (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Multi-select Dropdown Search (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Dynamic Form Generator from JSON (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: File Upload Drag & Drop Progress (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Toast Notification Imperative API (Medium)", path: "/machine-coding", category: "Machine Coding" },
  { label: "Machine Coding: Countdown Timer Hours/Mins/Secs (Medium)", path: "/machine-coding", category: "Machine Coding" },
];

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const queryLower = searchTerm.toLowerCase();

    return searchableContent.filter(
      (item) =>
        item.label.toLowerCase().includes(queryLower) ||
        (item.category && item.category.toLowerCase().includes(queryLower))
    );
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredResults,
  };
};
