import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBranding } from "../contexts/BrandingContext";
import { studentApi } from "../apps/shared/utils/api";
import { useToast } from "../components/Toast";
import { GridSkeleton } from "../components/SkeletonLoader";
import {
  uploadImage,
  compressImage,
  uploadMultipleImages,
} from "../apps/shared/utils/fileUpload";

function Marketplace() {
  const { user, isAdmin } = useAuth();
  const { branding } = useBranding();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("schoolStore");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [tutoringServices, setTutoringServices] = useState([]);
  const [textbookRentals, setTextbookRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showTutoringModal, setShowTutoringModal] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    condition: "Good",
    type: "student",
    images: [],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [newTutoringService, setNewTutoringService] = useState({
    subject: "",
    level: "Undergraduate",
    rate: "",
    availability: "",
    description: "",
    credentials: "",
  });

  useEffect(() => {
    fetchMarketplaceData();
  }, [selectedCategory, activeTab]);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }
      if (activeTab === "schoolStore") {
        params.type = "school";
      } else if (activeTab === "studentListings") {
        params.type = "student";
      }

      const response = await studentApi.getMarketplace(params);
      const itemsData = response.items || response.data || [];

      setItems(
        itemsData.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price || 0,
          image: item.image_url || item.image || "📦",
          category: item.category || "General",
          seller:
            item.seller_name ||
            `${item.first_name || ""} ${item.last_name || ""}`.trim() ||
            "Unknown",
          sellerEmail: item.seller_email || item.email,
          description: item.description || "",
          condition: item.condition || "Good",
          verified: item.verified || false,
          stock: item.stock || 1,
          type: item.type || "student",
          sellerVerified: item.seller_verified || false,
          sellerRating: item.seller_rating || 0,
          sellerReviews: item.seller_reviews || 0,
          images: item.images || [],
          location: item.location || "",
          datePosted: item.created_at || item.date_posted,
        }))
      );

      // Fetch tutoring services separately if needed
      // This would be a separate API endpoint
      // For now, keeping the mock data structure
    } catch (err) {
      console.error("Failed to fetch marketplace data:", err);
      showToast("Failed to load marketplace items", "error");
      // Fallback to empty array
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListingAPI = async (listingData) => {
    try {
      const response = await studentApi.createListing(listingData);
      showToast("Listing created successfully!", "success");
      setShowListingModal(false);
      fetchMarketplaceData(); // Refresh listings
      return response;
    } catch (err) {
      console.error("Failed to create listing:", err);
      showToast("Failed to create listing", "error");
      throw err;
    }
  };

  const categories = [
    "all",
    "Textbooks",
    "Electronics",
    "Apparel",
    "Accessories",
    "Furniture",
    "Services",
  ];

  const getFilteredItems = () => {
    // Map activeTab values to item.type values
    const typeMap = {
      schoolStore: "school",
      studentListings: "student",
    };
    const expectedType = typeMap[activeTab] || activeTab;
    const filteredByTab = items.filter((item) => item.type === expectedType);
    if (selectedCategory === "all") return filteredByTab;
    return filteredByTab.filter((item) => item.category === selectedCategory);
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      await handleCreateListingAPI({
        title: newListing.title,
        description: newListing.description,
        price: parseFloat(newListing.price),
        category: newListing.category,
        condition: newListing.condition,
        type: newListing.type || "student",
        images: newListing.images,
      });
    } catch (err) {
      // Error already handled in handleCreateListingAPI
    }
  };

  const handleCreateTutoringService = (e) => {
    e.preventDefault();
    if (newTutoringService.subject && newTutoringService.rate) {
      const service = {
        id: `tutor-${Date.now()}`,
        ...newTutoringService,
        name: user?.name || "Anonymous",
        rating: 5.0,
        reviews: 0,
        verified: true,
        profileImage: "👨‍🎓",
        specialties: [newTutoringService.subject],
        responseTime: "Within 24 hours",
      };
      setTutoringServices((prev) => [...prev, service]);
      setNewTutoringService({
        subject: "",
        level: "Undergraduate",
        rate: "",
        availability: "",
        description: "",
        credentials: "",
      });
      setShowTutoringModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Enhanced Marketplace
          </h1>
          <p className="text-slate-600">
            Buy, sell, rent, and find tutoring services within the{" "}
            {branding.name || "UNICON"} community
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex gap-4 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("schoolStore")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === "schoolStore"
                  ? "bg-[#e1e6ed] text-[#3c4b58] border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🏪 School Store
            </button>
            <button
              onClick={() => setActiveTab("studentListings")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === "studentListings"
                  ? "bg-[#e1e6ed] text-[#3c4b58] border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📦 Student Listings
            </button>
            <button
              onClick={() => setActiveTab("tutoring")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === "tutoring"
                  ? "bg-[#e1e6ed] text-[#3c4b58] border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              🎓 Tutoring Services
            </button>
            <button
              onClick={() => setActiveTab("rentals")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === "rentals"
                  ? "bg-[#e1e6ed] text-[#3c4b58] border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              📚 Textbook Rentals
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
                    ? "bg-[#e1e6ed] text-[#3c4b58] border border-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category === "all" ? "All Categories" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "schoolStore" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {loading ? (
              <GridSkeleton count={6} columns={3} />
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-600">
                {error}
              </div>
            ) : getFilteredItems().length > 0 ? (
              getFilteredItems().map((item) => (
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
                      <span className="text-[#4a5a68] text-xs">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-[#4a5a68] mb-2">
                    ${item.price}
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{item.condition}</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        by {item.seller}
                      </span>
                      {item.sellerVerified && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-[#708090] text-white text-sm hover:bg-[#708090] transition-colors">
                      Buy Now
                    </button>
                  </div>
                  {item.stock && (
                    <div className="mt-2 text-xs text-slate-500">
                      {item.stock} in stock
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-500">
                No items found in this category
              </div>
            )}
          </div>
        )}

        {activeTab === "studentListings" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {loading ? (
              <GridSkeleton count={6} columns={3} />
            ) : error ? (
              <div className="col-span-full text-center py-8 text-red-600">
                {error}
              </div>
            ) : getFilteredItems().length > 0 ? (
              getFilteredItems().map((item) => (
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
                      <span className="text-[#4a5a68] text-xs">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-[#4a5a68] mb-2">
                    ${item.price}
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{item.condition}</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>⭐ {item.sellerRating}</span>
                      <span>({item.sellerReviews} reviews)</span>
                      {item.sellerVerified && (
                        <span className="text-green-500">
                          ✓ Verified Seller
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      📍 {item.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      by {item.seller}
                    </span>
                    <button className="px-4 py-2 rounded-lg bg-[#708090] text-white text-sm hover:bg-[#708090] transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-500">
                No student listings found
              </div>
            )}
          </div>
        )}

        {activeTab === "tutoring" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {tutoringServices.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{tutor.profileImage}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {tutor.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{tutor.subject}</span>
                      <span>•</span>
                      <span>{tutor.level}</span>
                      {tutor.verified && (
                        <span className="text-green-500">✓ Verified</span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-lg font-bold text-[#4a5a68] mb-2">
                  ${tutor.rate}/hour
                </p>
                <p className="text-sm text-slate-600 mb-3">
                  {tutor.description}
                </p>
                <div className="mb-3">
                  <div className="text-xs text-slate-500 mb-1">
                    <strong>Availability:</strong> {tutor.availability}
                  </div>
                  <div className="text-xs text-slate-500 mb-1">
                    <strong>Credentials:</strong> {tutor.credentials}
                  </div>
                  <div className="text-xs text-slate-500 mb-1">
                    <strong>Response Time:</strong> {tutor.responseTime}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>⭐ {tutor.rating}</span>
                    <span>({tutor.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {tutor.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#e1e6ed] text-blue-800 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <button className="w-full px-4 py-2 rounded-lg bg-[#708090] text-white text-sm hover:bg-[#5a6a78] transition-colors">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "rentals" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {textbookRentals.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4 text-center">{book.image}</div>
                <h3 className="font-semibold text-slate-900 text-sm mb-2">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-600 mb-2">by {book.author}</p>
                <p className="text-xs text-slate-500 mb-3">{book.edition}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-semibold">
                      Rental: ${book.rentalPrice}
                    </span>
                    <span className="text-slate-500">
                      Buy: ${book.purchasePrice}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-3">
                  <div>
                    <strong>Course:</strong> {book.course}
                  </div>
                  <div>
                    <strong>Semester:</strong> {book.semester}
                  </div>
                  <div>
                    <strong>Condition:</strong> {book.condition}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      by {book.renter}
                    </span>
                    {book.verified && (
                      <span className="text-green-500 text-xs">✓</span>
                    )}
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg text-white text-sm transition-colors ${
                      book.available
                        ? "bg-[#708090] hover:bg-[#708090]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!book.available}
                  >
                    {book.available ? "Rent Now" : "Unavailable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Sell Items</h3>
            <p className="mb-4 text-blue-100 text-sm">
              List your items and connect with fellow students
            </p>
            <button
              onClick={() => setShowListingModal(true)}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-[#4a5a68] hover:bg-[#708090]/10"
            >
              Post Listing
            </button>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Offer Tutoring</h3>
            <p className="mb-4 text-green-100 text-sm">
              Share your knowledge and earn money
            </p>
            <button
              onClick={() => setShowTutoringModal(true)}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-green-600 hover:bg-green-50"
            >
              Become Tutor
            </button>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Rent Textbooks</h3>
            <p className="mb-4 text-purple-100 text-sm">
              Save money on expensive textbooks
            </p>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-purple-600 hover:bg-purple-50">
              Browse Rentals
            </button>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white text-center">
            <h3 className="text-lg font-semibold mb-2">Find Services</h3>
            <p className="mb-4 text-orange-100 text-sm">
              Get help with academics and more
            </p>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-white text-orange-600 hover:bg-orange-50">
              Explore Services
            </button>
          </div>
        </div>

        {/* Enhanced Safety Tips */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            🛡️ Safety & Verification
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">Verified Sellers</h3>
                <p className="text-sm text-slate-600">
                  All sellers are verified with school email addresses
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Safe Meeting Spots
                </h3>
                <p className="text-sm text-slate-600">
                  Designated campus locations for exchanges
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">
                  Escrow Protection
                </h3>
                <p className="text-sm text-slate-600">
                  Secure payment processing for large transactions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-medium text-slate-900">24/7 Support</h3>
                <p className="text-sm text-slate-600">
                  Report issues anytime to campus security
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Create New Listing
            </h3>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) =>
                    setNewListing({ ...newListing, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter item title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newListing.description}
                  onChange={(e) =>
                    setNewListing({
                      ...newListing,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your item"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={newListing.price}
                    onChange={(e) =>
                      setNewListing({ ...newListing, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newListing.category}
                    onChange={(e) =>
                      setNewListing({ ...newListing, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Textbooks">Textbooks</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Condition
                </label>
                <select
                  value={newListing.condition}
                  onChange={(e) =>
                    setNewListing({ ...newListing, condition: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={uploadingImages}
                />
                {uploadingImages && (
                  <p className="text-xs text-slate-500 mt-1">
                    Uploading images...
                  </p>
                )}
                {newListing.images.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {newListing.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewListing((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#708090] text-white rounded-lg hover:bg-[#5a6a78] transition-colors"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tutoring Service Modal */}
      {showTutoringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Offer Tutoring Service
            </h3>
            <form onSubmit={handleCreateTutoringService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTutoringService.subject}
                  onChange={(e) =>
                    setNewTutoringService({
                      ...newTutoringService,
                      subject: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science, Mathematics"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Level
                  </label>
                  <select
                    value={newTutoringService.level}
                    onChange={(e) =>
                      setNewTutoringService({
                        ...newTutoringService,
                        level: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High School">High School</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rate ($/hour)
                  </label>
                  <input
                    type="number"
                    value={newTutoringService.rate}
                    onChange={(e) =>
                      setNewTutoringService({
                        ...newTutoringService,
                        rate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Availability
                </label>
                <input
                  type="text"
                  value={newTutoringService.availability}
                  onChange={(e) =>
                    setNewTutoringService({
                      ...newTutoringService,
                      availability: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Mon-Fri 6-9 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTutoringService.description}
                  onChange={(e) =>
                    setNewTutoringService({
                      ...newTutoringService,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your teaching experience and approach"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Credentials
                </label>
                <input
                  type="text"
                  value={newTutoringService.credentials}
                  onChange={(e) =>
                    setNewTutoringService({
                      ...newTutoringService,
                      credentials: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Computer Science Major, Teaching Assistant"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTutoringModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
