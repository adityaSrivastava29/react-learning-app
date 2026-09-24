import React, { useState, useEffect } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { useEffectNotes } from "../hookNotesData";

const UseEffectExample: React.FC = () => {
  // State for tracking window width
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update window width
    const handleResize = () => setWindowWidth(window.innerWidth);

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // State and effect for user input delay
  const [inputValue, setInputValue] = useState("");
  const [delayedValue, setDelayedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDelayedValue(inputValue);
    }, 1000); // Update delayedValue after 1 second

    return () => {
      clearTimeout(handler); // Clear timeout if the component unmounts before delay
    };
  }, [inputValue]); // Only re-run the effect if inputValue changes

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          useEffect Hook
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">useEffect</strong> is a hook for managing side-effects such as data fetching, subscriptions, or manually changing the DOM in React components. It replaces component lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount.
        </p>
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          Basic Syntax
        </h3>
        <CodeBlock
          code={`import { useEffect } from 'react'

useEffect(() => {
  // Side-effect logic
  return () => {
    // Cleanup
  }
}, [dependencies]) // Re-run effect if dependencies change`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          1. Window Resize Example (Event Listener Cleanup)
        </h3>
        <div className="p-3 bg-white dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm font-semibold">
          Window width: <span className="text-blue-600 dark:text-blue-400">{windowWidth}px</span>
        </div>
        <CodeBlock
          code={`const [windowWidth, setWindowWidth] = useState(window.innerWidth)

useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          2. Debounced Input Delay Example
        </h3>
        <div className="space-y-2.5">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type something..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="p-3 bg-white dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-mono">
            Delayed Output (1s): <strong className="text-blue-600 dark:text-blue-400">{delayedValue || "(waiting...)"}</strong>
          </div>
        </div>
        <CodeBlock
          code={`const [inputValue, setInputValue] = useState('')
const [delayedValue, setDelayedValue] = useState('')

useEffect(() => {
  const handler = setTimeout(() => setDelayedValue(inputValue), 1000)
  return () => clearTimeout(handler)
}, [inputValue])`}
        />
      </div>

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...useEffectNotes} />
    </div>
  );
};

export default UseEffectExample;
