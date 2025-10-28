import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function StatCard({ label, value, trend, suffix }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-lg shadow-black/30">
      <p className="text-xs uppercase tracking-[0.35em] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold">
        {value}
        {suffix}
      </p>
      {trend && (
        <p className="text-xs text-emerald-300 mt-1">
          ▲ {trend} vs last period
        </p>
      )}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <h3 className="mb-5 text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const overviewStats = [
    { label: "Total users", value: 2847, trend: "4.2%" },
    { label: "Daily active", value: "68%", trend: "2.1%" },
    { label: "New signups", value: "+122", trend: "18 this week" },
    { label: "Marketplace volume", value: "$12.4k", trend: "+5.3%" },
  ];

  const engagementData = [
    { label: "Average session", value: "12m 34s" },
    { label: "Page views", value: "8.2K/day" },
    { label: "Bounce rate", value: "34%" },
    { label: "New vs returning", value: "62/38" },
  ];

  const activityData = [
    { label: "Posts today", value: "147" },
    { label: "Comments today", value: "523" },
    { label: "Events live", value: "12" },
    { label: "Marketplace listings", value: "89" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin-dashboard")}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-white/60">
                Platform insights and metrics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <SectionCard title="Engagement metrics">
          <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
            {engagementData.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {row.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Activity overview">
          <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2 lg:grid-cols-4">
            {activityData.map((row) => (
              <div
                key={row.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {row.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Automation queue">
          <div className="grid gap-3 text-sm text-white/80 lg:grid-cols-2">
            {[
              "Auto-approve verified student marketplace items",
              "Escalate flagged messages to moderators",
              "Sync Google Calendar schedule to campus feed",
              "Trigger onboarding drip for new freshmen",
            ].map((task, index) => (
              <div
                key={task}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
              >
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                  #{index + 1}
                </span>
                <p>{task}</p>
                <span className="ml-auto text-emerald-300 text-xs">Active</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}

