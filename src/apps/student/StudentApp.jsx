import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import StudentLogin from "../../pages/StudentLogin";
import Register from "../../pages/Register";
import ForgotPassword from "../../pages/ForgotPassword";
import ResetPassword from "../../pages/ResetPassword";
import { CardSkeleton } from "../../components/SkeletonLoader";
import ErrorBoundary from "../../components/ErrorBoundary";

// Lazy load heavy components for code splitting
const ForYou = lazy(() => import("../../pages/ForYou"));
const Community = lazy(() => import("../../pages/Community"));
const Messages = lazy(() => import("../../pages/Messages"));
const Marketplace = lazy(() => import("../../pages/Marketplace"));
const Calendar = lazy(() => import("../../pages/Calendar"));
const Settings = lazy(() => import("../../pages/Settings"));
const Profile = lazy(() => import("../../pages/Profile"));
const AnalyticsDashboard = lazy(() => import("../../pages/AnalyticsDashboard"));
const SearchResults = lazy(() => import("../../pages/SearchResults"));
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { BrandingProvider } from "../../contexts/BrandingContext";
import { ToastProvider } from "../../components/Toast";
import { WebSocketProvider } from "../../contexts/WebSocketContext";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { EngagementNudges } from "../../components/EngagementNudges";
import OfflineManager from "../shared/components/OfflineManager";

// Protected Route Component for Students
function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated, loading } = useAuth();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isCommunity = path.startsWith("/community");

  // Wait for auth check to complete before redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/student-login" replace />;
  }

  return children;
}

// Main Student App Layout
function StudentAppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isCommunity = path.startsWith("/community");

  const showGlobalHeader = isAuthenticated && !isCommunity;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f4f7fb 0%, #eef2f6 45%, #dfe6ed 100%)",
      }}
    >
      {/* Subtle animated background */}
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

      {/* Main Content */}
      <div className="relative z-10">
        {showGlobalHeader && <Header />}
        <main className={`${isAuthenticated ? "pb-20" : ""} animate-fadeIn`}>
          {children}
        </main>
        {isAuthenticated && <BottomNav />}
        <OfflineManager />
      </div>
    </div>
  );
}

function StudentApp() {
  // Only aggressively clear caches in development mode
  // In production, rely on proper service worker versioning
  useEffect(() => {
    // Only run in development
    if (import.meta.env.MODE !== "development") {
      return;
    }

    const clearAllCaches = async () => {
      console.log(
        "[StudentApp] Development mode: Starting cache clear process..."
      );

      // Step 1: Unregister all service workers (dev only)
      if ("serviceWorker" in navigator) {
        try {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          if (registrations.length > 0) {
            console.log(
              `[StudentApp] Dev: Found ${registrations.length} service worker(s), unregistering...`
            );

            await Promise.all(
              registrations.map((registration) => {
                return registration.unregister().then((success) => {
                  if (success) {
                    console.log(
                      "[StudentApp] Dev: Service worker unregistered successfully"
                    );
                  }
                  return success;
                });
              })
            );
          }
        } catch (error) {
          console.error(
            "[StudentApp] Dev: Error unregistering service workers:",
            error
          );
        }
      }

      // Step 2: Clear all caches (dev only)
      if ("caches" in window) {
        try {
          const cacheNames = await caches.keys();
          if (cacheNames.length > 0) {
            console.log(
              `[StudentApp] Dev: Clearing ${cacheNames.length} cache(s)...`
            );

            await Promise.all(
              cacheNames.map((cacheName) => {
                console.log(`[StudentApp] Dev: Deleting cache: ${cacheName}`);
                return caches.delete(cacheName);
              })
            );

            console.log("[StudentApp] Dev: All caches cleared successfully");
          }
        } catch (error) {
          console.error("[StudentApp] Dev: Error clearing caches:", error);
        }
      }
    };

    clearAllCaches();
  }, []);

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <BrandingProvider>
        <AuthProvider>
          <WebSocketProvider>
            <ToastProvider>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/student-login" element={<StudentLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Student Routes */}
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <SearchResults />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/for-you"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <ForYou />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Community />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/community/:channelId"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Community />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Messages />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Marketplace />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Calendar />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Settings />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Profile />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <Profile />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute>
                      <StudentAppLayout>
                        <AnalyticsDashboard />
                      </StudentAppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </ToastProvider>
          </WebSocketProvider>
        </AuthProvider>
      </BrandingProvider>
    </ErrorBoundary>
  );
}

export default StudentApp;
