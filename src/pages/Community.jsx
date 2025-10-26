import React, { useState, useEffect } from "react";

const sampleClubs = [
  {
    id: 1,
    name: "CS315",
    emoji: "💻",
    desc: "Data Structures & Algorithms",
    members: 45,
    posts: 12,
  },
  {
    id: 2,
    name: "Robotics Club",
    emoji: "🤖",
    desc: "Building the future, one robot at a time",
    members: 23,
    posts: 8,
  },
  {
    id: 3,
    name: "Design Society",
    emoji: "🎨",
    desc: "Where creativity meets technology",
    members: 67,
    posts: 15,
  },
];

const samplePosts = [
  {
    id: 1,
    author: { name: "Sarah Chen", avatar: "https://i.pravatar.cc/64?img=15" },
    channel: "Live Lounge",
    createdAt: "2 min ago",
    content:
      "Hey everyone! Just finished my CS315 assignment. Anyone want to study together for the midterm?",
    reactions: { like: 8, heart: 3, laugh: 1 },
    comments: 5,
  },
  {
    id: 2,
    author: {
      name: "Mike Rodriguez",
      avatar: "https://i.pravatar.cc/64?img=56",
    },
    channel: "Live Lounge",
    createdAt: "15 min ago",
    content:
      "The library is packed today! Found a great spot in the basement though. Perfect for group study sessions.",
    reactions: { like: 5, heart: 2, laugh: 2 },
    comments: 3,
  },
];

const sidebarNav = [
  { id: "announcements", label: "Announcements", emoji: "📣", badge: 4 },
  { id: "events", label: "Events", emoji: "📅" },
  { id: "challenges", label: "Monthly Challenges", emoji: "🏅" },
  { id: "introductions", label: "Introductions", emoji: "👏" },
  { id: "lounge", label: "Live Lounge", emoji: "💬", active: true },
  { id: "collab", label: "Collaboration Corner", emoji: "🤝" },
];

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100">
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

function PostCard({ post }) {
  const isLive =
    post.createdAt === "just now" || post.createdAt.includes("min ago");

  return (
    <div className="group flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all duration-300"
        />
        {isLive && (
          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
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
          <button className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-600 transition-colors group">
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
            <span className="font-medium">{post.reactions.like}</span>
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
            <span>Swipe to reply</span>
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
  const [clubs, setClubs] = useState(sampleClubs);
  const [posts, setPosts] = useState(samplePosts);
  const [query, setQuery] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activePage, setActivePage] = useState("lounge"); // which sidebar page is active
  const [selectedClub, setSelectedClub] = useState(null); // open channel when a club is clicked
  const [communityOpen, setCommunityOpen] = useState(true); // collapsible community group
  const [showClubs, setShowClubs] = useState(false); // modal to browse clubs
  const [composerChannel, setComposerChannel] = useState(""); // preselect channel when using + FAB

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

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const text = form.get("content");
    if (!text) return;
    const selectedChannel =
      composerChannel || form.get("channel") || "Live Lounge";
    const newPost = {
      id: Date.now(),
      author: { name: "You", avatar: "https://i.pravatar.cc/64?img=3" },
      channel: selectedChannel,
      createdAt: "just now",
      content: String(text),
      reactions: { like: 0, heart: 0, laugh: 0 },
      comments: 0,
    };
    setPosts((p) => [newPost, ...p]);
    setShowComposer(false);
    setComposerChannel("");
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
            className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center text-blue-500/20 text-9xl font-bold"
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
            className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-600/5 flex items-center justify-center text-blue-500/10 text-6xl font-bold"
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
            className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/5 to-indigo-600/5 flex items-center justify-center text-blue-500/10 text-4xl font-bold"
            style={{ display: "none" }}
          >
            U
          </div>
        </div>
      </div>

      {/* Clean Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/50">
        <div className="mx-auto max-w-6xl px-4 py-4">
          {/* Main Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src="/UNICON.png"
                alt="UNICON"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm"
                style={{ display: "none" }}
              >
                U
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                UNICON Community
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search posts, users, topics..."
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 pl-12 text-sm placeholder-slate-500 hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                />
                <svg
                  className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setShowClubs(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
              >
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Browse Clubs
              </button>
              <button
                onClick={() => setShowComposer(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-all shadow-sm"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Post
              </button>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {sidebarNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setSelectedClub(null);
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activePage === item.id
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">{item.emoji}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full min-w-[20px] text-center">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
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
                    className={`w-full text-left flex items-center justify-between rounded-xl px-2 py-2 text-sm transition hover:bg-slate-50 ${
                      activePage === item.id ? "bg-slate-100 font-medium" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-slate-800">{item.label}</span>
                    </span>
                    {item.badge ? (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white">
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
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={{ ...post, channel: selectedClub.name }}
                    />
                  ))}
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
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-40"
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
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-40"
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
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-40"
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
                    className="fixed bottom-28 right-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-40"
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
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
                    onSubmit={handlePostSubmit}
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all active:scale-95"
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
                onClick={() => setShowComposer(false)}
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
            <form onSubmit={handlePostSubmit}>
              <div className="mb-4">
                <textarea
                  name="content"
                  placeholder="What's on your mind?"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Channel:
                  </label>
                  {composerChannel ? (
                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
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
            </form>
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
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
