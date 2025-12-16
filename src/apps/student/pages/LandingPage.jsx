import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useBranding } from "../../shared/contexts/BrandingContext";

const heroHighlights = [
  "School-branded everywhere",
  "Verified marketplace",
  "Events + RSVP",
  "Real-time analytics",
];

const statBlocks = [
  { label: "Campuses onboarded", value: "500+" },
  { label: "Avg. adoption", value: "94%" },
  { label: "Modules enabled", value: "12" },
  { label: "Support CSAT", value: "4.9/5" },
];

const featureTiles = [
  {
    title: "Pulse Announcements",
    description:
      "Targeted broadcasts routed to the exact grade level, club, or department in seconds.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
        />
      </svg>
    ),
  },
  {
    title: "Unified Calendar",
    description:
      "Academic, athletic, and cultural events stacked into one living timeline with RSVP.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Safe Marketplace",
    description:
      "Verified listings for books, uniforms, services, and fundraising campaigns.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    title: "Moderated Spaces",
    description:
      "Role-based permissions, AI powered flagging, and escalation workflows for staff.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Insights & Trends",
    description:
      "Realtime analytics on engagement, post reach, vendor activity, and wellness signals.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Mobile Ready",
    description:
      "Installable PWA plus native apps so every stakeholder stays looped in on the go.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

const platformPillars = [
  {
    label: "Communicate",
    detail: "Announcements, nudges, office hours, and alerts consolidated.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
  {
    label: "Coordinate",
    detail:
      "Calendars, workflows, approvals, and shared task boards for teams.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    label: "Commerce",
    detail:
      "Cashless payments, fundraising storefronts, and audited reporting.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
];

const journeySteps = [
  {
    title: "Branding",
    copy: "Drop in your crest, palette, and tone. UNICON mirrors your campus guidelines in under 15 minutes.",
  },
  {
    title: "Module mix",
    copy: "Switch modules on/off so each school only sees what matters.",
  },
  {
    title: "Launch",
    copy: "White-glove onboarding, training, and adoption playbooks led by our success team.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₱999",
    highlight: "Best for single campuses",
    features: [
      "Unlimited announcements",
      "Community calendar",
      "Marketplace moderation",
      "Email + chat support",
    ],
  },
  {
    name: "Elevate",
    price: "₱1,888",
    highlight: "Most popular",
    features: [
      "Advanced analytics",
      "Role-based workflows",
      "Custom branding suite",
      "Priority success manager",
    ],
    featured: true,
  },
  {
    name: "Network",
    price: "Talk to us",
    highlight: "District + enterprise",
    features: [
      "Multi-school control",
      "API + SIS bridge",
      "Dedicated CSM",
      "24/7 incident desk",
    ],
  },
];

const faqs = [
  {
    question: "What is UNICON?",
    answer:
      "UNICON is a school-branded campus hub that unifies announcements, events, forums, marketplace, and academic tools in one verified environment.",
  },
  {
    question: "How long is the trial?",
    answer:
      "You get a full 30-day trial with every module unlocked. No credit card required and you can cancel anytime during the trial.",
  },
  {
    question: "Is it mobile ready?",
    answer:
      "Yes. UNICON is a responsive PWA and ships with native mobile apps so students, parents, and staff stay updated on every device.",
  },
  {
    question: "Can we enable only a few modules?",
    answer:
      "Each module is toggleable. Start with announcements and events, then add marketplace, chats, or commerce when you’re ready.",
  },
  {
    question: "What support do you provide?",
    answer:
      "Core support is included for every plan. Pro and Network tiers unlock priority routing, live onboarding, and quarterly success reviews.",
  },
  {
    question: "Can we integrate with existing systems?",
    answer:
      "Absolutely. Our API and SIS/LMS connectors keep rosters, enrollment, and schedules synced automatically.",
  },
];

function LandingPage() {
  const { globalBranding } = useBranding();
  const brandColor = globalBranding?.color || "#365b6d";
  const brandName = globalBranding?.name || "UNICON";
  const brandLogo = globalBranding?.logoData || "/UNICON.png";

  const [openFAQ, setOpenFAQ] = useState(0);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    school: "",
    message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLoginDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#platform", label: "Platform" },
    { href: "#solutions", label: "Solutions" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#e8f2f7] text-slate-900"
      style={{ backgroundColor: "#e8f2f7" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white to-[#dce7ef]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at top, rgba(54,91,109,0.18), transparent 55%), url(${brandLogo})`,
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "160% 100%, 60%",
          backgroundPosition: "center, center -4rem",
          opacity: 0.08,
          filter: "grayscale(1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-sm">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <div
                className="h-11 w-11 rounded-2xl border border-slate-100 bg-white/90 shadow-md flex items-center justify-center"
                style={{ boxShadow: `0 10px 30px rgba(0,0,0,0.08)` }}
              >
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {brandName}
                </p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Campus
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
                  onClick={() => setShowLoginDropdown((prev) => !prev)}
                >
                  Login
                  <svg
                    className={`h-4 w-4 transition-transform ${
                      showLoginDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {showLoginDropdown && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white/95 shadow-2xl">
                    <div className="p-2">
                      <Link
                        to="/student-login"
                        className="flex items-start gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-slate-50 text-[#4a5a68]">
                          <svg
                            className="h-5 w-5"
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
                          <p className="font-semibold text-slate-900">
                            Student Login
                          </p>
                          <p className="text-xs text-slate-500">
                            Portal, marketplace, communities
                          </p>
                        </div>
                      </Link>
                      <Link
                        to="/admin-login"
                        className="mt-1 flex items-start gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-slate-50 text-emerald-600">
                          <svg
                            className="h-5 w-5"
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
                          <p className="font-semibold text-slate-900">
                            Admin Login
                          </p>
                          <p className="text-xs text-slate-500">
                            Dashboards, controls, approvals
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/register"
                className="hidden sm:inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${brandColor}, #14232c)`,
                }}
              >
                Start free trial
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="relative px-4 pb-10 pt-4 sm:pt-6">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 shadow-sm">
                {brandName} platform
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: brandColor }}
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                  A calmer, branded digital campus for every stakeholder
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                  Swap scattered chats, spreadsheets, and social feeds for a
                  single source of truth. UNICON inherits your school identity,
                  keeps data verified, and turns engagement into decisions.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${brandColor}, #0f1d24)`,
                  }}
                >
                  Launch your trial
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
                </Link>
                <a
                  href="#platform"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-8 py-4 text-base font-semibold text-slate-700 transition hover:-translate-y-0.5"
                >
                  Explore the platform
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm"
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: brandColor }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-[#83adc4]/50 via-[#c6ddee]/50 to-white blur-3xl" />
              <div className="relative space-y-5 rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#1f4256] to-[#0b1c24] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.5em] text-white/70">
                    Live campus pulse
                  </p>
                  <p className="mt-4 text-4xl font-bold">892 online</p>
                  <p className="text-sm text-white/70">
                    Clubs, classes, and marketplace
                  </p>
                  <div className="mt-6 flex gap-3">
                    {["Announcements", "Events", "Marketplace"].map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      label: "Announcements today",
                      value: "12",
                      meta: "+8 new",
                    },
                    { label: "Active events", value: "5", meta: "Career week" },
                    {
                      label: "Marketplace",
                      value: "18",
                      meta: "Verified listings",
                    },
                    {
                      label: "Support tickets",
                      value: "3",
                      meta: "All resolved",
                    },
                  ].map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">
                        {card.value}
                      </p>
                      <p className="text-xs text-slate-500">{card.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12">
          <div className="mx-auto grid max-w-6xl gap-4 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm sm:grid-cols-4">
            {statBlocks.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform */}
        <section id="platform" className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                Platform overview
              </p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">
                All your campus touchpoints reimagined
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Purpose-built modules with your logo, palette, and governance
                layered throughout.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureTiles.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="mb-4 h-12 w-12 rounded-2xl flex items-center justify-center text-white"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, #0f1c24)`,
                      opacity: 0.9,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="px-4 py-16">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="rounded-[40px] border border-white/70 bg-white/90 p-10 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Why schools switch
              </p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">
                One home for communication, coordination, and commerce
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                UNICON links every surface: parents, faculty, students, alumni,
                vendors, and leadership. Your logo stays front and center thanks
                to the new immersive background treatment.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {platformPillars.map((pillar, idx) => (
                  <div
                    key={pillar.label}
                    className="group rounded-3xl border border-slate-100 bg-white/90 p-6 transition-all hover:border-slate-200 hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${brandColor}, #0f1c24)`,
                        }}
                      >
                        {pillar.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-500">
                          {pillar.label}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                          {pillar.detail}
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-slate-500">
                          {idx === 0 && (
                            <>
                              <p>• Broadcasts, nudges, alerts</p>
                              <p>• Inbox, read receipts</p>
                              <p>• Segments by role/grade</p>
                            </>
                          )}
                          {idx === 1 && (
                            <>
                              <p>• Calendar + RSVPs</p>
                              <p>• Approvals & workflows</p>
                              <p>• Shared task boards</p>
                            </>
                          )}
                          {idx === 2 && (
                            <>
                              <p>• Cashless payments</p>
                              <p>• Fundraising storefronts</p>
                              <p>• Verified vendors</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Implementation journey
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  Roll out UNICON in three clear steps
                </h3>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {journeySteps.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg"
                  >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white text-lg font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, #132028)`,
                    }}
                  >
                    {`0${index + 1}`}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                      {step.title}
                    </p>
                    <p className="mt-2 text-base text-slate-700">{step.copy}</p>
                    <div className="mt-3 text-xs text-slate-500 space-y-1">
                      {index === 0 && (
                        <>
                          <p>• Upload crest/logo, choose palette</p>
                          <p>• Typography + accent presets</p>
                          <p>• Branded emails and buttons</p>
                        </>
                      )}
                      {index === 1 && (
                        <>
                          <p>• Enable/disable modules per school</p>
                          <p>• Role-based views and permissions</p>
                          <p>• Quick start templates</p>
                        </>
                      )}
                      {index === 2 && (
                        <>
                          <p>• White-glove onboarding timeline</p>
                          <p>• Training sessions & office hours</p>
                          <p>• Adoption playbooks and recap</p>
                        </>
                      )}
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                Pricing
              </p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">
                Pick a plan and inherit your branding instantly
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Every plan keeps your palette, crest, and typography while
                layering in our new immersive logo background treatment.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-[34px] border border-white/70 bg-white/90 p-8 shadow-xl transition hover:-translate-y-1"
                  style={
                    plan.featured
                      ? {
                          borderColor: brandColor,
                          boxShadow: "0 25px 60px rgba(12,23,31,0.18)",
                        }
                      : undefined
                  }
                >
                  {plan.featured && (
                    <span
                      className="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white"
                      style={{ backgroundColor: brandColor }}
                    >
                      Most loved
                    </span>
                  )}
                  <div className="mt-4 flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-slate-900">
                      {plan.price}
                    </p>
                    {plan.price !== "Talk to us" && (
                      <span className="text-sm text-slate-500">per month</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {plan.highlight}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: brandColor }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className="mt-8 w-full inline-block rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg text-center transition hover:-translate-y-0.5"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, #0d1a21)`,
                    }}
                  >
                    Talk to our team
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white/70 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                FAQ
              </p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">
                Everything you want to know
              </h2>
            </div>
            <div className="mt-10 rounded-[34px] border border-white/80 bg-white/90 shadow-xl">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className="border-b border-slate-100 last:border-none"
                >
                  <button
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    onClick={() =>
                      setOpenFAQ((prev) => (prev === index ? -1 : index))
                    }
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-900">
                        {faq.question}
                      </p>
                      {openFAQ === index && (
                        <p className="mt-2 text-sm text-slate-600">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        openFAQ === index
                          ? "rotate-45 border-transparent"
                          : "border-slate-200"
                      }`}
                      style={{
                        backgroundColor:
                          openFAQ === index ? brandColor : "transparent",
                      }}
                    >
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v12m6-6H6"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="px-4 py-16">
          <div className="mx-auto max-w-7xl rounded-[40px] border border-white/70 bg-white/90 p-10 shadow-2xl">
            <div className="grid gap-12 lg:grid-cols-[1fr,1.1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  Let’s talk
                </p>
                <h2 className="mt-4 text-4xl font-bold text-slate-900">
                  See UNICON tailored to your campus
                </h2>
                <p className="mt-4 text-lg text-slate-600">
                  Share your challenges and we’ll walk you through a custom
                  experience with your branding and modules.
                </p>
                <div className="mt-10 space-y-4 text-sm">
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">Email:</span>{" "}
                    hello@unicon.school
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">Phone:</span>{" "}
                    +63 917 123 4567
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">
                      Office:
                    </span>{" "}
                    Makati, PH
                  </p>
                </div>
              </div>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();

                  // Enhanced validation
                  if (!contactForm.name || !contactForm.name.trim()) {
                    setContactMessage("Please enter your name.");
                    return;
                  }

                  if (!contactForm.email || !contactForm.email.trim()) {
                    setContactMessage("Please enter your email address.");
                    return;
                  }

                  // Email validation
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(contactForm.email)) {
                    setContactMessage("Please enter a valid email address.");
                    return;
                  }

                  if (!contactForm.message || !contactForm.message.trim()) {
                    setContactMessage("Please enter your message.");
                    return;
                  }

                  if (contactForm.message.trim().length < 10) {
                    setContactMessage(
                      "Please provide a more detailed message (at least 10 characters)."
                    );
                    return;
                  }

                  setContactLoading(true);
                  setContactMessage("");

                  try {
                    const response = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: contactForm.name.trim(),
                        email: contactForm.email.trim(),
                        school: contactForm.school.trim(),
                        message: contactForm.message.trim(),
                      }),
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                      setContactMessage(
                        data.message || "Thank you! We'll be in touch soon."
                      );
                      setContactForm({
                        name: "",
                        email: "",
                        school: "",
                        message: "",
                      });
                      // Clear success message after 5 seconds
                      setTimeout(() => setContactMessage(""), 5000);
                    } else {
                      setContactMessage(
                        data.error ||
                          "Failed to send message. Please try again."
                      );
                    }
                  } catch (err) {
                    console.error("Contact form error:", err);
                    setContactMessage(
                      "Network error. Please check your connection and try again."
                    );
                  } finally {
                    setContactLoading(false);
                  }
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="School email"
                    required
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="School / District"
                  value={contactForm.school}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, school: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                />
                <textarea
                  rows="4"
                  placeholder="Tell us about your goals"
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                />
                {contactMessage && (
                  <div
                    className={`rounded-xl px-4 py-3 text-sm flex items-start gap-3 ${
                      contactMessage.includes("Thank you") ||
                      contactMessage.includes("success")
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {contactMessage.includes("Thank you") ||
                    contactMessage.includes("success") ? (
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>{contactMessage}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={contactLoading}
                  className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${brandColor}, #0f1c24)`,
                  }}
                >
                  {contactLoading ? "Sending..." : "Book a walkthrough"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="px-4 pb-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-xs uppercase tracking-[0.5em] text-slate-500">
            <img
              src={brandLogo}
              alt={brandName}
              className="h-10 w-10 object-contain opacity-80"
            />
            <p>{brandName} • Unified Campus</p>
            <p className="text-[10px] tracking-[0.4em] text-slate-400">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
