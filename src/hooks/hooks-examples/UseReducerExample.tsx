import React, { useReducer, useState } from "react";
import CodeBlock from "../CodeBlock";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: "ADD"; text: string }
  | { type: "TOGGLE"; id: number }
  | { type: "DELETE"; id: number }
  | { type: "CLEAR_COMPLETED" };

const todoReducer = (state: TodoItem[], action: Action): TodoItem[] => {
  switch (action.type) {
    case "ADD":
      return [
        ...state,
        { id: Date.now(), text: action.text, completed: false },
      ];
    case "TOGGLE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "DELETE":
      return state.filter((todo) => todo.id !== action.id);
    case "CLEAR_COMPLETED":
      return state.filter((todo) => !todo.completed);
    default:
      return state;
  }
};

const initialTodos: TodoItem[] = [
  { id: 1, text: "Learn useReducer Hook", completed: true },
  { id: 2, text: "Build RTK Query Lesson", completed: false },
  { id: 3, text: "Master Tricky React Questions", completed: false },
];

const UseReducerExample: React.FC = () => {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);
  const [text, setText] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch({ type: "ADD", text: text.trim() });
      setText("");
    }
  };

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold mb-2">useReducer Hook</h2>
        <p className="text-gray-600 dark:text-gray-300">
          <strong>useReducer</strong> is an alternative to <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">useState</code> for managing complex state logic that involves multiple sub-values or when the next state depends on the previous state.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2">Basic Syntax</h3>
        <CodeBlock
          code={`import { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialState);`}
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="font-semibold text-lg">Interactive Task Manager</h3>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            placeholder="Add new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-3 py-1.5 border rounded bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-xs flex-1"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium">
            Add Task
          </button>
        </form>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
              <div
                onClick={() => dispatch({ type: "TOGGLE", id: todo.id })}
                className="flex items-center gap-2 cursor-pointer select-none flex-1">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${todo.completed ? "bg-green-500 text-white" : "border border-gray-400"}`}>
                  {todo.completed ? "✓" : ""}
                </span>
                <span className={`text-xs ${todo.completed ? "line-through text-gray-400" : ""}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE", id: todo.id })}
                className="text-[10px] px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-950 dark:hover:bg-red-900 dark:text-red-300 rounded">
                Delete
              </button>
            </div>
          ))}
        </div>

        <CodeBlock
          code={`const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { id: Date.now(), text: action.text, completed: false }];
    case "TOGGLE":
      return state.map(todo => 
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    case "DELETE":
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
};`}
        />
      </div>
    </div>
  );
};

export default UseReducerExample;
