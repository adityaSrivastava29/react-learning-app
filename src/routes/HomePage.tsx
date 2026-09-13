import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { LearningNote } from "../components/LearningNote";

const HomePage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Hooks Lab Showcase",
      description: "Interactive lab for useState, useEffect, useCallback, useMemo, useRef, useReducer",
      path: "/hooks",
      icon: "⚓",
      concepts: ["useState", "useEffect", "useCallback", "useMemo", "useRef", "useReducer"],
      highlight: true,
    },
    {
      title: "RTK Query Mastery",
      description: "Data fetching, automated caching, tag invalidation & live store inspector",
      path: "/rtk-query",
      icon: "⚡",
      concepts: ["createApi", "fetchBaseQuery", "Tag Invalidation", "Polling", "Normalized Cache"],
      highlight: true,
    },
    {
      title: "Tricky React Questions",
      description: "One-stop interview prep suite with definitions, pitfall breakdowns & live bug sandboxes",
      path: "/tricky-questions",
      icon: "🎯",
      concepts: ["Stale Closures", "Batching", "Two-Way Binding", "Child-to-Parent Data"],
      highlight: true,
    },
    {
      title: "Optimization Techniques",
      description: "Detailed performance guide with live sandboxes for memoization, colocation, and transitions",
      path: "/optimization",
      icon: "🚀",
      concepts: ["Memoization Matrix", "State Colocation", "useTransition", "Virtualization"],
      highlight: true,
    },
    {
      title: "Counter Module",
      description: "Learn basic hook patterns and state management",
      path: "/counter",
      icon: "🔢",
      concepts: ["useState", "useReducer", "useCallback", "useMemo"],
    },
    {
      title: "Todo List App",
      description: "Explore side effects, references, and nested route layouts",
      path: "/todos",
      icon: "📝",
      concepts: ["useEffect", "useRef", "Nested Routes"],
    },
    {
      title: "Settings & Redux",
      description: "Redux Toolkit slices and global app state configuration",
      path: "/settings",
      icon: "⚙️",
      concepts: ["Redux Toolkit", "Slices", "Global State"],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          🚀 React Learning & Understanding App
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Your interactive, one-stop playground for mastering React core concepts, hooks, <strong>RTK Query</strong>, and <strong>tricky interview questions</strong> with live code execution.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`relative block p-6 rounded-xl border-2 transition-all hover:scale-[1.02] hover:shadow-lg ${
              feature.highlight
                ? theme === "dark"
                  ? "bg-gray-800/90 border-blue-500 shadow-blue-900/20"
                  : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400 shadow-blue-100"
                : theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:border-gray-500"
                : "bg-white border-gray-200 hover:border-blue-300"
            }`}>
            {feature.highlight && (
              <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-full">
                Featured
              </span>
            )}
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {feature.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {feature.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-0.5 text-[11px] font-medium bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 rounded-md">
                  {concept}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <LearningNote title="React Learning & Understanding Path">
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-bold text-blue-600">Recommended Order:</h4>
            <ol className="list-decimal list-inside space-y-1.5 mt-1">
              <li>
                <strong>Hooks Lab (<code>/hooks</code>):</strong> Master stateful and performance hooks with live visual output.
              </li>
              <li>
                <strong>RTK Query Mastery (<code>/rtk-query</code>):</strong> Learn automated API fetching, cache tagging, and mutation invalidation.
              </li>
              <li>
                <strong>Tricky React Questions (<code>/tricky-questions</code>):</strong> Test your knowledge against real interview traps like stale closures, automatic batching, and React.memo reference bugs.
              </li>
            </ol>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default HomePage;
