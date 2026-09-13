import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface AccordionItem {
  id: number;
  title: string;
  content: string;
}

const accordionData: AccordionItem[] = [
  { id: 1, title: "What is React?", content: "React is a JavaScript library for building user interfaces maintained by Meta and a community of developers." },
  { id: 2, title: "What is JSX?", content: "JSX is a syntax extension for JavaScript that looks similar to HTML and allows writing markup directly inside JavaScript files." },
  { id: 3, title: "What are Hooks?", content: "Hooks are functions that let you use state and other React features without writing a class component." },
];

export const AccordionChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [openIds, setOpenIds] = useState<number[]>([1]);
  const [allowMultiple, setAllowMultiple] = useState(false);

  const toggleItem = (id: number) => {
    if (allowMultiple) {
      setOpenIds(openIds.includes(id) ? openIds.filter((i) => i !== id) : [...openIds, id]);
    } else {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <input
          type="checkbox"
          id="allowMultiple"
          checked={allowMultiple}
          onChange={(e) => setAllowMultiple(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="allowMultiple" className="cursor-pointer">
          Allow Multiple Open Sections
        </label>
      </div>

      <div className="space-y-2">
        {accordionData.map((item) => {
          const isOpen = openIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`rounded border overflow-hidden transition-all ${
                theme === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-300 bg-white"
              }`}>
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-full p-3.5 text-left font-bold text-xs sm:text-sm flex justify-between items-center ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"
                }`}>
                <span>{item.title}</span>
                <span className="text-sm font-mono">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className={`p-3.5 border-t text-xs sm:text-sm leading-relaxed ${
                  theme === "dark" ? "border-gray-800 text-gray-300 bg-gray-950/50" : "border-gray-200 text-gray-700 bg-gray-50"
                }`}>
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
