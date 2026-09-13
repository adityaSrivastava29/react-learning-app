import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const CounterChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold opacity-80">Step Value:</label>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(Math.max(1, parseInt(e.target.value) || 1))}
          className={`w-20 px-2 py-1 border rounded text-xs ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        />
      </div>

      <div className={`p-6 rounded-lg border text-center space-y-4 ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="text-4xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
          {count}
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => setCount((c) => c - step)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded">
            Decrement (-{step})
          </button>

          <button
            onClick={() => setCount(0)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs sm:text-sm rounded">
            Reset
          </button>

          <button
            onClick={() => setCount((c) => c + step)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded">
            Increment (+{step})
          </button>
        </div>
      </div>
    </div>
  );
};
