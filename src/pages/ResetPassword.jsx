import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useBranding } from "../contexts/BrandingContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";

function PasswordStrengthIndicator({ password }) {
  const getStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 2) return { strength: score, label: "Weak", color: "red" };
    if (score <= 4)
      return { strength: score, label: "Medium", color: "yellow" };
    return { strength: score, label: "Strong", color: "green" };
  };

  const { strength, label, color } = getStrength(password);
  const percentage = (strength / 6) * 100;

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-600">Password strength:</span>
        <span className={`font-medium text-${color}-600`}>{label}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full bg-${color}-500 transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { branding } = useBranding();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset."
      );
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setLoading(true);

    try {
      const result = await studentApi.resetPassword(token, password);
      if (result.success) {
        setSuccess(true);
        showToast(
          "Password reset successfully! Redirecting to login...",
          "success"
        );
        setTimeout(() => {
          navigate("/student-login");
        }, 2000);
      } else {
        setError(result.error || "Failed to reset password");
        showToast(result.error || "Failed to reset password", "error");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMsg = err.message || "Failed to reset password";
      setError(errorMsg);
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/70 p-8 md:p-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-slate-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Link
              to="/forgot-password"
              className="block w-full text-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 hover:from-blue-600 hover:to-blue-700 transition"
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/70 p-8 md:p-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Password Reset Successful!
            </h2>
            <p className="text-slate-600 mb-6">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="max-w-md w-full rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/70">
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Reset Your Password
              </h2>
              <p className="text-slate-600">
                Enter your new password below. Make sure it's at least 8
                characters long.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="relative">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-4 py-3 pl-12 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
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
              <PasswordStrengthIndicator password={password} />

              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-full border border-slate-200 px-4 py-3 pl-12 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={8}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center pt-4">
                <Link
                  to="/student-login"
                  className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
