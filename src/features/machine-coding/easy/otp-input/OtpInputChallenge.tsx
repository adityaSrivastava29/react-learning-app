import React, { useState, useRef } from "react";
import { useTheme } from "../../../../hooks/useTheme";

export const OtpInputChallenge: React.FC = () => {
  const { theme } = useTheme();
  const length = 4;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [submittedOtp, setSubmittedOtp] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return; // Numeric only

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Auto-focus next input if typed
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOtp(otp.join(""));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4 text-center">
        <div className="flex justify-center gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => { inputRefs.current[idx] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-12 h-14 text-center font-bold text-xl border-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "dark"
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={otp.some((d) => !d)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs sm:text-sm font-bold">
          Verify OTP Code
        </button>
      </form>

      {submittedOtp && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 text-xs font-mono text-center">
          ✓ Verified Code: <strong>{submittedOtp}</strong>
        </div>
      )}
    </div>
  );
};
