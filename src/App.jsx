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
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Messages from "./pages/Messages";
import Marketplace from "./pages/Marketplace";
import Calendar from "./pages/Calendar";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrandingProvider } from "./contexts/BrandingContext";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";

// Protected Route Component
function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}) {
  const { user, isAuthenticated, isAdmin } = useAuth();

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

  return (
    <div className="min-h-screen bg-sand-50">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? "pb-16" : ""}>{children}</main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}

function App() {
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
              path="/profile"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Profile />
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

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
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
