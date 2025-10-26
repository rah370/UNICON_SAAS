import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useBranding } from "../contexts/BrandingContext";

function LandingPage() {
  const { globalBranding } = useBranding();
  const [openFAQ, setOpenFAQ] = useState(5); // Start with the last FAQ open
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const heroHighlights = [
    "School-branded spaces",
    "Role-based access",
    "Verified marketplace",
    "Real-time analytics",
    "Moderation tools",
    "Mobile & web PWA",
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_55%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.1),transparent_50%)]" />
      <div className="absolute -top-32 -right-40 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-0 -left-40 h-[420px] w-[420px] rounded-full bg-emerald-200/30 blur-[120px]" />

      {/* UNICON Logo Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="opacity-[0.06] scale-[1.8]">
          <div className="flex items-center gap-8">
            <div
              className="w-40 h-40 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#F0F4F8" }}
            >
              <img
                src="/unicon.png"
                alt="UNICON"
                className="w-32 h-32 object-contain"
              />
            </div>
            <span className="text-8xl font-bold text-blue-800">UNICON</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
                style={{ backgroundColor: "#F0F4F8" }}
              >
                <img
                  src="/unicon.png"
                  alt="UNICON"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">UNICON</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#platform"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Platform
              </a>
              <a
                href="#pricing"
                className="px-3 py-1 rounded-full text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
                style={{
                  background: "linear-gradient(135deg, #1f4f77, #2f6c8f)",
                }}
              >
                Pricing
              </a>
              <a
                href="#solutions"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Solutions
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Contact
              </a>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Login Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all text-sm font-medium flex items-center gap-2"
                  onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                >
                  Login
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showLoginDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-2">
                      <Link
                        to="/login"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-l-4 border-transparent hover:border-blue-500"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              Student Login
                            </div>
                            <div className="text-xs text-gray-500">
                              Access student portal and features
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <Link
                        to="/admin-login"
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 transition-colors border-l-4 border-transparent hover:border-green-500"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              Admin Login
                            </div>
                            <div className="text-xs text-gray-500">
                              Access admin dashboard and controls
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/register"
                className="px-6 py-2 rounded-lg text-white text-sm font-semibold transition-all"
                style={{ backgroundColor: "#365b6d" }}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative z-10 px-4 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(226,232,240,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(226,232,240,0.25)_1px,transparent_1px)] bg-[size:52px_52px] opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Campus life, connected
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
                Connect your entire school community in one place
              </h1>
              <p className="max-w-2xl text-lg md:text-xl leading-relaxed text-slate-600">
                Announcements, events, forums, marketplace, and academic
                tools—verified and school-branded. UNICON turns scattered
                communication into a single, safe campus ecosystem.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Launch your trial
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <a
                  href="#platform"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-900"
                >
                  Explore the platform
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              <div className="grid w-full max-w-xl grid-cols-2 gap-3 pt-6 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/75 px-4 py-3 text-sm font-medium text-slate-600 shadow-sm backdrop-blur transition-all hover:border-slate-300"
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-sky-200/40 via-blue-100/30 to-indigo-200/40 blur-3xl" />
              <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-2xl backdrop-blur">
                <div className="border-b border-slate-100/70 px-8 py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                    Live campus snapshot
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="flex -space-x-2">
                      {["AJ", "MG", "LS"].map((initials) => (
                        <span
                          key={initials}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-800/90 text-sm font-semibold text-white"
                        >
                          {initials}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      892 online
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      Updated just now
                    </span>
                  </div>
                </div>
                <div className="space-y-5 px-8 py-6">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-5 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Announcements today
                        </p>
                        <p className="text-2xl font-bold text-slate-900">12</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        +8 new
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Events this week
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        5 campus events
                      </p>
                      <p className="text-xs text-slate-500">
                        Career Day starts in 2h
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Marketplace
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">
                        18 new listings
                      </p>
                      <p className="text-xs text-slate-500">
                        Textbooks verified by staff
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Upcoming events
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          Leadership Summit • 4pm
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        View agenda
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-6 rounded-2xl border border-white/70 bg-white/80 px-6 py-5 shadow-sm backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Trusted by 500+ modern campuses
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600 opacity-80">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                High schools
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Universities
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                Community colleges
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Charter networks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section id="platform" className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything your campus needs, connected
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verified, school-branded modules that scale from small departments
              to entire university systems.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Verified announcements",
                description:
                  "Targeted updates with analytics and optional pinning.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Event management",
                description:
                  "Calendar integration with RSVP and notifications.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                ),
                title: "Marketplace",
                description:
                  "Safe buying and selling with verification systems.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Forums & chats",
                description:
                  "Class and club discussions with moderation tools.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                ),
                title: "Role-based access",
                description:
                  "Students, staff, and admins get the right permissions.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Privacy-first spaces",
                description:
                  "School branding, content approvals, and data controls.",
              },
            ].map((solution, index) => (
              <div
                key={index}
                className="group rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/80 text-white shadow-sm transition-transform group-hover:scale-110">
                  {solution.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-20 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Choose the plan that fits your campus. Upgrade anytime.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
              <svg
                className="w-4 h-4 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Save up to ₱2,400/year vs separate tools
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up animate-stagger-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full mb-4">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">
                    Perfect for small schools
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ₱888
                  <span className="text-lg font-normal text-gray-500">.00</span>
                </div>
                <div className="text-gray-600 mb-4">per month</div>
                <div className="text-sm text-gray-500">Up to 500 students</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  School landing page
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  1000 users
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Basic support
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email notifications
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mobile responsive
                </li>
              </ul>
              <button
                className="w-full py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#365b6d" }}
              >
                Start Free Trial
              </button>
            </div>

            {/* Pro Plan */}
            <div
              className="bg-white rounded-3xl p-8 shadow-2xl border-2 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative animate-fade-in-up animate-stagger-2 transform"
              style={{ borderColor: "#365b6d" }}
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span
                  className="px-6 py-2 rounded-full text-sm font-bold shadow-lg"
                  style={{ backgroundColor: "#365b6d", color: "white" }}
                >
                  Most Popular
                </span>
              </div>
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
              <div className="text-center mb-8 mt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full mb-4">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Best for growing schools
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ₱1,888
                  <span className="text-lg font-normal text-gray-500">.00</span>
                </div>
                <div className="text-gray-600 mb-4">per month</div>
                <div className="text-sm text-gray-500">
                  Up to 2,000 students
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited posts
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  RSVP events
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Marketplace
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Custom branding
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced reporting
                </li>
              </ul>
              <button
                className="w-full py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#365b6d" }}
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in-up animate-stagger-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full mb-4">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-purple-800">
                    For large institutions
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Enterprise
                </h3>
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  ₱3,888
                  <span className="text-lg font-normal text-gray-500">.00</span>
                </div>
                <div className="text-gray-600 mb-4">per month</div>
                <div className="text-sm text-gray-500">Unlimited students</div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  White-label UI
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified marketplace
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  API access
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 text-green-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority feature requests
                </li>
              </ul>
              <button
                className="w-full py-4 rounded-xl text-white font-bold transition-all transform hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#365b6d" }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What our schools say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how UNICON is transforming campus communication
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "UNICON reduced our communication time by 50%. Students actually read our announcements now!",
                author: "Dr. Sarah Johnson",
                role: "Principal",
                school: "Metro High School",
                metric: "50% faster communication",
              },
              {
                quote:
                  "The marketplace feature has been a game-changer. Students can safely buy and sell textbooks without leaving campus.",
                author: "Michael Chen",
                role: "Student Affairs Director",
                school: "State University",
                metric: "90% safer transactions",
              },
              {
                quote:
                  "Finally, a platform that works for everyone - students, faculty, and parents. The role-based access is perfect.",
                author: "Lisa Rodriguez",
                role: "IT Director",
                school: "Community College",
                metric: "100% user satisfaction",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-4">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {testimonial.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {testimonial.school}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-800">
                      {testimonial.metric}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Modules */}
      <section id="solutions" className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Solutions for your campus
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verified, school-branded tools that scale from small departments
              to whole universities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Verified announcements",
                description:
                  "Targeted updates with analytics and optional pinning.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Events & RSVPs",
                description:
                  "Create events, collect RSVPs, remind attendees, and check-in.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15a1 1 0 01-2 0V9a1 1 0 012 0v6zm4 0a1 1 0 01-2 0V9a1 1 0 012 0v6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Student marketplace",
                description: "Safe buy/sell with verified school IDs.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Forums & chats",
                description:
                  "Class and club discussions with moderation tools.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                ),
                title: "Role-based access",
                description:
                  "Students, staff, and admins get the right permissions.",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ),
                title: "Privacy-first spaces",
                description:
                  "School branding, content approvals, and data controls.",
              },
            ].map((solution, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all group"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {solution.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative z-10 py-12 px-4 bg-gray-50">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Frequently asked questions
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Find answers to common questions about UNICON
            </p>
          </div>

          {/* FAQ Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up animate-stagger-2">
            {[
              {
                question: "What is UNICON?",
                answer:
                  "UNICON is a comprehensive school-branded campus hub that brings together announcements, events, forums, marketplace, and academic tools in one verified, secure app. It's designed specifically for educational institutions to streamline communication and enhance campus life.",
                isOpen: false,
              },
              {
                question: "How long is the trial?",
                answer:
                  "We offer a generous 30-day free trial with full access to all features and modules. No credit card required to get started, and you can cancel anytime during the trial period with no obligations.",
                isOpen: false,
              },
              {
                question: "Is it mobile ready?",
                answer:
                  "Absolutely! UNICON is fully responsive and works seamlessly across all devices—desktop, tablet, and mobile. We also offer native mobile apps for iOS and Android for the best user experience.",
                isOpen: false,
              },
              {
                question: "Can we enable only a few modules?",
                answer:
                  "Yes! UNICON is designed to be modular and flexible. You can start with just the modules you need and add more as your school grows. This allows for a customized experience that fits your specific requirements.",
                isOpen: false,
              },
              {
                question: "What support do you provide?",
                answer:
                  "We provide comprehensive support including email support for all plans, priority support for Pro customers, and dedicated account management for Enterprise customers. Plus, we offer extensive documentation and training resources.",
                isOpen: false,
              },
              {
                question: "Can we integrate with existing systems?",
                answer:
                  "Yes! UNICON offers robust integration capabilities with Student Information Systems (SIS), Learning Management Systems (LMS), and other educational tools you're already using. Our API makes it easy to connect with your existing infrastructure.",
                isOpen: true,
              },
            ].map((faq, index) => (
              <div
                key={index}
                className={`border-b border-gray-100 last:border-b-0 transition-all duration-300 ${
                  openFAQ === index ? "bg-gray-50" : "hover:bg-gray-25"
                }`}
              >
                <button
                  className="w-full py-4 px-6 text-left flex items-center justify-between group transition-all duration-300"
                  onClick={() => {
                    setOpenFAQ(openFAQ === index ? -1 : index);
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4 group-hover:text-gray-700 transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                        openFAQ === index
                          ? "bg-gray-200"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 transition-all duration-300 ${
                          openFAQ === index ? "rotate-45" : ""
                        }`}
                        style={{ color: "#365b6d" }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index
                      ? "max-h-64 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-4">
                    <div className="border-l-2 border-gray-300 pl-4">
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your school? Contact us today for a free
              consultation and demo.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Send us a message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  type="text"
                  placeholder="School Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Select School Size</option>
                  <option value="small">Small (1-500 students)</option>
                  <option value="medium">Medium (501-2000 students)</option>
                  <option value="large">Large (2000+ students)</option>
                </select>
                <textarea
                  placeholder="Tell us about your needs..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-white font-semibold transition-all"
                  style={{ backgroundColor: "#365b6d" }}
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">Email</div>
                      <div className="text-gray-600">hello@unicon.edu</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">Phone</div>
                      <div className="text-gray-600">+1 (555) 123-4567</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-gray-900 font-semibold">Address</div>
                      <div className="text-gray-600">
                        123 Education Street
                        <br />
                        Tech City, TC 12345
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Schedule a Demo
                </h3>
                <p className="text-gray-600 mb-6">
                  Book a personalized demo to see how UNICON can transform your
                  school's operations.
                </p>
                <button className="w-full py-3 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition-all">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/register"
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all transform hover:scale-105"
          style={{ backgroundColor: "#365b6d", color: "white" }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">Start Free Trial</span>
        </Link>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#F0F4F8" }}
                >
                  <img
                    src="/unicon.png"
                    alt="UNICON"
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-white">UNICON</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming education through technology. The complete school
                management platform for modern institutions.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors"
                  style={{ "--hover-color": "#365b6d" }}
                  onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors"
                  style={{ "--hover-color": "#365b6d" }}
                  onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#platform"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Platform overview
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#solutions"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Solutions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Training
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors"
                    style={{ "--hover-color": "#365b6d" }}
                    onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                    onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2024 UNICON. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-gray-400 transition-colors"
                  style={{ "--hover-color": "#365b6d" }}
                  onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors"
                  style={{ "--hover-color": "#365b6d" }}
                  onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors"
                  style={{ "--hover-color": "#365b6d" }}
                  onMouseEnter={(e) => (e.target.style.color = "#365b6d")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
