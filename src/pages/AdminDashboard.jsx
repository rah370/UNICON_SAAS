import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

const adminPalette = {
  primary: "#6b21a8",
  primaryDark: "#581c87",
  surface: "#0b1020",
  card: "#10172c",
  border: "rgba(255,255,255,0.08)",
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
  const [activeTab, setActiveTab] = useState("overview");
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [events, setEvents] = useState(defaultEvents);
  const [users, setUsers] = useState(defaultUsers);
  const [marketplace, setMarketplace] = useState(defaultMarketplace);

  // Redirect to admin login if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
    }
  }, [isAuthenticated, user, navigate]);

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

  const addAnnouncement = () => {
    if (!announcementForm.title.trim() || !announcementForm.content.trim())
      return;
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        ...announcementForm,
        status: "draft",
        createdAt: new Date().toISOString(),
        reach: 0,
      },
      ...prev,
    ]);
    setAnnouncementForm({ title: "", content: "", audience: "Everyone" });
  };

  const publishAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "published", reach: 100 } : item
      )
    );
  };

  const archiveAnnouncement = (id) => {
    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
  };

  const addEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.venue) return;
    setEvents((prev) => [
      {
        id: Date.now(),
        ...eventForm,
        rsvp: 0,
        moderated: true,
      },
      ...prev,
    ]);
    setEventForm({ title: "", date: "", venue: "", capacity: 100 });
  };

  const approveListing = (id, status) => {
    setMarketplace((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, flagged: status !== "approved" }
          : item
      )
    );
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "suspended" : "active",
            }
          : user
      )
    );
  };

  const updateSettings = (field, value) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
    if (field === "name" || field === "color") {
      updateSchoolBranding({ [field]: value });
    }
  };

  const tabClass = (id) =>
    `rounded-2xl px-4 py-3 text-sm font-semibold transition border border-white/10 ${
      activeTab === id
        ? "text-white bg-white/15"
        : "text-white/60 hover:text-white"
    }`;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-2">
              <span className="text-sm font-semibold">
                {schoolBranding.name?.[0] || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                Admin Command
              </p>
              <h1 className="text-xl font-bold">{schoolBranding.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-white/60">{user?.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/for-you")}
                className="rounded-full border border-white/20 px-4 py-1 text-sm font-semibold text-white/80 hover:border-white/60 hover:bg-white/5 transition-colors"
              >
                Student view
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-white/20 px-4 py-1 text-sm font-semibold text-white/80 hover:border-white/60 hover:bg-red-500/10 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-white lg:flex-row">
        <aside className="lg:w-64">
          <nav className="sticky top-6 flex flex-col gap-2">
            {[
              ["/admin-dashboard", "Overview", "overview"],
              ["/admin/announcements", "Announcements", "announcements"],
              ["/admin/events", "Events", "events"],
              ["/admin/users", "People", "users"],
              ["/admin/marketplace", "Marketplace", "marketplace"],
              ["/admin/analytics", "Analytics", "analytics"],
              ["/admin/settings", "Settings", "settings"],
            ].map(([path, label, id]) => (
              <button
                key={id}
                className={tabClass(id)}
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 space-y-6 pb-16">
          {activeTab === "overview" && (
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
          )}

          {activeTab === "announcements" && (
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

          {activeTab === "events" && (
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

          {activeTab === "users" && (
            <div className="space-y-6">
              <SectionCard
                title="User Management"
                actions={
                  <button
                    onClick={() => alert("Bulk import feature coming soon")}
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

          {activeTab === "marketplace" && (
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

          {activeTab === "analytics" && (
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

          {activeTab === "settings" && (
            <SectionCard title="Brand + controls">
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
            </SectionCard>
          )}
        </section>
      </main>
    </div>
  );
}
