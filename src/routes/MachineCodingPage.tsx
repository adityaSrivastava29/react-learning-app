import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { machineCodingChallenges, type MachineCodingChallenge } from '../features/machine-coding/challengesRegistry';

export const MachineCodingPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>('todo-list');
  const [filterDifficulty, setFilterDifficulty] = useState<'All' | 'Easy' | 'Medium'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'demo' | 'requirements' | 'guide'>('demo');
  const [completedRequirements, setCompletedRequirements] = useState<Record<string, boolean>>({});

  const selectedChallenge = machineCodingChallenges.find(c => c.id === selectedChallengeId) || machineCodingChallenges[0];

  const filteredChallenges = machineCodingChallenges.filter(challenge => {
    const matchesDifficulty = filterDifficulty === 'All' || challenge.difficulty === filterDifficulty;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          challenge.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const toggleRequirement = (req: string) => {
    const key = `${selectedChallenge.id}-${req}`;
    setCompletedRequirements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateProgress = (challenge: MachineCodingChallenge) => {
    const total = challenge.requirements.length;
    if (total === 0) return 0;
    const completedCount = challenge.requirements.filter(req => completedRequirements[`${challenge.id}-${req}`]).length;
    return Math.round((completedCount / total) * 100);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HERO HEADER */}
        <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm relative overflow-hidden transition-colors duration-200 ${
          theme === 'dark'
            ? 'bg-slate-800/80 border-slate-700/80 bg-gradient-to-r from-slate-800 via-slate-800/90 to-indigo-950/40'
            : 'bg-white border-slate-200/80 bg-gradient-to-r from-white via-indigo-50/30 to-purple-50/40'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center gap-1.5">
                  💻 React Machine Coding Suite
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  20 Practical Challenges
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                React Machine Coding Practice
              </h1>
              <p className={`text-base sm:text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Master frontend interview machine coding rounds with modular, isolated React exercises. Build step-by-step and test in real time.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-3">
              <div className={`px-4 py-3 rounded-xl border text-center ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-100/80 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-indigo-500">20</div>
                <div className="text-xs text-slate-400 font-medium">Challenges</div>
              </div>
              <div className={`px-4 py-3 rounded-xl border text-center ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-100/80 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-emerald-500">10 Easy</div>
                <div className="text-xs text-slate-400 font-medium">20-30 min</div>
              </div>
              <div className={`px-4 py-3 rounded-xl border text-center ${
                theme === 'dark' ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-100/80 border-slate-200'
              }`}>
                <div className="text-2xl font-bold text-amber-500">10 Medium</div>
                <div className="text-xs text-slate-400 font-medium">30-40 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SIDEBAR: CHALLENGE LIST */}
          <div className={`lg:col-span-4 rounded-2xl border p-4 space-y-4 ${
            theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            
            {/* Search Input */}
            <div className="relative">
              <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search challenges or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border transition-colors outline-none ${
                  theme === 'dark' 
                    ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500'
                }`}
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex rounded-xl p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {(['All', 'Easy', 'Medium'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    filterDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* List of Challenges */}
            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filteredChallenges.map((c) => {
                const isSelected = c.id === selectedChallenge.id;
                const progress = calculateProgress(c);

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChallengeId(c.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm'
                          : 'bg-indigo-50/80 border-indigo-300 text-indigo-900 shadow-sm'
                        : theme === 'dark'
                          ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300'
                          : 'bg-slate-50/50 border-slate-200/80 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm group-hover:text-indigo-500 transition-colors">
                          {c.title}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          c.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {c.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>⏱️ {c.estimatedTime}</span>
                        <span>•</span>
                        <span>{c.requirements.length} tasks</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {progress > 0 && (
                        <span className={`text-xs font-bold ${progress === 100 ? 'text-emerald-500' : 'text-indigo-400'}`}>
                          {progress}%
                        </span>
                      )}
                      <span className={`text-xs font-bold transition-transform ${isSelected ? 'translate-x-1 text-indigo-500' : 'text-slate-400'}`}>
                        →
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredChallenges.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No challenges match your search filter.
                </div>
              )}
            </div>
          </div>

          {/* MAIN CONTENT: ACTIVE CHALLENGE VIEWER */}
          <div className={`lg:col-span-8 rounded-2xl border p-6 space-y-6 ${
            theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            
            {/* Header for Active Challenge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    selectedChallenge.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  }`}>
                    {selectedChallenge.difficulty} ({selectedChallenge.estimatedTime})
                  </span>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedChallenge.description}
                </p>
                <div className="pt-1 flex items-center gap-1.5 text-xs font-mono text-indigo-500">
                  📁 {selectedChallenge.folderPath}
                </div>
              </div>

              {/* Requirements Progress Bar */}
              <div className={`p-3 rounded-xl border min-w-[140px] text-center ${
                theme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-xs text-slate-400 font-medium mb-1">Checklist Progress</div>
                <div className="text-lg font-bold text-indigo-500">
                  {calculateProgress(selectedChallenge)}%
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 space-x-6">
              <button
                onClick={() => setActiveTab('demo')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'demo'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                ✨ Live Interactive Sandbox
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'requirements'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                ✅ Requirements Checklist
              </button>

              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'guide'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                📂 How to Add Questions
              </button>
            </div>

            {/* TAB CONTENT: DEMO */}
            {activeTab === 'demo' && (
              <div className="space-y-4">
                <div className={`p-6 rounded-2xl border min-h-[400px] flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <selectedChallenge.component />
                </div>
              </div>
            )}

            {/* TAB CONTENT: REQUIREMENTS CHECKLIST */}
            {activeTab === 'requirements' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  🎯 Challenge Implementation Goals
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Check off requirements as you practice building or refining this component:
                </p>

                <div className="space-y-2">
                  {selectedChallenge.requirements.map((req, idx) => {
                    const isChecked = !!completedRequirements[`${selectedChallenge.id}-${req}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRequirement(req)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isChecked
                            ? theme === 'dark'
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : theme === 'dark'
                              ? 'bg-slate-900/60 border-slate-700 hover:border-slate-600 text-slate-200'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                        }`}
                      >
                        <span className={`text-base ${isChecked ? 'text-emerald-500' : 'text-slate-400'}`}>
                          {isChecked ? '☑' : '☐'}
                        </span>
                        <span className={`text-sm font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                          {req}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: EXTENSION GUIDE */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border space-y-4 ${
                  theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-500">
                    📂 How to Add Your Own Practice Questions
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    This suite is designed for seamless folder-wise expansion. Follow these 3 easy steps to add any new machine coding problem:
                  </p>

                  <div className="space-y-4 text-sm">
                    {/* Step 1 */}
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                        Create a folder & component
                      </div>
                      <div className={`p-3 rounded-xl font-mono text-xs border ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-800'
                      }`}>
                        src/features/machine-coding/easy/my-new-question/MyNewQuestionChallenge.tsx
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                        Import and register in <span className="font-mono text-indigo-500">challengesRegistry.ts</span>
                      </div>
                      <pre className={`p-3 rounded-xl font-mono text-xs border overflow-x-auto ${
                        theme === 'dark' ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-white border-slate-200 text-emerald-700'
                      }`}>
{`{
  id: 'my-new-question',
  title: 'My New Question',
  difficulty: 'Easy',
  estimatedTime: '20–30 min',
  description: 'Short explanation of what to build.',
  folderPath: 'src/features/machine-coding/easy/my-new-question',
  component: MyNewQuestionChallenge,
  requirements: ['Requirement 1', 'Requirement 2'],
  tags: ['custom', 'react']
}`}
                      </pre>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-2">
                      <div className="font-semibold flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                        Enjoy auto-indexed search & live testing!
                      </div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        Your new question will instantly appear in the sidebar, search bar, and live sandbox viewer!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default MachineCodingPage;
