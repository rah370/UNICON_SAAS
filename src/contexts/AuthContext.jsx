import React, { createContext, useContext, useState, useEffect } from "react";

const rawApiBase =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL
    : "";
const API_BASE_URL =
  (rawApiBase ? rawApiBase.replace(/\/$/, "") : "") || "/api";

const demoUsers = [
  {
    id: 1,
    email: "admin@unicon.edu",
    password: "password123",
    first_name: "Admin",
    last_name: "User",
    name: "Admin User",
    role: "admin",
    school_id: 1,
    school_name: "UNICON University",
    avatar_url: null,
  },
  {
    id: 2,
    email: "student@unicon.edu",
    password: "password123",
    first_name: "Alex",
    last_name: "Johnson",
    name: "Alex Johnson",
    role: "student",
    school_id: 1,
    school_name: "UNICON",
    avatar_url: null,
  },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("uniconToken");
        const userData = localStorage.getItem("uniconUser");

        if (token && userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
          setIsAdmin(user.role === "admin");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const persistSession = (userData, token) => {
    localStorage.setItem("uniconToken", token);
    localStorage.setItem("uniconUser", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === "admin");
  };

  const tryDemoLogin = (email, password, isAdminLogin) => {
    const match = demoUsers.find((demo) => {
      if (demo.email.toLowerCase() !== email.toLowerCase()) return false;
      if (demo.password !== password) return false;
      if (isAdminLogin && demo.role !== "admin") return false;
      return true;
    });

    if (!match) {
      return null;
    }

    const { password: _omit, ...safeUser } = match;
    const token = btoa(`${safeUser.email}:${safeUser.role}:${Date.now()}`);
    return { user: safeUser, token };
  };

  const login = async (email, password, isAdminLogin = false) => {
    let apiError = "";

    try {
      // Make actual API call
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        apiError = "Unexpected server response. Please try again.";
        data = null;
      }

      if (data?.success) {
        const { user: userData, token } = data;
        persistSession(userData, token);
        return { success: true, user: userData };
      }

      apiError =
        data?.error || apiError || "Unable to sign in with those credentials.";
    } catch (error) {
      console.error("Login error:", error);
      apiError = "Network error. Please try again.";
    }

    const demoResult = tryDemoLogin(email, password, isAdminLogin);
    if (demoResult) {
      persistSession(demoResult.user, demoResult.token);
      return { success: true, user: demoResult.user };
    }

    return {
      success: false,
      error: apiError || "Invalid email or password. Please try again.",
    };
  };

  const logout = () => {
    localStorage.removeItem("uniconSessionEmail");
    localStorage.removeItem("uniconAdminSession");
    localStorage.removeItem("uniconToken");
    localStorage.removeItem("uniconUser");
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const register = async (userData) => {
    try {
      localStorage.setItem("unicon_user", JSON.stringify(userData));
      localStorage.setItem(
        "uniconBrand",
        JSON.stringify({
          name: userData.school,
          color: userData.color,
          logoData: userData.logo,
          plan: userData.plan,
        })
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
