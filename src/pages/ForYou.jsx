import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { EngagementDashboard } from "../components/EngagementDashboard";

const quickStats = [
  { label: "Focus tasks", value: "2", meta: "Due this week" },
  { label: "Events", value: "3", meta: "RSVP today" },
  { label: "Communities", value: "7", meta: "Active" },
];

const focusTasks = [
  {
    id: 1,
    title: "Complete Math Assignment",
    detail: "Due tomorrow at 11:59 PM",
    tone: "from-sky-500/20 to-sky-500/10",
    badge: "Priority",
  },
  {
    id: 2,
    title: "Study for Chemistry Test",
    detail: "Test on Friday",
    tone: "from-emerald-500/20 to-emerald-500/10",
    badge: "Reminder",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "CS315 Study Group",
    time: "Today · 7:30 PM",
    location: "Library Basement",
  },
  {
    id: 2,
    title: "Spring Festival RSVP",
    time: "Tomorrow · 4:00 PM",
    location: "Campus Quad",
  },
];

const quickLinks = [
  { label: "Campus Pulse", href: "/community", emoji: "🌐" },
  { label: "Schedule", href: "/calendar", emoji: "🗓️" },
  { label: "Marketplace", href: "/marketplace", emoji: "🛍️" },
];

const activityFeed = [
  {
    id: 1,
    title: "New post in CS315 channel",
    detail: "\"Anyone want to study for midterm?\"",
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
    isAddButton: true,
    hasNewStory: false,
  },
  {
    id: 2,
    label: "Erin",
    initials: "E",
    color: "from-pink-400 to-pink-600",
    hasNewStory: true,
    moments: [
      {
        id: 1,
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
        id: 5,
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
        id: 6,
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
        id: 7,
        image: "https://picsum.photos/300/400?random=7",
        timestamp: "4h ago",
      },
    ],
  },
];

function ForYou() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const firstName = user?.first_name || user?.name?.split(" ")[0] || "Friend";

  const [stories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  const handleStoryClick = (story) => {
    if (story.isAddButton) {
      alert("Add new story feature coming soon!");
      return;
    }

    if (story.moments?.length) {
      setSelectedStory(story);
      setCurrentMomentIndex(0);
      setShowStoryViewer(true);
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
                  style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}
                >
                  View calendar
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {quickStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
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
            <button className="text-sm font-semibold text-[#4a5a68]">View all</button>
          </div>
          <div className="mt-3 flex space-x-3 overflow-x-auto pb-1">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => handleStoryClick(story)}
                className="flex-shrink-0 text-center"
              >
                <div className="relative">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${story.color} text-white font-semibold shadow-md transition hover:scale-105 ${
                      story.hasNewStory && !story.isAddButton
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : ""
                    }`}
                  >
                    {story.initials}
                  </div>
                  {story.hasNewStory && !story.isAddButton && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#708090] border-2 border-white" />
                  )}
                </div>
                <p className="mt-1 text-xs font-medium text-slate-600">{story.label}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Main grid */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900">Today's focus</h3>
              <div className="mt-4 space-y-3">
                {focusTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border border-slate-100 bg-gradient-to-r ${task.tone} px-4 py-3`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {task.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{task.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900">Recent activity</h3>
              <div className="mt-4 space-y-3">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-base">
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-lg">
              <h3 className="text-base font-semibold text-slate-900">Upcoming</h3>
              <div className="mt-4 space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-600">{event.time}</p>
                    <p className="text-xs text-slate-500">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {resourceCards.map((card) => (
                <div
                  key={card.id}
                  className={`rounded-2xl border border-white/70 bg-gradient-to-br ${card.tone} p-4 shadow-lg`}
                >
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
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
              <p className="text-sm font-semibold text-slate-900">{link.label}</p>
            </Link>
          ))}
        </section>

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
