import React, { useState, useRef, useEffect } from "react";
import CodeBlock from "../CodeBlock";

const UseRefExample: React.FC = () => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  const prevNameRef = useRef("");

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    prevNameRef.current = name;
  }, [name]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold mb-2">useRef Hook</h2>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>useRef</strong> returns a mutable ref object whose <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.current</code> property is initialized with the passed argument. It persists values across renders without causing a re-render when mutated, and provides direct access to DOM elements.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2">Basic Syntax</h3>
        <CodeBlock
          code={`import { useRef } from 'react';

const refContainer = useRef(initialValue);
// Access or mutate value: refContainer.current`}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="font-semibold text-lg">1. Accessing DOM Elements</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1.5 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-xs flex-1"
          />
          <button
            onClick={focusInput}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium">
            Focus Input
          </button>
        </div>
        <CodeBlock
          code={`const inputRef = useRef(null);

const focusInput = () => {
  inputRef.current.focus();
};

<input ref={inputRef} />
<button onClick={focusInput}>Focus</button>`}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="font-semibold text-lg">2. Storing Mutable Values Across Renders</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs">
            <span className="text-gray-500 block">Total Component Renders:</span>
            <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {renderCount.current}
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 text-xs">
            <span className="text-gray-500 block">Current vs Previous State:</span>
            <span className="font-mono text-xs block">
              Current: <strong className="text-blue-600">{name || "(empty)"}</strong>
            </span>
            <span className="font-mono text-xs block">
              Previous: <strong className="text-gray-500">{prevNameRef.current || "(empty)"}</strong>
            </span>
          </div>
        </div>

        <CodeBlock
          code={`const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
});`}
        />
      </div>
    </div>
  );
};

export default UseRefExample;
