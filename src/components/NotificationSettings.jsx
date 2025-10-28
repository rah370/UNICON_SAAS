import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

class NotificationService {
  constructor() {
    this.permission = null;
    this.isSupported = "Notification" in window;
  }

  async requestPermission() {
    if (!this.isSupported) {
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }

  async showNotification(title, options = {}) {
    if (!this.isSupported || this.permission !== "granted") {
      return false;
    }

    try {
      const notification = new Notification(title, {
        icon: "/UNICON.png",
        badge: "/UNICON.png",
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return true;
    } catch (error) {
      console.error("Error showing notification:", error);
      return false;
    }
  }

  // Subscribe to push notifications (requires service worker)
  async subscribeToPush() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: "your-vapid-public-key", // Replace with actual VAPID key
      });

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription),
      });

      return true;
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      return false;
    }
  }
}

// React hook for notifications
export function useNotifications() {
  const [notificationService] = useState(() => new NotificationService());
  const [permission, setPermission] = useState(Notification.permission);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if notifications are enabled in localStorage
    const enabled = localStorage.getItem("notifications_enabled") === "true";
    setIsEnabled(enabled);

    // Listen for permission changes
    const handlePermissionChange = () => {
      setPermission(Notification.permission);
    };

    if ("Notification" in window) {
      Notification.addEventListener("permissionchange", handlePermissionChange);
    }

    return () => {
      if ("Notification" in window) {
        Notification.removeEventListener(
          "permissionchange",
          handlePermissionChange
        );
      }
    };
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setIsEnabled(true);
      localStorage.setItem("notifications_enabled", "true");
    }
    return granted;
  };

  const showNotification = async (title, options) => {
    if (!isEnabled) return false;
    return await notificationService.showNotification(title, options);
  };

  const subscribeToPush = async () => {
    if (!isEnabled) return false;
    return await notificationService.subscribeToPush();
  };

  const disableNotifications = () => {
    setIsEnabled(false);
    localStorage.setItem("notifications_enabled", "false");
  };

  return {
    permission,
    isEnabled,
    isSupported: notificationService.isSupported,
    requestPermission,
    showNotification,
    subscribeToPush,
    disableNotifications,
  };
}

// Notification component for settings
export function NotificationSettings() {
  const { user } = useAuth();
  const {
    permission,
    isEnabled,
    isSupported,
    requestPermission,
    showNotification,
    subscribeToPush,
    disableNotifications,
  } = useNotifications();

  const [settings, setSettings] = useState({
    announcements: true,
    events: true,
    messages: true,
    marketplace: false,
    mentions: true,
  });

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem("notification_settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem("notification_settings", JSON.stringify(newSettings));
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribeToPush();
      await showNotification("Notifications Enabled!", {
        body: "You will now receive notifications from UNICON.",
        tag: "notification-enabled",
      });
    }
  };

  const handleTestNotification = async () => {
    await showNotification("Test Notification", {
      body: "This is a test notification from UNICON.",
      tag: "test-notification",
    });
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <span className="text-yellow-600">!</span>
          <p className="text-yellow-800">
            Notifications are not supported in this browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">
        Push Notifications
      </h3>

      {/* Permission Status */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium text-slate-900">Browser Permission</h4>
            <p className="text-sm text-slate-600">
              Current status: <span className="font-medium">{permission}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {permission === "granted" && (
              <span className="text-green-600 text-sm">✓ Granted</span>
            )}
            {permission === "denied" && (
              <span className="text-red-600 text-sm">✗ Denied</span>
            )}
            {permission === "default" && (
              <span className="text-yellow-600 text-sm">? Not Set</span>
            )}
          </div>
        </div>

        {permission !== "granted" && (
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-[#708090] transition-colors"
          >
            Enable Notifications
          </button>
        )}

        {permission === "granted" && !isEnabled && (
          <button
            onClick={handleEnableNotifications}
            className="px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-[#5a6a78] transition-colors"
          >
            Activate Notifications
          </button>
        )}

        {isEnabled && (
          <div className="flex gap-2">
            <button
              onClick={handleTestNotification}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Test Notification
            </button>
            <button
              onClick={disableNotifications}
              className="px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-red-600 transition-colors"
            >
              Disable Notifications
            </button>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      {isEnabled && (
        <div>
          <h4 className="font-medium text-slate-900 mb-4">
            Notification Preferences
          </h4>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-slate-900 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h5>
                  <p className="text-sm text-slate-600">
                    {key === "announcements" &&
                      "Get notified about school announcements"}
                    {key === "events" && "Get notified about upcoming events"}
                    {key === "messages" && "Get notified about new messages"}
                    {key === "marketplace" &&
                      "Get notified about marketplace updates"}
                    {key === "mentions" &&
                      "Get notified when someone mentions you"}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleSettingChange(key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#708090]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationSettings;
