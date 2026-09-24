import React, { useState, useCallback, memo } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { useCallbackNotes } from "../hookNotesData";

interface ExpensiveChildProps {
  onClick: () => void;
  name: string;
}

const ExpensiveChild = memo(({ onClick, name }: ExpensiveChildProps) => {
  console.log(`ExpensiveChild (${name}) rendered`);

  return (
    <div className="p-3 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-xs space-y-2">
      <p className="font-semibold text-gray-700 dark:text-gray-300">Expensive Child Component: {name}</p>
      <button
        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold"
        onClick={onClick}>
        Click me from {name}
      </button>
    </div>
  );
});

ExpensiveChild.displayName = "ExpensiveChild";

const UseCallbackExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [items, setItems] = useState(["Item 1", "Item 2"]);

  const handleClickWithoutCallback = () => {
    console.log("Clicked without useCallback!");
    setCount((prev) => prev + 1);
  };

  const handleClickWithCallback = useCallback(() => {
    console.log("Clicked with useCallback!");
    setCount((prev) => prev + 1);
  }, []);

  const handleClickWithDeps = useCallback(() => {
    console.log(`Clicked with current name: ${name}`);
    setCount((prev) => prev + 1);
  }, [name]);

  const addItem = useCallback(() => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
  }, []);

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          useCallback Hook
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">useCallback</strong> is a React hook that returns a memoized callback function. It's used to optimize performance by preventing unnecessary re-renders of child components that depend on callback functions.
        </p>
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          Basic Syntax
        </h3>
        <CodeBlock
          code={`import { useCallback } from 'react'

const memoizedCallback = useCallback(
  () => {
    // Your function logic
  },
  [dependency1, dependency2]
)`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-4">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          1. Performance Comparison
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type name to trigger re-renders..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="font-mono text-sm">
            <strong>Parent Count: {count}</strong>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-red-500 mb-1">Without useCallback (Re-renders on every render)</h4>
              <ExpensiveChild
                onClick={handleClickWithoutCallback}
                name="Without Callback"
              />
            </div>

            <div>
              <h4 className="text-xs font-bold text-green-500 mb-1">With useCallback (Memoized function reference)</h4>
              <ExpensiveChild
                onClick={handleClickWithCallback}
                name="With Callback"
              />
            </div>
          </div>
        </div>

        <CodeBlock
          code={`// Without useCallback - recreated every render
const handleClick = () => setCount(prev => prev + 1)

// With useCallback - memoized reference
const handleClick = useCallback(() => setCount(prev => prev + 1), [])`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          2. useCallback with State Dependencies
        </h3>
        <ExpensiveChild onClick={handleClickWithDeps} name="With Dependencies" />
        <CodeBlock
          code={`const handleClickWithDeps = useCallback(() => {
  console.log(\`Clicked with name: \${name}\`)
  setCount(prev => prev + 1)
}, [name]) // Re-created only when name changes`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          3. Dynamic Item Ingestion
        </h3>
        <div className="flex items-center gap-3">
          <button className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs" onClick={addItem}>
            Add Item
          </button>
          <span className="text-xs font-mono px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            Count: {items.length}
          </span>
        </div>
        <CodeBlock
          code={`const addItem = useCallback(() => {
  setItems(prev => [...prev, \`Item \${prev.length + 1}\`])
}, [])`}
        />
      </div>

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...useCallbackNotes} />
    </div>
  );
};

export default UseCallbackExample;
