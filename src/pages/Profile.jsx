import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

const quickStats = [
  { label: "Engagement score", value: "92", meta: "+8 vs last week" },
  { label: "Communities", value: "7", meta: "Active memberships" },
  { label: "Service hours", value: "48h", meta: "This semester" },
];

const journeyMilestones = [
  {
    title: "CS Club Officer",
    period: "2023 – Present",
    detail: "Lead sprints for 120+ members, shipping weekly micro-projects.",
  },
  {
    title: "Hackathon Finalist",
    period: "Aug 2024",
    detail: "Built a campus marketplace prototype that won the community choice vote.",
  },
  {
    title: "Student Success Fellow",
    period: "Jan 2024",
    detail: "Mentored freshmen on productivity systems and onboarding to UNICON.",
  },
];

const focusAreas = [
  {
    title: "Product Studio",
    detail: "Designing a verified vendor portal for campus marketplace.",
    meta: "CS315 · Team lead",
  },
  {
    title: "Community Ops",
    detail: "Automating club attendance + service hours via UNICON workflows.",
    meta: "Student Affairs · Internship",
  },
  {
    title: "Wellness Pulse",
    detail: "Piloting sentiment dashboards for guidance counselors.",
    meta: "Research · 2 credits",
  },
];

const badgeShowcase = [
  { icon: "🏅", title: "Dean's Lister", detail: "3 consecutive terms", tone: "from-sky-500/20" },
  { icon: "🧠", title: "Hackathon Finalist", detail: "Top 5 / 60 teams", tone: "from-indigo-500/20" },
  { icon: "🤝", title: "Service Leader", detail: "48 verified hours", tone: "from-emerald-500/20" },
  { icon: "🚀", title: "Startup Bootcamp", detail: "Cohort 03", tone: "from-orange-500/20" },
];

const toolkit = ["Figma", "Next.js", "Python", "Notion", "Firebase", "Miro"];

function Profile() {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
  const brandColor = branding?.color || "#365b6d";

  const [activeTab, setActiveTab] = useState("posts");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "User Name",
    bio: "Turning coffee into code ☕",
    location: "Cebu City",
    interests: ["Programming", "Web Development", "AI", "Mobile Apps"],
    major: user?.major || "Computer Science",
    year: user?.year || "Junior",
  });
  const [posts, setPosts] = useState([
    {
      id: 1,
      content: "Shipped the vendor verification flow for our campus marketplace pilot. 🎯",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      likes: 48,
      comments: 9,
      timestamp: "2 hours ago",
      canDelete: true,
    },
    {
      id: 2,
      content: "Hosted our CS club design critique — 5 teams demoed shipping updates!",
      likes: 32,
      comments: 6,
      timestamp: "1 day ago",
      canDelete: true,
    },
  ]);
  const [profilePic, setProfilePic] = useState(user?.avatarUrl || "");
  const [backgroundPic, setBackgroundPic] = useState("");
  const profilePicRef = useRef(null);
  const backgroundPicRef = useRef(null);

  const initials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Joined recently";
    const date = new Date(dateString);
    return `Joined ${date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })}`;
  };

  const handleProfilePicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundPicUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundPic(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const handleAddInterest = (interest) => {
    if (interest.trim() && !profileData.interests.includes(interest.trim())) {
      setProfileData({
        ...profileData,
        interests: [...profileData.interests, interest.trim()],
      });
    }
  };

  const handleRemoveInterest = (interest) => {
    setProfileData({
      ...profileData,
      interests: profileData.interests.filter((i) => i !== interest),
    });
  };

  const tabs = [
    { id: "posts", label: "Feed" },
    { id: "journey", label: "Journey" },
    { id: "about", label: "About" },
    { id: "badges", label: "Badges" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-16">
      <div className="relative h-60 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {backgroundPic && (
          <img
            src={backgroundPic}
            alt="Profile cover"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at top, ${brandColor}30, transparent 55%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-950" />
      </div>

      <section className="relative -mt-24 px-4">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
              <div className="flex items-center gap-4 lg:flex-col lg:items-start">
                <div className="relative">
                  <div className="h-24 w-24 rounded-3xl bg-[#708090] text-white shadow-2xl ring-4 ring-white flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials(profileData.name)
                    )}
                  </div>
                  <button
                    onClick={() => profilePicRef.current?.click()}
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-[#708090] text-white shadow-lg"
                    title="Change avatar"
                  >
                    📷
                  </button>
                  <input
                    ref={profilePicRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden"
                  />
                </div>
                <button
                  onClick={() => backgroundPicRef.current?.click()}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  {backgroundPic ? "Change cover" : "Add cover"}
                </button>
                <input
                  ref={backgroundPicRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundPicUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-slate-900">
                    {profileData.name}
                  </h1>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                    {profileData.major}
                  </span>
                </div>
                <p className="mt-1 text-slate-500">@{user?.email?.split("@")[0] || "username"}</p>
                <p className="mt-3 text-base text-slate-700 max-w-2xl">
                  {profileData.bio}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <span role="img" aria-label="location">
                      📍
                    </span>
                    {profileData.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span role="img" aria-label="calendar">
                      📅
                    </span>
                    {formatDate(user?.joinDate)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span role="img" aria-label="school">
                      🎓
                    </span>
                    {profileData.year} • {branding?.name || "UNICON University"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-56">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:border-slate-300"
                >
                  Edit profile
                </button>
                <button
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #0f1c24)` }}
                >
                  Share profile
                </button>
                <button
                  onClick={logout}
                  className="rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Posts", value: 24 },
                { label: "Followers", value: 156 },
                { label: "Following", value: 89 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-100 px-4 py-3 shadow-sm">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.meta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl overflow-x-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              style={
                activeTab === tab.id
                  ? { borderBottom: `3px solid ${brandColor}` }
                  : { borderBottom: "3px solid transparent" }
              }
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 py-3">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
              New post
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-5xl px-4 space-y-6">
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#708090] text-white flex items-center justify-center font-semibold">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    initials(profileData.name)
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Share an update with your campus..."
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #0f1c24)` }}
                >
                  Post
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Recent posts</h2>
              <div className="mt-4 space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-[#708090] text-white flex items-center justify-center font-semibold">
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt="Profile"
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          initials(profileData.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {profileData.name}
                            </p>
                            <p className="text-xs text-slate-500">{post.timestamp}</p>
                          </div>
                          {post.canDelete && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-slate-400 hover:text-red-500"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-sm text-slate-700">{post.content}</p>
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt="Post"
                            className="mt-4 h-48 w-full rounded-2xl object-cover"
                          />
                        )}
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <button className="hover:text-red-500">♥ {post.likes}</button>
                          <button className="hover:text-[#4a5a68]">💬 {post.comments}</button>
                          <button className="hover:text-green-500">🔄 Share</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "journey" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Milestones</h2>
                <div className="mt-4 space-y-6">
                  {journeyMilestones.map((item) => (
                    <div key={item.title} className="relative pl-6">
                      <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-white" style={{ backgroundColor: brandColor }} />
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{item.period}</p>
                        <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Focus areas</h2>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {focusAreas.map((area) => (
                    <div key={area.title} className="rounded-2xl border border-slate-100 p-4">
                      <p className="text-sm font-semibold text-slate-900">{area.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.35em] text-slate-500">{area.meta}</p>
                      <p className="mt-2 text-sm text-slate-600">{area.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Toolkit</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {toolkit.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Snapshot</h3>
                <ul className="mt-3 space-y-3 text-sm text-slate-600">
                  <li>• Mentoring 6 freshmen on UNICON onboarding.</li>
                  <li>• Partnering with Student Affairs on service tracking.</li>
                  <li>• Building a vendor dashboard for campus marketplace.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
                <p className="mt-2 text-sm text-slate-600">{profileData.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Focus</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Academic</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{profileData.major}</p>
                    <p className="text-xs text-slate-500">{profileData.year}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">School</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {branding?.name || "UNICON University"}
                    </p>
                    <p className="text-xs text-slate-500">{profileData.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Contact</h3>
                <p className="mt-2 text-sm text-slate-600">{user?.email}</p>
                <p className="text-xs text-slate-500">Usually replies within a day.</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">Availability</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>• Office hours: Tue & Thu, 3-5PM</li>
                  <li>• Mentorship slots: 2 remaining</li>
                  <li>• Open to: Product design, student success, research collabs</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="rounded-3xl border border-white/80 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Badge wall</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {badgeShowcase.map((badge) => (
                <div
                  key={badge.title}
                  className={`rounded-3xl border border-white/80 bg-gradient-to-br ${badge.tone} via-white/70 to-white p-4 shadow-sm`}
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{badge.title}</p>
                  <p className="text-xs text-slate-600">{badge.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#708090]/60 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-slate-900">Edit profile</h2>
            <p className="text-sm text-slate-500">Refresh how your classmates see you.</p>

            <div className="mt-6 grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Bio
                </label>
                <textarea
                  rows="3"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({ ...profileData, location: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Major
                  </label>
                  <input
                    type="text"
                    value={profileData.major}
                    onChange={(e) =>
                      setProfileData({ ...profileData, major: e.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year
                </label>
                <div className="relative">
                  <select
                    value={profileData.year}
                    onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                    className="w-full appearance-none rounded-2xl border border-slate-300 px-4 py-3 pr-10 text-slate-700 focus:border-slate-500 focus:outline-none"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profileData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {interest}
                      <button
                        onClick={() => handleRemoveInterest(interest)}
                        className="text-slate-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add interest"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInterest(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 focus:border-slate-500 focus:outline-none"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling;
                      handleAddInterest(input.value || "");
                      input.value = "";
                    }}
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-white"
                style={{ background: `linear-gradient(135deg, ${brandColor}, #0f1c24)` }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
