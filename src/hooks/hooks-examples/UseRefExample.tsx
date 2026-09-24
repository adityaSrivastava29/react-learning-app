import React, { useState, useRef, useEffect } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { useRefNotes } from "../hookNotesData";

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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          useRef Hook
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">useRef</strong> returns a mutable ref object whose <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium text-gray-800 dark:text-gray-200">.current</code> property is initialized with the passed argument. It persists values across renders without causing a re-render when mutated, and provides direct access to DOM elements.
        </p>
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          Basic Syntax
        </h3>
        <CodeBlock
          code={`import { useRef } from 'react';

const refContainer = useRef(initialValue);
// Access or mutate value: refContainer.current`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          1. Accessing DOM Elements
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type here..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={focusInput}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs">
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

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          2. Storing Mutable Values Across Renders
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-white dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
            <span className="text-gray-500 dark:text-gray-400 block mb-1">Total Component Renders:</span>
            <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
              {renderCount.current}
            </span>
          </div>
          <div className="p-3.5 bg-white dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm space-y-1">
            <span className="text-gray-500 dark:text-gray-400 block">Current vs Previous State:</span>
            <div className="font-mono text-xs">
              Current: <strong className="text-blue-600 dark:text-blue-400">{name || "(empty)"}</strong>
            </div>
            <div className="font-mono text-xs">
              Previous: <strong className="text-gray-500 dark:text-gray-400">{prevNameRef.current || "(empty)"}</strong>
            </div>
          </div>
        </div>

        <CodeBlock
          code={`const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
});`}
        />
      </div>

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...useRefNotes} />
    </div>
  );
};

export default UseRefExample;
