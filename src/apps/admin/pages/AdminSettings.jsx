import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { useToast } from "../../shared/components/Toast";
import { adminApi } from "../../shared/utils/api";

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-semibold text-slate-900">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schoolBranding, updateSchoolBranding } = useBranding();
  const { success, showError } = useToast();

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
    enforce2fa: false,
    sessionTimeout: 30,
    idleLogout: 15,
    ipAllowlist: "",
    smsAlerts: false,
    enableMarketplace: true,
    enableChat: true,
    enableRSVP: true,
    dataRetentionDays: 365,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getSettings();
        if (result.settings) {
          setSettings((prev) => ({ ...prev, ...result.settings }));
          // Update branding context
          if (result.settings.name || result.settings.color) {
            updateSchoolBranding({
              name: result.settings.name || prev.name,
              color: result.settings.color || prev.color,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        showError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [updateSchoolBranding, showError]);

  const handleUpdate = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "color") {
      updateSchoolBranding({ [field]: value });
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await adminApi.updateSettings(settings);
      
      // Update branding context
      updateSchoolBranding({
        name: settings.name,
        color: settings.color,
      });

      success("Settings saved successfully!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      showError("Failed to save settings: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#eef3f7] to-[#dce7ef] text-slate-900">
      <header className="border-b border-white/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-600">Platform configuration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-700">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {loading && (
          <div className="text-center py-12 text-slate-500">
            Loading settings...
          </div>
        )}
        {!loading && (
          <>
        <SectionCard title="Branding + Controls">
          <div className="grid gap-4 text-sm text-slate-700 lg:grid-cols-2">
            <input
              value={settings.name}
              onChange={(e) => handleUpdate("name", e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              placeholder="Campus name"
            />
            <input
              value={settings.domain}
              onChange={(e) => handleUpdate("domain", e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              placeholder="Domain"
            />
            <select
              value={settings.timezone}
              onChange={(e) => handleUpdate("timezone", e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            >
              <option value="UTC">UTC</option>
              <option value="UTC-5">UTC-5</option>
              <option value="UTC+8">UTC+8</option>
            </select>
            <select
              value={settings.language}
              onChange={(e) => handleUpdate("language", e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
            >
              <option>English</option>
              <option>Filipino</option>
              <option>Spanish</option>
            </select>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">
                Primary accent color
              </span>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => handleUpdate("color", e.target.value)}
                className="h-10 rounded-2xl border border-slate-200 bg-white p-1"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Logo</span>
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
                className="rounded-2xl border border-dashed border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
              />
            </label>
          </div>
        </SectionCard>

        <SectionCard title="Content Moderation">
          <div className="space-y-3 text-slate-800">
            {[
              { key: "allowStudentPosts", label: "Allow students to create posts" },
              { key: "moderationAuto", label: "Auto-moderation for spam" },
              { key: "requireEmailVerification", label: "Require email verification" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition"
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
          <div className="grid gap-4 text-sm text-slate-700 lg:grid-cols-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Max File Size (MB)</label>
              <input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => handleUpdate("maxFileSize", Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                min={1}
                max={100}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Allowed File Types</label>
              <input
                type="text"
                value={settings.allowedFileTypes}
                onChange={(e) => handleUpdate("allowedFileTypes", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                placeholder="jpg,png,pdf,doc"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="System Settings">
          <div className="space-y-3 text-slate-800">
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition">
              <span>Maintenance Mode</span>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleUpdate("maintenanceMode", e.target.checked)}
                className="toggle"
              />
            </label>
            {settings.maintenanceMode && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                ⚠️ Platform will be unavailable to students during maintenance mode
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Notifications">
          <div className="space-y-3 text-slate-800">
            {[
              { key: "notifications", label: "Enable notifications" },
              { key: "emailAlerts", label: "Email alerts for flagged content" },
              { key: "smsAlerts", label: "SMS alerts for incidents" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition"
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

        <SectionCard title="Security & Access">
          <div className="grid gap-4 text-sm text-slate-700 lg:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition">
              <span>Enforce 2FA for admins</span>
              <input
                type="checkbox"
                checked={settings.enforce2fa}
                onChange={(e) => handleUpdate("enforce2fa", e.target.checked)}
                className="toggle"
              />
            </label>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3">
              <label className="text-xs text-slate-500">Session timeout (minutes)</label>
              <input
                type="number"
                min={5}
                value={settings.sessionTimeout}
                onChange={(e) => handleUpdate("sessionTimeout", Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3">
              <label className="text-xs text-slate-500">Idle logout (minutes)</label>
              <input
                type="number"
                min={5}
                value={settings.idleLogout}
                onChange={(e) => handleUpdate("idleLogout", Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 lg:col-span-2">
              <label className="text-xs text-slate-500">IP allowlist (comma-separated)</label>
              <input
                type="text"
                value={settings.ipAllowlist}
                onChange={(e) => handleUpdate("ipAllowlist", e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                placeholder="e.g., 10.0.0.1, 192.168.0.0/24"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Platform modules">
          <div className="space-y-3 text-slate-800">
            {[
              { key: "enableMarketplace", label: "Enable marketplace" },
              { key: "enableChat", label: "Enable messaging/chat" },
              { key: "enableRSVP", label: "Enable event RSVPs" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 cursor-pointer hover:bg-slate-50 transition"
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

        <SectionCard title="Data & exports">
          <div className="grid gap-4 text-sm text-slate-700 lg:grid-cols-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Data retention (days)</label>
              <input
                type="number"
                min={30}
                value={settings.dataRetentionDays}
                onChange={(e) => handleUpdate("dataRetentionDays", Number(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
              />
              <p className="mt-1 text-xs text-slate-500">
                Older audit and activity logs will be purged after this period.
              </p>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => showError("Export coming soon")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Export settings CSV
              </button>
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={saving || loading}
            className="rounded-xl px-6 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
