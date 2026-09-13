import React, { useState, useTransition, useDeferredValue, useEffect } from "react";
import CodeBlock from "../hooks/CodeBlock";
import { LearningNote } from "../components/LearningNote";
import { useTheme } from "../hooks/useTheme";

// Sub-component for Demo 1: State Colocation
const ExpensiveTreeItem: React.FC<{ index: number; theme: string }> = ({ index, theme }) => {
  const startTime = performance.now();
  while (performance.now() - startTime < 0.2) {}

  return (
    <span
      className={`inline-block p-1 m-0.5 text-[10px] rounded font-mono ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300 border border-gray-700"
          : "bg-gray-200 text-gray-800 border border-gray-300"
      }`}>
      Item #{index}
    </span>
  );
};

const ColocatedStateDemo: React.FC = () => {
  const { theme } = useTheme();
  const [parentInput, setParentInput] = useState("");
  const [parentRenderCount, setParentRenderCount] = useState(0);

  const ColocatedInput = () => {
    const [localInput, setLocalInput] = useState("");
    return (
      <input
        type="text"
        placeholder="Local state input (Fast!)..."
        value={localInput}
        onChange={(e) => setLocalInput(e.target.value)}
        className={`w-full px-3 py-1.5 border rounded text-xs transition-colors ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
        }`}
      />
    );
  };

  useEffect(() => {
    setParentRenderCount((prev) => prev + 1);
  }, [parentInput]);

  return (
    <div
      className={`space-y-3 p-4 rounded-lg border transition-colors text-xs sm:text-sm ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-gray-100 border-gray-300 text-gray-900"
      }`}>
      <div
        className={`flex items-center justify-between border-b pb-2 ${
          theme === "dark" ? "border-gray-800" : "border-gray-300"
        }`}>
        <span className="font-bold text-amber-600 dark:text-amber-400">
          ⚡ Live Sandbox: State Colocation (Pushing State Down)
        </span>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          Parent Renders: {parentRenderCount}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Un-colocated State */}
        <div
          className={`p-3 rounded border space-y-2 ${
            theme === "dark"
              ? "bg-red-950/40 border-red-800/80 text-red-200"
              : "bg-red-50 border-red-200 text-red-900"
          }`}>
          <span className="font-bold block">❌ Un-colocated State (Parent Root)</span>
          <input
            type="text"
            placeholder="Type here (Causes heavy lag)..."
            value={parentInput}
            onChange={(e) => setParentInput(e.target.value)}
            className={`w-full px-3 py-1.5 border rounded text-xs ${
              theme === "dark"
                ? "bg-gray-900 border-red-700 text-white"
                : "bg-white border-red-300 text-gray-900"
            }`}
          />
          <p className="text-[11px] opacity-90">
            Keystrokes force parent to re-render all 150 child elements below!
          </p>
        </div>

        {/* Colocated State */}
        <div
          className={`p-3 rounded border space-y-2 ${
            theme === "dark"
              ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}>
          <span className="font-bold block">✅ Colocated State (Pushed Down)</span>
          <ColocatedInput />
          <p className="text-[11px] opacity-90">
            State lives inside the input component. Typing does NOT re-render parent tree!
          </p>
        </div>
      </div>

      <div className="pt-2">
        <span className="text-xs font-bold block mb-1 opacity-80">
          Heavy Component Subtree (150 Items):
        </span>
        <div
          className={`max-h-28 overflow-y-auto p-2 rounded border ${
            theme === "dark"
              ? "bg-gray-950 border-gray-800"
              : "bg-white border-gray-300"
          }`}>
          {Array.from({ length: 150 }).map((_, idx) => (
            <ExpensiveTreeItem key={idx} index={idx} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-component for Demo 2: Concurrent Rendering
const TransitionDemo: React.FC = () => {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const mockDatabase = Array.from({ length: 8000 }).map(
    (_, i) => `Product Item #${i + 1} - ${i % 2 === 0 ? "Electronics" : "Clothing"}`
  );

  const filteredItems = mockDatabase.filter((item) =>
    item.toLowerCase().includes(deferredQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    startTransition(() => {
      setQuery(val);
    });
  };

  return (
    <div
      className={`space-y-3 p-4 rounded-lg border transition-colors text-xs sm:text-sm ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-gray-100 border-gray-300 text-gray-900"
      }`}>
      <div
        className={`flex items-center justify-between border-b pb-2 ${
          theme === "dark" ? "border-gray-800" : "border-gray-300"
        }`}>
        <span className="font-bold text-blue-600 dark:text-blue-400">
          ⚡ Live Sandbox: Non-Blocking Concurrent UI (useTransition)
        </span>
        <span className="text-xs font-mono opacity-80">
          {isPending ? "⏳ Filtering 8,000 items in background..." : "✅ Idle"}
        </span>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Type to search 8,000 items smoothly..."
          onChange={handleSearchChange}
          className={`w-full px-3 py-1.5 border rounded text-xs ${
            theme === "dark"
              ? "bg-gray-900 border-blue-600 text-white placeholder-gray-500"
              : "bg-white border-blue-400 text-gray-900 placeholder-gray-400"
          }`}
        />
        <div className="flex justify-between text-xs font-mono opacity-80">
          <span>Active Search: "{deferredQuery}"</span>
          <span>Matches Found: {filteredItems.length} items</span>
        </div>
      </div>

      <div
        className={`max-h-32 overflow-y-auto p-2.5 rounded border text-xs font-mono space-y-0.5 ${
          theme === "dark"
            ? "bg-gray-950 border-gray-800 text-emerald-400"
            : "bg-white border-gray-300 text-emerald-700"
        }`}>
        {filteredItems.slice(0, 30).map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
        {filteredItems.length > 30 && (
          <div className="opacity-60">...and {filteredItems.length - 30} more items</div>
        )}
      </div>
    </div>
  );
};

const OptimizationPage: React.FC = () => {
  const { theme } = useTheme();

  const codeBadgeClass = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-700 text-amber-300 border border-gray-600"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 text-purple-900 border border-gray-300";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span>🚀</span> React Optimization Techniques
        </h1>
        <p className={`text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Master real-world React performance optimization. Learn when and how to apply memoization, state colocation, concurrent transitions, code splitting, and virtualization.
        </p>
      </div>

      {/* Golden Rule Callout */}
      <div
        className={`p-5 rounded-lg border flex items-start gap-3 ${
          theme === "dark"
            ? "bg-blue-950/40 border-blue-800 text-blue-100"
            : "bg-blue-50 border-blue-200 text-blue-900"
        }`}>
        <span className="text-2xl">💡</span>
        <div>
          <h3 className="font-bold text-sm mb-1">The Golden Rule of React Optimization</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>Do not prematurely optimize!</strong> Memoization (<code className={codeBadgeClass}>useMemo</code>, <code className={codeBadgeClass}>useCallback</code>, <code className={codeBadgeClass}>React.memo</code>) comes with memory overhead and dependency comparison checks. Always measure performance first using React DevTools Profiler before wrapping code in memoization hooks.
          </p>
        </div>
      </div>

      {/* Section 1: Memoization Matrix */}
      <div
        className={`p-6 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <span>🧠</span> 1. The Memoization Matrix (React.memo, useMemo, useCallback)
        </h2>

        <div className="grid md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div
            className={`p-4 rounded border space-y-2 ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
            }`}>
            <h4 className="font-bold text-purple-600 dark:text-purple-400 text-sm">React.memo</h4>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              Skips re-rendering a component if its props haven't changed (shallow comparison).
            </p>
            <div className="text-xs opacity-75">
              <strong>Best for:</strong> Pure presentation components that render frequently with identical props.
            </div>
          </div>

          <div
            className={`p-4 rounded border space-y-2 ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
            }`}>
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">useMemo</h4>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              Caches the <em>result value</em> of an expensive calculation across renders.
            </p>
            <div className="text-xs opacity-75">
              <strong>Best for:</strong> Heavy loops (&gt;10ms), complex array filtering/sorting, stable object references.
            </div>
          </div>

          <div
            className={`p-4 rounded border space-y-2 ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
            }`}>
            <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm">useCallback</h4>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
              Caches a <em>function instance</em> to preserve referential equality.
            </p>
            <div className="text-xs opacity-75">
              <strong>Best for:</strong> Callback props passed to child components wrapped in <code className={codeBadgeClass}>React.memo</code>.
            </div>
          </div>
        </div>

        <CodeBlock
          language="tsx"
          code={`// ✅ Correct Usage of Memoization Trio:
const MemoChild = React.memo(({ onItemClick }) => <button onClick={onItemClick}>Click</button>);

function Parent({ items }) {
  // 1. Expensive calculation cached with useMemo
  const sortedItems = useMemo(() => items.sort((a, b) => b.score - a.score), [items]);

  // 2. Function reference cached with useCallback
  const handleClick = useCallback((id) => console.log('Clicked', id), []);

  return <MemoChild onItemClick={handleClick} />;
}`}
        />
      </div>

      {/* Section 2: State Colocation */}
      <div
        className={`p-6 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <span>📌</span> 2. State Colocation (Pushing State Down)
        </h2>
        <p className="text-sm leading-relaxed">
          Before reaching for <code className={codeBadgeClass}>useMemo</code> or <code className={codeBadgeClass}>React.memo</code>, check if state is located too high in the component tree. Moving state down to the component that actually uses it prevents entire parent component subtrees from re-rendering!
        </p>

        <ColocatedStateDemo />
      </div>

      {/* Section 3: Concurrent Rendering */}
      <div
        className={`p-6 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <span>⚡</span> 3. Concurrent Rendering (useTransition & useDeferredValue)
        </h2>
        <p className="text-sm leading-relaxed">
          React 18+ introduced concurrent rendering. <code className={codeBadgeClass}>useTransition</code> allows you to mark state updates as non-urgent (low priority) so user input remains responsive while heavy rendering tasks execute in the background.
        </p>

        <TransitionDemo />

        <CodeBlock
          language="tsx"
          code={`import { useState, useTransition } from 'react';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    startTransition(() => {
      setQuery(e.target.value);
    });
  };

  return (
    <div>
      <input onChange={handleSearch} />
      {isPending && <p>Loading list...</p>}
      <HeavyList query={query} />
    </div>
  );
}`}
        />
      </div>

      {/* Section 4: Code Splitting */}
      <div
        className={`p-6 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <span>📦</span> 4. Code Splitting & Lazy Loading (React.lazy + Suspense)
        </h2>
        <p className="text-sm leading-relaxed">
          Reduces initial JavaScript bundle size by splitting routes and large components into separate async chunks loaded on-demand.
        </p>

        <CodeBlock
          language="tsx"
          code={`import React, { lazy, Suspense } from 'react';

const HeavyAnalyticsChart = lazy(() => import('./HeavyAnalyticsChart'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading Analytics Chart...</div>}>
        <HeavyAnalyticsChart />
      </Suspense>
    </div>
  );
}`}
        />
      </div>

      {/* Section 5: List Virtualization */}
      <div
        className={`p-6 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <h2 className="text-xl font-bold flex items-center gap-2 text-purple-600 dark:text-purple-400">
          <span>🪟</span> 5. List Virtualization / Windowing
        </h2>
        <p className="text-sm leading-relaxed">
          Rendering 10,000 DOM nodes creates huge DOM memory overhead. List virtualization (using libraries like <code className={codeBadgeClass}>react-window</code>) only renders the 10-20 items currently visible inside the viewport!
        </p>

        <div
          className={`p-4 rounded border text-xs sm:text-sm space-y-1 ${
            theme === "dark"
              ? "bg-purple-950/40 border-purple-800 text-purple-200"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}>
          <strong className="block font-bold">How Virtualization Works:</strong>
          <p>
            Instead of mounting 10,000 DOM nodes, a scroll container calculates scroll position and mounts only DOM nodes that fit the height of the container. As you scroll, nodes are recycled instantly.
          </p>
        </div>
      </div>

      <LearningNote title="Optimization Summary Checklist">
        <ul className="text-xs sm:text-sm space-y-1.5 list-disc pl-4">
          <li><strong>Identify first:</strong> Use React DevTools Profiler to find real render bottlenecks.</li>
          <li><strong>Push state down:</strong> Colocate state near its usage site to prevent root re-renders.</li>
          <li><strong>Stable references:</strong> Pair <code className={codeBadgeClass}>React.memo</code> with <code className={codeBadgeClass}>useCallback</code> and <code className={codeBadgeClass}>useMemo</code>.</li>
          <li><strong>Concurrent rendering:</strong> Wrap heavy non-urgent UI updates in <code className={codeBadgeClass}>useTransition</code>.</li>
          <li><strong>Code split:</strong> Lazy load routes and heavy modal dialogs with <code className={codeBadgeClass}>React.lazy</code>.</li>
        </ul>
      </LearningNote>
    </div>
  );
};

export default OptimizationPage;
