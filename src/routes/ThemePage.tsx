import React, { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { LearningNote } from "../components/LearningNote";

// Component that demonstrates props drilling problem
const GrandParent: React.FC = () => {
  const [userPreference, setUserPreference] = useState("blue");

  return (
    <div className="border-2 border-blue-500 p-4 rounded-lg">
      <h3 className="font-bold text-blue-600 mb-2">GrandParent Component</h3>
      <p className="text-sm mb-2">Has userPreference state: {userPreference}</p>
      <select
        value={userPreference}
        onChange={(e) => setUserPreference(e.target.value)}
        className="mb-2 p-1 border rounded text-gray-900">
        <option value="blue">Blue</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
      </select>
      <Parent userPreference={userPreference} />
    </div>
  );
};

const Parent: React.FC<{ userPreference: string }> = ({ userPreference }) => {
  return (
    <div className="border-2 border-yellow-500 p-4 rounded-lg ml-4 mt-2">
      <h4 className="font-bold text-yellow-600 mb-2">Parent Component</h4>
      <p className="text-sm mb-2">Just passes props down (doesn't use them)</p>
      <Child userPreference={userPreference} />
    </div>
  );
};

const Child: React.FC<{ userPreference: string }> = ({ userPreference }) => {
  return (
    <div
      className={`border-2 p-4 rounded-lg ml-4 mt-2 ${
        userPreference === "blue"
          ? "border-blue-500 bg-blue-50"
          : userPreference === "red"
          ? "border-red-500 bg-red-50"
          : "border-green-500 bg-green-50"
      }`}>
      <h5
        className={`font-bold mb-2 ${
          userPreference === "blue"
            ? "text-blue-600"
            : userPreference === "red"
            ? "text-red-600"
            : "text-green-600"
        }`}>
        Child Component
      </h5>
      <p className="text-sm">
        Finally uses the userPreference: {userPreference}
      </p>
    </div>
  );
};

// Component that uses Context instead of props drilling
const ContextConsumer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`border-2 p-4 rounded-lg ${
        theme === "dark"
          ? "border-gray-600 bg-gray-800"
          : "border-gray-300 bg-gray-50"
      }`}>
      <h4 className="font-bold mb-2">Context Consumer</h4>
      <p className="text-sm mb-2">
        Directly accesses theme from context: {theme}
      </p>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Toggle Theme
      </button>
    </div>
  );
};

const ThemePage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Theme & Context API</h1>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">Current Theme: {theme}</h2>
        <p className="mb-4">
          This entire app uses the Theme Context. Notice how the theme changes
          across all components without passing props down through every level.
        </p>
      </div>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">
          ❌ Props Drilling Problem
        </h2>
        <p className="mb-4 text-sm">
          This example shows how data needs to be passed through multiple
          components even when intermediate components don't use it:
        </p>
        <GrandParent />
      </div>

      <div
        className={`p-6 rounded-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}>
        <h2 className="text-xl font-semibold mb-4">✅ Context API Solution</h2>
        <p className="mb-4 text-sm">
          With Context, any component can access the theme directly without
          props drilling:
        </p>
        <ContextConsumer />
      </div>

      <LearningNote title="Context API Deep Dive">
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-blue-600">When to Use Context</h4>
            <p>
              <strong>Good for:</strong> Theme preferences, user authentication,
              language settings
            </p>
            <p>
              <strong>Avoid for:</strong> Frequently changing data, local
              component state
            </p>
            <p>
              <strong>Rule of thumb:</strong> If you're passing props through 3+
              levels, consider Context
            </p>
          </div>

          <div>
            <h4 className="font-bold text-red-600">Common Pitfalls</h4>
            <p>• Context value changes cause ALL consumers to re-render</p>
            <p>
              • Don't put everything in Context - use local state when possible
            </p>
            <p>• Split contexts by concern (theme vs user vs settings)</p>
          </div>

          <div>
            <h4 className="font-bold text-green-600">Best Practices</h4>
            <p>• Create custom hooks (useTheme) to encapsulate context logic</p>
            <p>• Provide error boundaries for context consumers</p>
            <p>• Use multiple contexts instead of one giant context</p>
            <p>• Memoize context values to prevent unnecessary re-renders</p>
          </div>

          <div>
            <h4 className="font-bold text-purple-600">Context vs Redux</h4>
            <p>
              <strong>Context:</strong> Simple global state, doesn't change
              often
            </p>
            <p>
              <strong>Redux:</strong> Complex state logic, time-travel
              debugging, middleware
            </p>
            <p>
              You can use both! This app uses Context for theme and Redux for
              settings.
            </p>
          </div>
        </div>
      </LearningNote>
    </div>
  );
};

export default ThemePage;
