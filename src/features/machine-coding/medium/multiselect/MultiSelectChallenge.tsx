import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

const allOptions = ["JavaScript", "TypeScript", "React", "Vue", "Angular", "Node.js", "Python", "Docker"];

export const MultiSelectChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<string[]>(["React", "TypeScript"]);
  const [filter, setFilter] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (opt: string) => {
    setSelected((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleSelectAll = () => {
    setSelected(allOptions);
  };

  const handleClearAll = () => {
    setSelected([]);
  };

  const filteredOptions = allOptions.filter((opt) =>
    opt.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Selected Tags Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded border min-h-12 flex flex-wrap gap-1.5 items-center cursor-pointer ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}>
        {selected.length === 0 ? (
          <span className="text-xs text-gray-400">Click to select options...</span>
        ) : (
          selected.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-600 text-white flex items-center gap-1">
              {item}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(item);
                }}
                className="hover:text-red-300 font-bold ml-1">
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {/* Options Dropdown Menu */}
      {isOpen && (
        <div
          className={`p-3 rounded border shadow-xl space-y-3 ${
            theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          }`}>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search options..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`flex-1 px-3 py-1 border rounded text-xs ${
                theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
            <button
              onClick={handleSelectAll}
              className="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold">
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1 bg-gray-600 text-white rounded text-[11px] font-bold">
              Clear All
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1">
            {filteredOptions.map((opt) => {
              const isChecked = selected.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className={`p-2 rounded cursor-pointer text-xs flex items-center justify-between transition-colors ${
                    isChecked
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold"
                      : theme === "dark"
                      ? "hover:bg-gray-800 text-gray-200"
                      : "hover:bg-gray-100 text-gray-800"
                  }`}>
                  <span>{opt}</span>
                  {isChecked && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectChallenge;
