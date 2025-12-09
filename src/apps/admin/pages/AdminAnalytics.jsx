import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";

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
  const { user, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("7d"); // 7d, 30d, 90d, all

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getAnalytics();
        setAnalytics(result);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isAuthenticated, user, navigate]);

  const overviewStats = analytics
    ? [
        { label: "Total users", value: analytics.total_users || 0, trend: "4.2%" },
        { label: "Daily active", value: "68%", trend: "2.1%" },
        { label: "Total posts", value: analytics.total_posts || 0, trend: "18 this week" },
        { label: "Upcoming events", value: analytics.upcoming_events?.[0]?.count || 0, trend: "+5.3%" },
      ]
    : [
        { label: "Total users", value: 0, trend: "4.2%" },
        { label: "Daily active", value: "68%", trend: "2.1%" },
        { label: "Total posts", value: 0, trend: "18 this week" },
        { label: "Upcoming events", value: 0, trend: "+5.3%" },
      ];

  const engagementData = [
    { label: "Average session", value: "12m 34s" },
    { label: "Page views", value: "8.2K/day" },
    { label: "Bounce rate", value: "34%" },
    { label: "New vs returning", value: "62/38" },
  ];

  const activityData = analytics
    ? [
        { label: "Total posts", value: analytics.total_posts || 0 },
        { label: "Messages today", value: analytics.messages_today || 0 },
        { label: "Upcoming events", value: analytics.upcoming_events?.[0]?.count || 0 },
        { label: "Total users", value: analytics.total_users || 0 },
      ]
    : [
        { label: "Posts today", value: "0" },
        { label: "Comments today", value: "0" },
        { label: "Events live", value: "0" },
        { label: "Marketplace listings", value: "0" },
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
              onClick={() => navigate("/admin/dashboard")}
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
        {loading && (
          <div className="text-center text-white/60 py-12">
            Loading analytics...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 mb-6">
            {error}
          </div>
        )}
        {!loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Analytics Overview</h2>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>

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

        <SectionCard title="Activity Overview">
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

        <SectionCard title="User Growth">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">New users this period</p>
              <p className="text-2xl font-bold text-white">
                {analytics?.new_users_this_period || 0}
              </p>
            </div>
            <div className="h-32 rounded-xl border border-white/10 bg-black/20 flex items-end justify-around p-2">
              {[65, 72, 68, 75, 80, 85, 90].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 mx-1 rounded-t-lg bg-gradient-to-t from-purple-500 to-purple-600"
                  style={{ height: `${height}%` }}
                  title={`Day ${index + 1}: ${height} users`}
                ></div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Content Performance">
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-2">Most Active Category</p>
              <p className="text-lg font-semibold text-white">Announcements</p>
              <p className="text-xs text-emerald-300 mt-1">+12% this week</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-2">Top Event Type</p>
              <p className="text-lg font-semibold text-white">Academic</p>
              <p className="text-xs text-blue-300 mt-1">45% of events</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-2">Marketplace Activity</p>
              <p className="text-lg font-semibold text-white">$12.4K</p>
              <p className="text-xs text-yellow-300 mt-1">Total value</p>
            </div>
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
          </>
        )}
      </main>
    </div>
  );
}

