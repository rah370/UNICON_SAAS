import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";
import { AdminCard } from "../components/AdminLayout";
import { useToast } from "../../shared/components/Toast";
import { exportAnnouncements } from "../../shared/utils/exportUtils";
import { PostSkeleton } from "../../shared/components/SkeletonLoader";

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

// Using AdminCard from AdminLayout

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, showError } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    audience: "Everyone",
    scheduledDate: "",
    scheduledTime: "",
    priority: "normal",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getPosts();
        const announcementsData = (result.posts || []).map((post) => ({
          id: post.id,
          title: post.title || "Untitled",
          content: post.content || "",
          createdAt: post.created_at,
          audience: post.category || "Everyone",
          status: "published",
          reach: Math.floor(Math.random() * 100),
        }));
        setAnnouncements(announcementsData);
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setError("Failed to load announcements. Using demo data.");
        setAnnouncements(defaultAnnouncements);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [isAuthenticated, user, navigate]);

  const addAnnouncement = async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    try {
      const result = await adminApi.createPost({
        title: form.title,
        content: form.content,
        category: form.audience.toLowerCase(),
        priority: form.priority,
        scheduled_at:
          form.scheduledDate && form.scheduledTime
            ? `${form.scheduledDate}T${form.scheduledTime}:00`
            : null,
      });

      if (result.success) {
        setAnnouncements((prev) => [
          {
            id: result.post_id,
            ...form,
            status: form.scheduledDate ? "scheduled" : "draft",
            createdAt: new Date().toISOString(),
            reach: 0,
          },
          ...prev,
        ]);
        setForm({
          title: "",
          content: "",
          audience: "Everyone",
          scheduledDate: "",
          scheduledTime: "",
          priority: "normal",
        });
      }
      success("Announcement created successfully");
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

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/70 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
            <p className="text-sm text-slate-600">Create and manage announcements</p>
          </div>
        </div>
      </header>
      {loading && (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 mb-6">
          {error}
        </div>
      )}
      <AdminCard
        title="Compose announcement"
        actions={
          <button
            onClick={addAnnouncement}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
          >
            {form.scheduledDate ? "Schedule" : "Publish draft"}
          </button>
        }
      >
        <div className="grid gap-4 text-sm lg:grid-cols-3">
          <input
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Title"
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          />
          <select
            value={form.audience}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, audience: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option>Everyone</option>
            <option>Students</option>
            <option>Faculty</option>
            <option>Admins</option>
          </select>
          <select
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priority: e.target.value }))
            }
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
          >
            <option value="normal">Normal Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <textarea
          value={form.content}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, content: e.target.value }))
          }
          placeholder="Share details..."
          rows={4}
          className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <label className="text-xs text-slate-600 mb-1 block">
              Schedule Date (optional)
            </label>
            <input
              type="date"
              value={form.scheduledDate}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, scheduledDate: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600 mb-1 block">
              Schedule Time (optional)
            </label>
            <input
              type="time"
              value={form.scheduledTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, scheduledTime: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Bulk tools">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm text-slate-700">
          <button
            onClick={() => showError("Import from CSV coming soon")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold hover:bg-slate-50 transition"
          >
            Import announcements (CSV)
          </button>
          <button
            onClick={() => showError("Send recap coming soon")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold hover:bg-slate-50 transition"
          >
            Send weekly recap
          </button>
          <button
            onClick={() => showError("Draft templates coming soon")}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left font-semibold hover:bg-slate-50 transition"
          >
            Save as template
          </button>
        </div>
      </AdminCard>

      <div className="flex gap-3 mb-4">
        {["all", "published", "draft", "scheduled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
              filterStatus === status
                ? "text-white shadow-md"
                : "text-slate-700 border border-slate-200 bg-white hover:bg-slate-50"
            }`}
            style={
              filterStatus === status
                ? {
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  }
                : {}
            }
          >
            {status}
          </button>
        ))}
      </div>

      <AdminCard
        title="Announcement pipeline"
        actions={
          <div className="flex gap-2">
            <button
              onClick={() => {
                try {
                  exportAnnouncements(announcements);
                  success("Announcements exported successfully");
                } catch (err) {
                  showError("Failed to export: " + err.message);
                }
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Export CSV
            </button>
          </div>
        }
      >
        {selectedAnnouncements.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  selectedAnnouncements.length ===
                  announcements.filter((item) => {
                    if (filterStatus === "all") return true;
                    return item.status === filterStatus;
                  }).length
                }
                onChange={selectAllAnnouncements}
                className="rounded"
              />
              <span className="text-sm text-slate-900">
                {selectedAnnouncements.length} announcement
                {selectedAnnouncements.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={bulkPublishAnnouncements}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition"
              >
                Publish All
              </button>
              <button
                onClick={bulkDeleteAnnouncements}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition"
              >
                Delete All
              </button>
              <button
                onClick={() => setSelectedAnnouncements([])}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {announcements
            .filter((item) => {
              if (filterStatus === "all") return true;
              return item.status === filterStatus;
            })
            .map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedAnnouncements.includes(item.id)}
                    onChange={() => toggleAnnouncementSelection(item.id)}
                    className="mt-1 rounded"
                  />
                  <div className="flex-1 flex flex-wrap gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-slate-600">
                        {item.content.slice(0, 120)}
                        {item.content.length > 120 ? "…" : ""}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                        {item.audience}
                      </span>
                      <span className="text-slate-500">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => publishAnnouncement(item.id)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => archiveAnnouncement(item.id)}
                    className="rounded-full border border-red-200 bg-white px-3 py-1 text-red-600 hover:bg-red-50 transition"
                  >
                    Archive
                  </button>
                  {item.status === "published" && (
                    <span className="ml-auto text-emerald-600 font-semibold">
                      Reach {item.reach}%
                    </span>
                  )}
                  {item.status === "scheduled" && (
                    <span className="ml-auto text-blue-600 font-semibold">
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </AdminCard>
    </div>
  );
}
