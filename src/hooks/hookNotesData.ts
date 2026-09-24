import type { KeyMechanic, TrickyGotcha, InterviewQuestion } from "../components/HookDeepNotes";

export interface HookNotesPackage {
  hookName: string;
  mentalModel: string;
  keyMechanics: KeyMechanic[];
  trickyGotchas: TrickyGotcha[];
  interviewQuestions: InterviewQuestion[];
}

export const useStateNotes: HookNotesPackage = {
  hookName: "useState",
  mentalModel: "State is an immutable cell attached to the Fiber node. Calling setState does not mutate the variable in-place; it enqueues an update object and schedules a re-render. Every render receives its own snapshot of state.",
  keyMechanics: [
    {
      title: "Fiber State Queue & WorkLoop",
      description: "Under the hood, React stores component hooks as a singly linked list on the Fiber's memoizedState. Each setState call appends an update to an internal circular queue that the React scheduler processes during the next render phase.",
    },
    {
      title: "Object.is Bailout Optimization",
      description: "Before triggering a re-render, React checks if Object.is(prevState, nextState). If the value has not changed, React bails out of re-rendering this component and its subtree entirely, saving CPU cycles.",
      code: `// If nextState === prevState, React skips rendering:
if (Object.is(prevState, nextState)) {
  return; // Bails out!
}`,
    },
    {
      title: "Automatic Batching (React 18+)",
      description: "React batches multiple state updates together into a single render pass for better performance. In React 18 and 19, batching happens automatically everywhere—including inside setTimeout, promises, fetch callbacks, and native event handlers.",
      code: `// All three setStates result in ONLY 1 re-render:
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(true);
  setName("React 19");
}, 100);`,
    },
    {
      title: "Lazy State Initialization",
      description: "If the initial state requires heavy computation (reading localStorage, parsing JSON, complex math), pass a function to useState(() => init()). React calls this function ONLY on mount, rather than on every render cycle.",
      code: `// ✅ Good: Function runs only on initial mount
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem("cache") || "{}");
});`,
    },
  ],
  trickyGotchas: [
    {
      title: "Direct Mutation Trap (No Re-render)",
      explanation: "Mutating an object or array in place does not change its memory address reference. Because React performs an Object.is reference check, it detects no change and completely skips re-rendering.",
      badCode: `const [user, setUser] = useState({ name: "Alex", age: 25 });

// ❌ BUG: Mutating state directly!
user.age = 26;
setUser(user); // Object.is(user, user) === true -> NO RENDER!`,
      goodCode: `const [user, setUser] = useState({ name: "Alex", age: 25 });

// ✅ FIX: Create a new object reference using spread syntax
setUser(prev => ({
  ...prev,
  age: 26
}));`,
      tip: "Always treat state as strictly read-only. Create shallow copies with spread ({ ...prev }) or use immer for deeply nested trees.",
    },
    {
      title: "Stale Snapshot in Consecutive Updates",
      explanation: "In an event handler, state variables are frozen snapshots of the current render. Calling setCount(count + 1) three times in a row passes the same snapshot value three times, resulting in only +1 increment.",
      badCode: `const [count, setCount] = useState(0);

const handleClick = () => {
  // ❌ BUG: Each call uses count = 0
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
  setCount(count + 1); // setCount(0 + 1)
  // Final count will be 1, NOT 3!
};`,
      goodCode: `const [count, setCount] = useState(0);

const handleClick = () => {
  // ✅ FIX: Functional updates read the pending queue value
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  // Final count will be 3!
};`,
      tip: "Whenever the next state depends on the previous state, always use the functional updater form: setState(prev => ...).",
    },
    {
      title: "Reading State Immediately After Setting It",
      explanation: "State updates are asynchronous relative to the current function scope. Calling setState does not mutate the local variable in the current call stack.",
      badCode: `const handleSearch = (query: string) => {
  setSearch(query);
  // ❌ BUG: search is still the old value here!
  fetchResults(search);
};`,
      goodCode: `const handleSearch = (query: string) => {
  setSearch(query);
  // ✅ FIX: Use the local variable directly for immediate actions
  fetchResults(query);
};`,
      tip: "If you need to react to state changes across renders, use useEffect with the state variable in the dependency array.",
    },
    {
      title: "Heavy Initializer Invoked on Every Render",
      explanation: "Passing a function call directly into useState(expensiveCalculation()) evaluates that expression on every single render pass, wasting CPU.",
      badCode: `// ❌ BUG: computeHeavyStats() runs on EVERY re-render!
const [stats, setStats] = useState(computeHeavyStats(dataset));`,
      goodCode: `// ✅ FIX: Pass a function reference; React only runs it on mount!
const [stats, setStats] = useState(() => computeHeavyStats(dataset));`,
      tip: "Use the lazy initializer callback () => value for any computation that takes more than ~1ms or touches storage/DOM.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why does React use Object.is instead of triple equals (===) for state comparisons?",
      answer: "Object.is handles special JavaScript edge cases that === fails on: Object.is(NaN, NaN) is true (preventing infinite loops if NaN is set), and Object.is(-0, +0) is false (correctly distinguishing signs).",
      tag: "Deep Core",
    },
    {
      question: "How does React 18 automatic batching work with promises and timeouts?",
      answer: "Prior to React 18, React only batched updates inside native React event handlers. In React 18+, all updates scheduled within microtasks (promises) and macrotasks (setTimeout) are automatically batched into a single render using the React Scheduler microtask queue.",
      tag: "React 18+",
    },
    {
      question: "How can you force a state update if an object mutation was unavoidable?",
      answer: "By creating a shallow clone: setState({ ...mutatedObject }) or setState([...mutatedArray]). Changing the reference pointer allows Object.is to evaluate to false and trigger reconciliation.",
      tag: "Patterns",
    },
  ],
};

export const useEffectNotes: HookNotesPackage = {
  hookName: "useEffect",
  mentalModel: "useEffect is an escape hatch to synchronize your component with external systems (network, window listeners, browser APIs, timers). It runs asynchronously AFTER browser paint so it never blocks the user from seeing pixel updates.",
  keyMechanics: [
    {
      title: "Passive Effect Execution Phase",
      description: "Unlike class lifecycle componentDidMount/Update, useEffect is scheduled as a passive effect. The browser paints pixels first, then the React Scheduler triggers passive effects asynchronously.",
    },
    {
      title: "Symmetrical Cleanup Lifecycle",
      description: "The cleanup function returned by useEffect does not only run on component unmount. It runs BEFORE the effect executes on the next render pass to tear down stale subscriptions.",
      code: `useEffect(() => {
  console.log("Effect executed for ID:", id);
  return () => {
    console.log("Cleanup executed for old ID:", id);
  };
}, [id]);`,
    },
    {
      title: "React 18/19 StrictMode Mount-Unmount Cycle",
      description: "In development mode with StrictMode enabled, React intentionally mounts -> unmounts -> re-mounts your component. This ensures your cleanup logic is resilient and prevents memory leaks from un-cancelled timers or subscriptions.",
    },
  ],
  trickyGotchas: [
    {
      title: "Network Race Conditions in Data Fetching",
      explanation: "If user triggers multiple requests in rapid succession (e.g. searching 'cat' then 'dog'), the 'cat' response might arrive AFTER 'dog', overwriting newer data with stale data.",
      badCode: `useEffect(() => {
  // ❌ BUG: No cancellation or stale response protection!
  fetchUserData(userId).then(data => setUser(data));
}, [userId]);`,
      goodCode: `useEffect(() => {
  let isCurrent = true;
  const controller = new AbortController();

  fetchUserData(userId, { signal: controller.signal })
    .then(data => {
      if (isCurrent) setUser(data);
    })
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  // ✅ FIX: Abort in-flight request and mark stale
  return () => {
    isCurrent = false;
    controller.abort();
  };
}, [userId]);`,
      tip: "Always use AbortController or a boolean cancellation flag when fetching inside useEffect, or use RTK Query / TanStack Query.",
    },
    {
      title: "Stale Closure in Interval or Event Listeners",
      explanation: "Omitting state variables from dependencies while referencing them inside an interval locks the closure to the initial snapshot value forever.",
      badCode: `const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    // ❌ BUG: count is frozen at 0 in this closure!
    setCount(count + 1); // Always sets 0 + 1 = 1
  }, 1000);
  return () => clearInterval(timer);
}, []); // Empty dependencies`,
      goodCode: `const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    // ✅ FIX: Functional updater receives latest state without dependency!
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
      tip: "Use functional updates setCount(c => c + 1) whenever an effect needs the previous state, keeping dependency arrays minimal.",
    },
    {
      title: "Derived State Syncing Anti-Pattern",
      explanation: "Using an effect to compute state from other state causes an extra unnecessary render cycle and can introduce subtle synchronization glitches.",
      badCode: `// ❌ ANTI-PATTERN: Double render cycle!
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(\`\${firstName} \${lastName}\`);
}, [firstName, lastName]);`,
      goodCode: `// ✅ FIX: Calculate derived state directly during render!
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');

const fullName = \`\${firstName} \${lastName}\`; // Pure calculation!`,
      tip: "If something can be calculated from existing props or state, never put it in state or useEffect. Calculate it during render.",
    },
  ],
  interviewQuestions: [
    {
      question: "What is the difference between useEffect and useLayoutEffect?",
      answer: "useEffect runs asynchronously after the browser has painted the screen (non-blocking). useLayoutEffect runs synchronously immediately after React commits DOM mutations but BEFORE the browser paints. Use useLayoutEffect only to measure DOM nodes or prevent visual flicker before paint.",
      tag: "Rendering Lifecycle",
    },
    {
      question: "Why should you avoid useEffect for user action side-effects?",
      answer: "User actions (like button clicks, form submissions) should have their side-effects in the event handler itself. Putting them in useEffect decouples the trigger from the action, making debugging harder and risking unwanted triggers when other dependencies change.",
      tag: "Architecture",
    },
    {
      question: "How does React detect dependency changes in useEffect?",
      answer: "React loops through the dependency array comparing each element with its previous render value using Object.is. If any item returns false, the cleanup is executed and the effect runs again.",
      tag: "Core Mechanics",
    },
  ],
};

export const useCallbackNotes: HookNotesPackage = {
  hookName: "useCallback",
  mentalModel: "useCallback caches a FUNCTION REFERENCE between renders. It does NOT cache the execution result (that is useMemo) and it does NOT make function execution faster. It exists to satisfy referential equality.",
  keyMechanics: [
    {
      title: "Function Referential Equality",
      description: "In JavaScript, functions are objects: () => {} !== () => {}. Every component render creates brand new function instances in memory. useCallback returns the exact same function reference until dependencies change.",
    },
    {
      title: "The React.memo Pairing Rule",
      description: "useCallback provides ZERO re-render protection unless the child component receiving the callback is wrapped in React.memo. If the child is not memoized, it re-renders whenever the parent re-renders regardless of useCallback.",
    },
    {
      title: "Memory vs Allocation Cost",
      description: "Wrapping every inline function in useCallback introduces memory overhead (closure storage, dependency arrays, comparison checks). Only use it where referential stability actually prevents expensive downstream work.",
    },
  ],
  trickyGotchas: [
    {
      title: "The Useless useCallback Anti-Pattern",
      explanation: "Using useCallback on callbacks passed to native HTML elements like <button onClick={cb}> adds overhead with zero benefit. Native DOM nodes are not memoized React components.",
      badCode: `// ❌ OVERKILL: native <button> does not benefit from referential stability!
const handleClick = useCallback(() => {
  console.log("Clicked!");
}, []);

return <button onClick={handleClick}>Click</button>;`,
      goodCode: `// ✅ CLEAN: Simple inline function is faster and cleaner
const handleClick = () => {
  console.log("Clicked!");
};

return <button onClick={handleClick}>Click</button>;`,
      tip: "Only wrap callbacks in useCallback if: 1) Passed to React.memo child, 2) Used in a hook dependency array, 3) Returned from a custom hook.",
    },
    {
      title: "Unnecessary Dependency Invalidation",
      explanation: "Listing state variables in the dependency array causes the callback reference to change on every state change, defeating the purpose of memoization.",
      badCode: `const [count, setCount] = useState(0);

// ❌ BUG: handleClick is recreated on EVERY count change!
const handleClick = useCallback(() => {
  setCount(count + 1);
}, [count]);`,
      goodCode: `const [count, setCount] = useState(0);

// ✅ FIX: Functional updater requires NO dependencies!
const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []); // Reference is stable forever!`,
      tip: "Use the updater function form setState(prev => ...) to eliminate state variables from useCallback dependency arrays.",
    },
  ],
  interviewQuestions: [
    {
      question: "Is useCallback(fn, deps) just syntactic sugar for useMemo?",
      answer: "Yes! useCallback(fn, deps) is equivalent to useMemo(() => fn, deps). While useMemo caches the returned value of the callback, useCallback caches the function definition itself.",
      tag: "Equivalence",
    },
    {
      question: "Why can excessive useCallback hurt performance?",
      answer: "Every useCallback creates a new function definition anyway (to pass into useCallback), allocates an array for dependencies, and runs an array comparison on every render. If the child re-renders anyway, this is strictly wasted CPU and memory.",
      tag: "Performance",
    },
  ],
};

export const useMemoNotes: HookNotesPackage = {
  hookName: "useMemo",
  mentalModel: "useMemo caches the RESULT of a calculation. It trades memory to avoid expensive CPU work during the render phase. It also guarantees referential equality for complex objects passed into dependency arrays.",
  keyMechanics: [
    {
      title: "Render-Phase Execution",
      description: "useMemo executes purely during the render phase. Because concurrent rendering can abort or restart render passes, useMemo must be a pure calculation with ZERO side-effects.",
    },
    {
      title: "Two Legitimate Use Cases",
      description: "1) Expensive calculations (e.g. filtering, sorting, transforming large arrays with 1,000+ items). 2) Preserving object or array referential stability when passed to React.memo children or hook dependency arrays.",
    },
    {
      title: "Performance Optimization, NOT Semantic Guarantee",
      description: "React's specification states that React may discard the memoized cache under memory pressure. Your component must produce the correct result even if useMemo recalculates.",
    },
  ],
  trickyGotchas: [
    {
      title: "Premature Optimization of Trivial Calculations",
      explanation: "Using useMemo for simple primitive operations (e.g. a + b, array.length > 0) is an anti-pattern. The cost of comparing dependencies and storing cache exceeds the trivial cost of recalculation.",
      badCode: `// ❌ OVERHEAD: Simple math takes < 0.001ms to recalculate!
const total = useMemo(() => price * quantity, [price, quantity]);`,
      goodCode: `// ✅ CLEAN: Calculate directly on every render!
const total = price * quantity;`,
      tip: "Only memoize calculations that take noticeable time (measure with performance.now() >= 1ms) or produce non-primitive dependencies.",
    },
    {
      title: "Object Literal in Dependency Array Infinite Loop",
      explanation: "Passing an inline object or array into a useEffect dependency causes infinite re-renders because { filter: 'active' } !== { filter: 'active' } by reference.",
      badCode: `// ❌ BUG: options is a brand new reference on every single render!
const options = { filter: activeTab, limit: 10 };

useEffect(() => {
  fetchData(options); // Runs in an infinite loop!
}, [options]);`,
      goodCode: `// ✅ FIX: Memoize the object reference to stabilize the effect dependency
const options = useMemo(() => ({
  filter: activeTab,
  limit: 10
}), [activeTab]);

useEffect(() => {
  fetchData(options); // Runs only when activeTab changes!
}, [options]);`,
      tip: "Alternatively, pass primitive values directly into the dependency array: useEffect(..., [activeTab]).",
    },
  ],
  interviewQuestions: [
    {
      question: "How does React 19 / React Compiler impact useMemo and useCallback?",
      answer: "The React Compiler (React 19) automatically memoizes expressions and components at build time using static analysis. In projects using the React Compiler, manual useMemo and useCallback annotations are largely automated.",
      tag: "React 19",
    },
    {
      question: "Why should you never write side-effects inside useMemo?",
      answer: "useMemo runs during rendering. In React Concurrent Mode, rendering can be paused, aborted, or re-run multiple times before committing. Side effects like analytics, network calls, or mutations will cause unpredictable duplicate executions and memory leaks.",
      tag: "Concurrent Mode",
    },
  ],
};

export const useRefNotes: HookNotesPackage = {
  hookName: "useRef",
  mentalModel: "useRef provides a persistent mutable container { current: value } whose reference never changes. Modifying ref.current is synchronous and does NOT trigger a re-render. It is an escape hatch from React's declarative state.",
  keyMechanics: [
    {
      title: "The Persistent Object Identity",
      description: "React gives you the exact same JavaScript object on every single render. You can mutate .current directly at any time without alerting the React scheduler.",
    },
    {
      title: "DOM Node Attachment Commit Phase",
      description: "When attached to a JSX element with <div ref={myRef} />, React sets ref.current to the actual DOM node during the commit phase, and sets it back to null upon unmount.",
    },
    {
      title: "Instance Variables Across Renders",
      description: "useRef is the functional component equivalent of class instance variables (this.intervalId). Perfect for storing timer IDs, animation frame handles, previous state, and tracking whether a component has mounted.",
    },
  ],
  trickyGotchas: [
    {
      title: "Reading or Writing ref.current During Rendering",
      explanation: "Reading or writing ref.current during the component render phase causes breaking bugs in React Concurrent Mode because render passes can be aborted or executed multiple times.",
      badCode: `// ❌ BUG: Modifying or reading ref in render body!
const renderCount = useRef(0);
renderCount.current += 1; // Pure render violation!

return <div>Renders: {renderCount.current}</div>;`,
      goodCode: `// ✅ FIX: Mutate refs inside useEffect or event handlers
const renderCount = useRef(0);

useEffect(() => {
  renderCount.current += 1;
});`,
      tip: "Never write or read ref.current directly in the component body before the return statement. Only touch refs in useEffect or event handlers.",
    },
    {
      title: "Expecting UI to Re-render on Ref Change",
      explanation: "Changing ref.current does not notify React of a change. The screen will not update until another state change forces a re-render.",
      badCode: `const count = useRef(0);

const increment = () => {
  count.current += 1;
  // ❌ Screen does NOT update! No re-render scheduled!
};

return <span>{count.current}</span>;`,
      goodCode: `// ✅ FIX: If UI must reflect the change, use useState!
const [count, setCount] = useState(0);

const increment = () => {
  setCount(c => c + 1); // Triggers re-render and updates screen!
};`,
      tip: "Rule of thumb: If the value is displayed in JSX, use useState. If it is an invisible operational detail (timer, socket, flag), use useRef.",
    },
    {
      title: "Conditional DOM Element Missed by useRef",
      explanation: "useRef does not notify you when a DOM element mounts or unmounts. If an element renders conditionally, ref.current will remain null until the next unrelated render.",
      badCode: `// ❌ Does not notify when input appears:
const inputRef = useRef<HTMLInputElement>(null);
{showInput && <input ref={inputRef} />}`,
      goodCode: `// ✅ FIX: Use a Callback Ref to run logic immediately upon mounting:
const inputCallbackRef = useCallback((node: HTMLInputElement | null) => {
  if (node) {
    node.focus(); // Runs immediately when attached to DOM!
  }
}, []);

{showInput && <input ref={inputCallbackRef} />}`,
      tip: "Use Callback Refs whenever you need to measure a node or run logic precisely when a DOM element attaches or detaches.",
    },
  ],
  interviewQuestions: [
    {
      question: "How do you implement a usePrevious hook using useRef?",
      answer: "Store value in a ref inside useEffect: useEffect(() => { ref.current = value; }, [value]); return ref.current;. Because useEffect runs AFTER the render is painted, ref.current still holds the value from the previous render during the current execution.",
      tag: "Custom Hook Pattern",
    },
    {
      question: "Why does forwardRef exist in React?",
      answer: "By default, React does not allow passing ref to functional custom components because components do not expose DOM nodes automatically. forwardRef explicitly opts into forwarding the ref attribute to an internal DOM node.",
      tag: "Component API",
    },
  ],
};

export const useReducerNotes: HookNotesPackage = {
  hookName: "useReducer",
  mentalModel: "useReducer organizes complex state transitions into a predictable action-driven state machine. It separates 'what happened' (dispatching an action) from 'how state updates' (pure reducer function).",
  keyMechanics: [
    {
      title: "Pure Reducer Contract",
      description: "A reducer must be a pure function: (state, action) => nextState. Given the same inputs, it must return the same output without performing side effects, API calls, or generating random values.",
    },
    {
      title: "Guaranteed Stable Dispatch",
      description: "React guarantees that the dispatch function identity never changes between re-renders. It is completely safe to omit dispatch from useEffect or useCallback dependency arrays.",
    },
    {
      title: "Decoupling Deep Component Trees",
      description: "Passing dispatch down via React Context avoids callback prop-drilling. Deeply nested children can trigger complex state updates by dispatching actions without intermediate components needing callback props.",
    },
  ],
  trickyGotchas: [
    {
      title: "Mutating State Inside Reducer",
      explanation: "Mutating previous state in the reducer violates React's immutability model. Because React uses Object.is comparison, returning a mutated state object causes React to bail out of re-rendering.",
      badCode: `const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      // ❌ BUG: Mutating array in-place!
      state.todos.push(action.payload);
      return state; // Object.is(state, state) -> NO RE-RENDER!
  }
};`,
      goodCode: `const reducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      // ✅ FIX: Return a new object with cloned array
      return {
        ...state,
        todos: [...state.todos, action.payload]
      };
  }
};`,
      tip: "Treat reducer state as strictly immutable. Return new objects and new array references on every mutation.",
    },
    {
      title: "Side Effects Inside the Reducer",
      explanation: "Putting async calls, localStorage writes, or timers inside a reducer violates purity and causes unpredictable bugs during Concurrent Mode replays.",
      badCode: `const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      // ❌ BUG: Asynchronous network call inside reducer!
      fetch('/api/data').then(res => dispatch({ type: "DONE", res }));
      return { ...state, loading: true };
  }
};`,
      goodCode: `// ✅ FIX: Perform async side-effects in event handler or useEffect!
const handleFetch = async () => {
  dispatch({ type: "FETCH_START" });
  try {
    const data = await fetch('/api/data').then(r => r.json());
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "FETCH_ERROR", payload: err });
  }
};`,
      tip: "Reducers are purely synchronous state calculators. All async operations belong in event handlers or useEffect.",
    },
  ],
  interviewQuestions: [
    {
      question: "When should you prefer useReducer over useState?",
      answer: "Prefer useReducer when: 1) State logic is complex and involves multiple sub-values, 2) The next state depends on multiple parts of previous state, 3) Multiple event handlers trigger the same state transitions, 4) You want to pass dispatch down via Context instead of callbacks.",
      tag: "Architecture",
    },
    {
      question: "What is the third argument in useReducer(reducer, initialArg, init)?",
      answer: "The third argument init is a lazy initialization function: (initialArg) => initialState. It calculates the initial state lazily on mount and allows resetting state back to initial values cleanly.",
      tag: "API Mastery",
    },
  ],
};

export const customHooksNotes: HookNotesPackage = {
  hookName: "Custom Hooks",
  mentalModel: "Custom hooks are reusable functions that encapsulate stateful logic using React primitives. Crucially: custom hooks share stateful LOGIC, not stateful INSTANCES. Each component that calls a hook receives its own isolated state.",
  keyMechanics: [
    {
      title: "Stateful Logic vs Shared State",
      description: "Calling useCounter() in Component A and Component B does NOT synchronize their counts. Each component initializes its own independent copy of useState and useEffect.",
    },
    {
      title: "Rule of Hooks Enforcement",
      description: "Any JavaScript function starting with 'use' automatically triggers the React ESLint plugin rules, enforcing top-level invocation and consistent hook order.",
    },
    {
      title: "Composition Pattern",
      description: "Custom hooks act as composable primitives. A complex hook (e.g. useAuth) can compose useState, useEffect, useRef, and useMemo internally into a clean single-line API.",
    },
  ],
  trickyGotchas: [
    {
      title: "Returning Unmemoized Helper Functions",
      explanation: "If a custom hook returns utility functions without wrapping them in useCallback, every render of the consumer component creates a new function reference. If the consumer uses that function in an effect dependency, an infinite loop occurs.",
      badCode: `function useApi(url) {
  // ❌ BUG: refetch is recreated on every render of consumer!
  const refetch = () => {
    fetchData(url);
  };
  return { refetch };
}`,
      goodCode: `function useApi(url) {
  // ✅ FIX: Stabilize function reference with useCallback
  const refetch = useCallback(() => {
    fetchData(url);
  }, [url]);

  return { refetch };
}`,
      tip: "Always wrap functions returned from custom hooks in useCallback so consumers can safely include them in useEffect dependencies.",
    },
    {
      title: "Tuple vs Object Return Signature Design",
      explanation: "Returning an array [value, setter] is great for 1-2 items (easy renaming). For 3+ items, positional tuples become fragile and awkward; return an object { data, loading, error, refetch } instead.",
      badCode: `// ❌ Fragile tuple: consumer must use 3 empty commas to skip items!
const [data, , , refetch] = useQuery('/api');`,
      goodCode: `// ✅ Robust object: consumer destructures only what is needed!
const { data, refetch } = useQuery('/api');`,
      tip: "Use tuples [a, b] for 1-2 items (like useState). Use objects { a, b, c, d } for 3+ items.",
    },
  ],
  interviewQuestions: [
    {
      question: "Can two components share the same state using a custom hook?",
      answer: "No, custom hooks share logic, not state. To share state, combine the custom hook with React Context or an external store like Redux/Zustand so the state resides in a shared provider.",
      tag: "Fundamentals",
    },
    {
      question: "Can a custom hook call another custom hook?",
      answer: "Yes! Custom hooks can compose other custom hooks and built-in hooks arbitrarily, as long as they follow the top-level invocation rules (no conditionals, loops, or nested functions).",
      tag: "Composition",
    },
  ],
};

export const dataFlowNotes: HookNotesPackage = {
  hookName: "Data Flow & 2-Way Binding",
  mentalModel: "React enforces strictly Unidirectional (One-Way) Data Flow: Data flows downwards via props; events flow upwards via callbacks. Two-way data binding in React is syntactic sugar created by pairing a value prop with an onChange callback.",
  keyMechanics: [
    {
      title: "Unidirectional Data Flow Architecture",
      description: "Data flows top-down from parent to child. This ensures a single source of truth, eliminates race conditions between sibling components, and makes application state completely predictable.",
    },
    {
      title: "Lifting State Up",
      description: "When two sibling components need to synchronize data or reflect changes together, lift the shared state up to their closest common parent component and pass callbacks down.",
    },
    {
      title: "Controlled vs Uncontrolled Paradigm",
      description: "Controlled components have their current value driven by React state (value + onChange). Uncontrolled components maintain their internal DOM state and are accessed via useRef or FormData.",
    },
  ],
  trickyGotchas: [
    {
      title: "Uncontrolled to Controlled Input Warning",
      explanation: "Initializing a state variable to undefined or null causes React to mount the input as uncontrolled. When state updates to a string, React throws a warning.",
      badCode: `// ❌ BUG: search starts as undefined -> Input mounts uncontrolled!
const [search, setSearch] = useState();

return <input value={search} onChange={e => setSearch(e.target.value)} />;`,
      goodCode: `// ✅ FIX: Always initialize with empty string "" or default value!
const [search, setSearch] = useState("");

return <input value={search} onChange={e => setSearch(e.target.value)} />;`,
      tip: "Always initialize form input state with an empty string ('') or proper primitive default, never undefined.",
    },
    {
      title: "Mutating Props in Child Component",
      explanation: "Props are strictly read-only snapshots. Mutating props directly corrupts state without informing the parent component's render loop.",
      badCode: `const UserCard = ({ user }) => {
  const handleEdit = () => {
    // ❌ BUG: Mutating parent's prop object!
    user.name = "New Name";
  };
};`,
      goodCode: `const UserCard = ({ user, onUpdateName }) => {
  const handleEdit = () => {
    // ✅ FIX: Invoke parent's callback with new value!
    onUpdateName("New Name");
  };
};`,
      tip: "Props are frozen in development mode. Always treat props as immutable contracts.",
    },
  ],
  interviewQuestions: [
    {
      question: "Why did React choose Unidirectional Data Flow over 2-Way Binding?",
      answer: "In 2-way binding systems (like early AngularJS), any child can mutate parent state automatically. In large apps, this leads to cascading digest cycles, infinite loops, and difficult debugging. One-way flow guarantees that state changes have an explicit, traceable origin.",
      tag: "Architecture",
    },
    {
      question: "What are the performance trade-offs of Controlled vs Uncontrolled forms?",
      answer: "Controlled inputs re-render on every keystroke, allowing instant validation, formatting, and dynamic disabled states. Uncontrolled inputs keep DOM state internal (read once via FormData on submit), which performs significantly better in forms with dozens or hundreds of fields.",
      tag: "Performance",
    },
  ],
};
