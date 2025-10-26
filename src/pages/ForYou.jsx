import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { EngagementDashboard } from "../components/EngagementDashboard";
import { Link } from "react-router-dom";

function ForYou() {
  const { user } = useAuth();
  const { branding } = useBranding();

  // Stories state
  const [stories, setStories] = useState([
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
      avatar: "https://i.pravatar.cc/64?img=1",
      moments: [
        {
          id: 1,
          image: "https://picsum.photos/300/400?random=1",
          timestamp: "2h ago",
          type: "image",
        },
        {
          id: 2,
          image: "https://picsum.photos/300/400?random=2",
          timestamp: "5h ago",
          type: "image",
        },
      ],
    },
    {
      id: 3,
      label: "Film Club",
      initials: "FC",
      color: "from-purple-400 to-purple-600",
      hasNewStory: true,
      avatar: "https://i.pravatar.cc/64?img=2",
      moments: [
        {
          id: 3,
          image: "https://picsum.photos/300/400?random=3",
          timestamp: "1h ago",
          type: "image",
        },
        {
          id: 4,
          image: "https://picsum.photos/300/400?random=4",
          timestamp: "3h ago",
          type: "image",
        },
      ],
    },
    {
      id: 4,
      label: "Alex",
      initials: "A",
      color: "from-orange-400 to-orange-600",
      hasNewStory: true,
      avatar: "https://i.pravatar.cc/64?img=3",
      moments: [
        {
          id: 5,
          image: "https://picsum.photos/300/400?random=5",
          timestamp: "30m ago",
          type: "image",
        },
      ],
    },
    {
      id: 5,
      label: "Sarah",
      initials: "S",
      color: "from-green-400 to-green-600",
      hasNewStory: false,
      avatar: "https://i.pravatar.cc/64?img=4",
      moments: [
        {
          id: 6,
          image: "https://picsum.photos/300/400?random=6",
          timestamp: "1d ago",
          type: "image",
        },
      ],
    },
    {
      id: 6,
      label: "Mike",
      initials: "M",
      color: "from-indigo-400 to-indigo-600",
      hasNewStory: true,
      avatar: "https://i.pravatar.cc/64?img=5",
      moments: [
        {
          id: 7,
          image: "https://picsum.photos/300/400?random=7",
          timestamp: "4h ago",
          type: "image",
        },
        {
          id: 8,
          image: "https://picsum.photos/300/400?random=8",
          timestamp: "6h ago",
          type: "image",
        },
      ],
    },
  ]);

  const [selectedStory, setSelectedStory] = useState(null);
  const [currentMomentIndex, setCurrentMomentIndex] = useState(0);
  const [showStoryViewer, setShowStoryViewer] = useState(false);

  // Handle story click
  const handleStoryClick = (story) => {
    if (story.isAddButton) {
      // Handle adding new story
      alert("Add new story feature coming soon!");
      return;
    }

    if (story.moments && story.moments.length > 0) {
      setSelectedStory(story);
      setCurrentMomentIndex(0);
      setShowStoryViewer(true);
    }
  };

  // Handle next moment
  const handleNextMoment = () => {
    if (
      selectedStory &&
      currentMomentIndex < selectedStory.moments.length - 1
    ) {
      setCurrentMomentIndex(currentMomentIndex + 1);
    } else {
      // Move to next story
      const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
      if (currentIndex < stories.length - 1) {
        const nextStory = stories[currentIndex + 1];
        if (nextStory.moments && nextStory.moments.length > 0) {
          setSelectedStory(nextStory);
          setCurrentMomentIndex(0);
        }
      } else {
        setShowStoryViewer(false);
      }
    }
  };

  // Handle previous moment
  const handlePrevMoment = () => {
    if (currentMomentIndex > 0) {
      setCurrentMomentIndex(currentMomentIndex - 1);
    } else {
      // Move to previous story
      const currentIndex = stories.findIndex((s) => s.id === selectedStory.id);
      if (currentIndex > 0) {
        const prevStory = stories[currentIndex - 1];
        if (prevStory.moments && prevStory.moments.length > 0) {
          setSelectedStory(prevStory);
          setCurrentMomentIndex(prevStory.moments.length - 1);
        }
      }
    }
  };

  // Close story viewer
  const closeStoryViewer = () => {
    setShowStoryViewer(false);
    setSelectedStory(null);
    setCurrentMomentIndex(0);
  };

  return (
    <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-4 animate-fadeIn">
      {/* Stories Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 shadow-lg animate-scaleIn">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Stories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-1">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0 text-center group cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                    story.color
                  } flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    story.hasNewStory
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }`}
                >
                  {story.isAddButton ? "+" : story.initials}
                </div>
                {story.hasNewStory && !story.isAddButton && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                {story.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {showStoryViewer && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Close button */}
            <button
              onClick={closeStoryViewer}
              className="absolute top-4 right-4 z-10 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>

            {/* Story content */}
            <div className="relative w-full h-full">
              {selectedStory.moments[currentMomentIndex] && (
                <div className="relative w-full h-full">
                  <img
                    src={selectedStory.moments[currentMomentIndex].image}
                    alt="Story moment"
                    className="w-full h-full object-cover rounded-lg"
                  />

                  {/* Story header */}
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedStory.color} flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {selectedStory.initials}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {selectedStory.label}
                        </p>
                        <p className="text-white/80 text-xs">
                          {selectedStory.moments[currentMomentIndex].timestamp}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="absolute top-16 left-4 right-4 flex space-x-1">
                    {selectedStory.moments.map((_, index) => (
                      <div
                        key={index}
                        className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                      >
                        <div
                          className={`h-full bg-white transition-all duration-300 ${
                            index <= currentMomentIndex ? "w-full" : "w-0"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation areas */}
                  <div className="absolute inset-0 flex">
                    <div
                      className="w-1/2 h-full cursor-pointer"
                      onClick={handlePrevMoment}
                    ></div>
                    <div
                      className="w-1/2 h-full cursor-pointer"
                      onClick={handleNextMoment}
                    ></div>
                  </div>

                  {/* Story actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button className="text-white hover:text-gray-300 transition-colors">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </button>
                      <button className="text-white hover:text-gray-300 transition-colors">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </button>
                      <button className="text-white hover:text-gray-300 transition-colors">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </button>
                    </div>
                    <button className="text-white hover:text-gray-300 transition-colors">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Today's Focus */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg animate-bounceIn">
        <h2 className="text-base font-bold text-slate-800 mb-3">
          Today's Focus
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-xl">
            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">
                Complete Math Assignment
              </p>
              <p className="text-xs text-slate-600">Due tomorrow at 11:59 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-green-50 rounded-xl">
            <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">
                Study for Chemistry Test
              </p>
              <p className="text-xs text-slate-600">Test on Friday</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity (Mobile Only) */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg md:hidden">
        <h2 className="text-base font-bold text-slate-800 mb-3">
          Recent Activity
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-600 text-xs">💬</span>
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">
                New post in CS315 channel
              </p>
              <p className="text-xs text-slate-600">
                "Anyone want to study for midterm?"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-slate-600 text-xs">🎉</span>
            </div>
            <div>
              <p className="font-medium text-slate-800 text-sm">
                Spring Festival RSVP
              </p>
              <p className="text-xs text-slate-600">
                You've RSVP'd for the event
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Dashboard (Desktop Only) */}
      <div className="hidden md:block">
        <EngagementDashboard />
      </div>
    </div>
  );
}

export default ForYou;
