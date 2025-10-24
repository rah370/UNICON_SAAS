import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { branding } = useBranding();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, true);
      if (result.success) {
        navigate("/admin-dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Watermark */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: `url('${branding.logoData || "/UNICON.png"}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "200px",
        }}
      />

      <main className="relative z-10 min-h-screen grid place-items-center px-4 py-10">
        <div className="max-w-6xl mx-auto rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/70">
          <div className="grid md:grid-cols-2 min-h-[540px]">
            {/* Left gradient welcome */}
            <div className="relative p-10 md:p-14 text-white flex items-center bg-gradient-to-br from-green-600 to-green-800">
              <div className="relative z-10 max-w-xl">
                <h1 className="text-3xl md:text-5xl font-semibold">
                  Admin Portal
                </h1>
                <p className="mt-4 text-base md:text-lg text-white/90">
                  Manage your school's UNICON platform. Access admin tools,
                  analytics, user management, and content moderation.
                </p>
              </div>
              {/* Decorative shapes */}
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -bottom-8 left-10 w-52 h-20 rounded-full bg-gradient-to-r from-white/20 to-white/10"></div>
                <div className="absolute bottom-16 left-40 w-64 h-24 rounded-full rotate-12 bg-gradient-to-r from-white/25 to-white/10"></div>
                <div className="absolute bottom-24 left-64 w-40 h-16 rounded-full -rotate-6 bg-gradient-to-r from-white/25 to-white/10"></div>
                <div className="absolute bottom-10 right-10 w-56 h-20 rounded-full rotate-3 bg-gradient-to-r from-white/20 to-white/10"></div>
              </div>
            </div>

            {/* Right login card */}
            <div className="bg-white p-8 md:p-12 flex items-center">
              <div className="w-full">
                <h2 className="text-center font-semibold tracking-wide text-green-600">
                  ADMIN LOGIN
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-4 max-w-sm mx-auto"
                >
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Admin Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full border border-slate-200 px-4 py-3 pl-12 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-full border border-slate-200 px-4 py-3 pl-12 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                      />
                      Remember
                    </label>
                    <a href="#" className="hover:underline text-green-600">
                      Forgot password?
                    </a>
                  </div>
                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Signing in…" : "ADMIN LOGIN"}
                  </button>
                  <div className="flex items-center justify-between text-sm pt-1">
                    <Link
                      to="/student-login"
                      className="text-slate-600 hover:underline"
                    >
                      Student Login
                    </Link>
                    <Link to="/" className="text-slate-600 hover:underline">
                      Home
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
