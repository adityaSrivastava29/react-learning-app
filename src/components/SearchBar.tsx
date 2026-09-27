import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import { useTheme } from "../hooks/useTheme";

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose, autoFocus = false }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, filteredResults } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle click outside to close results dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        // keep searchTerm if user is just clicking elsewhere
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (path: string) => {
    navigate(path);
    setSearchTerm("");
    if (onClose) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchTerm("");
      if (onClose) onClose();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {/* Left search icon */}
        <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">
          🔍
        </span>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search concepts, hooks, labs..."
          className={`w-full pl-8 pr-8 py-1.5 text-xs sm:text-sm rounded-xl transition-all outline-none border ${
            theme === "dark"
              ? "bg-slate-800/80 border-slate-700/80 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
              : "bg-slate-100/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 shadow-xs"
          }`}
        />

        {/* Right clear icon */}
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-0.5 rounded-full"
            aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {searchTerm && filteredResults.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-50 max-h-72 overflow-y-auto backdrop-blur-md ${
            theme === "dark"
              ? "bg-slate-900/95 border-slate-700 text-white shadow-black/60 divide-slate-800"
              : "bg-white/95 border-slate-200 text-slate-800 shadow-slate-300/50 divide-slate-100"
          } divide-y`}>
          <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-inherit">
            Found {filteredResults.length} matching topics
          </div>
          {filteredResults.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelectResult(result.path)}
              className={`px-3.5 py-2.5 cursor-pointer flex items-center justify-between text-xs sm:text-sm transition-colors ${
                theme === "dark"
                  ? "hover:bg-blue-600/20 hover:text-blue-300"
                  : "hover:bg-blue-50/80 hover:text-blue-700"
              }`}>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">📄</span>
                <span className="font-semibold">{result.label}</span>
              </div>
              {result.category && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    theme === "dark"
                      ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
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
