import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function BottomNav() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const studentNavItems = [
    { path: "/for-you", icon: "Home", label: "Home" },
    { path: "/community", icon: "Community", label: "Community" },
    { path: "/messages", icon: "Messages", label: "Messages" },
    { path: "/marketplace", icon: "Store", label: "Marketplace" },
    { path: "/calendar", icon: "Calendar", label: "Calendar" },
  ];

  const adminNavItems = [
    { path: "/admin-dashboard", icon: "Dashboard", label: "Dashboard" },
    { path: "/admin-users", icon: "Users", label: "Users" },
    { path: "/admin-content", icon: "Content", label: "Content" },
    { path: "/admin-analytics", icon: "Chart", label: "Analytics" },
    { path: "/admin-settings", icon: "Settings", label: "Settings" },
  ];

  const navItems = isAdmin ? adminNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "text-blue-600 bg-blue-50"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="text-sm font-semibold mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
