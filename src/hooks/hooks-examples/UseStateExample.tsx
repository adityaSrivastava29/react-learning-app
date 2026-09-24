import React, { useState } from "react";
import CodeBlock from "../CodeBlock";
import { HookDeepNotes } from "../../components/HookDeepNotes";
import { useStateNotes } from "../hookNotesData";

const UseStateExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState({ name: "", email: "", age: 0 });
  const [items, setItems] = useState(["Apple", "Banana"]);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateUser = (field: string, value: string | number) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const containerCardClass =
    "bg-gray-50/70 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-200/80 dark:border-gray-700/70 space-y-3";

  const inputClass =
    "px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          useState Hook
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          <strong className="text-gray-900 dark:text-white">useState</strong> is the most fundamental React hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.
        </p>
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-lg mb-2">Basic Syntax</h3>
        <CodeBlock
          code={`import { useState } from 'react'

const [state, setState] = useState(initialValue)

// Examples:
const [count, setCount] = useState(0)           // Number
const [name, setName] = useState('')            // String  
const [isVisible, setIsVisible] = useState(true) // Boolean
const [user, setUser] = useState({})            // Object
const [items, setItems] = useState([])          // Array`}
        />
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-lg">1. Counter Example (Number State)</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded" onClick={() => setCount(count + 1)}>
            Increment (+1)
          </button>
          <button className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded" onClick={() => setCount(count - 1)}>
            Decrement (-1)
          </button>
          <button className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded" onClick={() => setCount(0)}>
            Reset
          </button>
          <strong className="font-mono text-sm ml-2">Count: {count}</strong>
        </div>
        <CodeBlock
          code={`const [count, setCount] = useState(0)

// Usage:
<button onClick={() => setCount(count + 1)}>Increment</button>
<button onClick={() => setCount(count - 1)}>Decrement</button>
<button onClick={() => setCount(0)}>Reset</button>`}
        />
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-lg">2. Text Input Example (String State)</h3>
        <div className="flex gap-2 items-center flex-wrap">
          <input
            type="text"
            className={`${inputClass} flex-1 max-w-xs`}
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded" onClick={() => setName("")}>
            Clear
          </button>
          <strong className="text-sm ml-2">Hello, {name || "Anonymous"}!</strong>
        </div>
        <CodeBlock
          code={`const [name, setName] = useState('')

// Usage:
<input 
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`}
        />
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-lg">3. Toggle Example (Boolean State)</h3>
        <div>
          <button
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded mb-2"
            onClick={() => setIsVisible(!isVisible)}>
            Toggle Visibility
          </button>
          <div>
            {isVisible ? (
              <div className="p-3.5 rounded-lg text-xs sm:text-sm font-medium border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                👋 This content is visible!
              </div>
            ) : (
              <div className="p-3.5 rounded-lg text-xs sm:text-sm font-medium border bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
                🙈 Content is hidden
              </div>
            )}
          </div>
        </div>
        <CodeBlock
          code={`const [isVisible, setIsVisible] = useState(true)

// Usage:
<button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
{isVisible && <div>Visible content</div>}`}
        />
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">4. Object State Example</h3>
        <div className="grid sm:grid-cols-3 gap-2.5">
          <input
            type="text"
            className={inputClass}
            placeholder="Name"
            value={user.name}
            onChange={(e) => updateUser("name", e.target.value)}
          />
          <input
            type="email"
            className={inputClass}
            placeholder="Email"
            value={user.email}
            onChange={(e) => updateUser("email", e.target.value)}
          />
          <input
            type="number"
            className={inputClass}
            placeholder="Age"
            value={user.age}
            onChange={(e) => updateUser("age", parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="p-3 rounded-lg border text-xs sm:text-sm font-mono bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700">
          User State: Name: {user.name || "Not set"} | Email: {user.email || "Not set"} | Age: {user.age || "Not set"}
        </div>
        <CodeBlock
          code={`const [user, setUser] = useState({ name: '', email: '', age: 0 })

const updateUser = (field, value) => {
  setUser(prev => ({
    ...prev,
    [field]: value
  }))
}`}
        />
      </div>

      <div className={containerCardClass}>
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">5. Array State Example</h3>
        <div className="flex gap-2.5">
          <input
            type="text"
            className={`${inputClass} flex-1`}
            placeholder="Add new item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors shadow-xs" onClick={addItem}>
            Add Item
          </button>
        </div>
        <ul className="space-y-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between p-2.5 rounded-lg border text-xs sm:text-sm bg-white dark:bg-gray-900/90 border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100">{item}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-xs px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-md font-medium transition-colors">
                Remove
              </button>
            </li>
          ))}
        </ul>
        <CodeBlock
          code={`const [items, setItems] = useState(['Apple', 'Banana'])

const addItem = (newItem) => setItems([...items, newItem])
const removeItem = (index) => setItems(items.filter((_, i) => i !== index))`}
        />
      </div>

      {/* Deep-Dive Notes & Tricky Parts */}
      <HookDeepNotes {...useStateNotes} />
    </div>
  );
};

export default UseStateExample;
