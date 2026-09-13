import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

const mockItems = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  title: `Item #${i + 1}`,
  description: `Detail description payload for item ${i + 1}`,
}));

export const PaginationChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(mockItems.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = mockItems.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold opacity-80">
          Showing {startIndex + 1} - {Math.min(startIndex + pageSize, mockItems.length)} of {mockItems.length}
        </span>
        <div className="flex items-center gap-2">
          <label className="font-semibold opacity-80">Page Size:</label>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className={`px-2 py-1 border rounded text-xs ${
              theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}>
            <option value={5}>5 items</option>
            <option value={10}>10 items</option>
            <option value={15}>15 items</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded border text-xs sm:text-sm flex justify-between items-center ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
            <span className="font-bold text-blue-600 dark:text-blue-400">{item.title}</span>
            <span className="text-gray-500">{item.description}</span>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center gap-2 pt-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs font-semibold">
          ← Previous
        </button>

        <div className="flex gap-1 overflow-x-auto">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white"
                    : theme === "dark"
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs font-semibold">
          Next →
        </button>
      </div>
    </div>
  );
};
