import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";

export function AdminLayout({ children, title, subtitle, actions }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { schoolBranding } = useBranding();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f4f7fb 0%, #eef2f6 45%, #dfe6ed 100%)",
      }}
    >
      {/* Subtle animated background - matching student app */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "linear-gradient(125deg, color-mix(in srgb, var(--brand-color, #365b6d) 8%, transparent), transparent)",
          }}
        ></div>
        <div
          className="absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-3xl animate-bounce"
          style={{
            background:
              "color-mix(in srgb, var(--brand-color, #365b6d) 18%, transparent)",
          }}
        ></div>
        <div
          className="absolute bottom-0 right-1/5 w-[28rem] h-[28rem] rounded-full blur-3xl animate-bounce"
          style={{
            animationDelay: "1s",
            background:
              "color-mix(in srgb, var(--brand-color, #365b6d) 12%, transparent)",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="relative z-20 sticky top-0 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {title && (
              <>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  ← Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                  {subtitle && (
                    <p className="text-sm text-slate-600">{subtitle}</p>
                  )}
                </div>
              </>
            )}
            {!title && (
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {schoolBranding.name?.[0] || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
                    Admin Dashboard
                  </p>
                  <h1 className="text-xl font-bold text-slate-900">
                    {schoolBranding.name || "UNICON"}
                  </h1>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Navigate to student app - if authenticated, go to for-you, otherwise landing
                  if (user && user.role) {
                    // User is authenticated, go to student dashboard
                    window.location.href = "/for-you";
                  } else {
                    // Not authenticated, go to landing page
                    window.location.href = "/";
                  }
                }}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Student View
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-red-200 bg-white px-4 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export function AdminCard({ title, children, actions, className = "" }) {
  return (
    <div
      className={`rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur ${className}`}
    >
      {title && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {actions && (
            <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function AdminStatCard({ label, value, trend, suffix }) {
  return (
    <div className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
        {suffix}
      </p>
      {trend && (
        <p className="text-xs text-emerald-600 mt-1">
          ▲ {trend} vs last period
        </p>
      )}
    </div>
  );
}

