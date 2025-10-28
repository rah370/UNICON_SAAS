import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./pages/StudentLogin";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import ForYou from "./pages/ForYou";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminSettings from "./pages/admin/AdminSettings";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import { EngagementNudges } from "./components/EngagementNudges";
import OfflineManager from "./components/OfflineManager";

// Protected Route Component
function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}) {
  const { isAuthenticated } = useAuth();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isAdminRoute = path.startsWith("/admin");
  const isCommunity = path.startsWith("/community");

  const showGlobalHeader = isAuthenticated && !isAdminRoute && !isCommunity;
  const location =
    typeof window !== "undefined" ? window.location.pathname : "";

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/student-login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

// Main App Layout
function AppLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isAdminRoute = path.startsWith("/admin");
  const isCommunity = path.startsWith("/community");

  const showGlobalHeader = isAuthenticated && !isAdminRoute && !isCommunity;
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
            isAuthenticated && !isAdminRoute ? "pb-20" : ""
          } animate-fadeIn`}
        >
          {children}
        </main>
        {isAuthenticated && !isAdminRoute && <BottomNav />}
        <OfflineManager />
      </div>
    </div>
  );
}

function App() {
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
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Routes */}
            <Route
              path="/for-you"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ForYou />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Community />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/community/:channelId"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Community />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Messages />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Marketplace />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Calendar />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Settings />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/marketplace"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminMarketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default App;
