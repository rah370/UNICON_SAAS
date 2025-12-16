import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { useToast } from "../../shared/components/Toast";

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <h3 className="mb-5 text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schoolBranding, updateSchoolBranding } = useBranding();
  const { showToast } = useToast();

  const [settings, setSettings] = useState({
    name: schoolBranding.name || "UNICON Admin",
    domain: "campus.edu",
    timezone: "UTC",
    color: schoolBranding.color || "#6b21a8",
    language: "English",
    notifications: true,
    emailAlerts: true,
    moderationAuto: false,
    allowStudentPosts: true,
    requireEmailVerification: true,
    maxFileSize: 10,
    allowedFileTypes: "jpg,png,pdf,doc",
    maintenanceMode: false,
    apiKey: "",
  });

  const handleUpdate = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "color") {
      updateSchoolBranding({ [field]: value });
    }
  };

  const saveSettings = async () => {
    try {
      // Save branding settings
      updateSchoolBranding({
        name: settings.name,
        color: settings.color,
      });

      // In a real app, you would save other settings to the backend
      // For now, we'll just show a success message
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save settings:", err);
      showToast("Failed to save settings", "error");
    }
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
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-white/60">Platform configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        <SectionCard title="Branding + Controls">
          <div className="grid gap-4 text-sm text-white/80 lg:grid-cols-2">
            <input
              value={settings.name}
              onChange={(e) => handleUpdate("name", e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              placeholder="Campus name"
            />
            <input
              value={settings.domain}
              onChange={(e) => handleUpdate("domain", e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
              placeholder="Domain"
            />
            <select
              value={settings.timezone}
              onChange={(e) => handleUpdate("timezone", e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            >
              <option value="UTC">UTC</option>
              <option value="UTC-5">UTC-5</option>
              <option value="UTC+8">UTC+8</option>
            </select>
            <select
              value={settings.language}
              onChange={(e) => handleUpdate("language", e.target.value)}
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            >
              <option>English</option>
              <option>Filipino</option>
              <option>Spanish</option>
            </select>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/60">
                Primary accent color
              </span>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => handleUpdate("color", e.target.value)}
                className="h-10 rounded-2xl border border-white/10 bg-black/20 p-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/60">Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (upload) =>
                    updateSchoolBranding({
                      logoData: upload.target?.result,
                    });
                  reader.readAsDataURL(file);
                }}
                className="rounded-2xl border border-dashed border-white/20 bg-black/20 px-3 py-2 text-xs text-white/70"
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Content Moderation">
          <div className="space-y-3">
            {[
              { key: "allowStudentPosts", label: "Allow students to create posts" },
              { key: "moderationAuto", label: "Auto-moderation for spam" },
              { key: "requireEmailVerification", label: "Require email verification" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:bg-black/30 transition"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleUpdate(key, e.target.checked)}
                  className="toggle"
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="File Upload Settings">
          <div className="grid gap-4 text-sm text-white/80 lg:grid-cols-2">
            <div>
              <label className="text-xs text-white/60 mb-1 block">Max File Size (MB)</label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleUpdate("maxFileSize", Number(e.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                min={1}
                max={100}
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Allowed File Types</label>
              <input
                type="text"
                value={settings.allowedFileTypes}
                onChange={(e) => handleUpdate("allowedFileTypes", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                placeholder="jpg,png,pdf,doc"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="System Settings">
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:bg-black/30 transition">
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleUpdate("maintenanceMode", e.target.checked)}
                className="toggle"
              />
            </label>
            {settings.maintenanceMode && (
              <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
                ⚠️ Platform will be unavailable to students during maintenance mode
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Notifications">
          <div className="space-y-3">
            {[
              { key: "notifications", label: "Enable notifications" },
              { key: "emailAlerts", label: "Email alerts for flagged content" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 cursor-pointer hover:bg-black/30 transition"
              >
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleUpdate(key, e.target.checked)}
                  className="toggle"
                />
              </label>
            ))}
          </div>
        </SectionCard>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border border-white/20 px-6 py-2 text-sm font-semibold text-white/80 hover:border-white/40 transition"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="rounded-xl px-6 py-2 text-sm font-semibold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6b21a8 0%, #581c87 100%)",
            }}
          >
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
