import React, { useState, useReducer, useCallback, useMemo } from "react";
import { LearningNote } from "../../components/LearningNote";
import type { CounterState, CounterAction } from "../../types";
import { useTheme } from "../../hooks/useTheme";

// useReducer example
const counterReducer = (
  state: CounterState,
  action: CounterAction
): CounterState => {
  switch (action.type) {
    case "increment":
      return { ...state, value: state.value + state.step };
    case "decrement":
      return { ...state, value: state.value - state.step };
    case "reset":
      return { ...state, value: 0 };
    case "setStep":
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const CounterFeature: React.FC = () => {
  const { theme } = useTheme();

  // useState demonstration
  const [simpleCounter, setSimpleCounter] = useState(0);

  // useReducer demonstration
  const [counterState, dispatch] = useReducer(counterReducer, {
    value: 0,
    step: 1,
  });

  // useCallback demonstration - memoized functions
  const handleIncrement = useCallback(() => {
    console.log(`🔢 [Counter] Incrementing by ${counterState.step}`);
    dispatch({ type: "increment" });
  }, [counterState.step]);

  const handleDecrement = useCallback(() => {
    console.log(`🔢 [Counter] Decrementing by ${counterState.step}`);
    dispatch({ type: "decrement" });
  }, [counterState.step]);

  const handleReset = useCallback(() => {
    console.log(`🔢 [Counter] Resetting counter`);
    dispatch({ type: "reset" });
  }, []);

  // useMemo demonstration - expensive calculation
  const expensiveValue = useMemo(() => {
    console.log(
      `🧮 [Counter] Calculating expensive value for: ${counterState.value}`
    );
    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < counterState.value * 1000; i++) {
      result += i;
    }
    return result;
  }, [counterState.value]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Counter Module</h1>

      {/* useState example */}
      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">useState Example</h2>
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold">{simpleCounter}</span>
          <button
            onClick={() => setSimpleCounter((prev) => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            +
          </button>
          <button
            onClick={() => setSimpleCounter((prev) => prev - 1)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            -
          </button>
        </div>
      </div>

      {/* useReducer example */}
      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">useReducer Example</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-bold">{counterState.value}</span>
            <span className="text-sm text-gray-600">
              Step: {counterState.step}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleIncrement}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
              Increment
            </button>
            <button
              onClick={handleDecrement}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              Decrement
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
              Reset
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="step" className="text-sm">
              Step:
            </label>
            <input
              id="step"
              type="number"
              value={counterState.step}
              onChange={(e) =>
                dispatch({ type: "setStep", payload: Number(e.target.value) })
              }
              className="w-16 px-2 py-1 border rounded text-center text-gray-900"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* useMemo example */}
      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">useMemo Example</h2>
        <p className="text-sm mb-2">
          Expensive calculation result (check console for recalculation logs):
        </p>
        <p className="text-lg font-mono">{expensiveValue.toLocaleString()}</p>
      </div>

      <LearningNote title="Counter Module - Hooks Deep Dive">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">useState vs useReducer</h4>
            <p>
              <strong>useState:</strong> Perfect for simple state updates. Use
              when you have independent state variables.
            </p>
            <p>
              <strong>useReducer:</strong> Better for complex state logic,
              multiple related state variables, or when next state depends on
              previous state.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">useCallback Benefits</h4>
            <p>
              Prevents unnecessary re-renders of child components by memoizing
              functions. Dependencies array is crucial!
            </p>
            <p>
              <strong>Common Pitfall:</strong> Over-using useCallback can hurt
              performance. Only use when passing functions to child components
              or as dependencies.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">useMemo Optimization</h4>
            <p>
              Memoizes expensive calculations. Only recalculates when
              dependencies change.
            </p>
            <p>
              <strong>Real-world use case:</strong> Filtering large lists,
              complex calculations, or creating objects that shouldn't change
              reference.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-orange-600">Try This Exercise</h4>
            <p>1. Add a counter that increments by Fibonacci numbers</p>
            <p>
              2. Create a useCallback for a function that depends on multiple
              state values
            </p>
            <p>3. Use useMemo to calculate the sum of all counter values</p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default CounterFeature;
