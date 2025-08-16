import React from "react";
import type { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";

interface LearningNoteProps {
  title: string;
  children: ReactNode;
}

export const LearningNote: React.FC<LearningNoteProps> = ({
  title,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <details
      className={`border p-4 rounded-lg my-4 transition-colors ${
        theme === "dark"
          ? "bg-yellow-900 border-yellow-700"
          : "bg-yellow-50 border-yellow-200"
      }`}>
      <summary className="cursor-pointer font-bold text-lg hover:text-blue-600 transition-colors">
        📚 {title}
      </summary>
      <div className="mt-3 text-sm leading-relaxed">{children}</div>
    </details>
  );
};
