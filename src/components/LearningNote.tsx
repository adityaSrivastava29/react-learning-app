import React from "react";
import type { ReactNode } from "react";

interface LearningNoteProps {
  title: string;
  children: ReactNode;
}

export const LearningNote: React.FC<LearningNoteProps> = ({
  title,
  children,
}) => {
  return (
    <details className="group border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 rounded-xl p-3.5 my-3 transition-colors">
      <summary className="cursor-pointer font-semibold text-xs sm:text-sm text-amber-900 dark:text-amber-200 hover:text-amber-700 dark:hover:text-amber-100 transition-colors flex items-center justify-between select-none list-none">
        <span className="flex items-center gap-1.5">
          <span>💡</span>
          <span>{title}</span>
        </span>
        <span className="text-[10px] opacity-60 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
        {children}
      </div>
    </details>
  );
};
