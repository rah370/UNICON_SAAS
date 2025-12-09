import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/StudentLogin";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ForYou from "./pages/ForYou";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import { AuthProvider, useAuth } from "../shared/contexts/AuthContext";
import { BrandingProvider } from "../shared/contexts/BrandingContext";
import { ToastProvider } from "../shared/components/Toast";
import Header from "../shared/components/Header";
import BottomNav from "../shared/components/BottomNav";
import { EngagementNudges } from "../shared/components/EngagementNudges";
import OfflineManager from "../shared/components/OfflineManager";

// Protected Route Component for Students
function ProtectedRoute({ children, requireAuth = true }) {
  const { isAuthenticated } = useAuth();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isCommunity = path.startsWith("/community");

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
        <main
          className={`${
            isAuthenticated ? "pb-20" : ""
          } animate-fadeIn`}
        >
          {children}
        </main>
        {isAuthenticated && <BottomNav />}
        <OfflineManager />
      </div>
    </div>
  );
}

function StudentApp() {
  // Register service worker for offline functionality
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

    return (
      <BrandingProvider>
        <AuthProvider>
          <ToastProvider>
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
          </ToastProvider>
        </AuthProvider>
      </BrandingProvider>
    );
}

export default StudentApp;

