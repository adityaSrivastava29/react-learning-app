import React, { useState } from "react";
import CodeBlock from "../CodeBlock";
import { useTheme } from "../useTheme";

// Child Component 1: Receives Parent Props (Parent -> Child)
interface UserCardProps {
  user: { name: string; role: string };
  status: string;
  theme: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, status, theme }) => (
  <div className={`p-3 rounded border text-xs space-y-1 ${
    theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"
  }`}>
    <span className="font-bold opacity-75 block">Child Component (Receives Props from Parent)</span>
    <p>Name: <strong>{user.name}</strong> | Role: <strong>{user.role}</strong></p>
    <p>Status: <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">{status}</span></p>
  </div>
);

// Child Component 2: Sends Data Up via Callback (Child -> Parent)
interface ColorSelectorProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  theme: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onSelectColor, theme }) => {
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];

  return (
    <div className={`p-3 rounded border text-xs space-y-2 ${
      theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"
    }`}>
      <span className="font-bold opacity-75 block">Child Component (Invokes Parent Callback on Click)</span>
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onSelectColor(c)}
            style={{ backgroundColor: c }}
            className={`w-7 h-7 rounded-full transition-transform ${
              selectedColor === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : ""
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
  const { theme } = useTheme();
  const [parentColor, setParentColor] = useState("#3b82f6");
  const [parentUser] = useState({ name: "Aditya", role: "Frontend Lead" });

  const nameBinding = useTwoWayBinding("React Developer");

  const codeBadgeClass = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-700 text-amber-300 border border-gray-600"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 text-purple-900 border border-gray-300";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">React Data Flow, Props & Two-Way Binding</h2>
        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          React strictly enforces <strong>Unidirectional (One-Way) Data Flow</strong>. Data flows downwards from parent to child via read-only <code className={codeBadgeClass}>props</code>, while actions flow upwards from child to parent via callback functions.
        </p>
      </div>

      {/* 1. Parent to Child & Child to Parent Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <h3 className="font-semibold text-base text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <span>⬇️</span> 1. Parent to Child Data Flow
          </h3>
          <p className="text-xs sm:text-sm opacity-80">
            Parents pass data down to children as read-only <code className={codeBadgeClass}>props</code>. Props cannot be mutated by the child component.
          </p>
          <UserCard user={parentUser} status="Active Learner" theme={theme} />
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

        <div className={`p-4 rounded-lg border space-y-3 ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <h3 className="font-semibold text-base text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span>⬆️</span> 2. Child to Parent Data Flow
          </h3>
          <p className="text-xs sm:text-sm opacity-80">
            Children send data up by executing a callback function passed down by the parent ("Lifting State Up").
          </p>
          <ColorSelector selectedColor={parentColor} onSelectColor={setParentColor} theme={theme} />
          <div className="p-2 rounded text-xs font-mono font-bold text-white transition-colors text-center" style={{ backgroundColor: parentColor }}>
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
      <div className={`p-5 rounded-lg border space-y-3 ${
        theme === "dark" ? "bg-amber-950/40 border-amber-800 text-amber-200" : "bg-amber-50 border-amber-200 text-amber-900"
      }`}>
        <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
          <span>🧠</span> Why Does React NOT Support Two-Way Data Binding By Default?
        </h3>

        <div className="grid sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className={`p-3 rounded border space-y-1 ${theme === "dark" ? "bg-gray-900 border-amber-800/60" : "bg-white border-amber-200"}`}>
            <strong className="block font-bold">1. Predictability & Debugging</strong>
            <p className="opacity-90">In 2-way binding systems, any child can mutate parent state directly behind the scenes, making it hard to trace state changes.</p>
          </div>

          <div className={`p-3 rounded border space-y-1 ${theme === "dark" ? "bg-gray-900 border-amber-800/60" : "bg-white border-amber-200"}`}>
            <strong className="block font-bold">2. Single Source of Truth</strong>
            <p className="opacity-90">Unidirectional flow guarantees that state lives in one explicit owner. UI updates are a pure function of state: <code className={codeBadgeClass}>UI = f(State)</code>.</p>
          </div>

          <div className={`p-3 rounded border space-y-1 ${theme === "dark" ? "bg-gray-900 border-amber-800/60" : "bg-white border-amber-200"}`}>
            <strong className="block font-bold">3. Performance Control</strong>
            <p className="opacity-90">Explicit handlers prevent cascading cycle re-renders where Child updates Parent, which re-evaluates Child, causing infinite digests.</p>
          </div>
        </div>
      </div>

      {/* 3. Simulating Two-Way Binding in React */}
      <div className={`p-4 rounded-lg border space-y-4 ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}>
        <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
          <span>🔄</span> How to Achieve Two-Way Binding Effect in React
        </h3>
        <p className="text-xs sm:text-sm opacity-80">
          In React, two-way binding is simulated by pairing a controlled input value (<code className={codeBadgeClass}>value={"{state}"}</code>) with an change handler (<code className={codeBadgeClass}>onChange={"{e => setState(e.target.value)}"}</code>) or a custom binding helper.
        </p>

        <div className={`p-4 rounded border space-y-3 ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}>
          <label className="text-xs font-bold block">
            Simulated 2-Way Binding Demo Input:
          </label>
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              {...nameBinding.bind}
              className={`px-3 py-1.5 border rounded text-xs sm:text-sm flex-1 max-w-sm ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
              placeholder="Type to see 2-way sync..."
            />
            <button
              onClick={() => nameBinding.onChange({ target: { value: "Full Stack Engineer" } } as any)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold">
              Set via Parent State
            </button>
          </div>
          <div className={`p-2 rounded font-mono text-xs ${
            theme === "dark" ? "bg-gray-900 text-emerald-400" : "bg-gray-100 text-emerald-700"
          }`}>
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
    </div>
  );
};

export default DataFlowExample;
