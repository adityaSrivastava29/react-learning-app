import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const CountdownTimerChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [initialMinutes, setInitialMinutes] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // In seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    if (timeLeft === 0) setTimeLeft(initialMinutes * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center items-center gap-3">
        <label className="text-xs font-semibold opacity-80">Duration (Minutes):</label>
        <input
          type="number"
          disabled={isRunning}
          value={initialMinutes}
          onChange={(e) => {
            const mins = Math.max(1, parseInt(e.target.value) || 1);
            setInitialMinutes(mins);
            setTimeLeft(mins * 60);
          }}
          className={`w-20 px-2 py-1 border rounded text-xs ${
            theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
          }`}
        />
      </div>

      <div
        className={`p-6 rounded-xl border space-y-4 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}>
        <div className={`text-5xl font-extrabold font-mono ${
          timeLeft === 0 ? "text-red-500 animate-pulse" : "text-blue-600 dark:text-blue-400"
        }`}>
          {formattedTime}
        </div>

        {timeLeft === 0 && (
          <div className="p-2 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-xs font-bold rounded">
            🔔 Time's Up! Countdown completed.
          </div>
        )}

        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs sm:text-sm rounded">
              {timeLeft === 0 ? "Restart" : "Start"}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded">
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs sm:text-sm rounded">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerChallenge;
