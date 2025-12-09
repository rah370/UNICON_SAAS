import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";

const defaultListings = [
  {
    id: 1,
    title: "Chemistry kit",
    seller: "Alex Johnson",
    sellerId: 1,
    price: 80,
    status: "pending",
    flagged: false,
    category: "Textbooks",
    image: "",
  },
  {
    id: 2,
    title: "MacBook Air 2020",
    seller: "Maria Garcia",
    sellerId: 2,
    price: 690,
    status: "approved",
    flagged: true,
    category: "Electronics",
    image: "",
  },
  {
    id: 3,
    title: "Calculus textbook",
    seller: "John Smith",
    sellerId: 3,
    price: 45,
    status: "pending",
    flagged: false,
    category: "Textbooks",
    image: "",
  },
];

function SectionCard({ title, children, actions }) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.06] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminMarketplace() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedListings, setSelectedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getMarketplace();
        const listingsData = (result.items || []).map((item) => ({
          id: item.id,
          title: item.title,
          seller: `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Unknown",
          sellerId: item.seller_id,
          price: item.price || 0,
          status: item.is_sold ? "sold" : "approved",
          flagged: false,
          category: item.category || "General",
          image: item.image_url || "",
        }));
        setListings(listingsData);
      } catch (err) {
        console.error("Failed to fetch marketplace listings:", err);
        setError("Failed to load listings. Using demo data.");
        setListings(defaultListings);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [isAuthenticated, user, navigate]);

  const filteredListings = useMemo(() => {
    let filtered = listings;

    // Status filter
    if (filter === "pending") filtered = filtered.filter((item) => item.status === "pending");
    if (filter === "flagged") filtered = filtered.filter((item) => item.flagged);
    if (filter === "approved") filtered = filtered.filter((item) => item.status === "approved");

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [listings, filter, searchQuery]);

  const approveListing = async (id, status) => {
    try {
      await adminApi.updateMarketplaceItem(id, { status });
      setListings((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status, flagged: status !== "approved" }
            : item
        )
      );
    } catch (err) {
      alert("Failed to update listing: " + err.message);
    }
  };

  const bulkApprove = async (status) => {
    if (selectedListings.length === 0) return;
    
    try {
      await Promise.all(
        selectedListings.map((id) => adminApi.updateMarketplaceItem(id, { status }))
      );
      setListings((prev) =>
        prev.map((item) =>
          selectedListings.includes(item.id)
            ? { ...item, status, flagged: status !== "approved" }
            : item
        )
      );
      setSelectedListings([]);
      alert(`Successfully ${status === "approved" ? "approved" : "rejected"} ${selectedListings.length} listings`);
    } catch (err) {
      alert("Failed to update listings: " + err.message);
    }
  };

  const toggleListingSelection = (id) => {
    setSelectedListings((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const flagListing = async (id) => {
    try {
      // This would require a flag endpoint
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, flagged: !item.flagged } : item
        )
      );
    } catch (err) {
      alert("Failed to flag listing: " + err.message);
    }
  };

  const stats = [
    { label: "Total Listings", value: listings.length },
    {
      label: "Pending Review",
      value: listings.filter((l) => l.status === "pending").length,
    },
    { label: "Flagged Items", value: listings.filter((l) => l.flagged).length },
    {
      label: "Approved",
      value: listings.filter((l) => l.status === "approved").length,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <header className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">Marketplace</h1>
              <p className="text-sm text-white/60">
                Review and moderate listings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        {loading && (
          <div className="text-center text-white/60 py-12">
            Loading marketplace listings...
          </div>
        )}
        {error && (
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300 mb-6">
            {error}
          </div>
        )}
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white placeholder-white/40"
          />
          {["all", "pending", "flagged", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                filter === f
                  ? "text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
              style={
                filter === f
                  ? {
                      background:
                        "linear-gradient(135deg, #6b21a8 0%, #581c87 100%)",
                    }
                  : { backgroundColor: "rgba(255,255,255,0.05)" }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {selectedListings.length > 0 && (
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 flex items-center justify-between">
            <span className="text-sm text-white">
              {selectedListings.length} listing{selectedListings.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkApprove("approved")}
                className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
              >
                Approve All
              </button>
              <button
                onClick={() => bulkApprove("rejected")}
                className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/30"
              >
                Reject All
              </button>
              <button
                onClick={() => setSelectedListings([])}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/60 hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <SectionCard title="Marketplace Statistics">
          <div className="grid gap-4 text-sm sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Listing Review">
          <div className="space-y-3 text-sm text-white/80">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 text-white/60">
                No listings found matching your filters
              </div>
            ) : (
              filteredListings.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedListings.includes(item.id)}
                    onChange={() => toggleListingSelection(item.id)}
                    className="rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="text-white font-semibold">{item.title}</p>
                    {item.flagged && (
                      <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300">
                        🚩 Flagged
                      </span>
                    )}
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        item.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : item.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-white/60">
                    {item.seller} • ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <button
                    onClick={() => approveListing(item.id, "approved")}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => approveListing(item.id, "rejected")}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-red-300 hover:bg-red-500/20 transition"
                  >
                    ✕ Reject
                  </button>
                  <button
                    onClick={() => flagListing(item.id)}
                    className={`rounded-xl border px-3 py-1.5 transition ${
                      item.flagged
                        ? "border-red-500/30 bg-red-500/20 text-red-300"
                        : "border-white/20 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {item.flagged ? "Unflag" : "Flag"}
                  </button>
                  <button className="rounded-xl border border-white/20 px-3 py-1.5 text-white/60 hover:bg-white/10 transition">
                    View Details
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
