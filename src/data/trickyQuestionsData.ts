export interface TrickyQuestion {
  id: string;
  title: string;
  category: "Hooks" | "Rendering" | "State & RTK" | "Async & Lifecycle" | "React 19";
  difficulty: "Easy" | "Medium" | "Tricky / Expert";
  topicDefinition: string;
  question: string;
  answer: string;
  whyItHappens: string;
  badCode: string;
  goodCode: string;
  keyTakeaway: string;
  interactiveDemoId?: "stale-closure" | "batching" | "memo-ref" | "key-reorder";
}

export class TrickyQuestionData {
  static questions: TrickyQuestion[] = [
    {
      id: "stale-closure-useeffect",
      title: "The Stale Closure Bug in useEffect & setInterval",
      category: "Hooks",
      difficulty: "Tricky / Expert",
      topicDefinition:
        "A closure in JavaScript captures variables from its outer lexical scope at the time of creation. In React, if a hook like useEffect or useCallback has an empty dependency array [], its callback closes over the initial state values and never sees updated state in subsequent renders.",
      question:
        "Why does a count variable inside a setInterval inside useEffect([]) stay stuck at 0 or 1, no matter how many seconds pass?",
      answer:
        "Because the effect function was evaluated during the initial render where `count` was `0`. The interval callback keeps referencing that exact initial `count` variable due to JavaScript closure scope, ignoring subsequent component re-renders.",
      whyItHappens:
        "React creates a new `count` variable on every render. But the `setInterval` callback function was created on mount and captured `count = 0`. Each time it runs `setCount(count + 1)`, it calculates `0 + 1 = 1` forever.",
      badCode: `// ❌ BUG: Stale closure - count never increments beyond 1!
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // Captured count = 0 forever!
  }, 1000);
  return () => clearInterval(timer);
}, []); // Empty dependencies!`,
      goodCode: `// ✅ FIX 1: Functional State Update
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // Always receives fresh state!
  }, 1000);
  return () => clearInterval(timer);
}, []);

// ✅ FIX 2: Dependency array inclusion
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // Re-subscribes timer when count changes`,
      keyTakeaway:
        "Always use functional state updates `setCount(prev => prev + 1)` when new state depends on previous state inside persistent listeners or timers.",
      interactiveDemoId: "stale-closure",
    },
    {
      id: "automatic-batching",
      title: "Automatic Batching in React 18 & 19",
      category: "Rendering",
      difficulty: "Medium",
      topicDefinition:
        "Batching is when React groups multiple state updates into a single re-render for better performance. In React 18+, automatic batching works across async code, fetch calls, promises, and setTimeout.",
      question:
        "If you call `setCount(c => c + 1)` and `setFlag(f => !f)` inside a `setTimeout` or `fetch.then()`, how many re-renders occur?",
      answer:
        "Only 1 re-render occurs in React 18+. In React 17 and earlier, asynchronous handlers triggered multiple separate re-renders.",
      whyItHappens:
        "React 18 introduced a unified batching engine (`createRoot`) that wraps all state updates in a microtask batch, regardless of where they are dispatched.",
      badCode: `// In React 17: This caused 2 separate re-renders
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);`,
      goodCode: `// In React 18/19: Automatically batched into 1 re-render!
// If you explicitly MUST opt-out of batching:
import { flushSync } from 'react-dom';

setTimeout(() => {
  flushSync(() => setCount(c => c + 1)); // Triggers render 1
  flushSync(() => setFlag(f => !f));    // Triggers render 2
}, 1000);`,
      keyTakeaway:
        "State updates in promises, timeouts, and native event handlers are automatically batched together into a single UI render.",
      interactiveDemoId: "batching",
    },
    {
      id: "memo-reference-trap",
      title: "React.memo Shallow Comparison & Object Prop Traps",
      category: "Rendering",
      difficulty: "Tricky / Expert",
      topicDefinition:
        "React.memo performs a shallow comparison of props using Object.is. Inline objects `{}` or inline functions `() => {}` create new reference addresses on every parent render, causing React.memo to completely fail.",
      question:
        "Why does a component wrapped in `React.memo` still re-render every time its parent renders, even though the data inside the props object hasn't changed?",
      answer:
        "Because inline objects `{ style: { color: 'red' } }` or inline functions `onClick={() => doSomething()}` create a brand-new object/function reference in memory during every parent render, failing shallow `===` comparison.",
      whyItHappens:
        "In JS: `{} === {}` is `false`. Even if two objects have identical keys and values, they occupy different memory memory locations.",
      badCode: `// ❌ BUG: React.memo is useless here!
const MemoChild = React.memo(({ config, onClick }) => <div onClick={onClick}>{config.title}</div>);

function Parent() {
  return (
    <MemoChild 
      config={{ title: "Hello" }} // Brand new object every render!
      onClick={() => console.log("click")} // Brand new function every render!
    />
  );
}`,
      goodCode: `// ✅ FIX: Memoize function with useCallback and object with useMemo (or move static object outside)
const staticConfig = { title: "Hello" }; // Constant reference outside component

function Parent() {
  const handleClick = useCallback(() => console.log("click"), []);
  
  return <MemoChild config={staticConfig} onClick={handleClick} />;
}`,
      keyTakeaway:
        "React.memo only works if object/function props maintain referential equality across renders using useMemo, useCallback, or module-scope variables.",
      interactiveDemoId: "memo-ref",
    },
    {
      id: "key-prop-reconciliation",
      title: "Using Array Index as `key` Prop Anti-Pattern",
      category: "Rendering",
      difficulty: "Medium",
      topicDefinition:
        "The `key` prop tells React's reconciliation diffing engine how to map elements in a list to DOM nodes across renders when items are inserted, removed, or reordered.",
      question:
        "What goes wrong when using the array `index` as a `key` prop in a list where items can be re-ordered, deleted, or inserted at the top?",
      answer:
        "React will misidentify element identity, causing local DOM input state, CSS transitions, and un-memoized component states to bleed into neighboring items or render incorrect values.",
      whyItHappens:
        "When an item at index 0 is deleted, the item that was at index 1 now receives `key=0`. React assumes the first item's DOM node should be reused for the new index 0 item, keeping its internal un-controlled state intact!",
      badCode: `// ❌ BUG: Index as key causes state bleed on deletion/reorder
{items.map((item, index) => (
  <TodoItem key={index} text={item.text} />
));}`,
      goodCode: `// ✅ FIX: Unique stable ID as key
{items.map((item) => (
  <TodoItem key={item.id} text={item.text} />
));}`,
      keyTakeaway:
        "Never use array index as key for dynamic lists that undergo reordering, addition, or removal.",
      interactiveDemoId: "key-reorder",
    },
    {
      id: "rtk-query-vs-slice",
      title: "RTK Query Cache Invalidation vs Redux Slice Manual State",
      category: "State & RTK",
      difficulty: "Tricky / Expert",
      topicDefinition:
        "RTK Query handles data fetching as a normalized, query-key driven server cache, whereas standard Redux slices store imperative local application state.",
      question:
        "Why shouldn't you copy data fetched from an RTK Query hook into a standard Redux slice or local `useState` in a `useEffect`?",
      answer:
        "Doing so creates 'Single Source of Truth' duplication, breaking RTK Query's automated cache invalidation, deduplication, polling, and background updates.",
      whyItHappens:
        "When RTK Query re-fetches or invalidates tags, the cache updates automatically. But your local copy stored in `useState` or a Redux slice remains frozen in its old snapshot.",
      badCode: `// ❌ BUG: Anti-pattern - Duplicating server state in useState
const { data: user } = useGetUserQuery(id);
const [userData, setUserData] = useState(null);

useEffect(() => {
  if (user) setUserData(user); // Now userData will get out of sync with backend!
}, [user]);`,
      goodCode: `// ✅ FIX: Consume RTK Query hook directly or derive state with useMemo
const { data: user, isLoading } = useGetUserQuery(id);

// If transformation is needed:
const formattedName = useMemo(() => {
  return user ? \`\${user.firstName} \${user.lastName}\` : '';
}, [user]);`,
      keyTakeaway:
        "Treat RTK Query as the single source of truth for server data. Never copy query results into local state unless user draft editing is required.",
    },
    {
      id: "async-race-condition",
      title: "Async Data Fetching Race Conditions & AbortController",
      category: "Async & Lifecycle",
      difficulty: "Tricky / Expert",
      topicDefinition:
        "Race conditions occur when fast consecutive user actions fire multiple asynchronous requests, and a slower initial request resolves AFTER a faster subsequent request, overwriting valid state with stale data.",
      question:
        "How can rapid tab/filter switching cause the UI to display data belonging to a previous click?",
      answer:
        "Request #1 (slow network) finishes AFTER Request #2 (fast network). Request #1's response overwrites Request #2's state because responses resolve out of order.",
      whyItHappens:
        "Asynchronous network promises have non-deterministic completion times. Without cancellation or ignored flag checks, the last request dispatched is not guaranteed to be the last response received.",
      badCode: `// ❌ BUG: Race condition on rapid userId prop changes
useEffect(() => {
  fetchUser(userId).then(data => setUser(data));
}, [userId]);`,
      goodCode: `// ✅ FIX: Clean up with boolean flag or AbortController
useEffect(() => {
  let isCurrent = true;
  const controller = new AbortController();

  fetch(\`/api/user/\${userId}\`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => {
      if (isCurrent) setUser(data);
    });

  return () => {
    isCurrent = false;
    controller.abort(); // Cancel pending network request
  };
}, [userId]);`,
      keyTakeaway:
        "Use AbortController or a boolean `isCurrent` cleanup flag inside useEffect to discard out-of-order async responses.",
    },
    {
      id: "why-no-two-way-binding",
      title: "Why React Does Not Support Two-Way Data Binding By Default",
      category: "Rendering",
      difficulty: "Medium",
      topicDefinition:
        "Unidirectional Data Flow ensures data travels down via read-only props and events travel up via callbacks, creating a single predictable source of truth.",
      question:
        "Why did React intentionally avoid automatic 2-way data binding (like Angular 1 v-model or Vue)?",
      answer:
        "To maximize data predictability and ease of debugging. In two-way binding systems, any child can mutate parent state directly behind the scenes, creating hard-to-trace state mutation chains.",
      whyItHappens:
        "Explicit event handlers ensure state mutations pass through a single owner component, allowing developers to set breakpoints or use Redux/React DevTools to trace every state change.",
      badCode: `// ❌ Implicit 2-way binding (Not supported in React):
<input v-model="username" />`,
      goodCode: `// ✅ Explicit 1-way binding + Change Event in React:
const [username, setUsername] = useState("");

<input 
  value={username} 
  onChange={(e) => setUsername(e.target.value)} 
/>`,
      keyTakeaway:
        "Unidirectional data flow keeps UI predictable: UI = f(State). Use controlled inputs to simulate two-way sync explicitly.",
    },
    {
      id: "child-to-parent-communication",
      title: "Child-to-Parent Data Communication & Lifting State Up",
      category: "Hooks",
      difficulty: "Easy",
      topicDefinition:
        "Lifting state up is the React pattern where state is stored in the closest common ancestor component and shared down via props and back up via callbacks.",
      question:
        "How does a child component send user selection data back up to its parent component?",
      answer:
        "The parent passes a callback function as a prop to the child. When an action occurs inside the child, it invokes that callback function with the data payload as an argument.",
      whyItHappens:
        "Functions in JavaScript are first-class objects. Passing a parent's state setter or handler function into a child allows the child to execute code in the parent's lexical context.",
      badCode: `// ❌ BUG: Trying to mutate parent prop inside child directly
const Child = ({ user }) => {
  const handleClick = () => {
    user.name = "New Name"; // Mutation anti-pattern!
  };
  return <button onClick={handleClick}>Change</button>;
};`,
      goodCode: `// ✅ FIX: Invoke parent callback passed via props
// Parent:
<Child onUpdateUser={(newName) => setUser({ ...user, name: newName })} />

// Child:
const Child = ({ onUpdateUser }) => (
  <button onClick={() => onUpdateUser("New Name")}>Change</button>
);`,
      keyTakeaway:
        "Always pass callback functions to child components to send data back up to parent components.",
    },
    {
      id: "custom-hook-vs-utility",
      title: "Custom Hook vs Utility Function: When to use which?",
      category: "Hooks",
      difficulty: "Medium",
      topicDefinition:
        "A Custom Hook is a JS function that calls other React hooks (useState, useEffect) to encapsulate stateful logic. A utility function is a pure JS function with no internal React state or hooks.",
      question:
        "When should you write a Custom Hook (`useFormatData`) vs a plain Utility Function (`formatData`)?",
      answer:
        "Write a Custom Hook if and only if the logic needs to use internal React state or side-effects (`useState`, `useEffect`, `useRef`). If the logic is pure math/formatting without React hooks, write a plain utility function.",
      whyItHappens:
        "React hooks carry overhead and can only be invoked at the top level of React components or other custom hooks. Pure utility functions can be called anywhere (inside loops, async handlers, utility files).",
      badCode: `// ❌ ANTI-PATTERN: Making a pure calculation a custom hook
function useCalculateTax(amount) {
  // Uses no React hooks! Unnecessarily restricts where it can be called.
  return amount * 0.18;
}`,
      goodCode: `// ✅ FIX: Plain utility function for pure data calculations
export function calculateTax(amount: number) {
  return amount * 0.18;
}

// ✅ Use Custom Hook ONLY when React state/effects are involved:
export function useFetchTaxRate(country: string) {
  const [rate, setRate] = useState(0);
  useEffect(() => { fetchRate(country).then(setRate); }, [country]);
  return rate;
}`,
      keyTakeaway:
        "Use custom hooks for stateful/effectful React logic; use pure utility functions for stateless calculations.",
    },
    {
      id: "state-colocation-benefit",
      title: "State Colocation: The Best Performance Optimization",
      category: "Rendering",
      difficulty: "Medium",
      topicDefinition:
        "State Colocation is the practice of keeping state as close as possible to where it is consumed, rather than hoisting all state to root parent components.",
      question:
        "Why is pushing state down (colocating state) often more effective than wrapping components in `React.memo`?",
      answer:
        "Because when state lives inside the specific sub-component, changing that state only re-renders that tiny component without triggering a re-render of the parent component tree at all!",
      whyItHappens:
        "React re-renders a component AND all of its children whenever its state updates. Moving state down prevents the parent component from re-rendering in the first place.",
      badCode: `// ❌ Un-colocated state: Typing in searchInput re-renders entire App tree!
function App() {
  const [searchInput, setSearchInput] = useState("");
  return (
    <div>
      <input value={searchInput} onChange={e => setSearchInput(e.target.value)} />
      <HeavyDashboard />
      <HeavyFooter />
    </div>
  );
}`,
      goodCode: `// ✅ Colocated state: State lives inside SearchBar component only!
function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  return <input value={searchInput} onChange={e => setSearchInput(e.target.value)} />;
}

function App() {
  return (
    <div>
      <SearchBar />
      <HeavyDashboard /> {/* Never re-renders when user types in search! */}
      <HeavyFooter />
    </div>
  );
}`,
      keyTakeaway:
        "Colocate state close to where it's used. It eliminates unnecessary parent re-renders without needing memoization.",
    },
  ];
}
