import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";

function Marketplace() {
  const { user } = useAuth();
  const { branding } = useBranding();
  const [activeTab, setActiveTab] = useState("schoolStore");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setItems([
        // School Store Items
        {
          id: "school1",
          title: "UNICON Official Hoodie",
          price: 25,
          image: "👕",
          category: "Apparel",
          seller: "USP Store",
          description: "Comfortable cotton hoodie with school logo",
          condition: "New",
          verified: true,
          stock: 25,
          type: "school",
        },
        {
          id: "school2",
          title: "Programming Textbook",
          price: 15,
          image: "📚",
          category: "Textbooks",
          seller: "USP Store",
          description: "Introduction to Computer Science - Latest Edition",
          condition: "New",
          verified: true,
          stock: 50,
          type: "school",
        },
        {
          id: "school3",
          title: "UNICON Stickers Pack",
          price: 8,
          image: "T",
          category: "Accessories",
          seller: "USP Store",
          description: "Set of 10 vinyl stickers for laptops and notebooks",
          condition: "New",
          verified: true,
          stock: 50,
          type: "school",
        },
        // Student Listings
        {
          id: "student1",
          title: "Used MacBook Pro",
          price: 800,
          image: "💻",
          category: "Electronics",
          seller: "Alex Johnson",
          sellerEmail: "student@school.edu",
          description:
            "Used but in excellent condition. No highlights or markings.",
          condition: "Good",
          verified: false,
          datePosted: "2025-09-20",
          type: "student",
        },
        {
          id: "student2",
          title: "iPhone 12",
          price: 400,
          image: "📱",
          category: "Electronics",
          seller: "Sarah Chen",
          sellerEmail: "sarah@university.edu",
          description:
            "Perfect for students. Battery health 95%. Includes charger.",
          condition: "Excellent",
          verified: false,
          datePosted: "2025-09-18",
          type: "student",
        },
        {
          id: "student3",
          title: "Gaming Chair",
          price: 120,
          image: "🪑",
          category: "Furniture",
          seller: "Mike Rodriguez",
          sellerEmail: "mike@k12.school",
          description:
            "Comfortable gaming chair, great for long study sessions",
          condition: "Good",
          verified: false,
          datePosted: "2025-09-15",
          type: "student",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    "all",
    "Textbooks",
    "Electronics",
    "Apparel",
    "Accessories",
    "Furniture",
  ];

  const getFilteredItems = () => {
    const filteredByTab = items.filter((item) => item.type === activeTab);
    if (selectedCategory === "all") return filteredByTab;
    return filteredByTab.filter((item) => item.category === selectedCategory);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Marketplace
          </h1>
          <p className="text-slate-600">
            Buy and sell items within the {branding.name || "UNICON"} community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("schoolStore")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "schoolStore"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏪 School Store
            </button>
            <button
              onClick={() => setActiveTab("studentListings")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "studentListings"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Student Listings
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {getFilteredItems().map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4 text-center">{item.image}</div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 text-sm">
                  {item.title}
                </h3>
                {item.verified && (
                  <span className="text-blue-500 text-xs">✓</span>
                )}
              </div>
              <p className="text-lg font-bold text-blue-600 mb-2">
                ${item.price}
              </p>
              <p className="text-sm text-slate-600 mb-3">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span>{item.condition}</span>
                <span>{item.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">by {item.seller}</span>
                <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Post New Listing */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-lg font-semibold mb-2">
            Have something to sell?
          </h3>
          <p className="mb-4 text-blue-100">
            List your items and connect with fellow students
          </p>
          <button className="px-6 py-2 rounded-lg font-medium transition-colors bg-white text-blue-600 hover:bg-blue-50">
            Post New Listing
          </button>
        </div>

        {/* Safety Tips */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Safety Tips
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Meet in Public Places
                </h3>
                <p className="text-sm text-slate-600">
                  Always meet in well-lit, public areas for exchanges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">Verify Items</h3>
                <p className="text-sm text-slate-600">
                  Inspect items thoroughly before making payment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">Use School Email</h3>
                <p className="text-sm text-slate-600">
                  Communicate through verified school email addresses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">Report Issues</h3>
                <p className="text-sm text-slate-600">
                  Report any suspicious activity to school administration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketplace;
