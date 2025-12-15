import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdminHeader from "../../apps/admin/components/AdminHeader";
import { adminApi } from "../../apps/shared/utils/api";
import { useToast } from "../../components/Toast";

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
  const { user } = useAuth();
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getMarketplace();
      const items = response.items || response.data || [];
      setListings(
        items.map((item) => ({
          id: item.id,
          title: item.title,
          seller:
            `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
            "Unknown",
          sellerId: item.user_id,
          price: item.price || 0,
          status: item.is_sold ? "sold" : item.status || "pending",
          flagged: item.flagged || false,
          category: item.category || "General",
          image: item.image_url || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError(err.message || "Failed to load listings");
      showToast("Failed to load listings", "error");
      // Fallback to default listings
      setListings(defaultListings);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending";
    if (filter === "flagged") return item.flagged;
    if (filter === "approved") return item.status === "approved";
    return true;
  });

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
      showToast(`Listing ${status} successfully`, "success");
    } catch (err) {
      console.error("Failed to update listing:", err);
      showToast("Failed to update listing", "error");
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

  if (loading) {
    return (
      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
      >
        <AdminHeader
          title="Marketplace"
          description="Review and moderate listings"
        />
        <div className="text-center text-white/60 py-12">
          Loading listings...
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg,#05070e,#1e1140)" }}
    >
      <AdminHeader
        title="Marketplace"
        description="Review and moderate listings"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-6 text-white">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}
        <div className="flex gap-3">
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
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/30 p-4 flex flex-wrap gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white font-semibold">{item.title}</p>
                    {item.flagged && (
                      <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-300">
                        🚩 Flagged
                      </span>
                    )}
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-white/60">
                    {item.seller} • ${item.price}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-3 py-1 ${
                      item.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {item.status}
                  </span>
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
                  <button className="rounded-xl border border-white/20 px-3 py-1.5 text-white/60 hover:bg-white/10 transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
