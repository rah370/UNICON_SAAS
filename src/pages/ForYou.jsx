import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { EngagementDashboard } from "../components/EngagementDashboard";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";
import { CardSkeleton, ListSkeleton } from "../components/SkeletonLoader";
import { uploadImage, compressImage } from "../apps/shared/utils/fileUpload";

const quickLinks = [
  { label: "Campus Pulse", href: "/community", emoji: "🌐" },
  { label: "Schedule", href: "/calendar", emoji: "🗓️" },
  { label: "Marketplace", href: "/marketplace", emoji: "🛍️" },
];

const activityFeed = [
  {
    id: 1,
    title: "New post in CS315 channel",
    detail: '"Anyone want to study for midterm?"',
    icon: "💬",
  },
  {
    id: 2,
    title: "Spring Festival RSVP",
    detail: "You've RSVP'd for the event",
    icon: "🎉",
  },
];

const resourceCards = [
  {
    id: 1,
    title: "Advising drop-in",
    detail: "Today · 3-5 PM",
    tone: "from-amber-500/20 to-amber-500/5",
  },
  {
    id: 2,
    title: "Wellness check-in",
    detail: "Schedule 1:1",
    tone: "from-rose-500/20 to-rose-500/5",
  },
];

const initialStories = [
  {
    id: 1,
    label: "Your Story",
    initials: "+",
    color: "from-blue-500 to-blue-600",
    isAddButton: false, // Not used in logic, but kept for reference
    hasNewStory: false,
    moments: [
      {
        id: 1,
        image: "https://picsum.photos/300/400?random=0",
        timestamp: "Just now",
      },
    ], // Can have moments, but clicking still triggers "add story" flow
  },
  {
    id: 2,
    label: "Erin",
    initials: "E",
    color: "from-pink-400 to-pink-600",
    hasNewStory: true,
    moments: [
      {
        id: 2,
        image: "https://picsum.photos/300/400?random=1",
        timestamp: "2h ago",
      },
    ],
  },
  {
    id: 3,
    label: "Film Club",
    initials: "FC",
    color: "from-purple-400 to-purple-600",
    hasNewStory: true,
    moments: [
      {
        id: 3,
        image: "https://picsum.photos/300/400?random=3",
        timestamp: "1h ago",
      },
    ],
  },
  {
    id: 4,
    label: "Alex",
    initials: "A",
    color: "from-orange-400 to-orange-600",
    hasNewStory: true,
    moments: [
      {
        id: 4,
        image: "https://picsum.photos/300/400?random=5",
        timestamp: "30m ago",
      },
    ],
  },
  {
    id: 5,
    label: "Sarah",
    initials: "S",
    color: "from-green-400 to-green-600",
    hasNewStory: false,
    moments: [
      {
        id: 5,
        image: "https://picsum.photos/300/400?random=6",
        timestamp: "1d ago",
      },
    ],
  },
  {
    id: 6,
    label: "Mike",
    initials: "M",
    color: "from-indigo-400 to-indigo-600",
    hasNewStory: true,
    moments: [
      {
        id: 6,
        image: "https://picsum.photos/300/400?random=7",
        timestamp: "4h ago",
      },
    ],
  },
];

function ForYou() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const { showToast } = useToast();
  const firstName = user?.first_name || user?.name?.split(" ")[0] || "Friend";

  const [stories, setStories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);

  // Dashboard data from API
  const [quickStats, setQuickStats] = useState([
    { label: "Focus tasks", value: "0", meta: "Loading..." },
    { label: "Events", value: "0", meta: "Loading..." },
    { label: "Communities", value: "0", meta: "Loading..." },
  ]);
  const [focusTasks, setFocusTasks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from /api/dashboard or /api/feed
      const data = await studentApi
        .getDashboard()
        .catch(() => studentApi.getFeed());

      // Update quick stats
      if (data.stats) {
        setQuickStats([
          {
            label: "Focus tasks",
            value: String(data.stats.tasks_count || data.stats.tasks || 0),
            meta: "Due this week",
          },
          {
            label: "Events",
            value: String(data.stats.events_count || data.stats.events || 0),
            meta: "RSVP today",
          },
          {
            label: "Communities",
            value: String(
              data.stats.communities_count || data.stats.communities || 0
            ),
            meta: "Active",
          },
        ]);
      }

      // Update focus tasks
      if (data.tasks) {
        setFocusTasks(
          data.tasks.map((task) => ({
            id: task.id,
            title: task.title,
            detail: task.due_date
              ? `Due ${new Date(task.due_date).toLocaleDateString()}`
              : task.description || "No due date",
            tone: "from-sky-500/20 to-sky-500/10",
            badge: task.priority || "Task",
          }))
        );
      } else {
        // Fallback: fetch tasks separately
        try {
          const tasksData = await studentApi.getTasks();
          setFocusTasks(
            (tasksData.tasks || []).slice(0, 2).map((task) => ({
              id: task.id,
              title: task.title,
              detail: task.due_date
                ? `Due ${new Date(task.due_date).toLocaleDateString()}`
                : task.description || "No due date",
              tone: "from-sky-500/20 to-sky-500/10",
              badge: task.priority || "Task",
            }))
          );
        } catch (err) {
          console.error("Failed to fetch tasks:", err);
        }
      }

      // Update upcoming events
      if (data.events) {
        setUpcomingEvents(
          data.events.slice(0, 2).map((event) => ({
            id: event.id,
            title: event.title,
            time: event.event_date
              ? new Date(event.event_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "TBA",
            location: event.location || event.venue || "TBA",
          }))
        );
      } else {
        // Fallback: fetch events separately
        try {
          const eventsData = await studentApi.getEvents();
          const publicEvents = (eventsData.events || []).filter(
            (e) => e.is_public
          );
          setUpcomingEvents(
            publicEvents.slice(0, 2).map((event) => ({
              id: event.id,
              title: event.title,
              time: event.event_date
                ? new Date(event.event_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "TBA",
              location: event.location || event.venue || "TBA",
            }))
          );
        } catch (err) {
          console.error("Failed to fetch events:", err);
        }
      }

      // Update activity feed
      if (data.activity || data.feed) {
        setActivityFeed(
          (data.activity || data.feed || []).slice(0, 2).map((item, idx) => ({
            id: item.id || idx,
            title: item.title || item.type || "Activity",
            detail: item.content || item.description || "",
            icon: item.icon || "💬",
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      showToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (story) => {
    // "Your Story" should always trigger "add story" flow when clicked
    // This preserves the original add-button behavior
    if (story.label === "Your Story") {
      setShowAddStoryModal(true);
      return;
    }

    // Other stories with moments show the viewer
    if (story.moments?.length) {
      setSelectedStory(story);
      setCurrentMomentIndex(0);
      setShowStoryViewer(true);
    }
  };

  const handleAddStory = async (imageUrl, imageFile = null) => {
    try {
      let finalImageUrl = imageUrl;

      // If file provided, upload it
      if (imageFile) {
        try {
          const compressedFile = await compressImage(imageFile);
          finalImageUrl = await uploadImage(compressedFile, "story");
          showToast("Story added successfully!", "success");
        } catch (err) {
          console.error("Failed to upload story image:", err);
          showToast("Failed to upload story image", "error");
          return;
        }
      }

      // Add new story moment to "Your Story"
      const yourStory = stories.find((s) => s.label === "Your Story");
      if (yourStory) {
        const newMoment = {
          id: Date.now(),
          image:
            finalImageUrl ||
            `https://picsum.photos/300/400?random=${Date.now()}`,
          timestamp: "Just now",
        };

        setStories((prev) =>
          prev.map((s) =>
            s.id === yourStory.id
              ? {
                  ...s,
                  moments: [newMoment, ...(s.moments || [])],
                  hasNewStory: true,
                }
              : s
          )
        );
      }
      setShowAddStoryModal(false);
    } catch (err) {
      console.error("Failed to add story:", err);
      showToast("Failed to add story", "error");
    }
  };

  const handleNextMoment = () => {
    if (!selectedStory) return;
    if (currentMomentIndex < selectedStory.moments.length - 1) {
      setCurrentMomentIndex((prev) => prev + 1);
    } else {
      setShowStoryViewer(false);
      setSelectedStory(null);
      setCurrentMomentIndex(0);
    }
  };

  const handlePrevMoment = () => {
    if (!selectedStory) return;
    if (currentMomentIndex > 0) {
      setCurrentMomentIndex((prev) => prev - 1);
    }
  };

  const closeStoryViewer = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
    setCurrentMomentIndex(0);
  };

  return (
    <div className="relative z-10">
      <div className="mx-auto max-w-6xl px-4 py-6 space-y-6 lg:px-6">
        {/* Hero */}
        <section className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1.3fr,0.7fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">
                Welcome back
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  Hi {firstName}, here is your campus pulse
                </h1>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                  {branding?.name || "UNICON"}
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-2xl">
                Track your priorities, events, and communities in one calm view.
                Everything here reflects your saved preferences across UNICON.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/community"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5"
                >
                  Browse community
                </Link>
                <Link
                  to="/calendar"
                  className="rounded-2xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  }}
                >
                  View calendar
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 animate-pulse"
                    >
                      <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-slate-200 rounded w-12 mb-1"></div>
                      <div className="h-2 bg-slate-200 rounded w-24"></div>
                    </div>
                  ))
                : quickStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                    >
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500">{stat.meta}</p>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* Stories */}
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-800">Stories</h2>
            <button className="text-sm font-semibold text-[#4a5a68]">
              View all
            </button>
          </div>
          <div className="mt-3 flex justify-evenly items-start pb-1 overflow-x-auto scrollbar-hide">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => handleStoryClick(story)}
                className="flex-shrink-0 text-center min-w-[70px] max-w-[90px]"
              >
                <div className="relative mx-auto">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${
                      story.color
                    } text-white font-semibold shadow-md transition hover:scale-105 ${
                      story.hasNewStory
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    {story.initials}
                  </div>
                  {story.hasNewStory && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#708090] border-2 border-white" />
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600 truncate">
                  {story.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Today's focus
              </h3>
              {loading ? (
                <ListSkeleton count={2} />
              ) : error ? (
                <div className="text-sm text-red-600 p-4 bg-red-50 rounded-xl">
                  {error}
                </div>
              ) : focusTasks.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {focusTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded-2xl border border-slate-100 bg-gradient-to-r ${task.tone} px-4 py-3`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          {task.title}
                        </p>
                        <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {task.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{task.detail}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 p-4 text-center">
                  No tasks due today
                </div>
              )}
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Recent activity
              </h3>
              {loading ? (
                <ListSkeleton count={2} />
              ) : activityFeed.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {activityFeed.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-600">
                          {activity.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 p-4 text-center">
                  No recent activity
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900 mb-4">
                Upcoming
              </h3>
              {loading ? (
                <ListSkeleton count={2} />
              ) : upcomingEvents.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-600">{event.time}</p>
                      <p className="text-xs text-slate-500">{event.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 p-4 text-center">
                  No upcoming events
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {resourceCards.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl border border-white/70 bg-gradient-to-br ${card.tone} p-4 shadow-lg`}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {card.title}
                  </p>
                  <p className="text-xs text-slate-600">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="rounded-[24px] border border-white/70 bg-white/90 p-5 text-center shadow-lg transition hover:-translate-y-1"
            >
              <div className="mb-2 text-xl">{link.emoji}</div>
              <p className="text-sm font-semibold text-slate-900">
                {link.label}
              </p>
            </Link>
          ))}
        </section>

        {/* Add Story Modal */}
        {showAddStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Add to Your Story
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Simulate image upload - in real app, this would open file picker
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            handleAddStory(event.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    📷 Upload Photo
                  </button>
                  <button
                    onClick={() => {
                      // Quick add with placeholder image
                      handleAddStory();
                    }}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg"
                    style={{
                      background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    }}
                  >
                    ✨ Quick Add
                  </button>
                </div>
                <button
                  onClick={() => setShowAddStoryModal(false)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Story Viewer */}
        {showStoryViewer && selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#708090]/80 px-4">
            <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-black">
              <button
                onClick={closeStoryViewer}
                className="absolute right-4 top-4 z-10 text-white text-2xl"
              >
                ×
              </button>
              <img
                src={selectedStory.moments[currentMomentIndex].image}
                alt="Story moment"
                className="h-[520px] w-full object-cover"
              />
              <div className="absolute inset-x-0 top-0 px-4 pt-4">
                <div className="flex gap-1">
                  {selectedStory.moments.map((_, index) => (
                    <span
                      key={index}
                      className="flex-1 h-1 rounded-full bg-white/30"
                    >
                      <span
                        className={`block h-full bg-white transition-all ${
                          index <= currentMomentIndex ? "w-full" : "w-0"
                        }`}
                      />
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex">
                <button className="flex-1" onClick={handlePrevMoment}></button>
                <button className="flex-1" onClick={handleNextMoment}></button>
              </div>
            </div>
          </div>
        )}

        {/* Engagement Dashboard */}
        <div className="hidden md:block">
          <EngagementDashboard />
        </div>
      </div>
    </div>
  );
}

export default ForYou;
