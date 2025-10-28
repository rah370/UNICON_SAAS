import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useBranding } from "../contexts/BrandingContext";

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
  },
  {
    title: "Unified Calendar",
    description:
      "Academic, athletic, and cultural events stacked into one living timeline with RSVP.",
  },
  {
    title: "Safe Marketplace",
    description:
      "Verified listings for books, uniforms, services, and fundraising campaigns.",
  },
  {
    title: "Moderated Spaces",
    description:
      "Role-based permissions, AI powered flagging, and escalation workflows for staff.",
  },
  {
    title: "Insights & Trends",
    description:
      "Realtime analytics on engagement, post reach, vendor activity, and wellness signals.",
  },
  {
    title: "Mobile Ready",
    description:
      "Installable PWA plus native apps so every stakeholder stays looped in on the go.",
  },
];

const platformPillars = [
  {
    label: "Communicate",
    detail: "Announcements, nudges, office hours, and alerts consolidated.",
  },
  {
    label: "Coordinate",
    detail: "Calendars, workflows, approvals, and shared task boards for teams.",
  },
  {
    label: "Commerce",
    detail: "Cashless payments, fundraising storefronts, and audited reporting.",
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
                <img src={brandLogo} alt={brandName} className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">{brandName}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Campus OS</p>
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
                    className={`h-4 w-4 transition-transform ${showLoginDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Student Login</p>
                          <p className="text-xs text-slate-500">Portal, marketplace, communities</p>
                        </div>
                      </Link>
                      <Link
                        to="/admin-login"
                        className="mt-1 flex items-start gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setShowLoginDropdown(false)}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-slate-50 text-emerald-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">Admin Login</p>
                          <p className="text-xs text-slate-500">Dashboards, controls, approvals</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/register"
                className="hidden sm:inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${brandColor}, #14232c)` }}
              >
                Start free trial
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section id="home" className="relative px-4 pb-10 pt-16 sm:pt-24">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-600 shadow-sm">
                {brandName} platform
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandColor }} />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                  A calmer, branded digital campus for every stakeholder
                </h1>
                <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                  Swap scattered chats, spreadsheets, and social feeds for a single source of truth.
                  UNICON inherits your school identity, keeps data verified, and turns engagement into
                  decisions.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #0f1d24)` }}
                >
                  Launch your trial
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
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
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandColor }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-[#83adc4]/50 via-[#c6ddee]/50 to-white blur-3xl" />
              <div className="relative space-y-5 rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-2xl backdrop-blur">
                <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-[#1f4256] to-[#0b1c24] p-6 text-white">
                  <p className="text-xs uppercase tracking-[0.5em] text-white/70">Live campus pulse</p>
                  <p className="mt-4 text-4xl font-bold">892 online</p>
                  <p className="text-sm text-white/70">Clubs, classes, and marketplace</p>
                  <div className="mt-6 flex gap-3">
                    {["Announcements", "Events", "Marketplace"].map((pill) => (
                      <span key={pill} className="rounded-full bg-white/10 px-4 py-1 text-xs font-semibold">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Announcements today", value: "12", meta: "+8 new" },
                    { label: "Active events", value: "5", meta: "Career week" },
                    { label: "Marketplace", value: "18", meta: "Verified listings" },
                    { label: "Support tickets", value: "3", meta: "All resolved" },
                  ].map((card) => (
                    <div key={card.label} className="rounded-2xl border border-slate-100 bg-white/80 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {card.label}
                      </p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
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
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Platform */}
        <section id="platform" className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">Platform overview</p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">All your campus touchpoints reimagined</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Purpose-built modules with your logo, palette, and governance layered throughout.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featureTiles.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className="mb-4 h-12 w-12 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${brandColor}, #0f1c24)`,
                      opacity: 0.9,
                    }}
                  />
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="solutions" className="px-4 py-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="rounded-[40px] border border-white/70 bg-white/90 p-10 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Why schools switch</p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">One home for communication, coordination, and commerce</h2>
              <p className="mt-4 text-lg text-slate-600">
                UNICON links every surface: parents, faculty, students, alumni, vendors, and leadership. Your logo stays front
                and center thanks to the new immersive background treatment.
              </p>
              <div className="mt-8 space-y-5">
                {platformPillars.map((pillar) => (
                  <div key={pillar.label} className="rounded-3xl border border-slate-100 bg-white/90 p-5">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">{pillar.label}</p>
                    <p className="mt-2 text-base text-slate-700">{pillar.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {journeySteps.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-lg">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white text-lg font-bold"
                    style={{ background: `linear-gradient(135deg, ${brandColor}, #132028)` }}
                  >
                    {`0${index + 1}`}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{step.title}</p>
                    <p className="mt-2 text-base text-slate-700">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">Pricing</p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">Pick a plan and inherit your branding instantly</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Every plan keeps your palette, crest, and typography while layering in our new immersive logo background treatment.
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
                    <p className="text-4xl font-bold text-slate-900">{plan.price}</p>
                    {plan.price !== "Talk to us" && <span className="text-sm text-slate-500">per month</span>}
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{plan.name}</p>
                  <p className="mt-2 text-sm text-slate-600">{plan.highlight}</p>
                  <ul className="mt-6 space-y-3 text-sm text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: brandColor }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="mt-8 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${brandColor}, #0d1a21)` }}
                  >
                    Talk to our team
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-white/70 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">FAQ</p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">Everything you want to know</h2>
            </div>
            <div className="mt-10 rounded-[34px] border border-white/80 bg-white/90 shadow-xl">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="border-b border-slate-100 last:border-none">
                  <button
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                    onClick={() => setOpenFAQ((prev) => (prev === index ? -1 : index))}
                  >
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{faq.question}</p>
                      {openFAQ === index && (
                        <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                      )}
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        openFAQ === index ? "rotate-45 border-transparent" : "border-slate-200"
                      }`}
                      style={{ backgroundColor: openFAQ === index ? brandColor : "transparent" }}
                    >
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
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
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">Let’s talk</p>
                <h2 className="mt-4 text-4xl font-bold text-slate-900">See UNICON tailored to your campus</h2>
                <p className="mt-4 text-lg text-slate-600">
                  Share your challenges and we’ll walk you through a custom experience with your branding and modules.
                </p>
                <div className="mt-10 space-y-4 text-sm">
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">Email:</span> hello@unicon.school
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">Phone:</span> +63 917 123 4567
                  </p>
                  <p className="flex items-center gap-3 text-slate-600">
                    <span className="font-semibold text-slate-900">Office:</span> Makati, PH
                  </p>
                </div>
              </div>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full name"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="School email"
                    className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="School / District"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                />
                <textarea
                  rows="4"
                  placeholder="Tell us about your goals"
                  className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  className="w-full rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #0f1c24)` }}
                >
                  Book a walkthrough
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="px-4 pb-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-xs uppercase tracking-[0.5em] text-slate-500">
            <img src={brandLogo} alt={brandName} className="h-10 w-10 object-contain opacity-80" />
            <p>{brandName} • Unified Campus OS</p>
            <p className="text-[10px] tracking-[0.4em] text-slate-400">© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
