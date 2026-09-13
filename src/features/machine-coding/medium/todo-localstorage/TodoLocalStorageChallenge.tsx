import React, { useState, useEffect } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "react_machine_coding_todos";

export const TodoLocalStorageChallenge: React.FC = () => {
  const { theme } = useTheme();

  // Initialize from LocalStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            { id: 1, text: "Task persisted in LocalStorage", completed: true },
            { id: 2, text: "Try refreshing the browser page!", completed: false },
          ];
    } catch (e) {
      return [];
    }
  });

  const [text, setText] = useState("");

  // Persist to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [todos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), completed: false }]);
    setText("");
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Add persistent task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`flex-1 px-3 py-1.5 border rounded text-xs sm:text-sm ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
          }`}
        />
        <button
          type="submit"
          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-semibold">
          Add Task
        </button>
      </form>

      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center justify-between p-2.5 rounded border text-xs sm:text-sm ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
            <div
              onClick={() => toggleTodo(todo.id)}
              className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="rounded"
              />
              <span className={todo.completed ? "line-through opacity-50" : "font-medium"}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded">
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 rounded text-xs flex justify-between items-center">
        <span>💾 Data automatically saved to LocalStorage under key: <code className="font-mono font-bold">{STORAGE_KEY}</code></span>
        <button
          onClick={() => setTodos([])}
          className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px]">
          Clear Storage
        </button>
      </div>
    </div>
  );
};

export default TodoLocalStorageChallenge;
