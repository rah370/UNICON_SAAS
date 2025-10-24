import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function AnalyticsDashboard() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call for analytics data
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalUsers: 1247,
          activeUsers: 892,
          totalPosts: 3456,
          totalEvents: 23,
          marketplaceItems: 156,
          reports: 12,
        },
        userEngagement: {
          dailyActiveUsers: [45, 52, 48, 61, 55, 67, 59],
          weeklyPosts: [23, 45, 34, 56, 78, 89, 67],
          monthlyEvents: [12, 15, 18, 22, 19, 25, 23],
        },
        topContent: [
          { title: "Midterm Exam Schedule", views: 1250, likes: 89 },
          { title: "Career Fair Announcement", views: 980, likes: 67 },
          { title: "Library Renovation Update", views: 756, likes: 45 },
          { title: "Student Council Elections", views: 634, likes: 78 },
          { title: "Sports Day Results", views: 523, likes: 34 },
        ],
        userActivity: [
          { time: "9:00 AM", users: 45, posts: 12 },
          { time: "10:00 AM", users: 67, posts: 18 },
          { time: "11:00 AM", users: 89, posts: 23 },
          { time: "12:00 PM", users: 78, posts: 15 },
          { time: "1:00 PM", users: 56, posts: 9 },
          { time: "2:00 PM", users: 72, posts: 21 },
          { time: "3:00 PM", users: 95, posts: 28 },
          { time: "4:00 PM", users: 83, posts: 19 },
        ],
        demographics: {
          yearLevels: [
            { level: "Freshman", count: 234, percentage: 18.8 },
            { level: "Sophomore", count: 198, percentage: 15.9 },
            { level: "Junior", count: 312, percentage: 25.0 },
            { level: "Senior", count: 287, percentage: 23.0 },
            { level: "Graduate", count: 216, percentage: 17.3 },
          ],
          majors: [
            { major: "Computer Science", count: 156, percentage: 12.5 },
            { major: "Engineering", count: 134, percentage: 10.7 },
            { major: "Business", count: 123, percentage: 9.9 },
            { major: "Medicine", count: 98, percentage: 7.9 },
            { major: "Arts", count: 87, percentage: 7.0 },
          ],
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            Insights and metrics for {branding.name || "your school"}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Overview Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.totalUsers?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">
                  Users
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↗</span>
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.activeUsers?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↗</span>
              <span>+8% from last week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Posts</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.totalPosts?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-green-600">
                  Posts
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↗</span>
              <span>+23% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Events</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.totalEvents}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-orange-600">
                  Events
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-600">
              <span>3 upcoming this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Marketplace Items</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.marketplaceItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold text-yellow-600">
                  Store
                </span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↗</span>
              <span>+5 new today</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Reports</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.reports}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <span>2 require attention</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Engagement Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              User Engagement (Last 7 Days)
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Daily Active Users</span>
                  <span>892 avg</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Weekly Posts</span>
                  <span>456 total</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Monthly Events</span>
                  <span>23 total</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "82%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Content */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Top Performing Content
            </h2>
            <div className="space-y-4">
              {analytics.topContent?.map((content, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 text-sm">
                      {content.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span>{content.views} views</span>
                      <span>{content.likes} likes</span>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {idx === 0 && "1st"}
                    {idx === 1 && "2nd"}
                    {idx === 2 && "3rd"}
                    {idx > 2 && "Chart"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              User Demographics
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Year Levels</h3>
                {analytics.demographics?.yearLevels?.map((level, idx) => (
                  <div key={idx} className="mb-2">
                    <div className="flex justify-between text-sm text-slate-600 mb-1">
                      <span>{level.level}</span>
                      <span>
                        {level.count} ({level.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${level.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              Real-time Activity
            </h2>
            <div className="space-y-3">
              {analytics.userActivity?.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      {activity.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{activity.users} users online</span>
                    <span>{activity.posts} new posts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Export Analytics
          </h2>
          <div className="flex gap-4">
            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors">
              Export PDF Report
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              Schedule Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
