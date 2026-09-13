import React, { useState, useEffect } from "react";
import { TrickyQuestionData, type TrickyQuestion } from "../data/trickyQuestionsData";
import CodeBlock from "../hooks/CodeBlock";
import { useTheme } from "../hooks/useTheme";

// Live Interactive Demo Component for Stale Closure
const StaleClosureDemo: React.FC = () => {
  const { theme } = useTheme();
  const [brokenCount, setBrokenCount] = useState(0);
  const [fixedCount, setFixedCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const brokenTimer = setInterval(() => {
      setBrokenCount(brokenCount + 1);
    }, 1000);

    const fixedTimer = setInterval(() => {
      setFixedCount((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(brokenTimer);
      clearInterval(fixedTimer);
    };
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setBrokenCount(0);
    setFixedCount(0);
  };

  return (
    <div
      className={`p-4 rounded-lg border space-y-4 my-3 text-xs sm:text-sm ${
        theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
      }`}>
      <div className={`flex items-center justify-between border-b pb-2 ${theme === "dark" ? "border-gray-800" : "border-gray-300"}`}>
        <span className="font-bold text-amber-600 dark:text-amber-400">⚡ Live Sandbox: See Stale Closure Bug Live!</span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3 py-1 rounded font-bold text-white transition-all ${
              isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
            }`}>
            {isRunning ? "Pause Timer" : "Start Timer"}
          </button>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded">
            Reset
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`p-3 rounded border space-y-1 ${theme === "dark" ? "bg-red-950/40 border-red-800 text-red-200" : "bg-red-50 border-red-200 text-red-900"}`}>
          <span className="font-bold block">❌ Broken Counter (setCount(count + 1))</span>
          <p className="text-xs opacity-80">Closed over initial count=0 on mount:</p>
          <div className="text-2xl font-mono font-bold">Count: {brokenCount}</div>
        </div>

        <div className={`p-3 rounded border space-y-1 ${theme === "dark" ? "bg-emerald-950/40 border-emerald-800 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"}`}>
          <span className="font-bold block">✅ Fixed Counter (setCount(prev =&gt; prev + 1))</span>
          <p className="text-xs opacity-80">Uses functional state update:</p>
          <div className="text-2xl font-mono font-bold">Count: {fixedCount}</div>
        </div>
      </div>
    </div>
  );
};

// Live Interactive Demo for Automatic Batching
const AutomaticBatchingDemo: React.FC = () => {
  const { theme } = useTheme();
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);

  useEffect(() => {
    setRenderLogs((prev) => [
      ...prev,
      `Render #${prev.length + 1} -> count: ${count}, flag: ${String(flag)}`,
    ]);
  }, [count, flag]);

  const triggerAsyncUpdates = () => {
    setTimeout(() => {
      setCount((c) => c + 1);
      setFlag((f) => !f);
    }, 500);
  };

  return (
    <div
      className={`p-4 rounded-lg border space-y-3 my-3 text-xs sm:text-sm ${
        theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-gray-900"
      }`}>
      <div className={`flex items-center justify-between border-b pb-2 ${theme === "dark" ? "border-gray-800" : "border-gray-300"}`}>
        <span className="font-bold text-blue-600 dark:text-blue-400">⚡ Live Sandbox: Automatic Batching in setTimeout</span>
        <button
          onClick={triggerAsyncUpdates}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 font-semibold text-white rounded">
          Trigger 2 State Updates in setTimeout (500ms)
        </button>
      </div>

      <div className="font-mono text-xs space-y-1">
        <p className="opacity-80">Render History Log:</p>
        <div className={`max-h-28 overflow-y-auto p-2.5 rounded border space-y-1 ${
          theme === "dark" ? "bg-gray-950 border-gray-800 text-emerald-400" : "bg-white border-gray-300 text-emerald-700"
        }`}>
          {renderLogs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TrickyQuestionsPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({
    "stale-closure-useeffect": true,
  });

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = TrickyQuestionData.questions.filter((q) => {
    const matchesCategory =
      selectedCategory === "All" || q.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topicDefinition.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const categories = ["All", "Hooks", "Rendering", "State & RTK", "Async & Lifecycle"];
  const difficulties = ["All", "Easy", "Medium", "Tricky / Expert"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span>🎯</span> Tricky React Questions & Deep-Dive Concepts
        </h1>
        <p className={`text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          Your one-stop solution for mastering React edge-cases, interview traps, data flow, two-way binding, and core definitions.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        className={`p-4 rounded-lg border space-y-4 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Search Questions & Concepts
            </label>
            <input
              type="text"
              placeholder="e.g. stale closure, batching, two-way..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={`w-full px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}>
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className={`flex flex-wrap gap-2 pt-2 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Accordion List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className={`p-8 text-center rounded-lg border ${
            theme === "dark" ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-gray-100 border-gray-200 text-gray-600"
          }`}>
            No tricky questions found matching your filters. Try clearing search!
          </div>
        ) : (
          filteredQuestions.map((q: TrickyQuestion) => {
            const isExpanded = !!expandedQuestions[q.id];

            return (
              <div
                key={q.id}
                className={`rounded-lg border overflow-hidden transition-all ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
                }`}>
                <div
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-5 cursor-pointer transition-colors flex items-start justify-between gap-4 ${
                    theme === "dark" ? "hover:bg-gray-750" : "hover:bg-gray-200/60"
                  }`}>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                        {q.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          q.difficulty === "Tricky / Expert"
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }`}>
                        {q.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold">
                      {q.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90 font-medium">
                      ❓ <strong>Question:</strong> {q.question}
                    </p>
                  </div>

                  <button className="text-xl font-bold opacity-60 hover:opacity-100 select-none">
                    {isExpanded ? "▲" : "▼"}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className={`p-5 border-t space-y-6 ${
                    theme === "dark" ? "border-gray-700 bg-gray-900/60" : "border-gray-200 bg-white"
                  }`}>
                    {/* Definition */}
                    <div className={`p-4 rounded-lg border ${
                      theme === "dark" ? "bg-blue-950/40 border-blue-800 text-blue-200" : "bg-blue-50 border-blue-200 text-blue-900"
                    }`}>
                      <h4 className="font-bold text-sm mb-1 flex items-center gap-1.5">
                        <span>📖</span> Core Topic Definition
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {q.topicDefinition}
                      </p>
                    </div>

                    {/* Live Demos */}
                    {q.interactiveDemoId === "stale-closure" && <StaleClosureDemo />}
                    {q.interactiveDemoId === "batching" && <AutomaticBatchingDemo />}

                    {/* Answer & Why */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border space-y-1 ${
                        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                      }`}>
                        <h4 className="font-bold text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <span>💡</span> Answer Explanation
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                          {q.answer}
                        </p>
                      </div>

                      <div className={`p-4 rounded-lg border space-y-1 ${
                        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
                      }`}>
                        <h4 className="font-bold text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <span>⚙️</span> Under the Hood (Why it Happens)
                        </h4>
                        <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                          {q.whyItHappens}
                        </p>
                      </div>
                    </div>

                    {/* Code Comparison */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                          <span>❌</span> Common Pitfall (Problematic Code)
                        </h5>
                        <CodeBlock code={q.badCode} language="jsx" />
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                          <span>✅</span> Fixed Solution (Best Practice)
                        </h5>
                        <CodeBlock code={q.goodCode} language="jsx" />
                      </div>
                    </div>

                    {/* Key Takeaway */}
                    <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                      theme === "dark" ? "bg-emerald-950/40 border-emerald-800 text-emerald-200" : "bg-emerald-50 border-emerald-200 text-emerald-900"
                    }`}>
                      <span className="text-lg">🔑</span>
                      <p className="text-xs sm:text-sm font-semibold">
                        Key Takeaway: {q.keyTakeaway}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrickyQuestionsPage;
