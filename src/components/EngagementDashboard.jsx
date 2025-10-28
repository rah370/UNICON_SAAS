import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

// Engagement Streaks Component
export function EngagementStreaks() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [streaks, setStreaks] = useState({
    dailyLogin: 0,
    communityPosts: 0,
    messagesSent: 0,
    marketplaceActivity: 0,
    calendarUsage: 0,
  });

  useEffect(() => {
    // Simulate loading user streaks
    setStreaks({
      dailyLogin: 7,
      communityPosts: 3,
      messagesSent: 5,
      marketplaceActivity: 2,
      calendarUsage: 4,
    });
  }, [user]);

  const streakCategories = [
    {
      name: "Daily Login",
      streak: streaks.dailyLogin,
      icon: "🔥",
      color: "from-red-500 to-orange-500",
      description: "Days in a row",
    },
    {
      name: "Community Posts",
      streak: streaks.communityPosts,
      icon: "💬",
      color: "from-blue-500 to-purple-500",
      description: "Posts this week",
    },
    {
      name: "Messages Sent",
      streak: streaks.messagesSent,
      icon: "📱",
      color: "from-green-500 to-teal-500",
      description: "Messages today",
    },
    {
      name: "Marketplace Activity",
      streak: streaks.marketplaceActivity,
      icon: "🛒",
      color: "from-yellow-500 to-orange-500",
      description: "Activities this week",
    },
    {
      name: "Calendar Usage",
      streak: streaks.calendarUsage,
      icon: "📅",
      color: "from-purple-500 to-pink-500",
      description: "Days this month",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          🔥 Your Engagement Streaks
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-[#d0d7df] rounded-lg transition-colors"
        >
          <span>{isCollapsed ? "Show" : "Hide"}</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {streakCategories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg bg-gradient-to-r ${category.color} text-white relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-2xl font-bold">
                      {category.streak}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs opacity-90">{category.description}</p>
                </div>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Streak Milestones */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3">
              🎯 Streak Milestones
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  Next milestone: 10-day login streak
                </span>
                <span className="text-[#4a5a68] font-medium">3 days to go!</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-[#708090] h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Spotlight Cards Component
export function SpotlightCards() {
  const [spotlightUsers, setSpotlightUsers] = useState([]);

  useEffect(() => {
    // Simulate loading spotlight users
    setSpotlightUsers([
      {
        id: 1,
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        achievement: "Top Contributor",
        description: "Helped 15 students this week",
        badge: "🌟",
        stats: { posts: 23, likes: 156, comments: 89 },
      },
      {
        id: 2,
        name: "Mike Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        achievement: "Study Group Leader",
        description: "Organized 3 successful study sessions",
        badge: "📚",
        stats: { events: 3, participants: 45, rating: 4.9 },
      },
      {
        id: 3,
        name: "Emily Johnson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        achievement: "Marketplace Star",
        description: "Sold 8 items this month",
        badge: "🛒",
        stats: { sales: 8, rating: 5.0, reviews: 12 },
      },
    ]);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        ⭐ Campus Spotlight
      </h2>
      <div className="space-y-4">
        {spotlightUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                  {user.badge}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{user.name}</h3>
                  <span className="px-2 py-1 bg-[#e1e6ed] text-blue-800 text-xs font-medium rounded-full">
                    {user.achievement}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {user.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  {Object.entries(user.stats).map(([key, value]) => (
                    <span key={key}>
                      <span className="font-medium">{value}</span> {key}
                    </span>
                  ))}
                </div>
              </div>
              <button className="px-3 py-1 bg-[#708090] text-white text-xs rounded-lg hover:bg-[#708090] transition-colors">
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Leaderboard */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-slate-900 mb-3">
          🏆 Weekly Leaderboard
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">🥇</span>
              <span className="font-medium">Sarah Chen</span>
            </div>
            <span className="text-slate-600">156 points</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">🥈</span>
              <span className="font-medium">Mike Rodriguez</span>
            </div>
            <span className="text-slate-600">134 points</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">🥉</span>
              <span className="font-medium">Emily Johnson</span>
            </div>
            <span className="text-slate-600">98 points</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Student-Driven Polls Component
export function StudentPolls() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
    duration: "24h",
    category: "general",
  });

  useEffect(() => {
    // Simulate loading polls
    setPolls([
      {
        id: 1,
        question: "What's your favorite study spot on campus?",
        options: [
          { text: "Library", votes: 45, percentage: 45 },
          { text: "Student Center", votes: 30, percentage: 30 },
          { text: "Coffee Shop", votes: 20, percentage: 20 },
          { text: "Dorm Room", votes: 5, percentage: 5 },
        ],
        totalVotes: 100,
        author: "Alex Chen",
        category: "campus",
        createdAt: "2 hours ago",
        expiresAt: "22 hours left",
        userVoted: false,
      },
      {
        id: 2,
        question: "Which club should we start next semester?",
        options: [
          { text: "Photography Club", votes: 25, percentage: 35 },
          { text: "Debate Society", votes: 20, percentage: 28 },
          { text: "Coding Bootcamp", votes: 15, percentage: 21 },
          { text: "Art Collective", votes: 11, percentage: 16 },
        ],
        totalVotes: 71,
        author: "Student Council",
        category: "clubs",
        createdAt: "1 day ago",
        expiresAt: "6 days left",
        userVoted: true,
      },
    ]);
  }, []);

  const handleVote = (pollId, optionIndex) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id === pollId && !poll.userVoted) {
          const newOptions = poll.options.map((option, index) => {
            if (index === optionIndex) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          const newTotalVotes = poll.totalVotes + 1;
          const updatedOptions = newOptions.map((option) => ({
            ...option,
            percentage: Math.round((option.votes / newTotalVotes) * 100),
          }));

          return {
            ...poll,
            options: updatedOptions,
            totalVotes: newTotalVotes,
            userVoted: true,
          };
        }
        return poll;
      })
    );
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (
      newPoll.question &&
      newPoll.options.filter((opt) => opt.trim()).length >= 2
    ) {
      const poll = {
        id: Date.now(),
        question: newPoll.question,
        options: newPoll.options
          .filter((opt) => opt.trim())
          .map((opt) => ({ text: opt.trim(), votes: 0, percentage: 0 })),
        totalVotes: 0,
        author: user?.name || "Anonymous",
        category: newPoll.category,
        createdAt: "Just now",
        expiresAt: `${newPoll.duration} left`,
        userVoted: false,
      };

      setPolls((prev) => [poll, ...prev]);
      setNewPoll({
        question: "",
        options: ["", ""],
        duration: "24h",
        category: "general",
      });
      setShowCreatePoll(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          📊 Student Polls
        </h2>
        <button
          onClick={() => setShowCreatePoll(true)}
          className="px-4 py-2 bg-[#708090] text-white rounded-lg text-sm font-medium hover:bg-[#708090] transition-colors"
        >
          Create Poll
        </button>
      </div>

      <div className="space-y-6">
        {polls.map((poll) => (
          <div key={poll.id} className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">by {poll.author}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                  {poll.category}
                </span>
              </div>
              <div className="text-xs text-slate-500">{poll.expiresAt}</div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-4">
              {poll.question}
            </h3>

            <div className="space-y-2 mb-4">
              {poll.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleVote(poll.id, index)}
                  disabled={poll.userVoted}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    poll.userVoted
                      ? "bg-[#708090]/10 border border-blue-200"
                      : "bg-slate-50 hover:bg-[#d0d7df]"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{option.text}</span>
                    {poll.userVoted && (
                      <span className="text-xs text-slate-500">
                        {option.percentage}%
                      </span>
                    )}
                  </div>
                  {poll.userVoted && (
                    <div className="bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-[#708090] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{poll.totalVotes} votes</span>
              <span>{poll.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Poll Modal */}
      {showCreatePoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Create New Poll
            </h3>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={newPoll.question}
                  onChange={(e) =>
                    setNewPoll({ ...newPoll, question: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What would you like to ask?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Options
                </label>
                {newPoll.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setNewPoll({
                      ...newPoll,
                      options: [...newPoll.options, ""],
                    })
                  }
                  className="text-sm text-[#4a5a68] hover:text-[#3c4b58]"
                >
                  + Add Option
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Duration
                  </label>
                  <select
                    value={newPoll.duration}
                    onChange={(e) =>
                      setNewPoll({ ...newPoll, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1h">1 Hour</option>
                    <option value="24h">24 Hours</option>
                    <option value="3d">3 Days</option>
                    <option value="1w">1 Week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newPoll.category}
                    onChange={(e) =>
                      setNewPoll({ ...newPoll, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General</option>
                    <option value="campus">Campus</option>
                    <option value="academic">Academic</option>
                    <option value="clubs">Clubs</option>
                    <option value="events">Events</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreatePoll(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#708090] text-white rounded-lg hover:bg-[#5a6a78] transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Engagement Dashboard Component
export function EngagementDashboard() {
  return (
    <div className="space-y-6">
      <EngagementStreaks />
      <div className="grid gap-6 lg:grid-cols-2">
        <SpotlightCards />
        <StudentPolls />
      </div>
    </div>
  );
}

export default EngagementDashboard;
