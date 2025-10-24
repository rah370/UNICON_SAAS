import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function ForYou() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: "f1",
          title: "Welcome back!",
          body: "Check the School Calendar for midterm schedules.",
          author: "Admin",
          timestamp: "2 hours ago",
          likes: 23,
          comments: 5,
        },
        {
          id: "f2",
          title: "Forum highlight: CS101",
          body: "Tips for debugging PHP on XAMPP.",
          author: "Professor Smith",
          timestamp: "4 hours ago",
          likes: 18,
          comments: 3,
        },
        {
          id: "f3",
          title: "Marketplace picks",
          body: "Preloved textbooks listed today.",
          author: "Student Services",
          timestamp: "6 hours ago",
          likes: 31,
          comments: 8,
        },
      ]);

      setEvents([
        {
          id: "e1",
          title: "Orientation",
          time: "Mon 9 AM",
          location: "Main Hall",
        },
        {
          id: "e2",
          title: "Career Fair",
          time: "Wed 2 PM",
          location: "Gymnasium",
        },
        {
          id: "e3",
          title: "Midterm Exams",
          time: "Fri 8 AM",
          location: "Various Rooms",
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
          <p className="text-slate-600">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.email?.split("@")[0]}!
          </h1>
          <p className="text-slate-600">
            Here's what's happening at {branding.name || "your school"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Share a moment
                  </h3>
                  <p className="text-sm text-slate-600">
                    What's happening in your student life?
                  </p>
                </div>
              </div>
              <button className="w-full rounded-xl border-2 border-dashed border-slate-300 py-4 text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                Click to create a post...
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">
                          {post.author}
                        </h4>
                        <span className="text-blue-500 text-sm">✓</span>
                      </div>
                      <p className="text-sm text-slate-600">{post.timestamp}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-800 mb-4">{post.body}</p>

                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <span className="text-red-500">♥</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <span className="text-blue-500">M</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="hover:text-green-500 transition-colors">
                      <span>📤</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  Upcoming Events
                </h3>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  View All
                </a>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-slate-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-slate-600">{event.time}</p>
                      <p className="text-xs text-slate-500">{event.location}</p>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-colors">
                      RSVP
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                  <div className="text-sm font-semibold mb-1">Posts</div>
                  <div className="text-xs text-slate-600">Create Post</div>
                </button>
                <button className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                  <div className="text-sm font-semibold mb-1">Forum</div>
                  <div className="text-xs text-slate-600">Join Forum</div>
                </button>
                <button className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                  <div className="text-sm font-semibold mb-1">Store</div>
                  <div className="text-xs text-slate-600">Marketplace</div>
                </button>
                <button className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
                  <div className="text-sm font-semibold mb-1">Report</div>
                  <div className="text-xs text-slate-600">Report Issue</div>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
              <p className="text-sm text-blue-800">
                Enable notifications in settings to never miss an announcement
                or event update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForYou;
