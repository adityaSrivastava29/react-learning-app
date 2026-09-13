# 🚀 React Learning & Interview Understanding App

A state-of-the-art, interactive **React 18+, TypeScript, and Vite** learning playground and interview preparation suite. Designed as a **one-stop solution** for mastering core React concepts, hooks, **RTK Query**, **performance optimization**, **tricky interview traps**, and **machine coding interview challenges**.

---

## 🌟 Key Featured Modules

### 1. 💻 React Machine Coding Suite (`/machine-coding`)
A modular, folder-structured practice engine containing **20+ isolated frontend interview questions** categorized by difficulty and estimated completion time. Each challenge includes a **live interactive sandbox**, **requirements checklist with progress tracking**, and **folder path references**.

#### 🟢 Easy Challenges (20–30 min)
- **Todo List**: `src/features/machine-coding/easy/todo-list` — CRUD tasks with status filtering.
- **Counter**: `src/features/machine-coding/easy/counter` — Increment, decrement, reset, and step size modifiers.
- **Accordion**: `src/features/machine-coding/easy/accordion` — Collapsible panels supporting single vs. multi-open modes.
- **Tabs**: `src/features/machine-coding/easy/tabs` — Active tab selection with dynamic tab creation.
- **Star Rating**: `src/features/machine-coding/easy/star-rating` — Hover preview, selection lock, and read-only mode.
- **Modal Dialog**: `src/features/machine-coding/easy/modal` — Trigger open, Escape key listener, and backdrop click close.
- **Pagination**: `src/features/machine-coding/easy/pagination` — Prev/Next page navigation and dynamic page size selectors.
- **Image Carousel**: `src/features/machine-coding/easy/carousel` — Slider with dot indicators, hover pause, and auto-play playback.
- **OTP Input**: `src/features/machine-coding/easy/otp-input` — Multi-box digit input, auto-focus progression, and backspace shift.
- **Traffic Light**: `src/features/machine-coding/easy/traffic-light` — Automated sequence timing with pause and manual overrides.
- **Chips Input**: `src/features/machine-coding/easy/chipsInput` — Add tag chips on Enter key, active toggle, and event bubbling prevention.

#### 🟡 Medium Challenges (30–40 min)
- **Searchable User List**: `src/features/machine-coding/medium/searchable-list` — Multi-attribute live user filtering.
- **Debounced Search**: `src/features/machine-coding/medium/debounced-search` — Custom 500ms debounce hook with latency logs.
- **Autocomplete**: `src/features/machine-coding/medium/autocomplete` — Debounced combobox with loading spinner and fallback empty state.
- **Todo with LocalStorage**: `src/features/machine-coding/medium/todo-localstorage` — Durable state persistence across browser reloads.
- **Shopping Cart**: `src/features/machine-coding/medium/shopping-cart` — E-commerce catalog, quantity adjustments, and total math.
- **Multi-select Dropdown**: `src/features/machine-coding/medium/multiselect` — Search option filter, "Select All", and tag pills.
- **Dynamic Form**: `src/features/machine-coding/medium/dynamic-form` — Dynamic form generation from JSON schema definitions.
- **File Upload**: `src/features/machine-coding/medium/file-upload` — Drag-and-drop file attachment with animated upload progress.
- **Toast Notifications**: `src/features/machine-coding/medium/toast-notification` — Imperative alert stack (`toast.success()`, `toast.error()`).
- **Countdown Timer**: `src/features/machine-coding/medium/countdown-timer` — Hours/mins/secs countdown with play, pause, and alert ring.

---

### 2. ⚡ RTK Query Mastery (`/rtk-query`)
Master Redux Toolkit Query (`@reduxjs/toolkit/query/react`) with live API interactions:
- **Automatic Caching & Base Query**: Built on JSONPlaceholder.
- **Tag Invalidation**: `Post` tag invalidation on adding/deleting posts.
- **Polling & Prefetching**: Real-time state syncing with configurable refetch interval.
- **Live Store Inspector**: Inspect active RTK Query subscriptions, status, and cached state payload.

---

### 3. 🎯 Tricky React Questions & Pitfalls (`/tricky-questions`)
Deep-dive into common interview traps with live interactive sandboxes:
- **Stale Closures in `useEffect` / `useState`**: Why stale variables occur inside timers and how `useRef` or functional state updates fix them.
- **Automatic Batching (React 18/19)**: How React batches state updates across async timeouts and promises.
- **Two-Way Binding in React**: Why React enforces one-way data flow and how to implement controlled inputs vs Angular/Vue.
- **Child-to-Parent Data Flow**: Callback functions, lifting state up, and context events.
- **Custom Hooks vs Utility Functions**: When to encapsulate stateful logic in custom hooks (`use...`) vs pure utilities.
- **State Colocation**: Avoiding unnecessary parent re-renders by pushing state down.

---

### 4. 🚀 Performance Optimization Suite (`/optimization`)
Interactive performance guide showcasing React memoization and rendering strategies:
- **Memoization Matrix**: `React.memo`, `useMemo`, `useCallback`, and avoiding object reference traps.
- **State Colocation**: Moving state closest to where it is consumed.
- **Concurrent Rendering**: `useTransition` and `useDeferredValue` for non-blocking UI response during heavy filtering.
- **Code Splitting & Lazy Loading**: `React.lazy` and `<Suspense>` boundaries.
- **List Virtualization**: Rendering massive datasets efficiently using windowing.

---

### 5. ⚓ Hooks Lab (`/hooks`)
Interactive playground covering standard React hooks with visual re-render counters:
- `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo`, `useCallback`, `useRef`.
- **Custom Hook Creation Guide**: Step-by-step rules and patterns for writing custom hooks.

---

### 6. 🔍 Global Search & Unified Theme
- **Global Header Search (`/`)**: Instant search bar indexing all pages, tricky questions, hooks, and machine coding problems.
- **Unified Theme System**: 100% consistent Light and Dark mode toggle powered by `useTheme()`.

---

## 🛠 Tech Stack

- **Framework**: React 18+
- **Language**: TypeScript & JavaScript (supports `.tsx` and `.jsx` components)
- **Build Tool**: Vite 7+
- **Routing**: React Router DOM v6
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Vanilla CSS & Tailwind CSS v4
- **Localization**: i18next

---

## 📁 Project Structure

```
src/
├── components/                  # Shared UI & Layout components
│   ├── Layout.tsx              # Main navigation & theme shell
│   ├── LearningNote.tsx         # Educational callout cards
│   ├── SearchBar.tsx           # Global search modal (/ shortcut)
│   └── hoc/                    # Higher-Order Component examples
├── contexts/                   # Global React Contexts
│   └── ThemeContext.tsx        # Dark/Light theme provider
├── features/                   # Application Feature Modules
│   ├── machine-coding/         # Machine coding suite
│   │   ├── easy/               # Easy challenges (TodoList, Counter, OTP, ChipsInput...)
│   │   ├── medium/             # Medium challenges (Autocomplete, ShoppingCart, Toast...)
│   │   └── challengesRegistry.ts # Central registry of all machine coding challenges
│   ├── rtk-query/              # Redux Toolkit Query API slices
│   ├── todos/                  # Nested route Todo module
│   └── counter/                # Basic counter state demo
├── hooks/                      # Custom React Hooks
│   ├── useTheme.ts             # Theme access hook
│   ├── useSearch.ts            # Global search index hook
│   └── ...
├── routes/                     # Main Route Pages
│   ├── HomePage.tsx
│   ├── MachineCodingPage.tsx   # /machine-coding route
│   ├── TrickyQuestionsPage.tsx # /tricky-questions route
│   ├── OptimizationPage.tsx    # /optimization route
│   ├── RtkQueryPage.tsx        # /rtk-query route
│   └── HooksPage.tsx           # /hooks route
├── App.tsx                     # Main routes registry
└── main.tsx                    # Application entrypoint
```

---

## ➕ How to Add Your Own Machine Coding Question

The machine coding section is built for **instant folder-wise extension**. To add a new practice question:

1. **Create a folder & component** in `src/features/machine-coding/easy/` or `medium/`:
   ```bash
   src/features/machine-coding/easy/my-new-question/MyNewQuestionChallenge.tsx (or .jsx)
   ```
2. **Register the challenge** in `src/features/machine-coding/challengesRegistry.ts`:
   ```typescript
   {
     id: 'my-new-question',
     title: 'My New Question',
     difficulty: 'Easy',
     estimatedTime: '20–30 min',
     description: 'Short explanation of what to build.',
     folderPath: 'src/features/machine-coding/easy/my-new-question',
     component: MyNewQuestionChallenge,
     requirements: ['Requirement 1', 'Requirement 2'],
     tags: ['custom', 'react']
   }
   ```
3. **Done!** Your question automatically appears in the sidebar list, live interactive sandbox, search bar, and checklist viewer.

---

## ⚡ Quick Start

```bash
# 1. Clone repo
git clone <repository-url>
cd React-Learning/react-learning-app

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build for production verification
npm run build
```

---

## 🤝 Contributing

Contributions are warmly welcome! Whether adding new machine coding questions, interview pitfalls, or educational notes, check out our **[CONTRIBUTING.md](CONTRIBUTING.md)** guide for step-by-step instructions.

---

## 🙏 Acknowledgments

- **React Team** for building and maintaining the core framework.
- **Vite Team** for the lightning-fast development server and build tools.
- **Redux Toolkit Team** for state management & RTK Query.
- **Tailwind CSS Team** for the responsive utility-first CSS engine.

---

## 📜 License

This project is open-source under the [MIT License](LICENSE). Happy React coding! 🎉

