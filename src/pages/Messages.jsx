import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Messages() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConversations([
        {
          id: "conv1",
          name: "Sarah Chen",
          avatar: "👩",
          lastMessage: "Hey! Are you coming to the study group tomorrow?",
          timestamp: "2 min ago",
          unread: 2,
          online: true,
        },
        {
          id: "conv2",
          name: "Mike Rodriguez",
          avatar: "👨",
          lastMessage: "Thanks for the notes! Really helpful",
          timestamp: "1 hour ago",
          unread: 0,
          online: false,
        },
        {
          id: "conv3",
          name: "Professor Smith",
          avatar: "👨‍🏫",
          lastMessage: "Please submit your assignment by Friday",
          timestamp: "3 hours ago",
          unread: 1,
          online: false,
        },
        {
          id: "conv4",
          name: "Study Group CS101",
          avatar: "G",
          lastMessage: "Meeting moved to Room 205",
          timestamp: "5 hours ago",
          unread: 0,
          online: false,
          isGroup: true,
        },
      ]);

      setMessages([
        {
          id: "msg1",
          sender: "Sarah Chen",
          content: "Hey! Are you coming to the study group tomorrow?",
          timestamp: "2 min ago",
          isOwn: false,
        },
        {
          id: "msg2",
          sender: "You",
          content: "Yes, I'll be there! What time again?",
          timestamp: "1 min ago",
          isOwn: true,
        },
        {
          id: "msg3",
          sender: "Sarah Chen",
          content: "3 PM in the library. See you there!",
          timestamp: "Just now",
          isOwn: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: "You",
        content: newMessage,
        timestamp: "Just now",
        isOwn: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">
            Stay connected with your classmates and teachers
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200">
              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Conversations */}
              <div className="max-h-96 overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                          {conversation.avatar}
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="flex justify-end mt-1">
                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-xl border border-slate-200 h-96 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-lg">
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {selectedConversation.name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedConversation.online
                          ? "Online"
                          : "Last seen recently"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 text-slate-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? "text-blue-100" : "text-slate-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4 font-bold text-blue-500">M</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-slate-600">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
              <div className="text-lg mb-2 font-semibold text-blue-600">G</div>
              <div className="text-sm font-medium text-slate-900">
                New Group Chat
              </div>
            </button>
            <button className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
              <div className="text-2xl mb-2">👤</div>
              <div className="text-sm font-medium text-slate-900">
                Start Private Chat
              </div>
            </button>
            <button className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
              <div className="text-2xl mb-2">📞</div>
              <div className="text-sm font-medium text-slate-900">
                Voice Call
              </div>
            </button>
            <button className="p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-center">
              <div className="text-2xl mb-2">📹</div>
              <div className="text-sm font-medium text-slate-900">
                Video Call
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;
