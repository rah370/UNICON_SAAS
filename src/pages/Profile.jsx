import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Profile() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get user profile
    setTimeout(() => {
      setProfile({
        id: user?.email,
        name: user?.email?.split("@")[0] || "Student",
        year: "Junior",
        major: "Computer Science",
        avatar: "👤",
        bio: "Passionate about technology and learning new things!",
        interests: ["Programming", "Web Development", "AI", "Gaming"],
        joinDate: "2023-09-01",
        posts: 24,
        followers: 156,
        following: 89,
        verified: true,
      });
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{profile.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span className="text-blue-500 text-xl">✓</span>
                )}
              </div>
              <p className="text-slate-600 mb-1">
                {profile.year} • {profile.major}
              </p>
              <p className="text-sm text-slate-500">
                Joined {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <p className="text-slate-700 mt-3">{profile.bio}</p>
            </div>
            <button className="px-6 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Activity Overview
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.posts}
                  </div>
                  <div className="text-sm text-slate-600">Posts</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.followers}
                  </div>
                  <div className="text-sm text-slate-600">Followers</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-slate-900">
                    {profile.following}
                  </div>
                  <div className="text-sm text-slate-600">Following</div>
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    content:
                      "Just finished my final project! The coding marathon was worth it. #CSstudent #coding",
                    timestamp: "2 hours ago",
                    likes: 23,
                    comments: 5,
                    image: null,
                    tags: ["#CSstudent", "#coding"],
                  },
                  {
                    id: 2,
                    content:
                      "Coffee break between classes ☕ Found this amazing new study spot in the library!",
                    timestamp: "4 hours ago",
                    likes: 18,
                    comments: 3,
                    image: "📚",
                    tags: ["#study", "#coffee"],
                  },
                  {
                    id: 3,
                    content:
                      "Built my first robot today! 🤖 Engineering lab was incredible. Can't wait for robotics club!",
                    timestamp: "6 hours ago",
                    likes: 31,
                    comments: 8,
                    image: "🤖",
                    tags: ["#engineering", "#robotics"],
                  },
                ].map((post) => (
                  <div
                    key={post.id}
                    className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-slate-800 mb-3">{post.content}</p>
                    {post.image && (
                      <div className="text-4xl mb-3 text-center">
                        {post.image}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{post.timestamp}</span>
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <span className="text-red-500">♥</span>
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                        <span className="text-blue-500">M</span>
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interests */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* School Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                School Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-slate-600">School:</span>
                  <p className="font-medium text-slate-900">
                    {branding.name || "UNICON University"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Year Level:</span>
                  <p className="font-medium text-slate-900">{profile.year}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Major:</span>
                  <p className="font-medium text-slate-900">{profile.major}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Student ID:</span>
                  <p className="font-medium text-slate-900">{profile.id}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">Edit</span>
                    <span>Edit Profile</span>
                  </div>
                </button>
                <button className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔒</span>
                    <span>Privacy Settings</span>
                  </div>
                </button>
                <button className="w-full p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">Notify</span>
                    <span>Notification Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
