import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
  const [listings, setListings] = useState(defaultListings);
  const [filter, setFilter] = useState("all");

  const filteredListings = listings.filter((item) => {
    if (filter === "all") return true;
    if (filter === "pending") return item.status === "pending";
    if (filter === "flagged") return item.flagged;
    if (filter === "approved") return item.status === "approved";
    return true;
  });

  const approveListing = (id, status) => {
    setListings((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status, flagged: status !== "approved" }
          : item
      )
    );
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
              onClick={() => navigate("/admin-dashboard")}
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
