import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Profile() {
  const { user, logout } = useAuth();
  const { branding } = useBranding();
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
      content: "Finished our app pitch today! 🚀",
      imageUrl:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      likes: 23,
      comments: 5,
      timestamp: "2 hours ago",
      canDelete: true,
    },
    {
      id: 2,
      content: "Joined CS315 Study Group",
      likes: 12,
      comments: 3,
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
    // Here you would typically save to backend
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
    { id: "posts", label: "Posts" },
    { id: "about", label: "About" },
    { id: "clubs", label: "Clubs" },
    { id: "badges", label: "Badges" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
              U
            </div>
            <span className="font-semibold text-slate-900">
              UNICON School Platform
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="h-4 w-4 text-slate-600"
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {initials(user?.name)}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="relative bg-white px-4 py-6 lg:px-0 lg:py-8">
        {/* Background Image */}
        {backgroundPic && (
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10">
            <img
              src={backgroundPic}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-start gap-4 lg:gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold flex-shrink-0 overflow-hidden">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials(profileData.name)
                )}
              </div>
              {/* Profile Pic Upload Button */}
              <button
                onClick={() => profilePicRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-blue-600 transition-colors"
                title="Change profile picture"
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

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 lg:mb-2">
                <h1 className="text-xl lg:text-3xl font-bold text-slate-900 truncate">
                  {profileData.name}
                </h1>
                <div className="h-5 w-5 lg:h-6 lg:w-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-3 w-3 lg:h-4 lg:w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="hidden lg:block px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <p className="text-sm lg:text-lg text-slate-600 mb-1 lg:mb-2">
                @{user?.email?.split("@")[0] || "username"}
              </p>
              <p className="text-sm lg:text-base text-slate-500 mb-2 lg:mb-2">
                {profileData.major}, {profileData.year} •{" "}
                {branding?.name || "UNICON University"}
              </p>

              <div className="flex items-center gap-4 text-xs lg:text-sm text-slate-500 mb-3 lg:mb-4">
                <div className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3 lg:h-4 lg:w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="h-3 w-3 lg:h-4 lg:w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{formatDate(user?.joinDate)}</span>
                </div>
              </div>

              {/* Status */}
              <p className="text-sm lg:text-base text-slate-700 italic mb-3 lg:mb-4">
                "{profileData.bio}"
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Dean's Lister
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  CS Club Officer
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Volunteer
                </span>
              </div>

              {/* Background Image Upload */}
              <div className="mb-4">
                <button
                  onClick={() => backgroundPicRef.current?.click()}
                  className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  {backgroundPic ? "Change Background" : "Add Background"}
                </button>
                <input
                  ref={backgroundPicRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundPicUpload}
                  className="hidden"
                />
              </div>

              {/* Mobile Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="lg:hidden w-full px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-sm mb-4"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-lg lg:text-2xl font-bold text-slate-900">
                    24
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-2xl font-bold text-slate-900">
                    156
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg lg:text-2xl font-bold text-slate-900">
                    89
                  </div>
                  <div className="text-xs lg:text-sm text-slate-500">
                    Following
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-0">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600"
                    : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto flex items-center px-2">
              <button className="px-3 lg:px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors">
                New +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-4 lg:py-6">
        {activeTab === "posts" && (
          <div className="space-y-4 lg:space-y-6">
            {/* Recent Posts */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4">
                Recent Posts
              </h2>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="border-b border-slate-100 pb-4 last:border-none last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs lg:text-sm font-bold overflow-hidden">
                        {profilePic ? (
                          <img
                            src={profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          initials(profileData.name)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm lg:text-base">
                              {profileData.name}
                            </span>
                            <span className="text-xs lg:text-sm text-slate-500">
                              {post.timestamp}
                            </span>
                          </div>
                          {post.canDelete && (
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete post"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                        <p className="text-sm lg:text-base text-slate-800 mb-2">
                          {post.content}
                        </p>
                        {post.imageUrl && (
                          <div className="bg-slate-50 rounded-lg p-3 lg:p-4">
                            <img
                              src={post.imageUrl}
                              alt="Post"
                              className="w-full h-24 lg:h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs lg:text-sm text-slate-500">
                          <button className="hover:text-red-500 flex items-center gap-1">
                            ♥ {post.likes}
                          </button>
                          <button className="hover:text-blue-500 flex items-center gap-1">
                            💬 {post.comments}
                          </button>
                          <button className="hover:text-green-500 flex items-center gap-1">
                            🔄 Share
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4">
              About
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm lg:text-base">
                  Bio
                </h3>
                <p className="text-sm lg:text-base text-slate-600">
                  {profileData.bio}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm lg:text-base">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm lg:text-base">
                  Contact
                </h3>
                <p className="text-sm lg:text-base text-slate-600">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "clubs" && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4">
              Clubs & Organizations
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm lg:text-base">
                  Computer Science Club
                </h3>
                <p className="text-xs lg:text-sm text-slate-600 mb-2">
                  Officer
                </p>
                <p className="text-xs text-slate-500">
                  Active member since 2023
                </p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2 text-sm lg:text-base">
                  Debate Society
                </h3>
                <p className="text-xs lg:text-sm text-slate-600 mb-2">Member</p>
                <p className="text-xs text-slate-500">
                  Active member since 2023
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "badges" && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold text-slate-900 mb-4">
              Achievements & Badges
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border border-slate-200 rounded-lg">
                <div className="text-2xl lg:text-3xl mb-2">🏆</div>
                <h3 className="font-semibold text-slate-900 text-sm lg:text-base">
                  Dean's Lister
                </h3>
                <p className="text-xs lg:text-sm text-slate-600">
                  Academic Excellence
                </p>
              </div>
              <div className="text-center p-4 border border-slate-200 rounded-lg">
                <div className="text-2xl lg:text-3xl mb-2">👨‍💻</div>
                <h3 className="font-semibold text-slate-900 text-sm lg:text-base">
                  CS Club Officer
                </h3>
                <p className="text-xs lg:text-sm text-slate-600">Leadership</p>
              </div>
              <div className="text-center p-4 border border-slate-200 rounded-lg">
                <div className="text-2xl lg:text-3xl mb-2">🤝</div>
                <h3 className="font-semibold text-slate-900 text-sm lg:text-base">
                  Volunteer
                </h3>
                <p className="text-xs lg:text-sm text-slate-600">
                  Community Service
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Editing Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Major */}
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Year
                  </label>
                  <select
                    value={profileData.year}
                    onChange={(e) =>
                      setProfileData({ ...profileData, year: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center gap-1"
                      >
                        {interest}
                        <button
                          onClick={() => handleRemoveInterest(interest)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add interest..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddInterest(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        handleAddInterest(input.value);
                        input.value = "";
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
