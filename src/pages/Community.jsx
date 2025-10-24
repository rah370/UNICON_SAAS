import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Community() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setForums([
        {
          id: "cs101",
          title: "CS101 - Introduction to Programming",
          description:
            "Discussion forum for CS101 students. Share tips, ask questions, and collaborate!",
          members: 156,
          posts: 89,
          lastActivity: "2 hours ago",
          category: "Academic",
          pinned: true,
        },
        {
          id: "gaming",
          title: "Gaming Club",
          description:
            "Connect with fellow gamers! Share gaming tips, organize tournaments, and find gaming buddies.",
          members: 234,
          posts: 156,
          lastActivity: "1 hour ago",
          category: "Clubs",
          pinned: false,
        },
        {
          id: "study-group",
          title: "Study Group Finder",
          description:
            "Find study partners for your courses. Organize study sessions and share resources.",
          members: 89,
          posts: 45,
          lastActivity: "3 hours ago",
          category: "Study",
          pinned: false,
        },
        {
          id: "tech-talk",
          title: "Tech Talk",
          description:
            "Discuss the latest in technology, programming languages, and tech trends.",
          members: 178,
          posts: 67,
          lastActivity: "4 hours ago",
          category: "Technology",
          pinned: false,
        },
        {
          id: "career",
          title: "Career Development",
          description:
            "Share internship opportunities, career advice, and professional development tips.",
          members: 123,
          posts: 34,
          lastActivity: "5 hours ago",
          category: "Career",
          pinned: false,
        },
        {
          id: "general",
          title: "General Discussion",
          description:
            "General chat about campus life, events, and anything else!",
          members: 456,
          posts: 234,
          lastActivity: "30 minutes ago",
          category: "General",
          pinned: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading communities...</p>
        </div>
      </div>
    );
  }

  const categories = [
    "All",
    "Academic",
    "Clubs",
    "Study",
    "Technology",
    "Career",
    "General",
  ];

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Community</h1>
          <p className="text-slate-600">
            Join discussions, share ideas, and connect with fellow students
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search forums..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    category === "All"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Create Forum Button */}
        <div className="mb-6">
          <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all">
            + Create New Forum
          </button>
        </div>

        {/* Forums Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {forums.map((forum) => (
            <div
              key={forum.id}
              className={`bg-white rounded-xl border p-6 hover:shadow-md transition-all cursor-pointer ${
                forum.pinned ? "border-blue-200 bg-blue-50" : "border-slate-200"
              }`}
            >
              {forum.pinned && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600">📌</span>
                  <span className="text-sm font-medium text-blue-700">
                    Pinned
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {forum.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {forum.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{forum.members} members</span>
                    <span>{forum.posts} posts</span>
                    <span>Last activity: {forum.lastActivity}</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                  {forum.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">G</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-slate-900">
                      Active Community
                    </p>
                    <p className="text-slate-500">{forum.members} members</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors text-sm font-medium">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Topics */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Popular Topics
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Midterm Exam Tips",
              "Best Study Spots on Campus",
              "Programming Help Needed",
              "Gaming Tournament This Weekend",
              "Internship Opportunities",
              "Career Fair Preparation",
            ].map((topic, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <p className="font-medium text-slate-900">{topic}</p>
                <p className="text-sm text-slate-500">12 discussions</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
