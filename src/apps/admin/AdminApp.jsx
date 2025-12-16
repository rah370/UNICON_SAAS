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
import AdminProfile from "./pages/AdminProfile";
import { AuthProvider, useAuth } from "../shared/contexts/AuthContext";
import { BrandingProvider } from "../shared/contexts/BrandingContext";
import { ToastProvider } from "../shared/components/Toast";
import AdminLayout from "./components/AdminLayout";

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
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin && user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
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
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="announcements"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminAnnouncements />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="events"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminEvents />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="calendar"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminCalendar />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="analytics"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="marketplace"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminMarketplace />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminProfile />
                  </AdminLayout>
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
