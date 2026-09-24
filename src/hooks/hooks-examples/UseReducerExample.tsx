import React, { useReducer, useState } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { useReducerNotes } from "../hookNotesData";

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
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          useReducer Hook
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">useReducer</strong> is an alternative to <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono font-medium text-gray-800 dark:text-gray-200">useState</code> for managing complex state logic that involves multiple sub-values or when the next state depends on the previous state.
        </p>
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          Basic Syntax
        </h3>
        <CodeBlock
          code={`import { useReducer } from 'react';

const [state, dispatch] = useReducer(reducer, initialState);`}
        />
      </div>

      <div className="bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-4">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
          Interactive Task Manager
        </h3>

        <form onSubmit={handleAdd} className="flex gap-2.5">
          <input
            type="text"
            placeholder="Add new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs">
            Add Task
          </button>
        </form>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-gray-900/90 rounded-lg border border-gray-200 dark:border-gray-700">
              <div
                onClick={() => dispatch({ type: "TOGGLE", id: todo.id })}
                className="flex items-center gap-2.5 cursor-pointer select-none flex-1">
                <span className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-colors ${todo.completed ? "bg-emerald-600 text-white" : "border border-gray-400 dark:border-gray-600"}`}>
                  {todo.completed ? "✓" : ""}
                </span>
                <span className={`text-xs sm:text-sm ${todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200 font-medium"}`}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => dispatch({ type: "DELETE", id: todo.id })}
                className="text-xs px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-md font-medium transition-colors">
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

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...useReducerNotes} />
    </div>
  );
};

export default UseReducerExample;
