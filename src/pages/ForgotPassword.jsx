import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBranding } from "../contexts/BrandingContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { branding } = useBranding();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await studentApi.forgotPassword(email);
      if (result.success) {
        setSuccess(true);
        showToast("Password reset email sent! Check your inbox.", "success");
      } else {
        showToast(result.error || "Failed to send reset email", "error");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      showToast(err.message || "Failed to send reset email", "error");
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
          <div className="p-8 md:p-12">
            {success ? (
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
                  Check Your Email
                </h2>
                <p className="text-slate-600 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and click the link to reset your
                  password.
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  The reset link will expire in 1 hour. If you don't see the
                  email, check your spam folder.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setSuccess(false)}
                    className="w-full rounded-full border border-slate-300 px-4 py-3 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Resend Email
                  </button>
                  <Link
                    to="/student-login"
                    className="block w-full text-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 hover:from-blue-600 hover:to-blue-700 transition"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-slate-600">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full border border-slate-200 px-4 py-3 pl-12 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <svg
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full font-semibold text-white shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
