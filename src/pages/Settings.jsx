import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";
import { CardSkeleton } from "../components/SkeletonLoader";

function Settings() {
  const { user, logout } = useAuth();
  const { branding, updateBranding } = useBranding();
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      announcements: true,
      events: true,
      messages: true,
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false,
    },
    appearance: {
      theme: "light",
      language: "en",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentApi.getSettings();

      if (response.settings) {
        setSettings({
          notifications:
            response.settings.notifications || settings.notifications,
          privacy: response.settings.privacy || settings.privacy,
          appearance: response.settings.appearance || settings.appearance,
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      setError(err.message || "Failed to load settings");
      // Continue with default settings
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await studentApi.updateSettings(settings);
      showToast("Settings saved successfully!", "success");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError(err.message || "Failed to save settings");
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Simulate account deletion
      console.log("Account deletion requested");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50">
        <div className="bg-white border-b border-slate-200 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <CardSkeleton />
            </div>
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-600">
            Manage your account preferences and privacy settings
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
            {error}
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-6">
              <nav className="space-y-2">
                <a
                  href="#profile"
                  className="block px-3 py-2 rounded-lg bg-[#e1e6ed] text-[#3c4b58] font-medium"
                >
                  👤 Profile
                </a>
                <a
                  href="#notifications"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-[#d0d7df] transition-colors"
                >
                  Notifications
                </a>
                <a
                  href="#privacy"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-[#d0d7df] transition-colors"
                >
                  🔒 Privacy
                </a>
                <a
                  href="#appearance"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-[#d0d7df] transition-colors"
                >
                  🎨 Appearance
                </a>
                <a
                  href="#account"
                  className="block px-3 py-2 rounded-lg text-slate-600 hover:bg-[#d0d7df] transition-colors"
                >
                  Account
                </a>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <div
              id="profile"
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#e1e6ed] rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-sm text-slate-500 mt-1">
                      JPG, PNG up to 2MB
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.email?.split("@")[0] || "Student"}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div
              id="notifications"
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {key === "email" && "Receive notifications via email"}
                        {key === "push" &&
                          "Receive push notifications on your device"}
                        {key === "announcements" &&
                          "Get notified about new announcements"}
                        {key === "events" &&
                          "Get notified about upcoming events"}
                        {key === "messages" &&
                          "Get notified about new messages"}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) =>
                          handleSettingChange(
                            "notifications",
                            key,
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#708090]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Settings */}
            <div
              id="privacy"
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Privacy Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) =>
                      handleSettingChange(
                        "privacy",
                        "profileVisibility",
                        e.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Show Email Address
                      </h3>
                      <p className="text-sm text-slate-600">
                        Allow others to see your email address
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showEmail}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "showEmail",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#708090]"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-slate-900">
                        Show Phone Number
                      </h3>
                      <p className="text-sm text-slate-600">
                        Allow others to see your phone number
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.showPhone}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "showPhone",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#708090]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div
              id="account"
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-6">
                Account Management
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">
                    Change Password
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="mt-3 px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-[#708090] transition-colors">
                    Update Password
                  </button>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-6 py-3 rounded-lg bg-[#708090] text-white font-semibold hover:bg-[#708090] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
