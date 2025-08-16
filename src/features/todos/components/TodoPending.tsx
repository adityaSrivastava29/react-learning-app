import React from "react";
import { useOutletContext } from "react-router-dom";
import type { Todo } from "../../../types";

interface TodoContextType {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoPending: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useOutletContext<TodoContextType>();

  const pendingTodos = todos.filter((todo) => !todo.completed);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-orange-600">
        Pending Todos ({pendingTodos.length})
      </h3>
      {pendingTodos.length === 0 ? (
        <p className="text-gray-500">No pending todos! Great job! 🎉</p>
      ) : (
        <div className="space-y-2">
          {pendingTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center space-x-3 p-2 bg-orange-50 rounded border border-orange-200">
              <input
                type="checkbox"
                checked={false}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />
              <span className="flex-1 text-orange-700">{todo.text}</span>
              <span className="text-xs text-orange-600">
                📅 {todo.createdAt.toLocaleDateString()}
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
    </div>
  );
};

export default TodoPending;
