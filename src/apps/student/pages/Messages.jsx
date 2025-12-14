import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { messagesApi } from "../../shared/utils/messagesApi";
import { useToast } from "../../shared/components/Toast";

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

// --- Enhanced fake API with safety features ---
const fakeConversations = [
  {
    id: "conv1",
    name: "Sarah Chen",
    avatar: "",
    lastMessage: "See you at 3 PM?",
    timestamp: timeNow(),
    unread: 2,
    online: true,
    verified: true,
    role: "student",
    blocked: false,
    reported: false,
    otherUserId: 1,
    isGroup: false,
  },
  {
    id: "conv2",
    name: "Mike Rodriguez",
    avatar: "",
    lastMessage: "Thanks for the notes!",
    timestamp: timeNow(),
    unread: 0,
    online: false,
    verified: true,
    role: "student",
    blocked: false,
    reported: false,
    otherUserId: 2,
    isGroup: false,
  },
  {
    id: "conv3",
    name: "Professor Smith",
    avatar: "",
    lastMessage: "Submit by Friday.",
    timestamp: timeNow(),
    unread: 1,
    online: false,
    isGroup: false,
    verified: true,
    role: "teacher", // Changed from "professor" to "teacher" for consistency
    blocked: false,
    reported: false,
    otherUserId: 3,
  },
  {
    id: "conv6",
    name: "Admin User",
    avatar: "",
    lastMessage: "System maintenance tonight",
    timestamp: timeNow(),
    unread: 0,
    online: false,
    isGroup: false,
    verified: true,
    role: "admin",
    blocked: false,
    reported: false,
    otherUserId: 4,
  },
  {
    id: "conv4",
    name: "Study Group CS101",
    avatar: "",
    lastMessage: "Room 205 today.",
    timestamp: timeNow(),
    unread: 0,
    online: false,
    isGroup: true,
    verified: true,
    role: "group",
    blocked: false,
    reported: false,
    moderated: true,
    otherUserId: null,
  },
];

const fakeThread = [
  {
    id: "m1",
    senderId: "u2",
    sender: "Sarah Chen",
    content: "Hey! Study group tomorrow?",
    ts: timeNow(),
    status: "sent",
    verified: true,
    flagged: false,
    senderRole: "student", // Added role for role-based ticks
  },
  {
    id: "m2",
    senderId: "me",
    sender: "You",
    content: "Yes—what time again?",
    ts: timeNow(),
    status: "sent",
    verified: true,
    flagged: false,
    senderRole: "student", // Added role for role-based ticks
  },
  {
    id: "m3",
    senderId: "u2",
    sender: "Sarah Chen",
    content: "3 PM in the library. 📚",
    ts: timeNow(),
    status: "sent",
    verified: true,
    flagged: false,
    senderRole: "student", // Added role for role-based ticks
  },
];

const quickFilters = [
  { id: "all", label: "All" },
  { id: "group", label: "Group Chat" },
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
function Avatar({ name, online, verified, role, flagged }) {
  // Determine tick color based on role
  const getTickColor = () => {
    if (!role) return null;

    const roleLower = String(role).toLowerCase();
    if (roleLower === "group") return null; // No tick for groups

    if (roleLower === "admin" || roleLower === "super_admin") {
      return "bg-purple-500"; // Purple for admin
    } else if (
      roleLower === "teacher" ||
      roleLower === "staff" ||
      roleLower === "professor"
    ) {
      return "bg-green-500"; // Green for teachers/professors
    } else if (roleLower === "student") {
      return "bg-blue-500"; // Blue for students
    }
    return null; // No tick for unknown roles
  };

  const tickColor = getTickColor();

  return (
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full text-slate-700 grid place-items-center font-semibold ${
          flagged
            ? "bg-red-100 border-2 border-red-300"
            : role === "group"
            ? "bg-indigo-100 border-2 border-indigo-300"
            : "bg-slate-200"
        }`}
      >
        {initials(name)}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
      )}
      {tickColor && (
        <span
          className={`absolute -top-1 -right-1 h-4 w-4 rounded-full ${tickColor} flex items-center justify-center`}
        >
          <span className="text-white text-xs">✓</span>
        </span>
      )}
      {flagged && (
        <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-[#708090] flex items-center justify-center">
          <span className="text-white text-xs">⚠</span>
        </span>
      )}
    </div>
  );
}

function SafetyBadge({ type, verified, role }) {
  if (verified) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#e1e6ed] text-blue-800">
        ✓ Verified {role}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      ⚠ Unverified
    </span>
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
        case "group":
          return conversation.isGroup === true || conversation.role === "group";
        default:
          return true;
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
                  <Avatar
                    name={c.name}
                    online={c.online}
                    verified={c.verified}
                    role={c.role}
                    flagged={c.flagged}
                  />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">
                        {c.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {c.unread > 0 && (
                        <span className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 text-white text-xs font-semibold rounded-full flex items-center justify-center shadow-md">
                          {c.unread}
                        </span>
                      )}
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
                  {c.verified && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {c.role === "professor" || c.role === "teacher"
                        ? "Instructor"
                        : c.role === "admin"
                        ? "Admin"
                        : c.role === "group"
                        ? "Group"
                        : "Student"}
                    </div>
                  )}
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

// --- Enhanced message bubble with safety features ---
function MessageBubble({
  own,
  text,
  ts,
  status,
  verified,
  flagged,
  onReport,
  senderRole,
}) {
  const [showReportMenu, setShowReportMenu] = useState(false);

  const handleReport = () => {
    onReport(text);
    setShowReportMenu(false);
  };

  // Get tick color based on sender role
  const getRoleTick = () => {
    if (!senderRole || own) return null;

    const roleLower = String(senderRole || "").toLowerCase();
    if (roleLower === "admin" || roleLower === "super_admin") {
      return (
        <span className="text-purple-500 font-bold text-sm" title="Admin">
          ✓
        </span>
      );
    } else if (
      roleLower === "teacher" ||
      roleLower === "staff" ||
      roleLower === "professor"
    ) {
      return (
        <span className="text-green-500 font-bold text-sm" title="Teacher">
          ✓
        </span>
      );
    } else if (roleLower === "student") {
      return (
        <span className="text-blue-500 font-bold text-sm" title="Student">
          ✓
        </span>
      );
    }
    return null;
  };

  return (
    <div className={classNames("flex", own ? "justify-end" : "justify-start")}>
      <div className="relative group" style={{ maxWidth: "75%" }}>
        <div
          className={classNames(
            "rounded-full px-4 py-2 inline-block",
            own
              ? "bg-gradient-to-br from-[var(--brand-color)] to-[var(--brand-color-700)] text-white shadow-md"
              : "bg-white text-slate-900 border border-slate-200",
            flagged && "border-2 border-red-400 bg-red-50 shadow-red-200"
          )}
          role="text"
        >
          <p className="text-sm">{text}</p>
          <div
            className={classNames(
              "flex items-center gap-1 mt-1 text-[11px]",
              own ? "text-blue-100/90" : "text-slate-500"
            )}
          >
            <span>{formatClock(ts)}</span>
            {!own && getRoleTick()}
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
  onReport,
  isAdmin,
}) {
  const [draft, setDraft] = useState("");
  const [showSafetyPanel, setShowSafetyPanel] = useState(false);
  const fileInputRef = useRef(null);
  const viewportRef = useRef(null);

  // auto-scroll
  useEffect(() => {
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

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
            verified={conversation.verified}
            role={conversation.role}
            flagged={conversation.flagged}
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
              verified={row.verified}
              flagged={row.flagged}
              onReport={onReport}
              senderRole={row.senderRole}
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
          onChange={(e) => setDraft(e.target.value)}
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedContent, setReportedContent] = useState("");
  const [conversationFilter, setConversationFilter] = useState("all");
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Check for user parameter in URL to open conversation
  const userIdFromUrl = searchParams.get("user");

  // Helper function to format conversations
  const formatConversations = useCallback((conversations) => {
    if (!conversations || !Array.isArray(conversations)) {
      return [];
    }

    return conversations.map((conv) => {
      // Check if it's a group chat
      const isGroup = conv.is_group || conv.role === "group" || false;
      const otherUserId = conv.other_user_id || conv.id || null;

      return {
        id: isGroup
          ? `group-${otherUserId || Date.now()}`
          : `conv-${otherUserId || Date.now()}`,
        name: isGroup
          ? conv.name ||
            `${conv.first_name || ""} ${conv.last_name || ""}`.trim() ||
            "Group Chat"
          : `${conv.first_name || ""} ${conv.last_name || ""}`.trim() ||
            conv.email ||
            "User",
        avatar: conv.avatar_url || "",
        lastMessage: conv.last_message || "",
        timestamp:
          conv.last_message_time || conv.timestamp || new Date().toISOString(),
        unread: conv.unread_count || conv.unread || 0,
        online: false, // TODO: Implement online status
        verified: true,
        role: conv.role || "student",
        isGroup: isGroup,
        blocked: false,
        reported: false,
        otherUserId: isGroup ? null : otherUserId,
      };
    });
  }, []);

  // Fetch conversations on mount and set up polling
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const result = await messagesApi.getConversations();
        const formatted = formatConversations(result.conversations);
        setConversations(formatted);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
        if (conversations.length === 0) {
          showError("Failed to load conversations. Using demo data.");
          try {
            setConversations(fakeConversations);
          } catch (demoErr) {
            console.error("Error setting demo data:", demoErr);
            setConversations([]);
          }
        }
      }
    };

    if (user) {
      setLoading(true);
      fetchConversations().finally(() => setLoading(false));

      // Poll for new conversations every 5 seconds
      const pollInterval = setInterval(() => {
        fetchConversations();
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [user, showError, formatConversations, conversations]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(
    async (otherUserId) => {
      if (!otherUserId) {
        console.warn("No otherUserId provided to fetchMessages");
        return;
      }

      try {
        const result = await messagesApi.getMessages(otherUserId);
        if (!result || !result.messages) {
          console.warn("No messages in API response");
          return;
        }

        const formatted = (result.messages || [])
          .map((msg) => {
            if (!msg) return null;
            return {
              id: (msg.id || Date.now()).toString(),
              senderId:
                msg.sender_id === user?.id
                  ? "me"
                  : (msg.sender_id || "").toString(),
              sender:
                msg.sender_id === user?.id
                  ? "You"
                  : `${msg.first_name || ""} ${msg.last_name || ""}`.trim() ||
                    msg.email ||
                    "User",
              content: msg.content || "",
              ts: msg.created_at || new Date().toISOString(),
              status: "sent",
              verified: true,
              flagged: false,
              senderRole: msg.role || "student", // Include role from API
            };
          })
          .filter(Boolean); // Remove any null entries

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        if (messages.length === 0) {
          showError("Failed to load messages.");
          setMessages([]); // Set empty array instead of crashing
        }
      }
    },
    [user, showError, messages.length]
  );

  // when selecting a conversation
  const openConversation = useCallback(
    async (c) => {
      setSelected(c);
      // mark read locally
      setConversations((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x))
      );

      const otherUserId = c.otherUserId || c.id.replace("conv-", "");
      await fetchMessages(otherUserId);
    },
    [fetchMessages, setConversations]
  );

  // Poll for new messages in the current conversation
  useEffect(() => {
    if (!selected || !selected.otherUserId) return;

    const otherUserId =
      selected.otherUserId || selected.id.replace("conv-", "");

    // Poll for new messages every 3 seconds
    const pollInterval = setInterval(() => {
      fetchMessages(otherUserId);
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [selected, fetchMessages]);

  // optimistic send with safety checks
  const send = useCallback(
    async (text) => {
      if (!selected || !selected.otherUserId) {
        showError("Please select a conversation first.");
        return;
      }

      const tempId = `tmp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        senderId: "me",
        sender: "You",
        content: text,
        ts: timeNow(),
        status: "sending",
        verified: true,
        flagged: false,
      };
      setMessages((prev) => [...prev, optimistic]);

      try {
        const otherUserId =
          selected.otherUserId || selected.id.replace("conv-", "");
        const result = await messagesApi.sendMessage(otherUserId, text);

        // Replace optimistic message with real one
        if (result.message) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? {
                    id: result.message.id.toString(),
                    senderId: "me",
                    sender: "You",
                    content: result.message.content,
                    ts: result.message.created_at,
                    status: "sent",
                    verified: true,
                    flagged: false,
                    senderRole: user?.role || "student", // Include current user's role
                  }
                : m
            )
          );
        } else {
          // If no message returned, just mark as sent
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? { ...m, status: "sent", senderRole: user?.role || "student" }
                : m
            )
          );
        }

        // Refresh conversations to update last message
        const convResult = await messagesApi.getConversations();
        const formatted = formatConversations(convResult.conversations);
        setConversations(formatted);
      } catch (err) {
        console.error("Failed to send message:", err);
        showError("Failed to send message. Please try again.");
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, status: "failed" } : m))
        );
      }
    },
    [selected, showError]
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

  const handleNewChat = useCallback(() => {
    setShowNewChatModal(true);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  // Debounce search query for real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery) {
        setSearchResults([]);
        setSearching(false);
        return;
      }

      try {
        setSearching(true);
        const result = await messagesApi.searchUsers(debouncedSearchQuery);
        // Filter out current user and already existing conversations
        const existingUserIds = conversations
          .map((c) => c.otherUserId)
          .filter(Boolean);
        const filtered = (result.users || []).filter(
          (u) =>
            u.id !== user?.id &&
            !existingUserIds.includes(u.id.toString()) &&
            u.is_active !== false
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error("Failed to search users:", err);
        showError("Failed to search users.");
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchQuery, conversations, user, showError]);

  const handleStartChat = useCallback(
    async (otherUser) => {
      try {
        // Create a new conversation entry
        const newConv = {
          id: `conv-${otherUser.id}`,
          name:
            `${otherUser.first_name} ${otherUser.last_name}`.trim() ||
            otherUser.email,
          avatar: otherUser.avatar_url || "",
          lastMessage: "",
          timestamp: new Date().toISOString(),
          unread: 0,
          online: false,
          verified: true,
          role: otherUser.role || "student",
          blocked: false,
          reported: false,
          otherUserId: otherUser.id.toString(),
        };

        setConversations((prev) => [newConv, ...prev]);
        setSelected(newConv);
        setMessages([]);
        setShowNewChatModal(false);
        setSearchQuery("");
        setSearchResults([]);
        success(`Started conversation with ${newConv.name}`);
      } catch (err) {
        console.error("Failed to start chat:", err);
        showError("Failed to start chat.");
      }
    },
    [success, showError, setSearchParams]
  );

  // Handle opening conversation from URL parameter
  useEffect(() => {
    if (userIdFromUrl && conversations.length > 0 && !selected) {
      // Find existing conversation
      const existingConv = conversations.find(
        (c) => c.otherUserId === userIdFromUrl
      );

      if (existingConv) {
        openConversation(existingConv);
        setSearchParams({}); // Clear URL param after opening
      } else {
        // Try to find user and start chat
        messagesApi
          .searchUsers(userIdFromUrl)
          .then((result) => {
            const foundUser = result.users?.find(
              (u) => u.id.toString() === userIdFromUrl
            );
            if (foundUser) {
              handleStartChat(foundUser);
            }
          })
          .catch(() => {
            // If search fails, just open new chat modal
            setShowNewChatModal(true);
          });
      }
    }
  }, [
    userIdFromUrl,
    conversations,
    selected,
    openConversation,
    handleStartChat,
    setSearchParams,
  ]);

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
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
          </div>
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] pb-16">
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
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-lg max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              New Chat
            </h3>
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search by name or email (e.g., 'ken' or 'kenshee')..."
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {searching ? (
                <div className="text-center text-slate-500 py-4">
                  Searching...
                </div>
              ) : searchResults.length === 0 && searchQuery ? (
                <div className="text-center text-slate-500 py-4">
                  No users found
                </div>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartChat(user)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                        {initials(`${user.first_name} ${user.last_name}`)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewChatModal(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
