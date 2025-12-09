import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StudentApp from "./apps/student/StudentApp";
import AdminApp from "./apps/admin/AdminApp";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin App Routes - must come first to match /admin paths */}
        <Route
          path="/admin-login"
          element={<Navigate to="/admin/login" replace />}
        />
        <Route
          path="/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Student App Routes - catch all other routes */}
        <Route path="/*" element={<StudentApp />} />
      </Routes>
    </Router>
  );
}

export default App;
