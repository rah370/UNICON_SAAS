import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { useToast } from "../../shared/components/Toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { branding } = useBranding();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setSent(true);
        success("Password reset email sent! Check your inbox.");
      } else {
        error(result.error || "Failed to send reset email. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      error("An error occurred. Please try again.");
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
        <div className="max-w-md w-full rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/70">
          <div className="p-8">
            {!sent ? (
              <>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-slate-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      placeholder="your.email@school.edu"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link
                    to="/student-login"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
                  <svg
                    className="w-8 h-8 text-emerald-600"
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
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Check Your Email
                </h2>
                <p className="text-slate-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  The link will expire in 1 hour. If you don't see the email, check your spam folder.
                </p>
                <Link
                  to="/student-login"
                  className="inline-block rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;

