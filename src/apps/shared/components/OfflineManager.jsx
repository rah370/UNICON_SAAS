import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function OfflineManager() {
  const { user } = useAuth();
  // DISABLED: Offline detection causes false positives
  // Only show banner if user explicitly goes offline (airplane mode, etc.)
  // Start with online=true and banner=false - never show automatically
  const [isOnline, setIsOnline] = useState(true);
  const [offlineActions, setOfflineActions] = useState([]);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  // Check API connectivity - only show offline if browser AND health check confirm offline
  const checkApiConnectivity = useCallback(async (silent = false) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
    const healthUrl = `${API_BASE_URL}/health`;

    console.log("[OfflineManager] Starting API connectivity check", {
      apiUrl: API_BASE_URL,
      healthUrl: healthUrl,
      navigatorOnLine: navigator.onLine,
      silent,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      console.log("[OfflineManager] Fetching health endpoint:", healthUrl);
      const testResponse = await fetch(healthUrl, {
        method: "GET",
        cache: "no-cache",
        signal: controller.signal,
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      clearTimeout(timeoutId);

      console.log("[OfflineManager] Health check response:", {
        status: testResponse.status,
        ok: testResponse.ok,
        statusText: testResponse.statusText,
        url: testResponse.url,
      });

      const actuallyOnline = testResponse.ok && testResponse.status === 200;

      console.log("[OfflineManager] Connectivity result:", {
        actuallyOnline,
        silent,
        navigatorOnLine: navigator.onLine,
      });

      // ONLY update to offline if BOTH conditions are true:
      // 1. navigator.onLine is false (browser says offline)
      // 2. Health check also fails
      // This prevents false positives from backend issues
      if (!navigator.onLine && !actuallyOnline) {
        // Both browser and health check say offline - we're really offline
        setIsOnline(false);
        if (!silent) {
          setShowOfflineBanner(true);
          console.log(
            "[OfflineManager] Confirmed offline - both browser and health check failed"
          );
        }
        return false;
      }

      // If we get here, either browser says online OR health check succeeded
      // Trust that we're online
      setIsOnline(true);
      setShowOfflineBanner(false);
      console.log("[OfflineManager] Online - browser or health check confirms");
      return true;
    } catch (error) {
      const errorDetails = {
        apiUrl: API_BASE_URL,
        healthUrl: healthUrl,
        error: error.message,
        errorName: error.name,
        navigatorOnLine: navigator.onLine,
        isAbortError: error.name === "AbortError",
      };
      console.error("[OfflineManager] Health check failed:", errorDetails);

      // Only show offline if BOTH browser says offline AND health check fails
      // This prevents false positives
      if (!navigator.onLine) {
        // Browser says offline AND health check failed - we're really offline
        setIsOnline(false);
        if (!silent) {
          setShowOfflineBanner(true);
          console.log(
            "[OfflineManager] Confirmed offline - browser says offline and health check failed:",
            error.name
          );
        }
        return false;
      }

      // Browser says online but health check failed - probably backend issue, not network
      // Don't show offline banner
      console.log(
        "[OfflineManager] Health check failed but navigator.onLine=true - assuming backend issue, staying online"
      );
      // Keep current state (don't change to offline)
      return true; // Return true because navigator says we're online
    }
  }, []);

  useEffect(() => {
    // Listen to browser events and verify with health check
    const handleOffline = () => {
      console.log(
        "[OfflineManager] Browser offline event detected - verifying"
      );
      // Verify with health check before showing banner
      checkApiConnectivity(false);
    };

    const handleOnline = () => {
      console.log("[OfflineManager] Browser online event - verifying");
      setIsOnline(true);
      setShowOfflineBanner(false);
      // Clear dismissal flag when coming back online
      sessionStorage.removeItem("offlineBannerDismissed");
      // Verify with health check
      checkApiConnectivity(true);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Initial connectivity check after a short delay
    const initialCheckTimeout = setTimeout(() => {
      checkApiConnectivity(true); // Silent initial check
    }, 2000);

    return () => {
      clearTimeout(initialCheckTimeout);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [checkApiConnectivity]);

  // Expose checkApiConnectivity for manual retry button
  const checkApiConnectivityRef = useRef(checkApiConnectivity);
  useEffect(() => {
    checkApiConnectivityRef.current = checkApiConnectivity;
  }, [checkApiConnectivity]);

  const syncOfflineActions = useCallback(async () => {
    if (offlineActions.length === 0) return;

    try {
      for (const action of offlineActions) {
        await syncAction(action);
      }
      setOfflineActions([]);
      console.log("All offline actions synced successfully");
    } catch (error) {
      console.error("Failed to sync offline actions:", error);
    }
  }, [offlineActions]);

  const syncAction = async (action) => {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(action),
    });

    if (!response.ok) {
      throw new Error("Sync failed");
    }

    return response.json();
  };

  const addOfflineAction = useCallback(
    (action) => {
      const offlineAction = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: user?.id,
        ...action,
      };

      setOfflineActions((prev) => [...prev, offlineAction]);

      // Store in localStorage for persistence
      const storedActions = JSON.parse(
        localStorage.getItem("offlineActions") || "[]"
      );
      storedActions.push(offlineAction);
      localStorage.setItem("offlineActions", JSON.stringify(storedActions));
    },
    [user]
  );

  const removeOfflineAction = useCallback((actionId) => {
    setOfflineActions((prev) =>
      prev.filter((action) => action.id !== actionId)
    );

    // Update localStorage
    const storedActions = JSON.parse(
      localStorage.getItem("offlineActions") || "[]"
    );
    const updatedActions = storedActions.filter(
      (action) => action.id !== actionId
    );
    localStorage.setItem("offlineActions", JSON.stringify(updatedActions));
  }, []);

  // Load offline actions from localStorage on mount
  useEffect(() => {
    const storedActions = JSON.parse(
      localStorage.getItem("offlineActions") || "[]"
    );
    setOfflineActions(storedActions);
  }, []);

  // Sync actions when coming back online
  useEffect(() => {
    if (isOnline && offlineActions.length > 0) {
      syncOfflineActions();
    }
  }, [isOnline, syncOfflineActions]);

  // Don't render if online and no banner
  if (!showOfflineBanner && isOnline) {
    return null;
  }

  return (
    <>
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
          <div className="flex items-center justify-center gap-2">
            <span>📡</span>
            <span>You're offline. Some features may be limited.</span>
            <button
              onClick={() => {
                console.log(
                  "[OfflineManager] Manual retry - checking connectivity"
                );
                checkApiConnectivityRef.current(false);
              }}
              className="ml-2 px-2 py-1 bg-yellow-600 text-yellow-100 rounded hover:bg-yellow-700 text-xs"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setShowOfflineBanner(false);
                // Remember dismissal for this session
                sessionStorage.setItem("offlineBannerDismissed", "true");
              }}
              className="ml-2 text-yellow-800 hover:text-yellow-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Offline Actions Indicator */}
      {!isOnline && offlineActions.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50 bg-[#708090] text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>💾</span>
            <span className="text-sm">
              {offlineActions.length} action
              {offlineActions.length !== 1 ? "s" : ""} pending sync
            </span>
          </div>
        </div>
      )}
    </>
  );
}

// Hook for offline functionality
export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineActions, setOfflineActions] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addOfflineAction = useCallback((action) => {
    const offlineAction = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...action,
    };

    setOfflineActions((prev) => [...prev, offlineAction]);

    // Store in localStorage
    const storedActions = JSON.parse(
      localStorage.getItem("offlineActions") || "[]"
    );
    storedActions.push(offlineAction);
    localStorage.setItem("offlineActions", JSON.stringify(storedActions));
  }, []);

  const syncOfflineActions = useCallback(async () => {
    if (offlineActions.length === 0) return;

    try {
      for (const action of offlineActions) {
        const response = await fetch("/api/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(action),
        });

        if (!response.ok) {
          throw new Error("Sync failed");
        }
      }

      setOfflineActions([]);
      localStorage.removeItem("offlineActions");
    } catch (error) {
      console.error("Failed to sync offline actions:", error);
    }
  }, [offlineActions]);

  return {
    isOnline,
    offlineActions,
    addOfflineAction,
    syncOfflineActions,
  };
}

// Offline Storage Hook
export function useOfflineStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    },
    [key]
  );

  return [value, setStoredValue];
}

// Offline Post Component
export function OfflinePostComposer({ onSubmit }) {
  const { isOnline, addOfflineAction } = useOffline();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);

    if (isOnline) {
      try {
        await onSubmit(content);
        setContent("");
      } catch (error) {
        console.error("Failed to submit post:", error);
        // Fallback to offline storage
        addOfflineAction({
          type: "post",
          content: content,
          timestamp: new Date().toISOString(),
        });
        setContent("");
      }
    } else {
      // Store offline
      addOfflineAction({
        type: "post",
        content: content,
        timestamp: new Date().toISOString(),
      });
      setContent("");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          isOnline
            ? "What's on your mind?"
            : "Draft a post (will sync when online)"
        }
        className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          {!isOnline && (
            <span className="flex items-center gap-1">
              <span>📡</span>
              <span>Offline mode</span>
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="px-4 py-2 bg-[#708090] text-white rounded-lg hover:bg-[#708090] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : isOnline ? "Post" : "Save Draft"}
        </button>
      </div>
    </form>
  );
}

// Offline Message Component
export function OfflineMessageComposer({ onSend }) {
  const { isOnline, addOfflineAction } = useOffline();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    if (isOnline) {
      try {
        await onSend(message);
        setMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
        // Fallback to offline storage
        addOfflineAction({
          type: "message",
          content: message,
          timestamp: new Date().toISOString(),
        });
        setMessage("");
      }
    } else {
      // Store offline
      addOfflineAction({
        type: "message",
        content: message,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    }

    setIsSending(false);
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={
          isOnline
            ? "Type a message..."
            : "Draft message (will sync when online)"
        }
        className="flex-1 p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isSending}
      />
      <button
        type="submit"
        disabled={!message.trim() || isSending}
        className="px-4 py-2 bg-[#708090] text-white rounded-lg hover:bg-[#708090] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? "Sending..." : isOnline ? "Send" : "Save"}
      </button>
    </form>
  );
}

export default OfflineManager;
