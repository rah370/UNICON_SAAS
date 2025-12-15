import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { adminApi } from "../apps/shared/utils/api";

const adminPalette = {
  primary: "#6b21a8",
  primaryDark: "#581c87",
  surface: "#0b1020",
  card: "#10172c",
  border: "rgba(255,255,255,0.08)",
};

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

function SectionCard({ title, children, actions }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { schoolBranding, updateSchoolBranding } = useBranding();
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to admin login if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [postsRes, eventsRes, usersRes, marketplaceRes] =
          await Promise.all([
            adminApi.getPosts().catch(() => ({ posts: [] })),
            adminApi.getEvents().catch(() => ({ events: [] })),
            adminApi.getUsers().catch(() => ({ users: [] })),
            adminApi.getMarketplace().catch(() => ({ items: [] })),
          ]);

        // Transform posts to announcements format
        const announcementsData = (postsRes.posts || [])
          .slice(0, 5)
          .map((post) => ({
            id: post.id,
            title: post.title || "Untitled",
            content: post.content || "",
            createdAt: post.created_at,
            audience: post.category || "Everyone",
            status: post.status || "published",
            reach: Math.floor(Math.random() * 100),
          }));

        // Transform events
        const eventsData = (eventsRes.events || [])
          .slice(0, 5)
          .map((event) => ({
            id: event.id,
            title: event.title,
            date: event.event_date,
            venue: event.location || "TBA",
            capacity: event.max_attendees || 100,
            rsvp: event.attendees_count || 0,
            moderated: true,
          }));

        // Transform users
        const usersData = (usersRes.users || []).map((u) => ({
          id: u.id,
          name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.email,
          email: u.email,
          role: u.role || "student",
          status: u.is_active ? "active" : "suspended",
          lastLogin: "Recently",
        }));

        // Transform marketplace
        const marketplaceData = (marketplaceRes.items || [])
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            title: item.title,
            seller:
              `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
              "Unknown",
            price: item.price || 0,
            status: item.is_sold ? "sold" : "approved",
            flagged: false,
          }));

        setAnnouncements(announcementsData);
        setEvents(eventsData);
        setUsers(usersData);
        setMarketplace(marketplaceData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const overviewStats = useMemo(
    () => [
      { label: "Total users", value: users.length, trend: "4.2%" },
      {
        label: "Announcements",
        value: announcements.length,
        trend: "1 new",
      },
      {
        label: "Events",
        value: events.length,
        suffix: "",
        trend: "2 live",
      },
      {
        label: "Marketplace",
        value: marketplace.length,
        trend: "3 pending",
      },
    ],
    [users.length, announcements.length, events.length, marketplace.length]
  );

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center text-white/60 py-12">
          Loading dashboard data...
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}
      {!loading && (
        <>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

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
                    <span className="ml-auto text-emerald-300 text-xs">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Quick Actions - Redirect to dedicated pages */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate("/admin/announcements")}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10 transition"
            >
              <p className="text-sm font-semibold">Announcements</p>
              <p className="text-xs text-white/60 mt-1">
                {announcements.length} total
              </p>
            </button>
            <button
              onClick={() => navigate("/admin/events")}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10 transition"
            >
              <p className="text-sm font-semibold">Events</p>
              <p className="text-xs text-white/60 mt-1">
                {events.length} total
              </p>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10 transition"
            >
              <p className="text-sm font-semibold">Users</p>
              <p className="text-xs text-white/60 mt-1">{users.length} total</p>
            </button>
            <button
              onClick={() => navigate("/admin/marketplace")}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-white hover:bg-white/10 transition"
            >
              <p className="text-sm font-semibold">Marketplace</p>
              <p className="text-xs text-white/60 mt-1">
                {marketplace.length} listings
              </p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
