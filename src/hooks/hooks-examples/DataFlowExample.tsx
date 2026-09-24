import React, { useState } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { dataFlowNotes } from "../hookNotesData";

// Child Component 1: Receives Parent Props (Parent -> Child)
interface UserCardProps {
  user: { name: string; role: string };
  status: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, status }) => (
  <div className="p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/90 text-xs sm:text-sm space-y-1.5 text-gray-900 dark:text-gray-100">
    <span className="font-semibold text-gray-500 dark:text-gray-400 block text-xs">
      Child Component (Receives Props from Parent)
    </span>
    <p>
      Name: <strong className="text-gray-900 dark:text-white">{user.name}</strong> | Role: <strong className="text-gray-900 dark:text-white">{user.role}</strong>
    </p>
    <p>
      Status: <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-semibold text-xs">{status}</span>
    </p>
  </div>
);

// Child Component 2: Sends Data Up via Callback (Child -> Parent)
interface ColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor }) => {
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];

  return (
    <div className="p-3.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/90 text-xs sm:text-sm space-y-2 text-gray-900 dark:text-gray-100">
      <span className="font-semibold text-gray-500 dark:text-gray-400 block text-xs">
        Child Component (Invokes Parent Callback on Click)
      </span>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onSelectColor(c)}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full transition-transform ${
              selectedColor === c ? "scale-125 ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

function useTwoWayBinding(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    bind: {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    },
  };
}

const DataFlowExample: React.FC = () => {
  const [parentColor, setParentColor] = useState("#3b82f6");
  const [parentUser] = useState({ name: "Aditya", role: "Frontend Lead" });

  const nameBinding = useTwoWayBinding("React Developer");

  const codeBadgeClass =
    "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border border-gray-300 dark:border-gray-600";

  const cardClass =
    "bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3";

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          React Data Flow, Props & Two-Way Binding
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          React strictly enforces <strong className="text-gray-900 dark:text-white">Unidirectional (One-Way) Data Flow</strong>. Data flows downwards from parent to child via read-only <code className={codeBadgeClass}>props</code>, while actions flow upwards from child to parent via callback functions.
        </p>
      </div>

      {/* 1. Parent to Child & Child to Parent Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={cardClass}>
          <h3 className="font-semibold text-base sm:text-lg text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <span>⬇️</span> 1. Parent to Child Data Flow
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Parents pass data down to children as read-only <code className={codeBadgeClass}>props</code>. Props cannot be mutated by the child component.
          </p>
          <UserCard user={parentUser} status="Active Learner" />
          <CodeBlock
            language="tsx"
            code={`// Parent Component
<UserCard user={user} status="Active Learner" />

// Child Component (Read-Only Props)
const UserCard = ({ user, status }) => (
  <div>{user.name} - {status}</div>
);`}
          />
        </div>

        <div className={cardClass}>
          <h3 className="font-semibold text-base sm:text-lg text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span>⬆️</span> 2. Child to Parent Data Flow
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Children send data up by executing a callback function passed down by the parent ("Lifting State Up").
          </p>
          <ColorSelector selectedColor={parentColor} onSelectColor={setParentColor} />
          <div className="p-2.5 rounded-lg text-xs font-mono font-bold text-white transition-colors text-center shadow-xs" style={{ backgroundColor: parentColor }}>
            Parent Color State: {parentColor}
          </div>
          <CodeBlock
            language="tsx"
            code={`// Parent passes state setter function as prop
<ColorSelector onSelectColor={(color) => setParentColor(color)} />

// Child invokes parent callback when clicked
const ColorSelector = ({ onSelectColor }) => (
  <button onClick={() => onSelectColor("#10b981")}>Select</button>
);`}
          />
        </div>
      </div>

      {/* 2. Why React Does Not Support Two-Way Binding Out of the Box */}
      <div className="p-5 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200 space-y-3">
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2 text-amber-900 dark:text-amber-100">
          <span>🧠</span> Why Does React NOT Support Two-Way Data Binding By Default?
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 rounded-lg border bg-white dark:bg-gray-900/90 border-amber-200 dark:border-amber-900/40 space-y-1">
            <strong className="block font-bold text-amber-950 dark:text-amber-200">1. Predictability & Debugging</strong>
            <p className="opacity-90 leading-relaxed text-gray-700 dark:text-gray-300">In 2-way binding systems, any child can mutate parent state directly behind the scenes, making it hard to trace state changes.</p>
          </div>

          <div className="p-3.5 rounded-lg border bg-white dark:bg-gray-900/90 border-amber-200 dark:border-amber-900/40 space-y-1">
            <strong className="block font-bold text-amber-950 dark:text-amber-200">2. Single Source of Truth</strong>
            <p className="opacity-90 leading-relaxed text-gray-700 dark:text-gray-300">Unidirectional flow guarantees that state lives in one explicit owner. UI updates are a pure function of state: <code className={codeBadgeClass}>UI = f(State)</code>.</p>
          </div>

          <div className="p-3.5 rounded-lg border bg-white dark:bg-gray-900/90 border-amber-200 dark:border-amber-900/40 space-y-1">
            <strong className="block font-bold text-amber-950 dark:text-amber-200">3. Performance Control</strong>
            <p className="opacity-90 leading-relaxed text-gray-700 dark:text-gray-300">Explicit handlers prevent cascading cycle re-renders where Child updates Parent, which re-evaluates Child, causing infinite digests.</p>
          </div>
        </div>
      </div>

      {/* 3. Simulating Two-Way Binding in React */}
      <div className={cardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <span>🔄</span> How to Achieve Two-Way Binding Effect in React
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          In React, two-way binding is simulated by pairing a controlled input value (<code className={codeBadgeClass}>value={"{state}"}</code>) with a change handler (<code className={codeBadgeClass}>onChange={"{e => setState(e.target.value)}"}</code>) or a custom binding helper.
        </p>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/90 space-y-3">
          <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
            Simulated 2-Way Binding Demo Input:
          </label>
          <div className="flex gap-2.5 flex-wrap">
            <input
              type="text"
              {...nameBinding.bind}
              className="px-3 py-2 border rounded-lg text-xs sm:text-sm flex-1 max-w-sm bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type to see 2-way sync..."
            />
            <button
              onClick={() => nameBinding.onChange({ target: { value: "Full Stack Engineer" } } as any)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors shadow-xs">
              Set via Parent State
            </button>
          </div>
          <div className="p-2.5 rounded-lg font-mono text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 border border-gray-200 dark:border-gray-700">
            State Value: "{nameBinding.value}"
          </div>
        </div>

        <CodeBlock
          language="tsx"
          code={`// Simulating 2-way binding using spreading helper object:
const useTwoWayBinding = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: (e) => setValue(e.target.value),
    bind: {
      value,
      onChange: (e) => setValue(e.target.value)
    }
  };
};

// Usage in JSX (Looks identical to v-model / 2-way binding):
const titleBinding = useTwoWayBinding("Developer");

<input {...titleBinding.bind} />`}
        />
      </div>

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...dataFlowNotes} />
    </div>
  );
};

export default DataFlowExample;
