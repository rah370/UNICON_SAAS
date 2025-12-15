import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import { BrandingProvider } from "../../contexts/BrandingContext";
import { ToastProvider } from "../../components/Toast";
import AdminLayout from "./components/AdminLayout";
import AdminLogin from "../../pages/AdminLogin";
import AdminDashboard from "../../pages/AdminDashboard";
import AdminAnalytics from "../../pages/admin/AdminAnalytics";
import AdminEvents from "../../pages/admin/AdminEvents";
import AdminMarketplace from "../../pages/admin/AdminMarketplace";
import AdminSettings from "../../pages/admin/AdminSettings";
import AdminUsers from "../../pages/admin/AdminUsers";
import AdminAnnouncements from "../../pages/admin/AdminAnnouncements";
import AdminCalendar from "../../pages/admin/AdminCalendar";

// Protected Route Component for Admin
function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function AdminApp() {
  // Unregister service workers to prevent offline issues
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
  }, []);

  return (
    <BrandingProvider>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Admin Routes */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected Admin Routes with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/announcements"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminAnnouncements />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminEvents />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminUsers />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/marketplace"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminMarketplace />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminAnalytics />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminCalendar />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout>
                    <AdminSettings />
                  </AdminLayout>
                </ProtectedAdminRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrandingProvider>
  );
}

export default AdminApp;
