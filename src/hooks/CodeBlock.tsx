import React, { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "jsx" }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split("\n");

  return (
    <div className="relative my-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-900 text-gray-100 font-mono text-sm shadow-md">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          aria-label="Copy code to clipboard">
          {copied ? (
            <>
              <span className="text-green-400">✓</span> Copied!
            </>
          ) : (
            <>
              <span>📋</span> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed">
        <pre className="m-0 font-mono">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row">
              <span className="table-cell text-right pr-4 text-gray-500 select-none text-xs w-8">
                {idx + 1}
              </span>
              <span className="table-cell text-gray-200 whitespace-pre">
                {line}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
