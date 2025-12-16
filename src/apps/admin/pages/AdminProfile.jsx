import React from "react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { AdminCard } from "../components/AdminLayout";

export default function AdminProfile() {
  const { user } = useAuth();
  const { schoolBranding } = useBranding();
  const profile = {
    name: user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "Admin",
    email: user?.email,
    role: user?.role || "admin",
    school: schoolBranding.name || user?.school_name || "UNICON",
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/admin/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
            <p className="text-sm text-slate-600">Your admin identity and organization details</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr,0.9fr]">
        <AdminCard title="Your details">
          <div className="space-y-4 text-sm text-slate-700">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Name</p>
              <p className="text-base font-semibold text-slate-900">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Email</p>
              <p className="text-base text-slate-800">{profile.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Role</p>
                <p className="text-base font-semibold text-slate-900">{profile.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">School</p>
                <p className="text-base font-semibold text-slate-900">{profile.school}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Phone</p>
                <p className="text-base font-semibold text-slate-900">{user?.phone || "Add a number"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Timezone</p>
                <p className="text-base font-semibold text-slate-900">{user?.timezone || "UTC"}</p>
              </div>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Security">
          <div className="space-y-3 text-sm text-slate-700">
            <p className="text-slate-600">Password resets are handled by your IT or super admin.</p>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50">
                Request password reset
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-800 hover:bg-slate-50">
                Enable 2FA
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Session timeout: 30 mins · Idle logout: 15 mins · Contact IT for access changes.
            </p>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Preferences">
        <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Product updates",
            "Incident alerts",
            "Weekly analytics",
            "Monthly reports",
            "Beta features",
            "Security notifications",
          ].map((pref) => (
            <label
              key={pref}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 cursor-pointer hover:bg-slate-50 transition"
            >
              <span>{pref}</span>
              <input type="checkbox" className="toggle" />
            </label>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Recent activity">
        <div className="space-y-2 text-sm text-slate-700">
          {[
            "Published announcement: Network maintenance",
            "Approved 3 marketplace listings",
            "Updated calendar event: Faculty meeting",
            "Enabled 2FA for admins",
          ].map((item) => (
            <div key={item} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              {item}
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
