import React, { useState, useEffect, useRef, useMemo } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LearningNote } from "../../components/LearningNote";
import type { Todo } from "../../types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useTheme } from "../../hooks/useTheme";

const TodoFeature: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [todos, setTodos] = useLocalStorage<Todo[]>("react-learning-todos", []);
  const [newTodoText, setNewTodoText] = useState("");
  const [filter, setFilter] = useState("all");

  // useRef demonstration - direct DOM manipulation
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect demonstration - focus input on mount
  useEffect(() => {
    console.log("📝 [Todos] Component mounted, focusing input");
    inputRef.current?.focus();
  }, []);

  // useEffect demonstration - localStorage sync
  useEffect(() => {
    console.log("📝 [Todos] Todos updated, count:", todos.length);
  }, [todos]);

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: newTodoText.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTodos((prev) => [...prev, newTodo]);
      setNewTodoText("");

      // Re-focus input after adding todo
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // useMemo demonstration - expensive filtering operation
  const filteredTodos = useMemo(() => {
    console.log("📝 [Todos] Filtering todos with filter:", filter);

    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "pending":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(
    () => ({
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
    }),
    [todos]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Todo Module</h1>

      {/* Add Todo Section */}
      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">
          Add New Todo (useRef Demo)
        </h2>
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Enter a new todo..."
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Add Todo
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`p-4 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <div className="flex justify-between items-center">
          <div className="flex space-x-6 text-sm">
            <span>Total: {stats.total}</span>
            <span className="text-green-600">Completed: {stats.completed}</span>
            <span className="text-orange-600">Pending: {stats.pending}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded text-sm ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}>
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded text-sm ${
                filter === "pending"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}>
              Pending
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded text-sm ${
                filter === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}>
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Navigation for nested routes */}
      <div className="flex space-x-4">
        <Link
          to="/todos"
          className={`px-4 py-2 rounded transition-colors ${
            location.pathname === "/todos"
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}>
          All Todos
        </Link>
        <Link
          to="/todos/pending"
          className={`px-4 py-2 rounded transition-colors ${
            location.pathname === "/todos/pending"
              ? "bg-orange-500 text-white"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}>
          Pending
        </Link>
        <Link
          to="/todos/completed"
          className={`px-4 py-2 rounded transition-colors ${
            location.pathname === "/todos/completed"
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}>
          Completed
        </Link>
      </div>

      {/* Todo List */}
      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">
          Todo List (useMemo Filtering)
        </h2>

        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {filter === "all" ? "No todos yet!" : `No ${filter} todos!`}
          </p>
        ) : (
          <div className="space-y-2">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center space-x-3 p-3 rounded border ${
                  todo.completed
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-white border-gray-200"
                } ${
                  theme === "dark" && todo.completed
                    ? "bg-green-900 text-green-200"
                    : ""
                }
                ${
                  theme === "dark" && !todo.completed
                    ? "bg-gray-700 text-white border-gray-600"
                    : ""
                }`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4"
                />
                <span
                  className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-2 py-1 text-red-500 hover:bg-red-100 rounded transition-colors">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nested routes outlet */}
        <div className="mt-6">
          <Outlet context={{ todos: filteredTodos, toggleTodo, deleteTodo }} />
        </div>
      </div>

      <LearningNote title="Todo Module - Effects, Refs, and Performance">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">useEffect Patterns</h4>
            <p>
              <strong>Mount Effect:</strong> Empty dependency array [] runs once
              on mount
            </p>
            <p>
              <strong>Update Effect:</strong> Dependency array [todos] runs when
              todos change
            </p>
            <p>
              <strong>Cleanup:</strong> Return function from useEffect for
              cleanup
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">useRef Use Cases</h4>
            <p>1. Direct DOM access (focus, scroll, measurements)</p>
            <p>2. Storing mutable values that don't trigger re-renders</p>
            <p>3. Previous values storage</p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">useMemo Performance</h4>
            <p>
              Filtering is memoized - only recalculates when todos or filter
              changes
            </p>
            <p>
              <strong>When to use:</strong> Expensive calculations, object/array
              creation that affects child re-renders
            </p>
          </div>

          <div>
            <h4 className="font-bold text-orange-600">
              LocalStorage Integration
            </h4>
            <p>
              Custom hook handles serialization, error handling, and initial
              value logic
            </p>
            <p>Data persists between sessions - try refreshing the page!</p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default TodoFeature;
