import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { adminApi } from "../../shared/utils/api";
import { useToast } from "../../shared/components/Toast";
import { exportMarketplace } from "../../shared/utils/exportUtils";
import { GridSkeleton } from "../../shared/components/SkeletonLoader";

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
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <div className="ml-auto flex flex-wrap gap-2">{actions}</div>
      </div>
      {children}
    </div>
  );
}

export default function AdminMarketplace() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, showError } = useToast();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedListings, setSelectedListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/admin/login");
      return;
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const result = await adminApi.getMarketplace();
        const listingsData = (result.items || []).map((item) => ({
          id: item.id,
          title: item.title,
          seller:
            `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
            "Unknown",
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
    if (filter === "pending")
      filtered = filtered.filter((item) => item.status === "pending");
    if (filter === "flagged")
      filtered = filtered.filter((item) => item.flagged);
    if (filter === "approved")
      filtered = filtered.filter((item) => item.status === "approved");

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
      success(
        `Listing ${
          status === "approved" ? "approved" : "rejected"
        } successfully`
      );
    } catch (err) {
      showError("Failed to update listing: " + err.message);
    }
  };

  const bulkApprove = async (status) => {
    if (selectedListings.length === 0) return;

    try {
      await Promise.all(
        selectedListings.map((id) =>
          adminApi.updateMarketplaceItem(id, { status })
        )
      );
      setListings((prev) =>
        prev.map((item) =>
          selectedListings.includes(item.id)
            ? { ...item, status, flagged: status !== "approved" }
            : item
        )
      );
      setSelectedListings([]);
      success(
        `Successfully ${status === "approved" ? "approved" : "rejected"} ${
          selectedListings.length
        } listing${selectedListings.length !== 1 ? "s" : ""}`
      );
    } catch (err) {
      showError("Failed to update listings: " + err.message);
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
      const listing = listings.find((l) => l.id === id);
      success(
        `Listing ${listing?.flagged ? "unflagged" : "flagged"} successfully`
      );
    } catch (err) {
      showError("Failed to flag listing: " + err.message);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-[#eef3f7] to-[#dce7ef] text-slate-900">
      <header className="border-b border-white/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Marketplace</h1>
              <p className="text-sm text-slate-600">
                Review and moderate listings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <div className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-xs font-bold text-slate-700">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        {loading && <GridSkeleton count={6} columns={2} />}
        {error && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        )}
        <div className="flex gap-3 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400"
          />
          {["all", "pending", "flagged", "approved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                filter === f
                  ? "text-white shadow"
                  : "text-slate-600 hover:text-slate-800"
              }`}
              style={
                filter === f
                  ? {
                      background:
                        "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                    }
                  : { backgroundColor: "rgba(148, 163, 184, 0.2)" }
              }
            >
              {f}
            </button>
          ))}
        </div>

        {selectedListings.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-center justify-between">
            <span className="text-sm text-slate-800">
              {selectedListings.length} listing
              {selectedListings.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => bulkApprove("approved")}
                className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-500/20"
              >
                Approve All
              </button>
              <button
                onClick={() => bulkApprove("rejected")}
                className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-500/20"
              >
                Reject All
              </button>
              <button
                onClick={() => setSelectedListings([])}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Listing Review"
          actions={
            <button
              onClick={() => {
                try {
                  exportMarketplace(filteredListings);
                  success("Marketplace listings exported successfully");
                } catch (err) {
                  showError("Failed to export: " + err.message);
                }
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              Export CSV
            </button>
          }
        >
          <div className="space-y-3 text-sm text-slate-700">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No listings found matching your filters
              </div>
            ) : (
              filteredListings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-wrap gap-3 shadow-sm"
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
                      <p className="text-slate-900 font-semibold">{item.title}</p>
                      {item.flagged && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                          🚩 Flagged
                        </span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                        {item.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-slate-600">
                      {item.seller} • ₱{item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <button
                      onClick={() => approveListing(item.id, "approved")}
                      className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 hover:bg-emerald-100 transition"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => approveListing(item.id, "rejected")}
                      className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-red-700 hover:bg-red-100 transition"
                    >
                      ✕ Reject
                    </button>
                    <button
                      onClick={() => flagListing(item.id)}
                      className={`rounded-xl border px-3 py-1.5 transition ${
                        item.flagged
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item.flagged ? "Unflag" : "Flag"}
                    </button>
                    <button className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition">
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
