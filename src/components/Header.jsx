import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import ProfileDropdown from "./ProfileDropdown";

function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { branding } = useBranding();
  const [logoErrored, setLogoErrored] = useState(false);

  useEffect(() => {
    setLogoErrored(false);
  }, [branding.logoData]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100/70 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand - Simplified */}
          <div className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-2xl border border-slate-200 bg-white flex items-center justify-center shadow-sm overflow-hidden">
              {!logoErrored && branding.logoData ? (
                <img
                  src={branding.logoData}
                  alt="UNICON"
                  className="h-full w-full object-contain"
                  onError={() => setLogoErrored(true)}
                />
              ) : (
                <span className="text-lg font-semibold text-[var(--brand-color, #365b6d)]">
                  U
                </span>
              )}
            </div>
            <span
              className="text-xl font-semibold tracking-tight"
              style={{ color: "var(--brand-color, #365b6d)" }}
            >
              {branding.name || "UNICON"}
            </span>
          </div>

          {/* Search - Simplified */}
          <div className="flex-1 max-w-xl">
            <div className="w-full flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full shadow-inner">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Profile - Simplified */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}

export default Header;
