import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface Tab {
  id: string;
  label: string;
  content: string;
}

export const TabsChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "overview", label: "Overview", content: "Welcome to the Overview tab. Here is high-level summary data." },
    { id: "features", label: "Features", content: "Key features include dynamic tabs, active state highlighting, and tab creation." },
    { id: "settings", label: "Settings", content: "Configure application properties and preferences here." },
  ]);
  const [activeTabId, setActiveTabId] = useState("overview");

  const addTab = () => {
    const newId = `tab-${tabs.length + 1}`;
    setTabs([
      ...tabs,
      { id: newId, label: `Tab ${tabs.length + 1}`, content: `Dynamic content for Tab ${tabs.length + 1}` },
    ]);
    setActiveTabId(newId);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold opacity-80">Interactive Dynamic Tabs</span>
        <button
          onClick={addTab}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold">
          + Add New Tab
        </button>
      </div>

      {/* Tabs Header Bar */}
      <div className="flex gap-1 border-b border-gray-300 dark:border-gray-700 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              activeTabId === tab.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div
        className={`p-4 rounded border text-xs sm:text-sm leading-relaxed ${
          theme === "dark" ? "bg-gray-900 border-gray-700 text-gray-200" : "bg-white border-gray-200 text-gray-800"
        }`}>
        {activeTab.content}
      </div>
    </div>
  );
};
