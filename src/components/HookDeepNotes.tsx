import React, { useState } from "react";
import CodeBlock from "../hooks/CodeBlock";

export interface KeyMechanic {
  title: string;
  description: string;
  code?: string;
}

export interface TrickyGotcha {
  title: string;
  explanation: string;
  badCode: string;
  goodCode: string;
  tip?: string;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  tag?: string;
}

interface HookDeepNotesProps {
  hookName: string;
  mentalModel: string;
  keyMechanics: KeyMechanic[];
  trickyGotchas: TrickyGotcha[];
  interviewQuestions: InterviewQuestion[];
}

export const HookDeepNotes: React.FC<HookDeepNotesProps> = ({
  hookName,
  mentalModel,
  keyMechanics,
  trickyGotchas,
  interviewQuestions,
}) => {
  const [activeTab, setActiveTab] = useState<"gotchas" | "mechanics" | "interview">("gotchas");

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {hookName} Deep-Dive Notes & Tricky Parts
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
            Senior Frontend Guide
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl">
          <strong className="text-gray-900 dark:text-white">Mental Model:</strong> {mentalModel}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("gotchas")}
          className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "gotchas"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>⚠️</span>
          <span>Tricky Parts & Pitfalls ({trickyGotchas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("mechanics")}
          className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "mechanics"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>⚙️</span>
          <span>Under the Hood Mechanics ({keyMechanics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("interview")}
          className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "interview"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}>
          <span>🎯</span>
          <span>Senior Interview Q&A ({interviewQuestions.length})</span>
        </button>
      </div>

      {/* Tab 1: Tricky Parts & Pitfalls */}
      {activeTab === "gotchas" && (
        <div className="p-5 sm:p-6 space-y-6">
          {trickyGotchas.map((gotcha, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                  {gotcha.title}
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {gotcha.explanation}
              </p>

              <div className="grid md:grid-cols-2 gap-4 pt-1">
                {/* Anti-Pattern / Bug */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                    <span>❌</span>
                    <span>The Pitfall / Anti-Pattern</span>
                  </div>
                  <CodeBlock code={gotcha.badCode} />
                </div>

                {/* The Correct Pattern */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>✅</span>
                    <span>The Production Fix</span>
                  </div>
                  <CodeBlock code={gotcha.goodCode} />
                </div>
              </div>

              {gotcha.tip && (
                <div className="p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <span><strong>Senior Tip:</strong> {gotcha.tip}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Under the Hood Mechanics */}
      {activeTab === "mechanics" && (
        <div className="p-5 sm:p-6 space-y-4">
          {keyMechanics.map((mech, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-2.5">
              <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                {mech.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {mech.description}
              </p>
              {mech.code && <CodeBlock code={mech.code} />}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Senior Interview Q&A */}
      {activeTab === "interview" && (
        <div className="p-5 sm:p-6 space-y-4">
          {interviewQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-xl border border-gray-200/90 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-850/50 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">Q{idx + 1}:</span>
                  {q.question}
                </h4>
                {q.tag && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {q.tag}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed pl-6 border-l-2 border-emerald-500/40">
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
