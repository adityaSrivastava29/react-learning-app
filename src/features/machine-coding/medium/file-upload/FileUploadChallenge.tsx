import React, { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  progress: number;
}

export const FileUploadChallenge: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    setError(null);

    if (!selected) return;

    // Validate size (max 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setError("File size exceeds maximum 5MB limit!");
      return;
    }

    const newFile: UploadedFile = {
      name: selected.name,
      size: selected.size,
      type: selected.type,
      progress: 0,
    };

    setFile(newFile);

    // Simulate progress upload
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 25;
      setFile((prev) => (prev ? { ...prev, progress: currentProgress } : null));

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Dropzone */}
      <div
        className={`p-6 rounded-xl border-2 border-dashed text-center space-y-2 cursor-pointer transition-colors ${
          theme === "dark"
            ? "bg-gray-900/60 border-gray-700 hover:border-blue-500"
            : "bg-gray-50 border-gray-300 hover:border-blue-400"
        }`}>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="fileInput" className="cursor-pointer block space-y-1">
          <span className="text-3xl block">📁</span>
          <span className="font-bold text-xs sm:text-sm block">Click to Choose or Drag & Drop File</span>
          <span className="text-[11px] text-gray-500 block">Max file size: 5MB</span>
        </label>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Selected File Progress */}
      {file && (
        <div
          className={`p-4 rounded border space-y-3 ${
            theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
          }`}>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div>
              <strong className="block truncate max-w-xs">{file.name}</strong>
              <span className="text-gray-500 text-xs font-mono">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <button
              onClick={removeFile}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold">
              Remove
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span>{file.progress < 100 ? "Uploading..." : "✓ Upload Complete"}</span>
              <span>{file.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadChallenge;
