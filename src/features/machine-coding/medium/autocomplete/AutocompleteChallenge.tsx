import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";

const mockDatabase = [
  "React.js", "React Native", "Redux Toolkit", "RTK Query", "TypeScript",
  "Tailwind CSS", "Next.js", "Node.js", "Express.js", "GraphQL", "Vite", "Webpack"
];

export const AutocompleteChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(() => {
      const filtered = mockDatabase.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    setQuery(item);
    setSuggestions([]);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search technologies (e.g. React, Redux)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedItem(null);
          }}
          className={`w-full px-3.5 py-2 border rounded text-xs sm:text-sm ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute right-3 top-2.5 text-xs text-blue-500 font-bold animate-spin">
            🔄
          </div>
        )}

        {/* Dropdown Suggestions */}
        {query.trim() && !isLoading && suggestions.length > 0 && (
          <div
            className={`absolute top-full left-0 right-0 mt-1 rounded border shadow-xl z-50 max-h-48 overflow-y-auto ${
              theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
            }`}>
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className={`px-3 py-2 cursor-pointer text-xs sm:text-sm transition-colors ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-blue-50"
                }`}>
                {item}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {query.trim() && !isLoading && suggestions.length === 0 && (
          <div
            className={`absolute top-full left-0 right-0 mt-1 p-3 rounded border text-xs text-gray-500 shadow-xl z-50 ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
            No matching technologies found.
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 rounded border border-blue-200 dark:border-blue-800 text-xs font-semibold">
          Selected: <strong>{selectedItem}</strong>
        </div>
      )}
    </div>
  );
};

export default AutocompleteChallenge;
