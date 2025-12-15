import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";
import Header from "../components/Header";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [results, setResults] = useState({
    users: [],
    posts: [],
    events: [],
    marketplace: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    }
  }, [query, type]);

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await studentApi.search(
        query,
        type === "all" ? null : type
      );
      setResults({
        users: response.users || [],
        posts: response.posts || [],
        events: response.events || [],
        marketplace: response.marketplace || [],
      });
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Search failed");
      showToast("Search failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const totalResults = useMemo(() => {
    return (
      results.users.length +
      results.posts.length +
      results.events.length +
      results.marketplace.length
    );
  }, [results]);

  const tabs = [
    { id: "all", label: "All", count: totalResults },
    { id: "users", label: "People", count: results.users.length },
    { id: "posts", label: "Posts", count: results.posts.length },
    { id: "events", label: "Events", count: results.events.length },
    {
      id: "marketplace",
      label: "Marketplace",
      count: results.marketplace.length,
    },
  ];

  const handleTabChange = (newType) => {
    navigate(`/search?q=${encodeURIComponent(query)}&type=${newType}`);
  };

  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-sand-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-slate-400 mb-4"
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
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">
              Start Searching
            </h2>
            <p className="text-slate-600">
              Enter a search query to find users, posts, events, and marketplace
              items.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) =>
                navigate(
                  `/search?q=${encodeURIComponent(e.target.value)}&type=${type}`
                )
              }
              placeholder="Search..."
              className="flex-1 rounded-full border border-slate-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={performSearch}
              className="rounded-full bg-blue-600 text-white px-6 py-3 hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  type === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Users Results */}
            {(type === "all" || type === "users") &&
              results.users.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    People ({results.users.length})
                  </h3>
                  <div className="space-y-3">
                    {results.users.map((user) => (
                      <Link
                        key={user.id}
                        to={`/profile/${user.id}`}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                          {user.first_name?.[0] || user.name?.[0] || "U"}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {user.email || user.role || ""}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Posts Results */}
            {(type === "all" || type === "posts") &&
              results.posts.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Posts ({results.posts.length})
                  </h3>
                  <div className="space-y-4">
                    {results.posts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/community/${post.channel_id || ""}`}
                        className="block p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold">
                            {post.author?.name?.[0] || "U"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {post.author?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {post.created_at || post.createdAt}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-700 line-clamp-2">
                          {post.content || post.body}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Events Results */}
            {(type === "all" || type === "events") &&
              results.events.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Events ({results.events.length})
                  </h3>
                  <div className="space-y-3">
                    {results.events.map((event) => (
                      <Link
                        key={event.id}
                        to="/calendar"
                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                          📅
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {event.title}
                          </p>
                          <p className="text-sm text-slate-600">
                            {event.event_date || event.date} •{" "}
                            {event.location || event.venue}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* Marketplace Results */}
            {(type === "all" || type === "marketplace") &&
              results.marketplace.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Marketplace ({results.marketplace.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.marketplace.map((item) => (
                      <Link
                        key={item.id}
                        to="/marketplace"
                        className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition"
                      >
                        <div className="w-full h-32 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-4xl">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            item.image || "📦"
                          )}
                        </div>
                        <p className="font-semibold text-slate-900 mb-1">
                          {item.title}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ${item.price}
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            {/* No Results */}
            {totalResults === 0 && !loading && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 mx-auto text-slate-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No results found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default SearchResults;
