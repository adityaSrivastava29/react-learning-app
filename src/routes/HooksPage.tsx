import React, { useState } from "react";
import UseStateExample from "../hooks/hooks-examples/UseStateExample";
import UseEffectExample from "../hooks/hooks-examples/UseEffectExample";
import UseCallbackExample from "../hooks/hooks-examples/UseCallbackExample";
import UseMemoExample from "../hooks/hooks-examples/UseMemoExample";
import UseRefExample from "../hooks/hooks-examples/UseRefExample";
import UseReducerExample from "../hooks/hooks-examples/UseReducerExample";
import CustomHooksExample from "../hooks/hooks-examples/CustomHooksExample";
import DataFlowExample from "../hooks/hooks-examples/DataFlowExample";
import { LearningNote } from "../components/LearningNote";

const hooksList = [
  { id: "useState", label: "useState", component: UseStateExample, category: "State" },
  { id: "useEffect", label: "useEffect", component: UseEffectExample, category: "Side Effects" },
  { id: "useCallback", label: "useCallback", component: UseCallbackExample, category: "Performance" },
  { id: "useMemo", label: "useMemo", component: UseMemoExample, category: "Performance" },
  { id: "useRef", label: "useRef", component: UseRefExample, category: "DOM & Mutables" },
  { id: "useReducer", label: "useReducer", component: UseReducerExample, category: "Complex State" },
  { id: "customHooks", label: "Custom Hooks Guide", component: CustomHooksExample, category: "Architecture" },
  { id: "dataFlow", label: "Data Flow & 2-Way Binding", component: DataFlowExample, category: "Props & Data" },
];

const HooksPage: React.FC = () => {
  const [activeHook, setActiveHook] = useState("useState");

  const ActiveComponent =
    hooksList.find((h) => h.id === activeHook)?.component || UseStateExample;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 flex items-center gap-2.5">
          <span className="text-2xl">⚓</span> React Hooks Showcase & Interactive Lab
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Master built-in React hooks, custom hook creation, data flow patterns, and two-way binding simulation.
        </p>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Select Learning Topic
          </h3>
          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
            {hooksList.map((hook) => (
              <button
                key={hook.id}
                onClick={() => setActiveHook(hook.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-between gap-2 whitespace-nowrap ${
                  activeHook === hook.id
                    ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-500"
                    : "bg-gray-100/90 hover:bg-gray-200/80 text-gray-700 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 dark:text-gray-200"
                }`}>
                <span>{hook.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    activeHook === hook.id
                      ? "bg-blue-700/90 text-white"
                      : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  }`}>
                  {hook.category}
                </span>
              </button>
            ))}
          </div>

          <LearningNote title="Hooks Rules Checklist">
            <ul className="space-y-1.5 list-disc pl-4 opacity-95">
              <li>Only call hooks at the top level of React components or custom hooks.</li>
              <li>Never call hooks inside loops, conditions, or nested functions.</li>
              <li>Always declare hook dependencies truthfully to avoid stale closure bugs.</li>
            </ul>
          </LearningNote>
        </div>

        {/* Selected Topic Showcase Content */}
        <div className="md:col-span-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-6 sm:p-8 shadow-sm">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default HooksPage;
