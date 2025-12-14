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
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {!logoErrored && branding.logoData ? (
                <img
                  src={branding.logoData}
                  alt={branding.name || "UNICON"}
                  className="h-full w-full object-contain"
                  onError={() => setLogoErrored(true)}
                />
              ) : (
                <span className="text-lg font-semibold text-[var(--brand-color,#365b6d)]">
                  U
                </span>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Campus
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--brand-color, #365b6d)" }}
              >
                {branding.name || "UNICON"}
              </p>
            </div>
          </div>

          <div className="hidden flex-1 max-w-xl md:block">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=all`);
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

          <Link
            to="/profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5"
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={user?.name || "Profile"}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-slate-700">
                {initials}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
