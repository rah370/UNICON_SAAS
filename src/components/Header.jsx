import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { branding } = useBranding();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              {branding.logoData ? (
                <img
                  src={branding.logoData}
                  alt="UNICON"
                  className="h-10 w-10 rounded-xl object-contain shadow-sm transition-transform group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-sm transition-transform group-hover:scale-105"
                style={{ display: branding.logoData ? "none" : "flex" }}
              >
                U
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 leading-tight">
                {branding.name || "UNICON"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                School Platform
              </span>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-slate-900">
                Welcome, {user?.email?.split("@")[0]}
              </div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isAdmin
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {isAdmin ? "Admin" : "Student"}
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
