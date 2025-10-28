import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function AnalyticsDashboard() {
  const { user, isAdmin } = useAuth();
  const { branding } = useBranding();
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");
  const [showNudgesPanel, setShowNudgesPanel] = useState(false);

  useEffect(() => {
    // Simulate API call for enhanced analytics data
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalUsers: 1247,
          activeUsers: 892,
          totalPosts: 3456,
          totalEvents: 23,
          marketplaceItems: 156,
          reports: 12,
          tutoringSessions: 89,
          textbookRentals: 234,
          engagementScore: 78,
          retentionRate: 85
        },
        userEngagement: {
          dailyActiveUsers: [45, 52, 48, 61, 55, 67, 59],
          weeklyPosts: [23, 45, 34, 56, 78, 89, 67],
          monthlyEvents: [12, 15, 18, 22, 19, 25, 23],
          sessionDuration: [12, 15, 18, 22, 19, 25, 23],
          bounceRate: [35, 32, 28, 25, 22, 20, 18]
        },
        topContent: [
          { title: "Midterm Exam Schedule", views: 1250, likes: 89, shares: 23, comments: 45 },
          { title: "Career Fair Announcement", views: 980, likes: 67, shares: 18, comments: 32 },
          { title: "Library Renovation Update", views: 756, likes: 45, shares: 12, comments: 28 },
          { title: "Student Council Elections", views: 634, likes: 78, shares: 15, comments: 41 },
          { title: "Sports Day Results", views: 523, likes: 34, shares: 8, comments: 19 },
        ],
        userActivity: [
          { time: "9:00 AM", users: 45, posts: 12, messages: 23 },
          { time: "10:00 AM", users: 67, posts: 18, messages: 34 },
          { time: "11:00 AM", users: 89, posts: 23, messages: 45 },
          { time: "12:00 PM", users: 78, posts: 15, messages: 28 },
          { time: "1:00 PM", users: 56, posts: 9, messages: 19 },
          { time: "2:00 PM", users: 72, posts: 21, messages: 38 },
          { time: "3:00 PM", users: 95, posts: 28, messages: 52 },
          { time: "4:00 PM", users: 83, posts: 19, messages: 41 },
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
        engagementInsights: {
          peakHours: "3:00 PM - 4:00 PM",
          mostActiveDay: "Tuesday",
          topFeatures: ["Community", "Messages", "Calendar"],
          userJourney: {
            newUserRetention: 72,
            weeklyActiveUsers: 68,
            monthlyActiveUsers: 85
          }
        },
        nudges: {
          activeNudges: 12,
          successfulNudges: 8,
          pendingNudges: 4,
          nudgeTypes: [
            { type: "Join Community", count: 45, successRate: 78 },
            { type: "Complete Profile", count: 23, successRate: 65 },
            { type: "Attend Event", count: 34, successRate: 82 },
            { type: "Use Marketplace", count: 18, successRate: 71 }
          ]
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  const getEngagementColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getEngagementLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Advanced Analytics Dashboard
              </h1>
              <p className="text-slate-600">
                Comprehensive insights and engagement metrics for {branding.name || "your school"}
              </p>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={() => setShowNudgesPanel(!showNudgesPanel)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                📊 Engagement Nudges
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Overview Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.totalUsers?.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#e1e6ed] rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
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
                <p className="text-sm text-slate-600">Engagement Score</p>
                <p className={`text-3xl font-bold ${getEngagementColor(analytics.overview?.engagementScore)}`}>
                  {analytics.overview?.engagementScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-600">
              <span>{getEngagementLabel(analytics.overview?.engagementScore)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Retention Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {analytics.overview?.retentionRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <span>↗</span>
              <span>+5% from last month</span>
            </div>
          </div>
        </div>

        {/* Engagement Insights */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              📊 Engagement Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-[#708090]/10 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Peak Activity Hours</p>
                  <p className="text-xs text-slate-600">{analytics.engagementInsights?.peakHours}</p>
                </div>
                <span className="text-2xl">⏰</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Most Active Day</p>
                  <p className="text-xs text-slate-600">{analytics.engagementInsights?.mostActiveDay}</p>
                </div>
                <span className="text-2xl">📅</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900">Top Features</p>
                  <p className="text-xs text-slate-600">{analytics.engagementInsights?.topFeatures?.join(", ")}</p>
                </div>
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              🎯 User Journey Metrics
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>New User Retention</span>
                  <span>{analytics.engagementInsights?.userJourney?.newUserRetention}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#708090] h-2 rounded-full"
                    style={{ width: `${analytics.engagementInsights?.userJourney?.newUserRetention}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Weekly Active Users</span>
                  <span>{analytics.engagementInsights?.userJourney?.weeklyActiveUsers}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#708090] h-2 rounded-full"
                    style={{ width: `${analytics.engagementInsights?.userJourney?.weeklyActiveUsers}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Monthly Active Users</span>
                  <span>{analytics.engagementInsights?.userJourney?.monthlyActiveUsers}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${analytics.engagementInsights?.userJourney?.monthlyActiveUsers}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              🚀 Nudge Performance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Active Nudges</span>
                <span className="text-lg font-semibold text-[#4a5a68]">{analytics.nudges?.activeNudges}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Success Rate</span>
                <span className="text-lg font-semibold text-green-600">
                  {Math.round((analytics.nudges?.successfulNudges / analytics.nudges?.activeNudges) * 100)}%
                </span>
              </div>
              <div className="space-y-2">
                {analytics.nudges?.nudgeTypes?.map((nudge, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{nudge.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{nudge.count}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        nudge.successRate >= 75 ? 'bg-green-100 text-green-800' :
                        nudge.successRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {nudge.successRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* User Engagement Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              User Engagement Trends
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Daily Active Users</span>
                  <span>892 avg</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#708090] h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Session Duration (min)</span>
                  <span>18 avg</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#708090] h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Bounce Rate</span>
                  <span>18%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-[#708090] h-2 rounded-full"
                    style={{ width: "18%" }}
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
                      <span>{content.shares} shares</span>
                      <span>{content.comments} comments</span>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {idx === 0 && "🥇"}
                    {idx === 1 && "🥈"}
                    {idx === 2 && "🥉"}
                    {idx > 2 && "📊"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
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
                    <div className="w-2 h-2 bg-[#708090] rounded-full"></div>
                    <span className="text-sm font-medium text-slate-900">
                      {activity.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span>{activity.users} users</span>
                    <span>{activity.posts} posts</span>
                    <span>{activity.messages} messages</span>
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
                        className="bg-[#708090] h-2 rounded-full"
                        style={{ width: `${level.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Nudges Panel */}
        {showNudgesPanel && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">
              🎯 Engagement Nudges Management
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Join Community</h3>
                <p className="text-sm text-slate-600 mb-3">Encourage new users to participate in community discussions</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 78%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Complete Profile</h3>
                <p className="text-sm text-slate-600 mb-3">Remind users to complete their profile information</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 65%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Attend Events</h3>
                <p className="text-sm text-slate-600 mb-3">Notify users about upcoming campus events</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 82%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Use Marketplace</h3>
                <p className="text-sm text-slate-600 mb-3">Promote marketplace features to increase usage</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 71%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Study Groups</h3>
                <p className="text-sm text-slate-600 mb-3">Suggest joining study groups based on courses</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 68%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">Tutoring Services</h3>
                <p className="text-sm text-slate-600 mb-3">Recommend tutoring based on academic performance</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Success Rate: 74%</span>
                  <button className="px-3 py-1 bg-[#708090] text-white rounded text-xs hover:bg-[#708090]">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Export & Reports
          </h2>
          <div className="flex gap-4 flex-wrap">
            <button className="px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-[#708090] transition-colors">
              Export CSV
            </button>
            <button className="px-4 py-2 rounded-lg bg-[#708090] text-white hover:bg-[#5a6a78] transition-colors">
              Export PDF Report
            </button>
            <button className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors">
              Engagement Report
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              Schedule Reports
            </button>
            <button className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              Share Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;