import React from "react";
import { useSearch } from "../hooks/useSearch";

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, filteredResults } = useSearch();

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Concepts..."
        className="w-full px-3 py-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {searchTerm && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow-lg z-50 max-h-64 overflow-auto">
          {filteredResults.map((result, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-gray-100 text-gray-900">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
