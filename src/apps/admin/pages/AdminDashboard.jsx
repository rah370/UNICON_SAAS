import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { adminApi } from "../../shared/utils/api";
import { AdminCard, AdminStatCard } from "../components/AdminLayout";
import { useToast } from "../../shared/components/Toast";
import {
  GridSkeleton,
  ListSkeleton,
} from "../../shared/components/SkeletonLoader";

const adminPalette = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  surface: "#f8fafc",
  card: "#ffffff",
  border: "rgba(15,23,42,0.08)",
};

const defaultAnnouncements = [
  {
    id: 1,
    title: "Network maintenance",
    content: "Platform will be offline Sunday 1–3 AM.",
    createdAt: "2024-11-02T08:45:00Z",
    audience: "Everyone",
    status: "published",
    reach: 86,
  },
  {
    id: 2,
    title: "New marketplace rules",
    content: "All listings now require ID verification.",
    createdAt: "2024-11-01T12:00:00Z",
    audience: "Sellers",
    status: "draft",
    reach: 0,
  },
];

const defaultEvents = [
  {
    id: 1,
    title: "Leadership Summit",
    date: "2024-11-18",
    venue: "Auditorium",
    capacity: 400,
    rsvp: 312,
    moderated: true,
  },
  {
    id: 2,
    title: "Winter Career Expo",
    date: "2024-12-02",
    venue: "Innovation Hall",
    capacity: 250,
    rsvp: 127,
    moderated: false,
  },
];

const defaultUsers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@campus.edu",
    role: "student",
    status: "active",
    lastLogin: "2h ago",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@campus.edu",
    role: "teacher",
    status: "active",
    lastLogin: "35m ago",
  },
  {
    id: 3,
    name: "Prof. Smith",
    email: "smith@campus.edu",
    role: "staff",
    status: "suspended",
    lastLogin: "1d ago",
  },
  {
    id: 4,
    name: "Security Desk",
    email: "security@campus.edu",
    role: "admin",
    status: "active",
    lastLogin: "Online",
  },
];

const defaultMarketplace = [
  {
    id: 1,
    title: "Chemistry kit",
    seller: "Alex Johnson",
    price: 80,
    status: "pending",
    flagged: false,
  },
  {
    id: 2,
    title: "MacBook Air 2020",
    seller: "Maria Garcia",
    price: 690,
    status: "approved",
    flagged: true,
  },
];

// Using AdminStatCard and AdminCard from AdminLayout

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { schoolBranding, updateSchoolBranding } = useBranding();
  const { success, showError } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [opsSnapshot, setOpsSnapshot] = useState({
    pendingApprovals: 0,
    openTickets: 0,
    uptime: 0,
    incidents: 0,
    updated_at: null,
  });
  const [approvals, setApprovals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [marketplaceFilter, setMarketplaceFilter] = useState("all");

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

        const [
          postsRes,
          eventsRes,
          usersRes,
          marketplaceRes,
          logsRes,
          snapshotRes,
          approvalsRes,
          alertsRes,
        ] = await Promise.all([
          adminApi.getPosts().catch(() => ({ posts: [] })),
          adminApi.getEvents().catch(() => ({ events: [] })),
          adminApi.getUsers().catch(() => ({ users: [] })),
          adminApi.getMarketplace().catch(() => ({ items: [] })),
          adminApi.getActivityLogs(10, 0).catch(() => ({ logs: [] })),
          adminApi.getOpsSnapshot().catch(() => ({})),
          adminApi.getApprovals().catch(() => ({ items: [] })),
          adminApi.getAlerts().catch(() => ({ alerts: [] })),
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
        setActivityLogs(logsRes.logs || []);
        setOpsSnapshot(snapshotRes || {});
        setApprovals(approvalsRes.items || []);
        setAlerts(alertsRes.alerts || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
        // Use default data as fallback
        setAnnouncements(defaultAnnouncements);
        setEvents(defaultEvents);
        setUsers(defaultUsers);
        setMarketplace(defaultMarketplace);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    audience: "Everyone",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    venue: "",
    capacity: 100,
  });
  const [userSearch, setUserSearch] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    name: schoolBranding.name || "UNICON Admin",
    domain: "campus.edu",
    timezone: "UTC",
    color: schoolBranding.color || adminPalette.primary,
    language: "English",
  });

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

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

  const filteredMarketplace = useMemo(() => {
    if (marketplaceFilter === "all") return marketplace;
    return marketplace.filter((item) => item.status === marketplaceFilter);
  }, [marketplace, marketplaceFilter]);

  const addAnnouncement = async () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim())
      return;

    try {
      const result = await adminApi.createPost({
        title: announcementForm.title,
        content: announcementForm.content,
        category: announcementForm.audience.toLowerCase(),
      });

      if (result.success) {
        setAnnouncements((prev) => [
          {
            id: result.post_id,
            ...announcementForm,
            status: "draft",
            createdAt: new Date().toISOString(),
            reach: 0,
          },
          ...prev,
        ]);
        setAnnouncementForm({ title: "", content: "", audience: "Everyone" });
        success("Announcement created successfully");
      }
    } catch (err) {
      showError("Failed to create announcement: " + err.message);
    }
  };

  const publishAnnouncement = async (id) => {
    try {
      await adminApi.updatePost(id, { status: "published" });
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "published", reach: 100 } : item
        )
      );
      success("Announcement published successfully");
    } catch (err) {
      showError("Failed to publish announcement: " + err.message);
    }
  };

  const archiveAnnouncement = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    try {
      await adminApi.deletePost(id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      success("Announcement deleted successfully");
    } catch (err) {
      showError("Failed to delete announcement: " + err.message);
    }
  };

  const addEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.venue) return;

    try {
      const result = await adminApi.createEvent({
        title: eventForm.title,
        event_date: eventForm.date,
        location: eventForm.venue,
        max_attendees: eventForm.capacity,
        description: "",
      });

      if (result.success) {
        setEvents((prev) => [
          {
            id: result.event_id,
            ...eventForm,
            rsvp: 0,
            moderated: true,
          },
          ...prev,
        ]);
        setEventForm({ title: "", date: "", venue: "", capacity: 100 });
        success("Event created successfully");
      }
    } catch (err) {
      showError("Failed to create event: " + err.message);
    }
  };

  const approveListing = async (id, status) => {
    try {
      await adminApi.updateMarketplaceItem(id, { status });
      setMarketplace((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status, flagged: status !== "approved" }
            : item
        )
      );
      success(
        `Listing ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (err) {
      showError("Failed to update listing: " + err.message);
    }
  };

  const handleMarketplaceDecision = async (id, status) => {
    await approveListing(id, status);
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleUserStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    const newStatus = user?.status === "active" ? 0 : 1;

    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                status: u.status === "active" ? "suspended" : "active",
              }
            : u
        )
      );
      success(
        `User ${newStatus === 1 ? "activated" : "suspended"} successfully`
      );
    } catch (err) {
      showError("Failed to update user status: " + err.message);
    }
  };

  const updateSettings = (field, value) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "color") {
      updateSchoolBranding({ [field]: value });
    }
  };

  const tabClass = (id) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition border ${
      activeTab === id
        ? "text-white border-transparent shadow-lg"
        : "text-slate-700 border-slate-200 bg-white hover:bg-slate-50"
    }`;

  const navBadges = useMemo(() => {
    const pendingApprovals = approvals.length;
    const flaggedMarketplace = approvals.filter(
      (a) => a.type === "marketplace"
    ).length;
    const pendingAnnouncements = approvals.filter(
      (a) => a.type === "announcement"
    ).length;
    const pendingEvents = approvals.filter((a) => a.type === "event").length;
    return {
      announcements: pendingAnnouncements || announcements.length,
      events: pendingEvents || events.length,
      users: users.length,
      marketplace: flaggedMarketplace || marketplace.length,
      analytics: alerts.length,
    };
  }, [
    approvals,
    alerts.length,
    announcements.length,
    events.length,
    users.length,
    marketplace.length,
  ]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <nav className="sticky top-16 z-10 flex gap-2 overflow-x-auto rounded-3xl border border-white/60 bg-white/90 p-2 shadow-sm backdrop-blur">
          {[
            ["/admin/dashboard", "Overview", "overview"],
            ["/admin/announcements", "Announcements", "announcements"],
            ["/admin/events", "Events", "events"],
            ["/admin/calendar", "Calendar", "calendar"],
            ["/admin/users", "People", "users"],
            ["/admin/marketplace", "Marketplace", "marketplace"],
            ["/admin/analytics", "Analytics", "analytics"],
            ["/admin/settings", "Settings", "settings"],
            ["/admin/profile", "Profile", "profile"],
          ].map(([path, label, id]) => {
            const badgeCount = navBadges[id];
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  {label}
                  {badgeCount ? (
                    <span
                      className={`rounded-full px-2 text-[11px] font-semibold ${
                        isActive ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {badgeCount}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </nav>

        <section className="space-y-6 pb-16">
          <div className="grid gap-3 rounded-[30px] border border-white/70 bg-white/90 p-4 shadow-xl sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Create announcement",
                action: () => navigate("/admin/announcements"),
                hint: "⌘ + N",
              },
              {
                label: "Schedule event",
                action: () => navigate("/admin/events"),
                hint: "⌘ + E",
              },
              {
                label: "Review approvals",
                action: () => setActiveTab("marketplace"),
                hint: "⌘ + R",
              },
              {
                label: "Invite user",
                action: () => navigate("/admin/users"),
                hint: "⌘ + I",
              },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                  {item.hint}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="space-y-6">
              <GridSkeleton count={4} columns={4} />
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <ListSkeleton count={3} />
                </div>
                <div className="space-y-3">
                  <ListSkeleton count={3} />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}
          {!loading && (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
                <AdminCard
                  title="Operations snapshot"
                  actions={
                    <span className="text-xs text-slate-500">
                      Updated{" "}
                      {opsSnapshot.updated_at
                        ? new Date(opsSnapshot.updated_at).toLocaleTimeString()
                        : "just now"}
                    </span>
                  }
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                      [
                        "Approvals",
                        opsSnapshot.pendingApprovals || 0,
                        "pending",
                      ],
                      ["Open tickets", opsSnapshot.openTickets || 0, "items"],
                      ["Uptime", `${opsSnapshot.uptime || 0}%`, "last 24h"],
                      ["Incidents", opsSnapshot.incidents || 0, "current"],
                    ].map(([label, value, meta]) => (
                      <div
                        key={label}
                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-700"
                      >
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {label}
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {value}
                        </p>
                        <p className="text-xs text-slate-500">{meta}</p>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard title="Alerts">
                  <div className="space-y-3">
                    {alerts.length === 0 && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                        No active alerts.
                      </div>
                    )}
                    {alerts.map((alert) => (
                      <button
                        key={alert.id}
                        onClick={() =>
                          setSelectedPanel({ type: "alert", item: alert })
                        }
                        className="flex w-full items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left hover:bg-slate-50"
                      >
                        <span
                          className={`mt-0.5 h-2.5 w-2.5 rounded-full ${
                            alert.severity === "high"
                              ? "bg-red-500"
                              : alert.severity === "medium"
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-900">
                            {alert.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(alert.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </AdminCard>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {overviewStats.map((stat) => (
                  <AdminStatCard key={stat.label} {...stat} />
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
                <AdminCard
                  title="Approvals queue"
                  actions={
                    <span className="text-xs text-slate-500">
                      {approvals.length} waiting
                    </span>
                  }
                >
                  <div className="space-y-3">
                    {approvals.length === 0 && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                        Nothing to approve right now.
                      </div>
                    )}
                    {approvals.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-sm text-slate-800"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold uppercase text-slate-600">
                          {item.type.slice(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.submitted_by} •{" "}
                            {new Date(item.submitted_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            item.risk === "high"
                              ? "bg-red-50 text-red-700"
                              : item.risk === "medium"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {item.risk}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setSelectedPanel({ type: "approval", item })
                            }
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Open
                          </button>
                          <button
                            onClick={() =>
                              handleMarketplaceDecision(item.id, "approved")
                            }
                            className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleMarketplaceDecision(item.id, "rejected")
                            }
                            className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                <AdminCard
                  title="Marketplace review"
                  actions={
                    <select
                      value={marketplaceFilter}
                      onChange={(e) => setMarketplaceFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      <option value="all">All</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                    </select>
                  }
                >
                  <div className="space-y-3">
                    {filteredMarketplace.length === 0 && (
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                        No listings in this filter.
                      </div>
                    )}
                    {filteredMarketplace.map((item) => (
                      <button
                        key={item.id}
                        onClick={() =>
                          setSelectedPanel({ type: "listing", item })
                        }
                        className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left hover:bg-slate-50"
                      >
                        <div className="h-10 w-10 rounded-2xl bg-slate-100 text-center text-xs font-semibold uppercase text-slate-600">
                          <div className="flex h-full items-center justify-center">
                            {item.title.slice(0, 2)}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.seller} • ₱{item.price || 0}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            item.status === "approved"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status === "sold"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </AdminCard>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <AdminCard
                  title="Quick Actions"
                  actions={
                    <button
                      onClick={() => navigate("/admin/announcements")}
                      className="text-xs text-slate-600 hover:text-slate-900"
                    >
                      View All
                    </button>
                  }
                >
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/admin/announcements")}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>Create Announcement</span>
                        <span className="text-slate-400">→</span>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/admin/events")}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>Schedule Event</span>
                        <span className="text-slate-400">→</span>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/admin/users")}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>Manage Users</span>
                        <span className="text-slate-400">→</span>
                      </div>
                    </button>
                    <button
                      onClick={() => navigate("/admin/marketplace")}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span>Review Listings</span>
                        <span className="text-slate-400">→</span>
                      </div>
                    </button>
                  </div>
                </AdminCard>

                <AdminCard
                  title="Recent Activity"
                  actions={
                    <button
                      onClick={() => navigate("/admin/analytics")}
                      className="text-xs text-slate-600 hover:text-slate-900"
                    >
                      View All
                    </button>
                  }
                >
                  <div className="space-y-3 text-sm">
                    {activityLogs.length > 0 ? (
                      activityLogs.slice(0, 5).map((log) => {
                        const getActionColor = (action) => {
                          if (
                            action.includes("created") ||
                            action.includes("registered")
                          )
                            return "bg-emerald-500";
                          if (
                            action.includes("updated") ||
                            action.includes("modified")
                          )
                            return "bg-blue-500";
                          if (
                            action.includes("deleted") ||
                            action.includes("removed")
                          )
                            return "bg-red-500";
                          if (
                            action.includes("pending") ||
                            action.includes("flagged")
                          )
                            return "bg-yellow-500";
                          return "bg-slate-500";
                        };

                        const getActionLabel = (action) => {
                          if (action.includes("user")) return "User";
                          if (action.includes("event")) return "Event";
                          if (
                            action.includes("announcement") ||
                            action.includes("post")
                          )
                            return "Announcement";
                          if (
                            action.includes("marketplace") ||
                            action.includes("listing")
                          )
                            return "Marketplace";
                          if (action.includes("settings")) return "Settings";
                          return "Activity";
                        };

                        const timeAgo = (dateString) => {
                          if (!dateString) return "Recently";
                          const date = new Date(dateString);
                          const now = new Date();
                          const diffMs = now - date;
                          const diffMins = Math.floor(diffMs / 60000);
                          const diffHours = Math.floor(diffMs / 3600000);
                          const diffDays = Math.floor(diffMs / 86400000);

                          if (diffMins < 1) return "Just now";
                          if (diffMins < 60)
                            return `${diffMins} minute${
                              diffMins !== 1 ? "s" : ""
                            } ago`;
                          if (diffHours < 24)
                            return `${diffHours} hour${
                              diffHours !== 1 ? "s" : ""
                            } ago`;
                          return `${diffDays} day${
                            diffDays !== 1 ? "s" : ""
                          } ago`;
                        };

                        const userName =
                          log.first_name && log.last_name
                            ? `${log.first_name} ${log.last_name}`
                            : log.email || "System";

                        return (
                          <div
                            key={log.id}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${getActionColor(
                                log.action
                              )}`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-slate-900">
                                {getActionLabel(log.action)}:{" "}
                                {log.action.replace(/_/g, " ")}
                                {log.user_id && ` by ${userName}`}
                              </p>
                              <p className="text-xs text-slate-500">
                                {timeAgo(log.created_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4 text-slate-500 text-sm">
                        No recent activity
                      </div>
                    )}
                  </div>
                </AdminCard>
              </div>

              <AdminCard title="Pending Moderation">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                    <div>
                      <p className="text-slate-900 font-semibold">
                        Marketplace Listings
                      </p>
                      <p className="text-xs text-slate-600">
                        {
                          marketplace.filter((m) => m.status === "pending")
                            .length
                        }{" "}
                        items need review
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/admin/marketplace")}
                      className="rounded-lg bg-yellow-500 px-4 py-2 text-xs font-semibold text-white hover:bg-yellow-600 transition"
                    >
                      Review
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="text-slate-900 font-semibold">
                        User Reports
                      </p>
                      <p className="text-xs text-slate-600">
                        0 pending reports
                      </p>
                    </div>
                    <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                      View
                    </button>
                  </div>
                </div>
              </AdminCard>

              <AdminCard title="Automation Queue">
                <div className="grid gap-3 text-sm text-slate-700 lg:grid-cols-2">
                  {[
                    "Auto-approve verified student marketplace items",
                    "Escalate flagged messages to moderators",
                    "Sync Google Calendar schedule to campus feed",
                    "Trigger onboarding drip for new freshmen",
                  ].map((task, index) => (
                    <div
                      key={task}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                        #{index + 1}
                      </span>
                      <p className="text-slate-700">{task}</p>
                      <span className="ml-auto text-emerald-600 text-xs font-semibold">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </AdminCard>
            </div>
          )}

          {false && activeTab === "announcements" && (
            <div className="space-y-5">
              <SectionCard
                title="Compose announcement"
                actions={
                  <button
                    onClick={addAnnouncement}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{ backgroundColor: adminPalette.primary }}
                  >
                    Publish draft
                  </button>
                }
              >
                <div className="grid gap-4 text-sm text-white/80 lg:grid-cols-3">
                  <input
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Title"
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                  <select
                    value={announcementForm.audience}
                    onChange={(e) =>
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        audience: e.target.value,
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  >
                    <option>Everyone</option>
                    <option>Students</option>
                    <option>Faculty</option>
                    <option>Admins</option>
                  </select>
                </div>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Share details..."
                  rows={4}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                />
              </SectionCard>

              <SectionCard title="Announcement pipeline">
                <div className="space-y-3">
                  {announcements.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm"
                    >
                      <div className="flex flex-wrap gap-3">
                        <div>
                          <p className="font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="text-white/60">
                            {item.content.slice(0, 120)}
                            {item.content.length > 120 ? "…" : ""}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2 text-xs">
                          <span className="rounded-full bg-white/10 px-3 py-1">
                            {item.audience}
                          </span>
                          <span className="text-white/50">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <button
                          onClick={() => publishAnnouncement(item.id)}
                          className="rounded-full border border-white/20 px-3 py-1 text-white/80"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => archiveAnnouncement(item.id)}
                          className="rounded-full border border-white/20 px-3 py-1 text-red-300"
                        >
                          Archive
                        </button>
                        {item.status === "published" && (
                          <span className="ml-auto text-emerald-300">
                            Reach {item.reach}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {false && activeTab === "events" && (
            <div className="space-y-5">
              <SectionCard
                title="Schedule event"
                actions={
                  <button
                    onClick={addEvent}
                    className="rounded-full px-4 py-2 text-sm font-semibold"
                    style={{ backgroundColor: adminPalette.primary }}
                  >
                    Save event
                  </button>
                }
              >
                <div className="grid gap-3 text-sm text-white/80 lg:grid-cols-4">
                  <input
                    value={eventForm.title}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Event title"
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                  <input
                    value={eventForm.venue}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        venue: e.target.value,
                      }))
                    }
                    placeholder="Venue"
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    value={eventForm.capacity}
                    onChange={(e) =>
                      setEventForm((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Event approvals">
                <div className="space-y-3 text-sm text-white/80">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {event.title}
                        </p>
                        <p className="text-xs text-white/60">
                          {event.date} • {event.venue}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-3 text-xs">
                        <span className="text-white/60">
                          RSVP {event.rsvp}/{event.capacity}
                        </span>
                        <label className="inline-flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={event.moderated}
                            onChange={() =>
                              setEvents((prev) =>
                                prev.map((e) =>
                                  e.id === event.id
                                    ? { ...e, moderated: !e.moderated }
                                    : e
                                )
                              )
                            }
                          />
                          <span>Moderation</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {false && activeTab === "users" && (
            <div className="space-y-6">
              <SectionCard
                title="User Management"
                actions={
                  <button
                    onClick={() => showError("Bulk import feature coming soon")}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/60"
                  >
                    + Import Users
                  </button>
                }
              >
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      placeholder="Search by name or email…"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-white/40"
                    />
                    <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
                      <option>All Roles</option>
                      <option>Students</option>
                      <option>Teachers</option>
                      <option>Staff</option>
                      <option>Admins</option>
                    </select>
                    <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Suspended</option>
                    </select>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10">
                    <div className="grid grid-cols-6 border-b border-white/10 bg-black/30 px-4 py-3 text-xs font-semibold text-white/60">
                      <span className="col-span-2">User</span>
                      <span>Role</span>
                      <span>Status</span>
                      <span>Last Login</span>
                      <span className="text-center">Actions</span>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredUsers.map((u) => (
                        <div
                          key={u.id}
                          className="grid grid-cols-6 items-center border-b border-white/5 bg-black/20 px-4 py-4 text-sm last:border-b-0 hover:bg-black/30 transition-colors"
                        >
                          <div className="col-span-2 flex items-center gap-3">
                            <div className="rounded-xl border border-white/10 bg-white/5 flex h-10 w-10 items-center justify-center text-xs font-bold">
                              {u.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {u.name}
                              </p>
                              <p className="text-xs text-white/50">{u.email}</p>
                            </div>
                          </div>
                          <select
                            value={u.role}
                            onChange={(e) =>
                              setUsers((prev) =>
                                prev.map((user) =>
                                  user.id === u.id
                                    ? { ...user, role: e.target.value }
                                    : user
                                )
                              )
                            }
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white"
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-center text-xs font-semibold ${
                              u.status === "active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {u.status}
                          </span>
                          <span className="text-xs text-white/60">
                            {u.lastLogin}
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`rounded-lg px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${
                                u.status === "active"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {u.status === "active" ? "Suspend" : "Restore"}
                            </button>
                            <button
                              onClick={() =>
                                alert(`Delete user ${u.name}?`) &&
                                setUsers((prev) =>
                                  prev.filter((user) => user.id !== u.id)
                                )
                              }
                              className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-red-300 hover:border-red-500/50 hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="User Statistics">
                <div className="grid gap-4 text-sm sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                      Total Users
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {users.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                      Active
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                      {users.filter((u) => u.status === "active").length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                      Suspended
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-300">
                      {users.filter((u) => u.status === "suspended").length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                      Students
                    </p>
                    <p className="mt-2 text-2xl font-bold text-blue-300">
                      {users.filter((u) => u.role === "student").length}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {false && activeTab === "marketplace" && (
            <SectionCard title="Listing review">
              <div className="space-y-3 text-sm text-white/80">
                {marketplace.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
                  >
                    <div>
                      <p className="text-white font-semibold">{item.title}</p>
                      <p className="text-white/60">
                        {item.seller} • ${item.price}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs">
                      <button
                        onClick={() => approveListing(item.id, "approved")}
                        className="rounded-full border border-white/20 px-3 py-1 text-emerald-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => approveListing(item.id, "rejected")}
                        className="rounded-full border border-white/20 px-3 py-1 text-red-300"
                      >
                        Reject
                      </button>
                      {item.flagged && (
                        <span className="ml-2 rounded-full bg-red-500/20 px-2 py-1 text-red-200">
                          Flagged
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {false && activeTab === "analytics" && (
            <div className="space-y-6">
              <SectionCard title="Engagement snapshot">
                <div className="grid gap-4 text-sm text-white/80 sm:grid-cols-2">
                  {[
                    { label: "Daily active", value: "68%" },
                    { label: "New signups", value: "+122" },
                    { label: "Moderation queue", value: "4 pending" },
                    { label: "Marketplace volume", value: "$12.4k" },
                  ].map((row) => (
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
            </div>
          )}

          {false && activeTab === "settings" && (
            <AdminCard title="Brand + controls">
              <div className="grid gap-4 text-sm text-white/80 lg:grid-cols-2">
                <input
                  value={settingsForm.name}
                  onChange={(e) => updateSettings("name", e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  placeholder="Campus name"
                />
                <input
                  value={settingsForm.domain}
                  onChange={(e) => updateSettings("domain", e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                  placeholder="Domain"
                />
                <select
                  value={settingsForm.timezone}
                  onChange={(e) => updateSettings("timezone", e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                >
                  <option value="UTC">UTC</option>
                  <option value="UTC-5">UTC-5</option>
                  <option value="UTC+8">UTC+8</option>
                </select>
                <select
                  value={settingsForm.language}
                  onChange={(e) => updateSettings("language", e.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
                >
                  <option>English</option>
                  <option>Filipino</option>
                  <option>Spanish</option>
                </select>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">
                    Primary accent color
                  </span>
                  <input
                    type="color"
                    value={settingsForm.color}
                    onChange={(e) => updateSettings("color", e.target.value)}
                    className="h-10 rounded-2xl border border-white/10 bg-black/20 p-1"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-white/60">Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (upload) =>
                        updateSchoolBranding({
                          logoData: upload.target?.result,
                        });
                      reader.readAsDataURL(file);
                    }}
                    className="rounded-2xl border border-dashed border-white/20 bg-black/20 px-3 py-2 text-xs text-white/70"
                  />
                </label>
              </div>
            </AdminCard>
          )}
        </section>
      </div>
      {selectedPanel && (
        <div className="fixed inset-0 z-40 flex items-center justify-end bg-black/30 backdrop-blur-sm">
          <div className="h-full w-full max-w-lg overflow-y-auto rounded-l-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {selectedPanel.type}
                </p>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedPanel.item?.title || selectedPanel.item?.message}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPanel(null)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              {selectedPanel.item?.message && (
                <p className="rounded-2xl bg-slate-50 p-3 text-slate-800">
                  {selectedPanel.item.message}
                </p>
              )}
              {selectedPanel.item?.submitted_by && (
                <p className="text-slate-500">
                  Submitted by{" "}
                  <span className="font-semibold text-slate-800">
                    {selectedPanel.item.submitted_by}
                  </span>
                </p>
              )}
              {selectedPanel.item?.seller && (
                <p className="text-slate-500">
                  Seller{" "}
                  <span className="font-semibold text-slate-800">
                    {selectedPanel.item.seller}
                  </span>
                </p>
              )}
              {selectedPanel.item?.created_at && (
                <p className="text-slate-500">
                  Created{" "}
                  {new Date(selectedPanel.item.created_at).toLocaleString()}
                </p>
              )}
              <div className="flex gap-2">
                {selectedPanel.type === "listing" && (
                  <>
                    <button
                      onClick={() =>
                        selectedPanel.item?.id &&
                        handleMarketplaceDecision(
                          selectedPanel.item.id,
                          "approved"
                        )
                      }
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        selectedPanel.item?.id &&
                        handleMarketplaceDecision(
                          selectedPanel.item.id,
                          "rejected"
                        )
                      }
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
