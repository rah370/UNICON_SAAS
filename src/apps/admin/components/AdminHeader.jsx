import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

function AdminHeader({ title, description, showBack = true }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition text-white"
          >
            ← Back
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {description && (
            <p className="text-sm text-white/60">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-white">{user?.name}</p>
        <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold text-white">
          {user?.name?.charAt(0)}
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
