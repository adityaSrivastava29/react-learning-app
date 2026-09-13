import React, { useState } from 'react';
import { useTheme } from '../../../../hooks/useTheme';
import './style.css';

export function ChipsInputChallenge() {
  const { theme } = useTheme();
  const [chipsData, setChipsData] = useState([
    { id: 1, label: "React", active: true },
    { id: 2, label: "JavaScript", active: false },
    { id: 3, label: "TypeScript", active: false }
  ]);
  const [input, setInput] = useState("");

  const handleKeyDown = (event) => {
    const trimmedInput = input.trim();

    if (event.key === 'Enter' && trimmedInput) {
      event.preventDefault();

      const newChip = {
        id: Date.now(),
        label: trimmedInput,
        active: false
      };

      setChipsData((prev) => [...prev, newChip]);
      setInput("");
    }
  };

  const removeChip = (idToRemove) => {
    setChipsData((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const toggleActive = (idToToggle) => {
    setChipsData((prev) =>
      prev.map((chip) =>
        chip.id === idToToggle ? { ...chip, active: !chip.active } : chip
      )
    );
  };

  return (
    <div className="main-container space-y-6 w-full max-w-md mx-auto">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Chips Input</h2>
        <p className="text-xs text-slate-500">
          Type tag name and press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono">Enter</kbd> to add. Click chip to toggle active.
        </p>
      </div>

      <div className="space-y-4 w-full">
        <input
          onKeyDown={handleKeyDown}
          type="text"
          placeholder="Type a chip and press Enter..."
          className={`w-full px-4 py-2 text-sm rounded-xl border transition-all outline-none ${
            theme === 'dark'
              ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500'
              : 'bg-white border-slate-300 text-slate-900 focus:border-indigo-500'
          }`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Chips Container */}
        <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 items-center">
          {chipsData.map((chip) => (
            <div
              key={chip.id}
              onClick={() => toggleActive(chip.id)}
              className={`chip inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer select-none transition-all shadow-sm ${
                chip.active
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 ring-2 ring-indigo-400/50'
                  : theme === 'dark'
                  ? 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  // e.stopPropagation() prevents Event Bubbling!
                  // Without it, clicking delete would bubble up to parent <div>
                  // and trigger toggleActive(chip.id) at the same time.
                  e.stopPropagation();
                  removeChip(chip.id);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] opacity-75 hover:opacity-100 hover:bg-black/20 dark:hover:bg-white/20 transition-all"
                title="Remove chip"
              >
                ✕
              </button>
            </div>
          ))}

          {chipsData.length === 0 && (
            <span className="text-xs text-slate-400 italic">No chips added yet. Type above and press Enter.</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChipsInputChallenge;
