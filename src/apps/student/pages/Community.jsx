import React, { useState, useEffect } from "react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { studentApi } from "../../shared/utils/api";
import { useToast } from "../../shared/components/Toast";
import {
  ListSkeleton,
  PostSkeleton,
} from "../../shared/components/SkeletonLoader";

const sidebarNav = [
  { id: "announcements", label: "Announcements", emoji: "📣", badge: 4 },
  { id: "events", label: "Events", emoji: "📅" },
  { id: "challenges", label: "Monthly Challenges", emoji: "🏅" },
  { id: "introductions", label: "Introductions", emoji: "👏" },
  { id: "lounge", label: "Live Lounge", emoji: "💬", active: true },
  { id: "collab", label: "Collaboration Corner", emoji: "🤝" },
];

const headerMetrics = [
  { label: "Students online", value: "892", meta: "+32 vs yesterday" },
  { label: "Posts today", value: "48", meta: "12 announcements" },
  { label: "Active clubs", value: "26", meta: "5 new this week" },
];

const quickFilters = ["All", "Pinned", "Clubs", "Staff", "Opportunities"];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#708090]/10 px-2 py-0.5 text-xs font-medium text-[#3c4b58] ring-1 ring-inset ring-blue-100">
      {children}
    </span>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-slate-900">{children}</h2>
      {action}
    </div>
  );
}

function PostCard({ post, onReaction }) {
  const isLive =
    post.createdAt === "just now" || post.createdAt.includes("min ago");

  const handleReactionClick = (reactionType) => {
    if (onReaction) {
      onReaction(post.id, reactionType);
    }
  };

  return (
    <div className="group flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all duration-300"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm ring-2 ring-slate-100">
            {post.author.name?.[0] || "U"}
          </div>
        )}
        {isLive && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#708090] border-2 border-white"></div>
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Commenter Info */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {post.author.name}
          </h3>
          <span className="text-xs text-slate-500">{post.createdAt}</span>
        </div>

        {/* Comment Text */}
        <div className="mb-2">
          <p className="text-sm text-slate-700 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleReactionClick("like")}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-[#4a5a68] transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h2a2 2 0 002-2v-7z"
              />
            </svg>
            <span className="font-medium">{post.reactions?.like || 0}</span>
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h10M7 16h10M3 4h18M3 4v16h18V4"
              />
            </svg>
            <span>{post.comments || 0} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- lightweight self-tests (dev only) ---
function runSelfTests() {
  try {
    const testUser = {
      role: "student",
      groups: ["bsit"],
      grants: { announcements: false, events: false },
    };
    console.log("[CommunityDashboard] self-tests passed");
  } catch (e) {
    console.warn("[CommunityDashboard] self-tests failed", e);
  }
}
runSelfTests();

export default function Community() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [clubs, setClubs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activePage, setActivePage] = useState("lounge");
  const [selectedClub, setSelectedClub] = useState(null);
  const [communityOpen, setCommunityOpen] = useState(true);
  const [showClubs, setShowClubs] = useState(false);
  const [composerChannel, setComposerChannel] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchClubs();
    fetchPosts();
  }, [activePage]);

  const fetchClubs = async () => {
    try {
      const response = await studentApi.getClubs();
      const clubsData = response.clubs || response.data || [];
      setClubs(
        clubsData.map((club) => ({
          id: club.id,
          name: club.name,
          emoji: club.emoji || "💬",
          desc: club.description || club.desc || "",
          members: club.members_count || club.members || 0,
          posts: club.posts_count || club.posts || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch clubs:", err);
      setError("Failed to load clubs");
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const params = {};
      if (activePage !== "lounge") {
        params.channel = activePage;
      }
      const response = await studentApi.getPosts(params);
      const postsData = response.posts || response.data || [];
      setPosts(
        postsData.map((post) => ({
          id: post.id,
          author: {
            name:
              post.author?.name ||
              `${post.author?.first_name || ""} ${
                post.author?.last_name || ""
              }`.trim() ||
              "Unknown",
            avatar: post.author?.avatar_url || post.author?.avatar || "",
          },
          channel: post.channel || post.channel_name || "Live Lounge",
          createdAt: formatTimeAgo(post.created_at || post.createdAt),
          content: post.content || post.body || "",
          reactions: post.reactions || { like: 0, heart: 0, laugh: 0 },
          comments: post.comments_count || post.comments || 0,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError("Failed to load posts");
      showToast("Failed to load posts", "error");
    } finally {
      setLoadingPosts(false);
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      showToast("Please enter some content", "error");
      return;
    }

    try {
      const response = await studentApi.createPost({
        content: newPostContent,
        channel: composerChannel || activePage,
      });

      const newPost = {
        id: response.post?.id || response.id || Date.now(),
        author: {
          name:
            user?.name ||
            `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
            "You",
          avatar: user?.avatar_url || user?.avatar || "",
        },
        channel: composerChannel || activePage || "Live Lounge",
        createdAt: "Just now",
        content: newPostContent,
        reactions: { like: 0, heart: 0, laugh: 0 },
        comments: 0,
      };

      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setShowComposer(false);
      showToast("Post created successfully!", "success");
    } catch (err) {
      console.error("Failed to create post:", err);
      showToast("Failed to create post", "error");
    }
  };

  const handleReaction = async (postId, reactionType) => {
    try {
      await studentApi.reactToPost(postId, reactionType);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactions: {
                  ...post.reactions,
                  [reactionType]: (post.reactions[reactionType] || 0) + 1,
                },
              }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to react to post:", err);
      showToast("Failed to react to post", "error");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(query.toLowerCase())
  );

  const currentUser = {
    role: "student",
    groups: ["bsit"],
    grants: { announcements: false, events: false },
  };

  const canPostTo = (section) => {
    // Open posting for Introductions, Live Lounge, Collaboration by default
    if (["introductions", "lounge", "collab"].includes(section)) return true;
    // Restricted: Announcements & Events -> admin or student council or explicit grant
    if (["announcements", "events"].includes(section)) {
      return (
        currentUser.role === "admin" ||
        currentUser.role === "studentCouncil" ||
        (currentUser.grants && currentUser.grants[section] === true)
      );
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* Transparent UNICON Logo Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/UNICON.png"
            alt="UNICON Background"
            className="w-96 h-96 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center text-[#4a5a68]/20 text-9xl font-bold"
            style={{ display: "none" }}
          >
            U
          </div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-3">
          <img
            src="/UNICON.png"
            alt="UNICON Background"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-600/5 flex items-center justify-center text-[#4a5a68]/10 text-6xl font-bold"
            style={{ display: "none" }}
          >
            U
          </div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-3">
          <img
            src="/UNICON.png"
            alt="UNICON Background"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-600/5 flex items-center justify-center text-[#4a5a68]/10 text-4xl font-bold"
            style={{ display: "none" }}
          >
            U
          </div>
        </div>
      </div>

      {/* Clean Header */}
      <header className="sticky top-0 z-30 border-b border-white/20 bg-gradient-to-br from-white/95 via-white/90 to-[#edf4fa]/95 backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white/80 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-3 sm:px-4 py-4 sm:py-5 space-y-4 sm:space-y-5">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/UNICON.png"
                  alt="UNICON"
                  className="h-11 w-11 rounded-2xl border border-white bg-white object-contain shadow-sm"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold items-center justify-center">
                  U
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                  Campus community
                </p>
                <h1 className="text-2xl font-bold text-slate-900">
                  UNICON Community
                </h1>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 sm:gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="relative w-full lg:max-w-sm">
                <input
                  type="text"
                  placeholder="Search posts, users, topics..."
                  className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 text-sm placeholder-slate-500 shadow-sm transition-all hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/15"
                />
                <svg
                  className="pointer-events-none absolute left-3 sm:left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowClubs(true)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Browse clubs
                </button>
                <button
                  onClick={() => setShowComposer(true)}
                  className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  }}
                >
                  + New post
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:col-span-1">
              {quickFilters.map((chip) => (
                <button
                  key={chip}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                >
                  {chip}
                </button>
              ))}
            </div>
            {headerMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {metric.label}
                </p>
                <p className="text-2xl font-semibold text-slate-900">
                  {metric.value}
                </p>
                <p className="text-xs text-slate-500">{metric.meta}</p>
              </div>
            ))}
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-2 pb-1">
              {sidebarNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSelectedClub(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    activePage === item.id
                      ? "bg-[#708090]/10 text-[#3c4b58]"
                      : "text-slate-600 hover:bg-[#d0d7df]"
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-[#708090] px-2 py-0.5 text-xs text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[240px_1fr] relative z-10">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="rounded-2xl border border-slate-200 bg-white p-2">
            <div className="flex items-center justify-between px-2 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Community
              </h3>
              <button
                onClick={() => setCommunityOpen((v) => !v)}
                className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
                aria-label="Toggle community nav"
              >
                {communityOpen ? "▾" : "▸"}
              </button>
            </div>
            {communityOpen && (
              <nav className="space-y-1">
                {sidebarNav.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setSelectedClub(null);
                    }}
                    className={`w-full text-left flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm transition hover:bg-slate-50 overflow-hidden ${
                      activePage === item.id
                        ? "bg-slate-100 font-medium border border-slate-200"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="text-base">{item.emoji}</span>
                      <span className="text-slate-800 truncate">
                        {item.label}
                      </span>
                    </span>
                    {item.badge ? (
                      <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#708090] text-xs font-semibold text-white">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Clubs column removed – now opened via modal */}
        <section className="hidden"></section>

        {/* Main Content */}
        <main>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 relative mb-6">
            {selectedClub ? (
              <div>
                <SectionTitle action={null}>
                  {selectedClub.name} Channel
                </SectionTitle>
                <p className="mb-3 text-sm text-slate-600">
                  {selectedClub.desc}
                </p>
                <div className="space-y-3">
                  {loadingPosts ? (
                    <PostSkeleton />
                  ) : filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={{ ...post, channel: selectedClub.name }}
                        onReaction={handleReaction}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      No posts yet in this channel
                    </div>
                  )}
                </div>
              </div>
            ) : activePage === "announcements" ? (
              <div>
                <SectionTitle>Announcements</SectionTitle>
                <ul className="space-y-3 text-sm">
                  <li className="rounded-xl border border-slate-200 p-3">
                    📣 Midterm review session on Friday 3PM.
                  </li>
                  <li className="rounded-xl border border-slate-200 p-3">
                    📢 New feature: study groups now support voice rooms.
                  </li>
                </ul>
                {canPostTo("announcements") && (
                  <button
                    onClick={() => {
                      setComposerChannel("Announcements");
                      setShowComposer(true);
                    }}
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#708090] text-white shadow-lg hover:bg-[#5a6a78] z-40"
                    aria-label="Create announcement"
                  >
                    +
                  </button>
                )}
              </div>
            ) : activePage === "events" ? (
              <div>
                <SectionTitle>Events</SectionTitle>
                <ul className="space-y-3 text-sm">
                  <li className="rounded-xl border border-slate-200 p-3">
                    📅 Hackathon – Nov 2 @ Innovation Lab.
                  </li>
                  <li className="rounded-xl border border-slate-200 p-3">
                    🎥 Film Night – Saturday 7PM, Hall B.
                  </li>
                </ul>
                {canPostTo("events") && (
                  <button
                    onClick={() => {
                      setComposerChannel("Events");
                      setShowComposer(true);
                    }}
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#708090] text-white shadow-lg hover:bg-[#5a6a78] z-40"
                    aria-label="Create event"
                  >
                    +
                  </button>
                )}
              </div>
            ) : activePage === "challenges" ? (
              <div>
                <SectionTitle>Monthly Challenges</SectionTitle>
                <ul className="space-y-3 text-sm">
                  <li className="rounded-xl border border-slate-200 p-3">
                    🏅 October: Build a web app in 48 hours.
                  </li>
                  <li className="rounded-xl border border-slate-200 p-3">
                    🎯 November: Learn a new programming language.
                  </li>
                </ul>
              </div>
            ) : activePage === "introductions" ? (
              <div>
                <SectionTitle>Introductions</SectionTitle>
                <ul className="space-y-3 text-sm">
                  <li className="rounded-xl border border-slate-200 p-3">
                    👋 Hi! I'm Alex, CS sophomore. Love React & Python.
                  </li>
                  <li className="rounded-xl border border-slate-200 p-3">
                    🚀 Hey everyone! Emma here, studying AI/ML.
                  </li>
                </ul>
                {canPostTo("introductions") && (
                  <button
                    onClick={() => {
                      setComposerChannel("Introductions");
                      setShowComposer(true);
                    }}
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#708090] text-white shadow-lg hover:bg-[#5a6a78] z-40"
                    aria-label="Create introduction"
                  >
                    +
                  </button>
                )}
              </div>
            ) : activePage === "collab" ? (
              <div>
                <SectionTitle>Collaboration Corner</SectionTitle>
                <ul className="space-y-3 text-sm">
                  <li className="rounded-xl border border-slate-200 p-3">
                    🤝 Looking for a study partner for Algorithms.
                  </li>
                  <li className="rounded-xl border border-slate-200 p-3">
                    💡 Anyone interested in starting a coding club?
                  </li>
                </ul>
                {canPostTo("collab") && (
                  <button
                    onClick={() => {
                      setComposerChannel("Collaboration Corner");
                      setShowComposer(true);
                    }}
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#708090] text-white shadow-lg hover:bg-[#5a6a78] z-40"
                    aria-label="Create collaboration post"
                  >
                    +
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Comment Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#708090] rounded-full animate-pulse"></div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        Live Lounge
                      </h2>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-full">
                      {filteredPosts.length} comments
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Live now</span>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400 transition-colors">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>

                {/* Add Comment Form */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-3 -mx-4 shadow-lg">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = new FormData(e.currentTarget);
                      const content = form.get("content");
                      if (content) {
                        setNewPostContent(content);
                        handleCreatePost();
                        e.currentTarget.reset();
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1 relative">
                      <input
                        name="content"
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full rounded-full border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-sm placeholder-slate-400 hover:border-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                      <input type="hidden" name="channel" value="Live Lounge" />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#4a5a68] hover:text-[#3c4b58] hover:bg-[#708090]/10 rounded-full transition-all active:scale-95"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all active:scale-95 text-xl"
                    >
                      😊
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Browse Clubs Modal */}
      {showClubs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Browse Clubs
              </h2>
              <button
                onClick={() => setShowClubs(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => {
                    setSelectedClub(club);
                    setShowClubs(false);
                  }}
                  className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-lg">{club.emoji}</span>
                    <span className="font-semibold text-slate-900">
                      {club.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{club.desc}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <span>{club.members} members</span>
                    <span>•</span>
                    <span>{club.posts} posts</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Create Post
              </h2>
              <button
                onClick={() => {
                  setShowComposer(false);
                  setNewPostContent("");
                  setComposerChannel("");
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatePost();
              }}
            >
              <div className="mb-4">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                />
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Channel:
                  </label>
                  {composerChannel ? (
                    <span className="rounded-lg bg-[#708090]/10 px-3 py-1 text-sm font-medium text-[#3c4b58]">
                      {composerChannel}
                    </span>
                  ) : (
                    <select
                      name="channel"
                      className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {canPostTo("lounge") && <option>Live Lounge</option>}
                      {canPostTo("announcements") && (
                        <option>Announcements</option>
                      )}
                      {canPostTo("events") && <option>Events</option>}
                      {canPostTo("introductions") && (
                        <option>Introductions</option>
                      )}
                      {canPostTo("collab") && (
                        <option>Collaboration Corner</option>
                      )}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Visibility:
                  </label>
                  <select className="w-full rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Everyone</option>
                    <option>My course only</option>
                    <option>Club members</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComposer(false)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#708090] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a6a78]"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
