import React, { useState, useMemo } from "react";
import Prism from "prismjs";

// Import core syntax grammars
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-java";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";

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

  const lines = useMemo(() => code.trim().split("\n"), [code]);

  const highlightedHtml = useMemo(() => {
    const rawLang = language.toLowerCase().trim();
    let grammar = Prism.languages[rawLang];
    let effectiveLang = rawLang;

    if (rawLang === "ts") {
      grammar = Prism.languages.typescript;
      effectiveLang = "typescript";
    } else if (rawLang === "js") {
      grammar = Prism.languages.javascript;
      effectiveLang = "javascript";
    } else if (rawLang === "sh" || rawLang === "shell") {
      grammar = Prism.languages.bash;
      effectiveLang = "bash";
    }

    if (!grammar) {
      grammar = Prism.languages.jsx || Prism.languages.javascript || Prism.languages.clike;
      effectiveLang = "jsx";
    }

    try {
      return Prism.highlight(code.trim(), grammar, effectiveLang);
    } catch {
      return code.trim();
    }
  }, [code, language]);

  return (
    <div className="relative my-4 rounded-xl overflow-hidden border border-gray-700/80 bg-gray-950 text-gray-100 font-mono text-sm shadow-md">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          aria-label="Copy code to clipboard">
          {copied ? (
            <>
              <span className="text-emerald-400 font-bold">✓</span> Copied!
            </>
          ) : (
            <>
              <span>📋</span> Copy
            </>
          )}
        </button>
      </div>

      {/* Code Container with Line Numbers & Syntax Highlighting */}
      <div className="p-4 overflow-x-auto text-xs sm:text-sm leading-relaxed flex">
        {/* Line numbers column */}
        <div className="select-none text-right pr-3.5 mr-3.5 text-gray-500/80 font-mono text-xs leading-relaxed border-r border-gray-800/80 shrink-0">
          {lines.map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>

        {/* Highlighted code column */}
        <div className="flex-1 min-w-0">
          <pre className="m-0 font-mono p-0 bg-transparent overflow-visible text-gray-100 leading-relaxed">
            <code
              className={`language-${language} whitespace-pre block`}
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
