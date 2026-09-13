import React, { useState, useMemo } from "react";
import CodeBlock from "../CodeBlock";

const UseMemoExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(["Buy groceries", "Walk the dog"]);
  const [newTodo, setNewTodo] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const expensiveCalculation = (num: number) => {
    console.log("⚡ Executing expensive calculation...");
    let sum = 0;
    for (let i = 0; i < 100000000; i++) {
      sum += num;
    }
    return sum;
  };

  const memoizedValue = useMemo(() => {
    return expensiveCalculation(count);
  }, [count]);

  const filteredTodos = useMemo(() => {
    console.log("🔍 Filtering todos list...");
    return todos.filter((todo) =>
      todo.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [todos, searchFilter]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo("");
    }
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold mb-2">useMemo Hook</h2>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>useMemo</strong> returns a memoized value. It recalculates the value only when one of its dependencies has changed. This optimization helps to avoid expensive calculations on every render.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2">Basic Syntax</h3>
        <CodeBlock
          code={`import { useMemo } from 'react';

const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);`}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="font-semibold text-lg">1. Expensive Calculation Caching</h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Notice how typing in the todo input (re-rendering the parent) does NOT re-trigger the 100 million loop calculation because <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">count</code> didn't change!
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs">
            Increment Count ({count})
          </button>
          <span className="font-mono text-xs font-semibold">
            Memoized Result: {memoizedValue}
          </span>
        </div>

        <CodeBlock
          code={`const memoizedValue = useMemo(() => {
  return expensiveCalculation(count);
}, [count]);`}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
        <h3 className="font-semibold text-lg">2. Filtering Collections</h3>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-3 py-1.5 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-xs flex-1"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="New todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="px-3 py-1.5 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-xs flex-1"
            />
            <button
              onClick={addTodo}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium">
              Add
            </button>
          </div>
        </div>

        <ul className="list-disc pl-5 space-y-1 text-xs">
          {filteredTodos.map((todo, idx) => (
            <li key={idx}>{todo}</li>
          ))}
        </ul>

        <CodeBlock
          code={`const filteredTodos = useMemo(() => {
  return todos.filter(todo => todo.includes(searchFilter));
}, [todos, searchFilter]);`}
        />
      </div>
    </div>
  );
};

export default UseMemoExample;
