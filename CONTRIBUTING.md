# 🤝 Contributing to React Learning Playground

Thank you for your interest in contributing to the **React Learning & Understanding Playground**! This project aims to be the ultimate, one-stop hands-on resource for mastering React core concepts, hooks, RTK Query, performance optimizations, interview pitfalls, and machine coding challenges.

---

## 🎯 Ways You Can Contribute

1. **Add New Machine Coding Challenges** (Easy / Medium / Hard)
2. **Add Tricky React Interview Questions** with live bug sandboxes
3. **Enhance Performance Optimization Examples**
4. **Fix Bugs or Improve UI/UX** across Light & Dark themes
5. **Improve Educational Notes & Documentation**

---

## 🛠️ Step-by-Step Guides

### 1. Adding a New Machine Coding Challenge

The machine coding practice suite at `/machine-coding` is built for modular, folder-wise extension.

1. **Create a new folder** under `src/features/machine-coding/easy/` or `medium/`:
   ```bash
   src/features/machine-coding/easy/my-challenge-name/
   ```
2. **Create your component file** (`.tsx` or `.jsx`):
   ```tsx
   // src/features/machine-coding/easy/my-challenge-name/MyChallenge.tsx
   import React, { useState } from 'react';
   import { useTheme } from '../../../../hooks/useTheme';

   export const MyChallenge: React.FC = () => {
     const { theme } = useTheme();
     // Your state & logic here...

     return (
       <div className="space-y-4">
         <h2>My Challenge</h2>
         {/* Live interactive UI */}
       </div>
     );
   };

   export default MyChallenge;
   ```
3. **Register your challenge** in `src/features/machine-coding/challengesRegistry.ts`:
   ```typescript
   import { MyChallenge } from './easy/my-challenge-name/MyChallenge';

   export const machineCodingChallenges: MachineCodingChallenge[] = [
     // ...
     {
       id: 'my-challenge-name',
       title: 'My Challenge Title',
       difficulty: 'Easy', // 'Easy' | 'Medium'
       estimatedTime: '20–30 min',
       description: 'Clear description of what the user is tasked to build.',
       folderPath: 'src/features/machine-coding/easy/my-challenge-name',
       component: MyChallenge,
       requirements: [
         'Requirement 1',
         'Requirement 2',
         'Requirement 3'
       ],
       tags: ['react', 'custom-tag']
     }
   ];
   ```
4. **Add to global search** in `src/hooks/useSearch.ts`:
   ```typescript
   { label: "Machine Coding: My Challenge Title (Easy)", path: "/machine-coding", category: "Machine Coding" },
   ```

---

### 2. Adding a Tricky React Interview Question

1. Open `src/routes/TrickyQuestionsPage.tsx`.
2. Add your question object to the `trickyQuestions` array:
   ```typescript
   {
     id: 'my-tricky-question',
     title: 'Question Title Here',
     category: 'Core React / Hooks / Async',
     shortSummary: 'One-line summary of the tricky interview concept.',
     definition: 'Detailed technical explanation of how React handles this under the hood.',
     pitfall: 'Common mistake candidates make in interview coding rounds.',
     codeSnippet: `// Reference code snippet showing the trap & fix`,
     demoComponent: MyTrickyQuestionSandbox
   }
   ```

---

## 🧼 Code Style & Best Practices

- **Theme Consistency**: Always support both Light and Dark modes using `useTheme()`. Use Tailwind color utilities (e.g. `bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`).
- **File Format**: You can use either `.tsx` or `.jsx` files for React components.
- **Event Handling**: When nesting clickable buttons inside clickable containers, use `e.stopPropagation()` to prevent unwanted event bubbling.
- **No Heavy External Icon Dependencies**: Use standard emojis or inline SVGs to keep the bundle lightweight.

---

## 🧪 Verification & PR Checklist

Before submitting a Pull Request, please ensure:

1. [ ] Project builds with zero errors:
   ```bash
   npm run build
   ```
2. [ ] Light & Dark themes render cleanly for your added component.
3. [ ] Search bar indexes your new question or module.
4. [ ] Code includes educational comments explaining non-obvious React decisions.

---

Thank you for helping make **React Learning Playground** better for developers worldwide! 🚀
