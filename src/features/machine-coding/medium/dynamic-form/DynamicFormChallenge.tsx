import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface FieldConfig {
  type: "text" | "email" | "select" | "checkbox";
  name: string;
  label: string;
  options?: string[];
  required?: boolean;
}

const formSchema: FieldConfig[] = [
  { type: "text", name: "fullName", label: "Full Name", required: true },
  { type: "email", name: "emailAddress", label: "Email Address", required: true },
  { type: "select", name: "country", label: "Country", options: ["India", "United States", "United Kingdom", "Canada"] },
  { type: "checkbox", name: "agreeTerms", label: "I agree to Terms & Conditions", required: true },
];

export const DynamicFormChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<Record<string, any> | null>(null);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedData(formData);
  };

  const inputClass = `w-full px-3 py-1.5 border rounded text-xs sm:text-sm ${
    theme === "dark"
      ? "bg-gray-900 border-gray-700 text-white placeholder-gray-500"
      : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {formSchema.map((field) => (
          <div key={field.name} className="space-y-1">
            {field.type !== "checkbox" && (
              <label className="text-xs font-semibold opacity-80 block">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            )}

            {field.type === "text" || field.type === "email" ? (
              <input
                type={field.type}
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={inputClass}
              />
            ) : field.type === "select" ? (
              <select
                required={field.required}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className={inputClass}>
                <option value="">-- Select {field.label} --</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "checkbox" ? (
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  required={field.required}
                  checked={!!formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                  className="rounded"
                />
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
            ) : null}
          </div>
        ))}

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-bold">
          Submit Dynamic Form
        </button>
      </form>

      {submittedData && (
        <div className="p-4 bg-gray-950 text-emerald-400 rounded-lg text-xs font-mono overflow-x-auto space-y-1 border border-gray-800">
          <p className="text-gray-400">// Submitted Form State Payload:</p>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DynamicFormChallenge;
