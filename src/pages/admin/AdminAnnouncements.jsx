import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "Everyone",
  });

  const addAnnouncement = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        ...form,
        status: "draft",
        createdAt: new Date().toISOString(),
        reach: 0,
      },
      ...prev,
    ]);
    setForm({ title: "", content: "", audience: "Everyone" });
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
              <h1 className="text-2xl font-bold">Announcements</h1>
              <p className="text-sm text-white/60">
                Create and manage announcements
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
        <SectionCard
          title="Compose announcement"
          actions={
            <button
              onClick={addAnnouncement}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: "#6b21a8" }}
            >
              Publish draft
            </button>
          }
        >
          <div className="grid gap-4 text-sm text-white/80 lg:grid-cols-3">
            <input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Title"
              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-white"
            />
            <select
              value={form.audience}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, audience: e.target.value }))
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
            value={form.content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, content: e.target.value }))
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
                    <p className="font-semibold text-white">{item.title}</p>
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
      </main>
    </div>
  );
}

