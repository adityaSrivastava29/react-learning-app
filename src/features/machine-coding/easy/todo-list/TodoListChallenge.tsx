import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoListChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn React Machine Coding", completed: true },
    { id: 2, text: "Build Todo List Challenge", completed: false },
    { id: 3, text: "Practice Star Rating & Modal", completed: false },
  ]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  const filteredTodos = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          placeholder="Add new task..."
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
          Add
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-all ${
              filter === f
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {/* Todo Items List */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No tasks found in this filter.</p>
        ) : (
          filteredTodos.map((todo) => (
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
                  className="rounded text-blue-600"
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
          ))
        )}
      </div>
    </div>
  );
};
