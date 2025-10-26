import React from "react";

export function StatusBadge({ children, variant = "default", dot = false }) {
  const variants = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}
    >
      {dot && (
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success"
              ? "bg-green-500"
              : variant === "warning"
              ? "bg-yellow-500"
              : variant === "danger"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        ></div>
      )}
      {children}
    </span>
  );
}

export function UnreadBadge({ count }) {
  if (!count || count === 0) return null;
  return (
    <span
      className="w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm"
      style={{
        backgroundColor: "var(--brand-color, #365b6d)",
        boxShadow:
          "0 6px 14px color-mix(in srgb, var(--brand-color, #365b6d) 45%, transparent)",
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function OnlineIndicator({ online }) {
  if (!online) return null;
  return (
    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
  );
}

export function VerifiedBadge({ verified }) {
  if (!verified) return null;
  return (
    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
      <svg
        className="w-2.5 h-2.5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
