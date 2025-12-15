import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";

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
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    audience: "Everyone",
    category: "announcement",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getPosts();
      const posts = response.posts || response.data || [];
      setAnnouncements(
        posts.map((post) => ({
          id: post.id,
          title: post.title || "Untitled",
          content: post.content || "",
          createdAt: post.created_at,
          audience: post.category || "Everyone",
          status: post.status || "published",
          reach: Math.floor(Math.random() * 100),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError(err.message || "Failed to load announcements");
      showToast("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  const addAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.content) {
      showToast("Please fill in title and content", "error");
      return;
    }

    try {
      const response = await adminApi.createPost({
        title: announcementForm.title,
        content: announcementForm.content,
        category: announcementForm.audience,
        status: "draft",
      });

      const newAnnouncement = {
        id: response.post?.id || response.id || Date.now(),
        title: announcementForm.title,
        content: announcementForm.content,
        createdAt: new Date().toISOString(),
        audience: announcementForm.audience,
        status: "draft",
        reach: 0,
      };

      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementForm({
        title: "",
        content: "",
        audience: "Everyone",
        category: "announcement",
      });
      showToast("Announcement created successfully", "success");
    } catch (err) {
      console.error("Failed to create announcement:", err);
      showToast("Failed to create announcement", "error");
    }
  };

  const publishAnnouncement = async (id) => {
    try {
      await adminApi.updatePost(id, { status: "published" });
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "published" } : item
        )
      );
      showToast("Announcement published successfully", "success");
    } catch (err) {
      console.error("Failed to publish announcement:", err);
      showToast("Failed to publish announcement", "error");
    }
  };

  const archiveAnnouncement = async (id) => {
    try {
      await adminApi.updatePost(id, { status: "archived" });
      setAnnouncements((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "archived" } : item
        )
      );
      showToast("Announcement archived successfully", "success");
    } catch (err) {
      console.error("Failed to archive announcement:", err);
      showToast("Failed to archive announcement", "error");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await adminApi.deletePost(id);
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      showToast("Announcement deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      showToast("Failed to delete announcement", "error");
    }
  };

  const filteredAnnouncements = announcements.filter((item) => {
    if (item.status === "archived") return false;
    return true;
  });

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader
          title="Announcements"
          description="Manage platform announcements"
        />
        <div className="text-center text-white/60 py-12">
          Loading announcements...
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
        title="Announcements"
        description="Manage platform announcements"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        <SectionCard
          title="Compose announcement"
          actions={
            <button
              onClick={addAnnouncement}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "#6b21a8" }}
            >
              Save draft
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

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        <SectionCard title="Announcement pipeline">
          <div className="space-y-3">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                No announcements yet
              </div>
            ) : (
              filteredAnnouncements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm"
                >
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1">
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
                    {item.status === "draft" && (
                      <button
                        onClick={() => publishAnnouncement(item.id)}
                        className="rounded-full border border-white/20 px-3 py-1 text-white/80 hover:bg-white/10"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => archiveAnnouncement(item.id)}
                      className="rounded-full border border-white/20 px-3 py-1 text-red-300 hover:bg-red-500/10"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(item.id)}
                      className="rounded-full border border-white/20 px-3 py-1 text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                    {item.status === "published" && (
                      <span className="ml-auto text-emerald-300">
                        Reach {item.reach}%
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
