import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";

const adminPalette = {
  primary: "#6b21a8",
  primaryDark: "#581c87",
  surface: "#0b1020",
  card: "#10172c",
  border: "rgba(255,255,255,0.08)",
};

const navItems = [
  { path: "/admin/dashboard", label: "Overview", id: "overview" },
  { path: "/admin/announcements", label: "Announcements", id: "announcements" },
  { path: "/admin/events", label: "Events", id: "events" },
  { path: "/admin/users", label: "People", id: "users" },
  { path: "/admin/marketplace", label: "Marketplace", id: "marketplace" },
  { path: "/admin/analytics", label: "Analytics", id: "analytics" },
  { path: "/admin/calendar", label: "Calendar", id: "calendar" },
  { path: "/admin/settings", label: "Settings", id: "settings" },
];

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return (
        location.pathname === "/admin/dashboard" ||
        location.pathname === "/admin-dashboard"
      );
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const tabClass = (id) => {
    const active = navItems.find((item) => isActive(item.path))?.id === id;
    return `w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
      active
        ? "bg-purple-600 text-white shadow-lg"
        : "text-white/60 hover:text-white hover:bg-white/10"
    }`;
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-xl font-bold hover:opacity-80 transition"
            >
              UNICON Admin
            </button>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
            <button
              onClick={logout}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="lg:w-64">
          <nav className="sticky top-6 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={tabClass(item.id)}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 space-y-6 pb-16 text-white">
          {children}
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;
