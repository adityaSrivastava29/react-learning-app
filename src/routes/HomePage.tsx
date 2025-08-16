import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { LearningNote } from "../components/LearningNote";

const HomePage: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Counter Module",
      description: "Learn useState, useReducer, useCallback, and useMemo",
      path: "/counter",
      icon: "🔢",
      concepts: ["useState", "useReducer", "useCallback", "useMemo"],
    },
    {
      title: "Todo List",
      description: "Explore useEffect, useRef, and performance optimization",
      path: "/todos",
      icon: "📝",
      concepts: ["useEffect", "useRef", "useMemo", "Nested Routes"],
    },
    {
      title: "Theme Switcher",
      description: "Master Context API and avoid props drilling",
      path: "/theme",
      icon: "🎨",
      concepts: ["useContext", "Context API", "Props Drilling"],
    },
    {
      title: "Profile Viewer",
      description: "Handle async operations and lifecycle methods",
      path: "/profile/1",
      icon: "👤",
      concepts: ["Async/Await", "API Calls", "Dynamic Routes"],
    },
    {
      title: "Settings Panel",
      description: "Redux Toolkit for complex state management",
      path: "/settings",
      icon: "⚙️",
      concepts: ["Redux Toolkit", "Async Thunks", "Global State"],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🚀 React Learning Playground
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Master React concepts through interactive examples and detailed
          explanations. Each module demonstrates core React patterns with
          real-world scenarios.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.path}
            to={feature.path}
            className={`block p-6 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                : "bg-white border-gray-200 hover:border-blue-400"
            }`}>
            <div className="text-4xl mb-3">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex flex-wrap gap-2">
              {feature.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {concept}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <LearningNote title="Getting Started with React Learning App">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">How to Use This App</h4>
            <p>
              Each module focuses on specific React concepts with hands-on
              examples. Check the browser console for detailed logging that
              shows what's happening behind the scenes.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">
              Learning Path Suggestions
            </h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Start with Counter:</strong> Basic hooks (useState,
                useReducer)
              </li>
              <li>
                <strong>Move to Todos:</strong> Effects and performance
                (useEffect, useRef, useMemo)
              </li>
              <li>
                <strong>Explore Theme:</strong> Context API and global state
              </li>
              <li>
                <strong>Try Profile:</strong> Async operations and API calls
              </li>
              <li>
                <strong>Master Settings:</strong> Redux Toolkit for complex
                state
              </li>
            </ol>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">Developer Tips</h4>
            <p>• Open DevTools Console to see detailed logs</p>
            <p>• Try the theme switcher to see Context API in action</p>
            <p>
              • Each component includes Learning Notes with deeper explanations
            </p>
            <p>• Data persists using localStorage where applicable</p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default HomePage;
