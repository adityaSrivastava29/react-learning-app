import React from "react";
import { useTheme } from "../hooks/useTheme";
import { LearningNote } from "../components/LearningNote";

const AboutPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">About React Learning App</h1>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-2xl font-semibold mb-4">🎯 Mission</h2>
        <p className="text-lg leading-relaxed">
          This application serves as a comprehensive learning playground for
          React concepts. Rather than just reading about React patterns, you can
          interact with them, see console logs showing what's happening, and
          understand the real-world applications.
        </p>
      </div>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-2xl font-semibold mb-4">🛠 What You'll Learn</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-blue-600 mb-2">Core Hooks</h3>
            <ul className="space-y-1 text-sm">
              <li>• useState - Simple state management</li>
              <li>• useEffect - Side effects and lifecycle</li>
              <li>• useContext - Consuming context values</li>
              <li>• useReducer - Complex state logic</li>
              <li>• useMemo - Performance optimization</li>
              <li>• useCallback - Function memoization</li>
              <li>• useRef - DOM access and mutable refs</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-green-600 mb-2">Advanced Patterns</h3>
            <ul className="space-y-1 text-sm">
              <li>• Context API for global state</li>
              <li>• Higher-Order Components (HOC)</li>
              <li>• Custom hooks for reusable logic</li>
              <li>• Props drilling and solutions</li>
              <li>• Redux Toolkit integration</li>
              <li>• Async operations with APIs</li>
              <li>• Performance optimization techniques</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-2xl font-semibold mb-4">🏗 Architecture</h2>
        <div className="space-y-3">
          <p>
            <strong>Tech Stack:</strong> React 18, TypeScript, Vite, React
            Router v6, Redux Toolkit, TailwindCSS
          </p>
          <p>
            <strong>Code Organization:</strong> Feature-based modules with clear
            separation of concerns
          </p>
          <p>
            <strong>Best Practices:</strong> TypeScript strict mode, ESLint
            rules, consistent naming conventions
          </p>
          <p>
            <strong>Learning Tools:</strong> Console logging, in-app notes,
            localStorage persistence
          </p>
        </div>
      </div>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-2xl font-semibold mb-4">📁 Project Structure</h2>
        <pre
          className={`text-sm p-4 rounded border overflow-x-auto ${
            theme === "dark"
              ? "bg-gray-900 text-green-400"
              : "bg-gray-50 text-gray-800"
          }`}>
          {`src/
├── components/        # Shared UI components
│   ├── Layout.tsx    # Main app layout
│   ├── LearningNote.tsx # Educational components
│   └── hoc/          # Higher-Order Components
├── features/         # Feature modules
│   ├── counter/      # useState, useReducer demos
│   ├── todos/        # useEffect, useRef demos
│   ├── theme/        # Context API demos
│   ├── profile/      # Async operations
│   └── settings/     # Redux Toolkit
├── hooks/            # Custom reusable hooks
├── contexts/         # React Context providers
├── store/            # Redux Toolkit setup
├── routes/           # Page components
├── types/            # TypeScript definitions
└── utils/            # Helper functions`}
        </pre>
      </div>

      <LearningNote title="About This Learning Experience">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">Interactive Learning</h4>
            <p>
              Every concept is demonstrated with working code that you can
              interact with. The console logs show you exactly what's happening
              when you click buttons or change state.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">Real-World Context</h4>
            <p>
              Examples aren't just toy problems - they represent real patterns
              you'll use in production apps: counters for form inputs, todos for
              CRUD operations, themes for user preferences.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">
              Progressive Complexity
            </h4>
            <p>
              Start simple with useState, then progress through useEffect,
              Context API, and finally to Redux Toolkit. Each concept builds on
              the previous ones.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-orange-600">Best Practice Focus</h4>
            <p>
              Code follows industry standards: TypeScript strict mode, proper
              error handling, performance optimization, and clean architecture
              patterns.
            </p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default AboutPage;
