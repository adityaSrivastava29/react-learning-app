import React from "react";
import { useOutletContext } from "react-router-dom";
import type { Todo } from "../../../types";

interface TodoContextType {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const TodoCompleted: React.FC = () => {
  const { todos, toggleTodo, deleteTodo } = useOutletContext<TodoContextType>();

  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-green-600">
        Completed Todos ({completedTodos.length})
      </h3>
      {completedTodos.length === 0 ? (
        <p className="text-gray-500">No completed todos yet!</p>
      ) : (
        <div className="space-y-2">
          {completedTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center space-x-3 p-2 bg-green-50 rounded border border-green-200">
              <input
                type="checkbox"
                checked={true}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4"
              />
              <span className="flex-1 line-through text-green-700">
                {todo.text}
              </span>
              <span className="text-xs text-green-600">
                ✅ {todo.updatedAt.toLocaleDateString()}
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

export default TodoCompleted;
