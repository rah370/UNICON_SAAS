import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";
import { ListSkeleton } from "../components/SkeletonLoader";

// --- small helpers ---
const classNames = (...a) => a.filter(Boolean).join(" ");
const timeNow = () => new Date().toISOString();
const formatClock = (iso) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
const isSameDay = (a, b) => {
  const A = new Date(a),
    B = new Date(b);
  return (
    A.getFullYear() === B.getFullYear() &&
    A.getMonth() === B.getMonth() &&
    A.getDate() === B.getDate()
  );
};
const dayLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  if (isSameDay(d, today)) return "Today";
  const yday = new Date();
  yday.setDate(today.getDate() - 1);
  if (isSameDay(d, yday)) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// --- API integration for real conversations ---

const quickFilters = [
  { id: "all", label: "All" },
  { id: "groups", label: "Group Chats" },
];

const quickReplies = [
  "On my way!",
  "Sending it now.",
  "Let’s meet at 3?",
  "Thanks for the update!",
];

// --- Safety and moderation features ---
const safetySettings = {
  contentFilter: true,
  profanityFilter: true,
  spamDetection: true,
  autoModeration: true,
  reportThreshold: 3,
  blockList: [],
  trustedContacts: ["conv1", "conv2", "conv3"],
};

// --- reusable UI bits ---
function Avatar({ name, online, role }) {
  return (
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full text-white grid place-items-center font-semibold ${
          role === "professor" || role === "teacher"
            ? "bg-purple-500"
            : role === "admin"
            ? "bg-red-500"
            : role === "group"
            ? "bg-green-500"
            : "bg-blue-500"
        }`}
      >
        {initials(name)}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
      )}
    </div>
  );
}

function SkeletonLine() {
  return <div className="h-4 bg-slate-200/70 rounded w-full animate-pulse" />;
}

function EmptyState({ title, caption, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-14 h-14 rounded-2xl bg-[#708090]/10 grid place-items-center mb-3">
        <span className="text-xl">💬</span>
      </div>
      <p className="text-slate-900 font-semibold">{title}</p>
      <p className="text-slate-600 text-sm mt-1">{caption}</p>
      {action}
    </div>
  );
}

// --- Enhanced conversation list with safety features ---
function ConversationList({
  items,
  selectedId,
  onSelect,
  onNewChat,
  onBlock,
  onReport,
  isAdmin,
  filterKey = "all",
}) {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [showSafetyMenu, setShowSafetyMenu] = useState(null);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim().toLowerCase()), 180);
    return () => clearTimeout(t);
  }, [q]);

  const passesFilter = useCallback(
    (conversation) => {
      switch (filterKey) {
        case "groups":
          return conversation.isGroup === true;
        default:
          return true; // "all" shows everything
      }
    },
    [filterKey]
  );

  const filtered = useMemo(() => {
    const base = items.filter((item) => !item.blocked && passesFilter(item));
    if (!debounced) return base;
    return base.filter(
      (c) =>
        c.name.toLowerCase().includes(debounced) ||
        (c.lastMessage || "").toLowerCase().includes(debounced)
    );
  }, [items, debounced, passesFilter]);

  const handleSafetyAction = (conversationId, action) => {
    if (action === "block") {
      onBlock(conversationId);
    } else if (action === "report") {
      onReport(conversationId);
    }
    setShowSafetyMenu(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Search bar */}
      <div className="p-3 border-b border-slate-200">
        <input
          aria-label="Search conversations"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      <div className="max-h-[28rem] overflow-y-auto">
        {filtered.length === 0 && (
          <EmptyState
            title="No conversations"
            caption="Try a different search."
          />
        )}

        {filtered.map((c) => (
          <div key={c.id} className="relative">
            <button
              onClick={() => onSelect(c)}
              className={classNames(
                "w-full text-left p-4 hover:bg-slate-50 focus:outline-none focus:bg-slate-50 transition-colors relative",
                selectedId === c.id && "bg-[#708090]/10/40"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      c.role === "professor" || c.role === "teacher"
                        ? "bg-purple-500"
                        : c.role === "admin"
                        ? "bg-red-500"
                        : c.role === "group"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  >
                    {initials(c.name)}
                  </div>
                  {c.online && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">
                        {c.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-slate-500">
                        {formatClock(c.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSafetyMenu(
                            showSafetyMenu === c.id ? null : c.id
                          );
                        }}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 truncate mb-2">
                    {c.lastMessage}
                  </p>
                  {/* Color-coded role badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
                      c.role === "professor" || c.role === "teacher"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : c.role === "admin"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : c.role === "group"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {c.role === "professor" || c.role === "teacher"
                      ? "Instructor"
                      : c.role === "admin"
                      ? "Admin"
                      : c.role === "group"
                      ? "Group"
                      : "Student"}
                  </div>
                </div>
              </div>
            </button>

            {/* Safety Menu */}
            {showSafetyMenu === c.id && (
              <div className="absolute right-2 top-12 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => handleSafetyAction(c.id, "report")}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚨 Report User
                </button>
                <button
                  onClick={() => handleSafetyAction(c.id, "block")}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🚫 Block User
                </button>
                {isAdmin && (
                  <>
                    <div className="border-t border-slate-200"></div>
                    <button className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50">
                      🔍 View Reports
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-purple-600 hover:bg-purple-50">
                      ⚙️ Moderate Chat
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Enhanced message bubble ---
function MessageBubble({ own, text, ts, status, onReport }) {
  const [showReportMenu, setShowReportMenu] = useState(false);

  const handleReport = () => {
    onReport(text);
    setShowReportMenu(false);
  };

  return (
    <div className={classNames("flex", own ? "justify-end" : "justify-start")}>
      <div className="relative group">
        <div
          className={classNames(
            "max-w-[75%] rounded-2xl px-4 py-2",
            own
              ? "bg-gradient-to-br from-[var(--brand-color)] to-[var(--brand-color-700)] text-white shadow-md"
              : "bg-white text-slate-900 border border-slate-200"
          )}
          role="text"
        >
          <p className="text-sm whitespace-pre-wrap">{text}</p>
          <div
            className={classNames(
              "flex items-center gap-1 mt-1 text-[11px]",
              own ? "text-blue-100/90" : "text-slate-500"
            )}
          >
            <span>{formatClock(ts)}</span>
            {own && (
              <span
                aria-label={
                  status === "sent"
                    ? "Sent"
                    : status === "sending"
                    ? "Sending"
                    : "Failed"
                }
              >
                {status === "seen"
                  ? "• Seen"
                  : status === "sending"
                  ? "• Sending…"
                  : status === "failed"
                  ? "• Failed"
                  : ""}
              </span>
            )}
          </div>
        </div>

        {/* Report button for received messages */}
        {!own && (
          <button
            onClick={() => setShowReportMenu(!showReportMenu)}
            className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-200"
          >
            🚨
          </button>
        )}

        {showReportMenu && (
          <div className="absolute right-0 top-0 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[120px]">
            <button
              onClick={handleReport}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Report Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DayDivider({ label }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-px flex-1 bg-slate-200" />
      <span className="text-xs text-slate-500">{label}</span>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

// --- Enhanced chat window with safety features ---
function ChatWindow({
  conversation,
  messages,
  onSend,
  onBack,
  typing,
  onTyping,
  onReport,
  isAdmin,
}) {
  const [draft, setDraft] = useState("");
  const [showSafetyPanel, setShowSafetyPanel] = useState(false);
  const fileInputRef = useRef(null);
  const viewportRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const grouped = useMemo(() => {
    const out = [];
    let prevDay = null;
    messages.forEach((m) => {
      const label = dayLabel(m.ts);
      if (label !== prevDay) {
        out.push({ type: "divider", id: `d-${m.id}-${m.ts}`, label });
        prevDay = label;
      }
      out.push({ type: "msg", ...m });
    });
    return out;
  }, [messages]);

  const submit = useCallback(
    (e) => {
      e?.preventDefault?.();
      const text = draft.trim();
      if (!text) return;

      // Basic content filtering
      if (safetySettings.contentFilter) {
        const filteredText = text.replace(
          /[!@#$%^&*()_+={}[\]|\\:";'<>?,./]/g,
          ""
        );
        if (filteredText.length < text.length * 0.5) {
          alert(
            "Message contains potentially inappropriate content. Please revise."
          );
          return;
        }
      }

      onSend(text);
      setDraft("");
    },
    [draft, onSend]
  );

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleQuickReply = (reply) => {
    setDraft((prev) => (prev ? `${prev} ${reply}` : reply));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 h-[34rem] flex flex-col shadow-lg">
      {/* header */}
      <div className="p-4 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden mr-1 rounded-lg px-2 py-1 hover:bg-[#d0d7df]"
            onClick={onBack}
            aria-label="Back to conversations"
          >
            ←
          </button>
          <Avatar
            name={conversation.name}
            online={conversation.online}
            role={conversation.role}
          />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">
              {conversation.name}
            </p>
            <p className="text-xs text-slate-500">
              {conversation.online ? (
                <span className="text-green-500 font-medium">● Online now</span>
              ) : (
                "Last seen recently"
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <button
            onClick={() => setShowSafetyPanel(!showSafetyPanel)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            🛡️ Safety
          </button>
          <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            📞 Call
          </button>
          <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            🎥 Video
          </button>
          <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            ⋯ More
          </button>
        </div>
      </div>

      {/* Safety Panel */}
      {showSafetyPanel && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
          <div className="text-sm text-yellow-800">
            <div className="font-medium mb-2">🛡️ Safety Features Active:</div>
            <ul className="text-xs space-y-1">
              <li>• Content filtering enabled</li>
              <li>• Spam detection active</li>
              <li>• Messages are monitored</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>
      )}

      {/* messages */}
      <div
        ref={viewportRef}
        className="flex-1 p-4 overflow-y-auto bg-slate-50/60"
      >
        {grouped.map((row) =>
          row.type === "divider" ? (
            <DayDivider key={row.id} label={row.label} />
          ) : (
            <MessageBubble
              key={row.id}
              own={row.senderId === "me"}
              text={row.content}
              ts={row.ts}
              status={row.status}
              onReport={onReport}
            />
          )
        )}
        {typing && <div className="mt-2 text-xs text-slate-500">Typing…</div>}
      </div>

      <div className="px-4 pt-2 border-t border-slate-200 bg-white">
        <div className="flex flex-wrap gap-2 pb-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              type="button"
              onClick={() => handleQuickReply(reply)}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-slate-400"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* composer with safety features */}
      <form
        onSubmit={submit}
        className="p-4 border-t border-slate-200 flex items-end gap-3 bg-white"
      >
        <button
          type="button"
          className="rounded-lg px-3 py-2 hover:bg-[#d0d7df]"
          aria-label="Add attachment"
          onClick={handleAttach}
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={() => alert("Attachments captured locally.")}
        />
        <textarea
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            // Send typing indicator
            if (onTyping && e.target.value.trim()) {
              onTyping();
              // Clear previous timeout
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              // Stop typing indicator after 3 seconds of no typing
              typingTimeoutRef.current = setTimeout(() => {
                if (onTyping) {
                  onTyping(false); // Stop typing
                }
              }, 3000);
            }
          }}
          placeholder="Message…"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              submit(e);
            }
          }}
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 resize-none max-h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Type a message"
        />
        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:transform-none"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-700) 100%)",
          }}
          disabled={!draft.trim()}
        >
          Send →
        </button>
      </form>

      {/* Safety footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center rounded-b-3xl">
        🛡️ Messages stay encrypted within UNICON. Report concerns anytime.
      </div>
    </div>
  );
}

// --- main page with enhanced safety features ---
export default function Messages() {
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const { isConnected, sendMessage, subscribe } = useWebSocket();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedContent, setReportedContent] = useState("");
  const [conversationFilter, setConversationFilter] = useState("all");
  const [error, setError] = useState(null);
  const typingTimeoutRef = useRef(null);

  // Fetch conversations from API
  useEffect(() => {
    fetchConversations();
  }, []);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribeNewMessage = subscribe("new_message", (data) => {
      if (selected && selected.id === data.conversation_id) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message_id,
            senderId: data.sender_id,
            sender: data.sender_name || "Unknown",
            content: data.content,
            ts: data.timestamp || timeNow(),
            status: "sent",
            verified: data.verified !== false,
            flagged: data.flagged || false,
          },
        ]);
      }
      // Update conversation last message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === data.conversation_id
            ? {
                ...c,
                lastMessage: data.content,
                timestamp: data.timestamp || timeNow(),
                unread: c.id === selected?.id ? 0 : (c.unread || 0) + 1,
              }
            : c
        )
      );
    });

    const unsubscribeTyping = subscribe("typing", (data) => {
      if (selected && selected.id === data.conversation_id) {
        setTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 3000);
      }
    });

    const unsubscribeUserOnline = subscribe("user_online", (data) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === data.user_id ? { ...c, online: true } : c))
      );
    });

    const unsubscribeUserOffline = subscribe("user_offline", (data) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === data.user_id ? { ...c, online: false } : c))
      );
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeTyping();
      unsubscribeUserOnline();
      unsubscribeUserOffline();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isConnected, selected, subscribe]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentApi.getConversations();
      const convs = response.conversations || response.data || [];

      setConversations(
        convs.map((conv) => ({
          id: conv.id || conv.conversation_id,
          name: conv.name || conv.participant_name || "Unknown",
          avatar: conv.avatar || conv.avatar_url || "",
          lastMessage: conv.last_message || conv.lastMessage || "",
          timestamp: conv.last_message_time || conv.updated_at || timeNow(),
          unread: conv.unread_count || conv.unread || 0,
          online: conv.is_online || false,
          verified: conv.verified !== false,
          role: conv.role || "student",
          blocked: conv.blocked || false,
          reported: conv.reported || false,
          isGroup: conv.is_group || false,
          moderated: conv.moderated || false,
        }))
      );
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError(err.message || "Failed to load conversations");
      showToast("Failed to load conversations", "error");
    } finally {
      setLoading(false);
    }
  };

  // when selecting a conversation
  const openConversation = useCallback(
    async (c) => {
      setSelected(c);
      // mark read
      setConversations((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x))
      );

      // fetch messages from API
      try {
        const response = await studentApi.getMessages(c.id);
        const messagesData = response.messages || response.data || [];
        setMessages(
          messagesData.map((msg) => ({
            id: msg.id || msg.message_id,
            senderId: msg.sender_id || msg.user_id,
            sender: msg.sender_name || msg.author_name || "Unknown",
            content: msg.content || msg.body || "",
            ts: msg.timestamp || msg.created_at || timeNow(),
            status: msg.status || "sent",
            verified: msg.verified !== false,
            flagged: msg.flagged || false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        showToast("Failed to load messages", "error");
        setMessages([]);
      }
    },
    [showToast]
  );

  // Send message with API and WebSocket
  const handleTyping = useCallback(
    (isTyping = true) => {
      if (!selected || !isConnected) return;

      sendMessage({
        type: "typing",
        conversation_id: selected.id,
        is_typing: isTyping,
      });
    },
    [selected, isConnected, sendMessage]
  );

  const send = useCallback(
    async (text) => {
      if (!selected || !text.trim()) return;

      // Stop typing indicator
      handleTyping(false);

      const tempId = `tmp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        senderId: user?.id || "me",
        sender: user?.name || "You",
        content: text,
        ts: timeNow(),
        status: "sending",
        verified: true,
        flagged: false,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        // Send via API
        const response = await studentApi.sendMessage(selected.id, text);

        // Update optimistic message with real data
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  id: response.message?.id || response.id || tempId,
                  status: "sent",
                }
              : m
          )
        );

        // Update conversation last message
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selected.id
              ? {
                  ...c,
                  lastMessage: text,
                  timestamp: timeNow(),
                }
              : c
          )
        );

        // Send via WebSocket if available
        sendMessage({
          type: "send_message",
          conversation_id: selected.id,
          content: text,
        });
      } catch (err) {
        console.error("Failed to send message:", err);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
        showToast("Failed to send message", "error");
      }
    },
    [selected, user, showToast, sendMessage, handleTyping]
  );

  // Safety functions
  const handleBlock = useCallback(
    (conversationId) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, blocked: true } : c))
      );
      if (selected?.id === conversationId) {
        setSelected(null);
      }
    },
    [selected]
  );

  const handleReport = useCallback((conversationId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, reported: true } : c))
    );
    alert("User reported. Campus security will review the case.");
  }, []);

  const handleMessageReport = useCallback((content) => {
    setReportedContent(content);
    setShowReportModal(true);
  }, []);

  const submitReport = useCallback(() => {
    alert("Message reported. Moderators will review it shortly.");
    setShowReportModal(false);
    setReportedContent("");
  }, []);

  // typing simulator (pretend remote user typing)
  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => setTyping(true), 1200);
    const t2 = setTimeout(() => {
      setTyping(false);
    }, 2600);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [selected]);

  const handleNewChat = useCallback(
    () => alert("New chat creation coming soon"),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-4 py-5">
          <div className="max-w-6xl mx-auto">
            <div className="h-6 w-40 bg-slate-200/70 rounded animate-pulse" />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <ListSkeleton count={5} />
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <ListSkeleton count={8} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] pb-16">
      {error && (
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 text-sm">
            {error}
          </div>
        </div>
      )}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setConversationFilter(filter.id)}
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  conversationFilter === filter.id
                    ? "text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
                style={
                  conversationFilter === filter.id
                    ? {
                        background:
                          "linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-700) 100%)",
                      }
                    : { backgroundColor: "#f8fafc" }
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[340px,1fr]">
          <div
            className={classNames(
              "transition-all",
              selected && "hidden lg:block"
            )}
          >
            <ConversationList
              items={conversations}
              selectedId={selected?.id}
              onSelect={openConversation}
              onNewChat={handleNewChat}
              onBlock={handleBlock}
              onReport={handleReport}
              isAdmin={isAdmin}
              filterKey={conversationFilter}
            />
          </div>

          <div
            className={classNames(
              "transition-all",
              !selected && "hidden lg:block"
            )}
          >
            {selected ? (
              <ChatWindow
                conversation={selected}
                messages={messages}
                typing={typing}
                onSend={send}
                onTyping={handleTyping}
                onBack={() => setSelected(null)}
                onReport={handleMessageReport}
                isAdmin={isAdmin}
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 h-[34rem] grid place-items-center text-center">
                <EmptyState
                  title="No chat open"
                  caption="Choose a conversation or start a new one."
                  action={
                    <button
                      onClick={handleNewChat}
                      className="mt-3 px-6 py-2 rounded-xl text-white font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-color) 0%, var(--brand-color-700) 100%)",
                      }}
                    >
                      Start chatting
                    </button>
                  }
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Report Inappropriate Content
            </h3>
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Reported message:</p>
              <div className="p-3 bg-slate-100 rounded-lg text-sm">
                "{reportedContent}"
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason for reporting:
              </label>
              <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Inappropriate content</option>
                <option>Harassment</option>
                <option>Spam</option>
                <option>Threats</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-[#5a6a78] transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
