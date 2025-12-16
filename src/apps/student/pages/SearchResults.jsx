import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";
import { apiRequest } from "../../shared/utils/api";
import { useToast } from "../../shared/components/Toast";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { branding } = useBranding();
  const { error: showError } = useToast();
  
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedType, setSelectedType] = useState(type);
  const [results, setResults] = useState({
    users: [],
    posts: [],
    events: [],
    marketplace: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchTypes = [
    { id: "all", label: "All", icon: "🔍" },
    { id: "users", label: "People", icon: "👥" },
    { id: "posts", label: "Posts", icon: "📝" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "marketplace", label: "Marketplace", icon: "🛒" },
  ];

  const performSearch = async (searchTerm, searchType) => {
    if (!searchTerm.trim()) {
      setResults({ users: [], posts: [], events: [], marketplace: [] });
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const result = await apiRequest(
        `/search?q=${encodeURIComponent(searchTerm)}&type=${searchType}`
      );
      console.log("Search result:", result); // Debug log
      setResults({
        users: result.users || [],
        posts: result.posts || [],
        events: result.events || [],
        marketplace: result.marketplace || [],
      });
    } catch (err) {
      console.error("Search error:", err);
      showError("Failed to perform search. Please try again.");
      setResults({ users: [], posts: [], events: [], marketplace: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query, type);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${selectedType}`);
    performSearch(searchQuery, selectedType);
  };

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${newType}`);
    performSearch(searchQuery, newType);
  };

  const totalResults = useMemo(() => {
    return (
      results.users.length +
      results.posts.length +
      results.events.length +
      results.marketplace.length
    );
  }, [results]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const initials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f3f6fb] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <svg
                  className="h-4 w-4 text-slate-400"
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
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts, users, events, marketplace..."
                  className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#365b6d] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#2a4754] transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Search Type Filters */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {searchTypes.map((st) => (
              <button
                key={st.id}
                onClick={() => handleTypeChange(st.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
                  selectedType === st.id
                    ? "bg-[#365b6d] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#365b6d]"></div>
            <p className="mt-4 text-slate-600">Searching...</p>
          </div>
        )}

        {!loading && hasSearched && totalResults === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No results found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {!loading && hasSearched && totalResults > 0 && (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="text-sm text-slate-600">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "
              {query}"
            </div>

            {/* Users Results */}
            {(selectedType === "all" || selectedType === "users") &&
              results.users.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    👥 People ({results.users.length})
                  </h2>
                  <div className="space-y-3">
                    {results.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group"
                      >
                        <Link
                          to={`/profile/${user.id}`}
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="h-12 w-12 rounded-full bg-[#365b6d] text-white flex items-center justify-center font-semibold flex-shrink-0">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.first_name}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              initials(`${user.first_name} ${user.last_name}`)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-slate-600 truncate">{user.email}</p>
                            {user.role && (
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => navigate(`/messages?user=${user.id}`)}
                          className="px-4 py-2 rounded-lg bg-[#365b6d] text-white text-sm font-semibold hover:bg-[#2a4754] transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                          title="Message this user"
                        >
                          Message
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Posts Results */}
            {(selectedType === "all" || selectedType === "posts") &&
              results.posts.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    📝 Posts ({results.posts.length})
                  </h2>
                  <div className="space-y-4">
                    {results.posts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/community`}
                        className="block p-4 rounded-xl hover:bg-slate-50 transition border border-slate-100"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-[#365b6d] text-white flex items-center justify-center text-xs font-semibold">
                            {initials(
                              `${post.first_name} ${post.last_name}`
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {post.first_name} {post.last_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDate(post.created_at)}
                            </p>
                          </div>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {post.content}
                        </p>
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="mt-2 rounded-lg w-full max-w-md h-48 object-cover"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Events Results */}
            {(selectedType === "all" || selectedType === "events") &&
              results.events.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    📅 Events ({results.events.length})
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.events.map((event) => (
                      <Link
                        key={event.id}
                        to={`/calendar`}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#365b6d] hover:shadow-md transition"
                      >
                        <h3 className="font-semibold text-slate-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-sm text-slate-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>📅 {formatDate(event.event_date)}</span>
                          {event.venue && <span>📍 {event.venue}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* Marketplace Results */}
            {(selectedType === "all" || selectedType === "marketplace") &&
              results.marketplace.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    🛒 Marketplace ({results.marketplace.length})
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.marketplace.map((item) => (
                      <Link
                        key={item.id}
                        to={`/marketplace`}
                        className="p-4 rounded-xl border border-slate-200 hover:border-[#365b6d] hover:shadow-md transition"
                      >
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-lg font-bold text-[#365b6d]">
                          ${item.price}
                        </p>
                        {item.category && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {item.category}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Start searching
            </h3>
            <p className="text-slate-600">
              Enter a search term above to find posts, people, events, and
              more
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

