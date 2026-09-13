import React from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { useTheme } from "../hooks/useTheme";

const SearchBar: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredResults } = useSearch();

  const handleSelectResult = (path: string) => {
    navigate(path);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Concepts..."
        className={`w-full px-3 py-2 rounded text-sm transition-colors focus:outline-none focus:ring-2 ${
          theme === "dark"
            ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
            : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-400"
        }`}
      />

      {searchTerm && filteredResults.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-1 rounded border shadow-xl z-50 max-h-64 overflow-y-auto ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}>
          {filteredResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelectResult(result.path)}
              className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-xs sm:text-sm transition-colors border-b last:border-b-0 ${
                theme === "dark"
                  ? "hover:bg-gray-800 border-gray-800"
                  : "hover:bg-blue-50 border-gray-100"
              }`}>
              <span className="font-medium">{result.label}</span>
              {result.category && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    theme === "dark"
                      ? "bg-blue-900/80 text-blue-200 border border-blue-700"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}>
                  {result.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
