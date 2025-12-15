import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";

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
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getAnalytics();
      setAnalytics(response);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "Failed to load analytics");
      showToast("Failed to load analytics", "error");
    } finally {
      setLoading(false);
    }
  };

  const overviewStats = analytics
    ? [
        {
          label: "Total users",
          value: analytics.total_users || 0,
          trend: "4.2%",
        },
        {
          label: "Daily active",
          value: "68%",
          trend: "2.1%",
        },
        {
          label: "New signups",
          value: `+${analytics.new_users || 0}`,
          trend: "18 this week",
        },
        {
          label: "Marketplace volume",
          value: "$12.4k",
          trend: "+5.3%",
        },
      ]
    : [
        { label: "Total users", value: 0, trend: "4.2%" },
        { label: "Daily active", value: "68%", trend: "2.1%" },
        { label: "New signups", value: "+0", trend: "18 this week" },
        { label: "Marketplace volume", value: "$0", trend: "+5.3%" },
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

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader
          title="Analytics"
          description="Platform insights and metrics"
        />
        <div className="text-center text-white/60 py-12">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <AdminHeader
        title="Analytics"
        description="Platform insights and metrics"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}
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
