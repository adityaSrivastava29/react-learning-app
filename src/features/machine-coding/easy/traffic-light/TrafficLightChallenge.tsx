import React, { useState, useEffect } from "react";

type LightColor = "red" | "yellow" | "green";

const lightDurations: Record<LightColor, number> = {
  red: 4000,
  green: 3000,
  yellow: 1500,
};

export const TrafficLightChallenge: React.FC = () => {
  const [currentColor, setCurrentColor] = useState<LightColor>("red");
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      if (currentColor === "red") setCurrentColor("green");
      else if (currentColor === "green") setCurrentColor("yellow");
      else if (currentColor === "yellow") setCurrentColor("red");
    }, lightDurations[currentColor]);

    return () => clearTimeout(timer);
  }, [currentColor, isRunning]);

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-1.5 rounded font-bold text-xs text-white ${
            isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
          }`}>
          {isRunning ? "Pause Transitions" : "Start Automatic Transitions"}
        </button>
      </div>

      {/* Traffic Light Housing */}
      <div className="inline-flex flex-col gap-3 p-4 bg-gray-950 rounded-2xl border-4 border-gray-800 shadow-2xl">
        <div
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            currentColor === "red" ? "bg-red-500 shadow-lg shadow-red-500/80 scale-105" : "bg-red-950/40"
          }`}
        />
        <div
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            currentColor === "yellow" ? "bg-yellow-400 shadow-lg shadow-yellow-400/80 scale-105" : "bg-yellow-950/40"
          }`}
        />
        <div
          className={`w-14 h-14 rounded-full transition-all duration-300 ${
            currentColor === "green" ? "bg-emerald-500 shadow-lg shadow-emerald-500/80 scale-105" : "bg-emerald-950/40"
          }`}
        />
      </div>

      <p className="text-xs font-mono font-semibold opacity-80">
        Current Active Light: <strong className="uppercase">{currentColor}</strong> ({lightDurations[currentColor]}ms)
      </p>
    </div>
  );
};

export default TrafficLightChallenge;
