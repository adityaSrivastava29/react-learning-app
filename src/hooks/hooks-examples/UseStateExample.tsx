import React, { useState } from "react";
import CodeBlock from "../CodeBlock";
import { useTheme } from "../useTheme";

const UseStateExample: React.FC = () => {
  const { theme } = useTheme();
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

  const containerCardClass = `p-4 rounded-lg border space-y-3 ${
    theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
  }`;

  const inputClass = `px-3 py-1.5 border rounded text-xs sm:text-sm ${
    theme === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
      : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">useState Hook</h2>
        <p className={`text-sm sm:text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          <strong>useState</strong> is the most fundamental React hook that allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.
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
              <div className={`p-3 rounded text-xs font-medium border ${
                theme === "dark" ? "bg-emerald-950/40 border-emerald-800 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}>
                👋 This content is visible!
              </div>
            ) : (
              <div className={`p-3 rounded text-xs font-medium border ${
                theme === "dark" ? "bg-rose-950/40 border-rose-800 text-rose-200" : "bg-rose-50 border-rose-200 text-rose-900"
              }`}>
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
        <h3 className="font-semibold text-lg">4. Object State Example</h3>
        <div className="grid sm:grid-cols-3 gap-2">
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
        <div className={`p-3 rounded border text-xs font-mono ${
          theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
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
        <h3 className="font-semibold text-lg">5. Array State Example</h3>
        <div className="flex gap-2">
          <input
            type="text"
            className={`${inputClass} flex-1`}
            placeholder="Add new item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <button className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded" onClick={addItem}>
            Add Item
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item, index) => (
            <li key={index} className={`flex items-center justify-between p-2 rounded border text-xs ${
              theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}>
              <span>{item}</span>
              <button
                onClick={() => removeItem(index)}
                className="text-[10px] px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded">
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
    </div>
  );
};

export default UseStateExample;
