import { useState, useMemo } from "react";

const searchableContent = [
  "useState Hook",
  "useEffect Hook",
  "useContext Hook",
  "useReducer Hook",
  "useMemo Hook",
  "useCallback Hook",
  "useRef Hook",
  "Counter Component",
  "Todo List",
  "Theme Switcher",
  "Profile Viewer",
  "Settings Page",
  "Higher Order Component",
  "Redux Toolkit",
  "Context API",
  "Props Drilling",
];

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // useMemo to optimize search filtering - only recalculates when searchTerm changes
  const filteredResults = useMemo(() => {
    if (!searchTerm) return [];

    console.log(`🔍 [useSearch] Filtering results for: "${searchTerm}"`);

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
