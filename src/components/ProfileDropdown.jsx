import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProfileDropdown() {
  const { user } = useAuth();

  const initials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Link
      to="/profile"
      className="flex items-center gap-3 px-3 py-2 rounded-2xl border border-slate-100 bg-white/80 shadow-sm hover:shadow-md transition-all"
    >
      <div
        className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
        style={{
          backgroundColor: "var(--brand-color, #365b6d)",
          boxShadow:
            "0 8px 18px color-mix(in srgb, var(--brand-color, #365b6d) 35%, transparent)",
        }}
      >
        {initials(user?.name)}
      </div>
      <div className="hidden sm:block text-left">
        <div className="text-sm font-semibold text-slate-900 leading-tight">
          {user?.name || "User"}
        </div>
        <div className="text-xs text-slate-500">{user?.email}</div>
      </div>
      <svg
        className="h-4 w-4 text-slate-400 sm:block hidden"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}

export default ProfileDropdown;
