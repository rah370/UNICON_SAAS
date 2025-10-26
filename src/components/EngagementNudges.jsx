import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function EngagementNudges() {
  const { user } = useAuth();
  const [nudges, setNudges] = useState([]);
  const [showNudges, setShowNudges] = useState(true);

  useEffect(() => {
    // Generate personalized nudges based on user behavior
    const generateNudges = () => {
      const userNudges = [
        {
          id: "nudge1",
          type: "community",
          title: "Join the CS315 Study Group!",
          message: "Your classmates are discussing the upcoming midterm. Join the conversation!",
          action: "Join Study Group",
          priority: "high",
          icon: "👥",
          color: "blue",
          dismissible: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        },
        {
          id: "nudge2",
          type: "profile",
          title: "Complete Your Profile",
          message: "Add your major and interests to connect with like-minded students.",
          action: "Complete Profile",
          priority: "medium",
          icon: "👤",
          color: "green",
          dismissible: true,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        },
        {
          id: "nudge3",
          type: "event",
          title: "Career Fair Tomorrow!",
          message: "Don't miss the annual career fair. 50+ companies will be recruiting.",
          action: "RSVP Now",
          priority: "high",
          icon: "🎯",
          color: "purple",
          dismissible: true,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 hours
        },
        {
          id: "nudge4",
          type: "marketplace",
          title: "Textbook Rental Available",
          message: "Save $80 by renting 'Data Structures & Algorithms' for this semester.",
          action: "Rent Now",
          priority: "medium",
          icon: "📚",
          color: "orange",
          dismissible: true,
          expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
        },
        {
          id: "nudge5",
          type: "tutoring",
          title: "Need Help with Calculus?",
          message: "Dr. Chen is offering tutoring sessions for MATH201 students.",
          action: "Book Session",
          priority: "medium",
          icon: "🎓",
          color: "indigo",
          dismissible: true,
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days
        },
        {
          id: "nudge6",
          type: "streak",
          title: "Keep Your Streak Going!",
          message: "You've been active for 5 days straight. Don't break the streak!",
          action: "Stay Active",
          priority: "low",
          icon: "🔥",
          color: "red",
          dismissible: true,
          expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        }
      ];

      // Filter nudges based on user preferences and behavior
      const activeNudges = userNudges.filter(nudge => {
        const now = new Date();
        return now < nudge.expiresAt;
      });

      setNudges(activeNudges.slice(0, 3)); // Show max 3 nudges
    };

    generateNudges();
  }, [user]);

  const handleNudgeAction = (nudgeId, action) => {
    // Handle nudge action
    console.log(`Nudge ${nudgeId} action: ${action}`);
    
    // Remove the nudge after action
    setNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
  };

  const handleDismissNudge = (nudgeId) => {
    setNudges(prev => prev.filter(nudge => nudge.id !== nudgeId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-yellow-200 bg-yellow-50";
      case "low":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getActionColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "green":
        return "bg-green-500 hover:bg-green-600";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600";
      case "orange":
        return "bg-orange-500 hover:bg-orange-600";
      case "indigo":
        return "bg-indigo-500 hover:bg-indigo-600";
      case "red":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  if (!showNudges || nudges.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm space-y-3">
      {nudges.map((nudge) => (
        <div
          key={nudge.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${getPriorityColor(nudge.priority)}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">{nudge.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 text-sm mb-1">
                {nudge.title}
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                {nudge.message}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNudgeAction(nudge.id, nudge.action)}
                  className={`px-3 py-1 rounded text-xs font-medium text-white transition-colors ${getActionColor(nudge.color)}`}
                >
                  {nudge.action}
                </button>
                {nudge.dismissible && (
                  <button
                    onClick={() => handleDismissNudge(nudge.id)}
                    className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDismissNudge(nudge.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {/* Nudge Controls */}
      <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
        <span className="text-xs text-slate-500">
          {nudges.length} notification{nudges.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => setShowNudges(false)}
          className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          Hide all
        </button>
      </div>
    </div>
  );
}

// Smart Nudge Component for specific contexts
function SmartNudge({ type, context, userBehavior }) {
  const [nudge, setNudge] = useState(null);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    // Generate contextual nudges based on user behavior and current context
    const generateContextualNudge = () => {
      const contextualNudges = {
        community: {
          inactive: {
            title: "Reconnect with Your Community",
            message: "You haven't posted in a while. Share what you're working on!",
            action: "Create Post",
            icon: "💬",
            color: "blue"
          },
          active: {
            title: "You're on Fire!",
            message: "Keep up the great engagement. Your posts are getting lots of attention.",
            action: "Keep Going",
            icon: "🔥",
            color: "red"
          }
        },
        calendar: {
          upcoming: {
            title: "Upcoming Assignment",
            message: "CS315 Project due in 3 days. Time to get started!",
            action: "View Details",
            icon: "📅",
            color: "orange"
          },
          overdue: {
            title: "Overdue Task",
            message: "You have 2 overdue assignments. Let's catch up!",
            action: "View Tasks",
            icon: "⚠️",
            color: "red"
          }
        },
        marketplace: {
          browsing: {
            title: "Found Something You Like?",
            message: "This textbook is 40% off compared to the bookstore price.",
            action: "Contact Seller",
            icon: "💰",
            color: "green"
          },
          selling: {
            title: "Boost Your Listing",
            message: "Add more photos to increase your chances of selling.",
            action: "Edit Listing",
            icon: "📸",
            color: "purple"
          }
        },
        messages: {
          unread: {
            title: "You Have Unread Messages",
            message: "Sarah sent you a message about the study group.",
            action: "Read Now",
            icon: "💌",
            color: "blue"
          },
          inactive: {
            title: "Stay Connected",
            message: "Your friends are asking about you. Send them a quick message!",
            action: "Send Message",
            icon: "📱",
            color: "green"
          }
        }
      };

      const nudgeConfig = contextualNudges[type]?.[context];
      if (nudgeConfig) {
        setNudge({
          id: `smart-${type}-${context}-${Date.now()}`,
          ...nudgeConfig,
          dismissible: true
        });
        setShowNudge(true);
      }
    };

    generateContextualNudge();
  }, [type, context, userBehavior]);

  const handleAction = () => {
    // Handle smart nudge action
    console.log(`Smart nudge action: ${nudge.action}`);
    setShowNudge(false);
  };

  const handleDismiss = () => {
    setShowNudge(false);
  };

  if (!showNudge || !nudge) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 max-w-sm">
      <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{nudge.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">
              {nudge.title}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              {nudge.message}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAction}
                className={`px-3 py-1 rounded text-xs font-medium text-white transition-colors ${
                  nudge.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600' :
                  nudge.color === 'green' ? 'bg-green-500 hover:bg-green-600' :
                  nudge.color === 'purple' ? 'bg-purple-500 hover:bg-purple-600' :
                  nudge.color === 'orange' ? 'bg-orange-500 hover:bg-orange-600' :
                  nudge.color === 'red' ? 'bg-red-500 hover:bg-red-600' :
                  'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {nudge.action}
              </button>
              {nudge.dismissible && (
                <button
                  onClick={handleDismiss}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export { EngagementNudges, SmartNudge };
