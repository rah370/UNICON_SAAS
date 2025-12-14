import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import AdminEvents from "./pages/AdminEvents";
import AdminCalendar from "./pages/AdminCalendar";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminMarketplace from "./pages/AdminMarketplace";
import AdminSettings from "./pages/AdminSettings";
import { AuthProvider, useAuth } from "../shared/contexts/AuthContext";
import { BrandingProvider } from "../shared/contexts/BrandingContext";
import { ToastProvider } from "../shared/components/Toast";

// Protected Route Component for Admin
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin, user, loading } = useAuth();

  // Wait for auth check to complete before redirecting
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (!isAdmin && user?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

function AdminApp() {
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
            {/* Public Admin Routes - handle both nested and direct access */}
            <Route index element={<AdminLogin />} />
            <Route path="login" element={<AdminLogin />} />

            {/* Protected Admin Routes - nested paths */}
            <Route
              path="dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedAdminRoute>
                  <AdminUsers />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="announcements"
              element={
                <ProtectedAdminRoute>
                  <AdminAnnouncements />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="events"
              element={
                <ProtectedAdminRoute>
                  <AdminEvents />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="calendar"
              element={
                <ProtectedAdminRoute>
                  <AdminCalendar />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedAdminRoute>
                  <AdminAnalytics />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="marketplace"
              element={
                <ProtectedAdminRoute>
                  <AdminMarketplace />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedAdminRoute>
                  <AdminSettings />
                </ProtectedAdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<AdminLogin />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default AdminApp;
