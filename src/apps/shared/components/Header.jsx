import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Header() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();
  const [logoErrored, setLogoErrored] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const avatarSrc =
    user?.avatarUrl || user?.avatar_url || user?.avatar || user?.photoURL || "";
  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.first_name?.[0] ||
    "U";

  useEffect(() => {
    setLogoErrored(false);
  }, [branding.logoData]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-10">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex-shrink-0">
              {!logoErrored && branding.logoData ? (
                <img
                  src={branding.logoData}
                  alt={branding.name || "UNICON"}
                  className="h-full w-full object-contain"
                  onError={() => setLogoErrored(true)}
                />
              ) : (
                <span className="text-sm sm:text-lg font-semibold text-[var(--brand-color,#365b6d)]">
                  U
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-500 truncate">
                Campus
              </p>
              <p
                className="text-sm sm:text-lg font-bold truncate"
                style={{ color: "var(--brand-color, #365b6d)" }}
              >
                {branding.name || "UNICON"}
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-xl md:block mx-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(
                    `/search?q=${encodeURIComponent(
                      searchQuery.trim()
                    )}&type=all`
                  );
                }
              }}
              className="flex items-center gap-3 rounded-full border border-slate-100 bg-white px-4 py-2 shadow-[inset_0_1px_0_rgba(148,163,184,0.3)]"
            >
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, users, updates..."
                className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
              />
            </form>
          </div>

          {/* Mobile Search Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:bg-slate-50"
              aria-label="Search"
            >
              <svg
                className="h-4 w-4 text-slate-600"
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
            </button>

            <Link
              to="/profile"
              className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 flex-shrink-0"
            >
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.name || "Profile"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  {initials}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-3 pb-3 pt-2 border-t border-slate-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(
                    `/search?q=${encodeURIComponent(
                      searchQuery.trim()
                    )}&type=all`
                  );
                  setShowMobileSearch(false);
                }
              }}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"
            >
              <svg
                className="h-4 w-4 text-slate-400 flex-shrink-0"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
