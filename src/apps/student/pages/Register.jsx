import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useBranding } from "../../shared/contexts/BrandingContext";

function Register() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    password: "",
    confirmPassword: "",

    // School Information
    schoolName: "",
    schoolType: "",
    schoolLevel: "",
    establishedYear: "",
    studentCount: "",
    teacherCount: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    phoneNumber: "",

    // School Details
    accreditation: "",
    curriculum: "",
    languages: [],
    facilities: [],
    specialPrograms: [],

    // Branding
    primaryColor: "#1D4E89",
    secondaryColor: "#3B82F6",
    logo: null,

    // Plan Selection
    plan: "Pro",

    // Additional Information
    howDidYouHear: "",
    expectedStartDate: "",
    specificNeeds: "",

    // Agreements
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { branding, updateBranding } = useBranding();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, logo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.schoolName
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!formData.email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (!formData.agreeTerms || !formData.agreePrivacy) {
        setError(
          "Please agree to the Terms and Conditions and Privacy Policy."
        );
        return;
      }

      const result = await register(formData);
      if (result.success) {
        updateBranding({
          name: formData.schoolName,
          color: formData.primaryColor,
          logoData: formData.logo,
          plan: formData.plan,
        });
      navigate("/student-login");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "$29",
      popular: false,
      features: [
        "Up to 500 students",
        "Basic announcements",
        "Event management",
        "Student portal",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$79",
      popular: true,
      features: [
        "Up to 2,000 students",
        "Advanced announcements",
        "Full event management",
        "Messaging system",
        "Marketplace",
        "Analytics dashboard",
        "Priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      popular: false,
      features: [
        "Unlimited students",
        "All features included",
        "Custom integrations",
        "White-label options",
        "Dedicated support",
        "Custom training",
      ],
    },
  ];

  const schoolTypes = [
    "Public School",
    "Private School",
    "Charter School",
    "International School",
    "Religious School",
    "Montessori",
    "Waldorf",
    "Homeschool Co-op",
    "Online School",
    "Other",
  ];

  const schoolLevels = [
    "Elementary (K-5)",
    "Middle School (6-8)",
    "High School (9-12)",
    "K-12",
    "Preschool",
    "University",
    "Community College",
    "Other",
  ];

  const curricula = [
    "Common Core",
    "IB (International Baccalaureate)",
    "AP (Advanced Placement)",
    "Montessori",
    "Waldorf",
    "Reggio Emilia",
    "Traditional",
    "Project-Based",
    "Other",
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Arabic",
    "Portuguese",
    "Other",
  ];

  const facilities = [
    "Library",
    "Computer Lab",
    "Science Lab",
    "Art Studio",
    "Music Room",
    "Gymnasium",
    "Cafeteria",
    "Playground",
    "Swimming Pool",
    "Sports Field",
    "Other",
  ];

  const specialPrograms = [
    "Gifted & Talented",
    "Special Education",
    "ESL/ELL",
    "STEM Program",
    "Arts Program",
    "Sports Program",
    "Music Program",
    "Drama Program",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Watermark */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5 z-0"
        style={{
          backgroundImage: `url('${branding.logoData || "/UNICON.png"}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "200px",
        }}
      />

      <main className="relative z-10 min-h-screen py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[#d0d7df] transition-all"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Landing Page
              </Link>
              <div className="flex items-center gap-3">
                <img
                  src="/UNICON.png"
                  alt="UNICON"
                  className="h-8 w-8"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <span className="text-lg font-semibold text-slate-900">
                  UNICON
                </span>
              </div>
              <div className="w-32"></div> {/* Spacer for centering */}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              School Registration
            </h1>
            <p className="text-lg text-slate-600 mb-6">
              Join thousands of schools using UNICON to manage their digital
              campus
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-8 text-sm text-slate-500">
              <span
                className={
                  currentStep >= 1 ? "text-cyan-600 font-semibold" : ""
                }
              >
                Personal Info
              </span>
              <span
                className={
                  currentStep >= 2 ? "text-cyan-600 font-semibold" : ""
                }
              >
                School Details
              </span>
              <span
                className={
                  currentStep >= 3 ? "text-cyan-600 font-semibold" : ""
                }
              >
                Programs
              </span>
              <span
                className={
                  currentStep >= 4 ? "text-cyan-600 font-semibold" : ""
                }
              >
                Plan
              </span>
              <span
                className={
                  currentStep >= 5 ? "text-cyan-600 font-semibold" : ""
                }
              >
                Review
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8"
          >
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Personal Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Position/Role *
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="">Select your position</option>
                      <option value="Principal">Principal</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Administrator">Administrator</option>
                      <option value="IT Director">IT Director</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      name="howDidYouHear"
                      value={formData.howDidYouHear}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select an option</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Referral">Referral</option>
                      <option value="Conference">Conference</option>
                      <option value="Advertisement">Advertisement</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Create a password (min 8 characters)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: School Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  School Information
                </h2>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School Name *
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter your school name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School Type *
                    </label>
                    <select
                      name="schoolType"
                      value={formData.schoolType}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="">Select school type</option>
                      {schoolTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School Level *
                    </label>
                    <select
                      name="schoolLevel"
                      value={formData.schoolLevel}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="">Select school level</option>
                      {schoolLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year Established
                    </label>
                    <input
                      type="number"
                      name="establishedYear"
                      value={formData.establishedYear}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="e.g., 1995"
                      min="1800"
                      max="2024"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Students
                    </label>
                    <select
                      name="studentCount"
                      value={formData.studentCount}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-250">101-250</option>
                      <option value="251-500">251-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Number of Teachers
                    </label>
                    <select
                      name="teacherCount"
                      value={formData.teacherCount}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10</option>
                      <option value="11-25">11-25</option>
                      <option value="26-50">26-50</option>
                      <option value="51-100">51-100</option>
                      <option value="100+">100+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter school address"
                    required
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="State/Province"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="ZIP/Postal Code"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="">Select country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      School Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="https://www.yourschool.edu"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Programs & Facilities */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Programs & Facilities
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Curriculum *
                  </label>
                  <select
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  >
                    <option value="">Select curriculum</option>
                    {curricula.map((curriculum) => (
                      <option key={curriculum} value={curriculum}>
                        {curriculum}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Languages Offered
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {languages.map((language) => (
                      <label
                        key={language}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() =>
                            handleMultiSelect("languages", language)
                          }
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">
                          {language}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Facilities Available
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {facilities.map((facility) => (
                      <label
                        key={facility}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() =>
                            handleMultiSelect("facilities", facility)
                          }
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">
                          {facility}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Programs
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {specialPrograms.map((program) => (
                      <label
                        key={program}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.specialPrograms.includes(program)}
                          onChange={() =>
                            handleMultiSelect("specialPrograms", program)
                          }
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-700">
                          {program}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Accreditation
                  </label>
                  <input
                    type="text"
                    name="accreditation"
                    value={formData.accreditation}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., WASC, NEASC, IB, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Specific Needs or Requirements
                  </label>
                  <textarea
                    name="specificNeeds"
                    value={formData.specificNeeds}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tell us about any specific needs or requirements for your school..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Plan Selection & Branding */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Plan Selection & Branding
                </h2>

                {/* Plan Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Choose Your Plan
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {plans.map((plan) => (
                      <div
                        key={plan.name}
                        className={`relative rounded-2xl border p-6 bg-white shadow-sm cursor-pointer transition-all ${
                          formData.plan === plan.name
                            ? "ring-2 ring-cyan-500 border-cyan-500"
                            : "hover:shadow-md"
                        } ${plan.popular ? "ring-2 ring-cyan-500" : ""}`}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, plan: plan.name }))
                        }
                      >
                        {plan.popular && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-200">
                            Most Popular
                          </span>
                        )}
                        <h4 className="text-xl font-semibold text-center text-slate-900">
                          {plan.name}
                        </h4>
                        <div className="mt-2 text-center text-cyan-600">
                          <div className="text-3xl font-bold">{plan.price}</div>
                          <div className="text-sm text-slate-500">
                            per month
                          </div>
                        </div>
                        <ul className="mt-6 space-y-2 text-sm text-slate-700">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2"
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Branding */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl border border-slate-200 p-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      className="w-full h-12 rounded-xl border border-slate-200 p-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    School Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white"
                  />
                  {formData.logo && (
                    <div className="mt-3">
                      <img
                        src={formData.logo}
                        alt="Logo preview"
                        className="h-20 w-20 object-contain rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Start Date
                  </label>
                  <input
                    type="date"
                    name="expectedStartDate"
                    value={formData.expectedStartDate}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Review & Agreements */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Review & Agreements
                </h2>

                {/* Review Summary */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Registration Summary
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-slate-700">
                        Personal Information
                      </h4>
                      <p className="text-sm text-slate-600">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm text-slate-600">{formData.email}</p>
                      <p className="text-sm text-slate-600">
                        {formData.position}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700">
                        School Information
                      </h4>
                      <p className="text-sm text-slate-600">
                        {formData.schoolName}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formData.schoolType} - {formData.schoolLevel}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formData.city}, {formData.state}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700">
                        Selected Plan
                      </h4>
                      <p className="text-sm text-slate-600">{formData.plan}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700">Curriculum</h4>
                      <p className="text-sm text-slate-600">
                        {formData.curriculum}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agreements */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      required
                    />
                    <label className="text-sm text-slate-600">
                      I agree to the{" "}
                      <a href="#" className="text-cyan-600 hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and understand that I am registering my school for UNICON
                      services.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      required
                    />
                    <label className="text-sm text-slate-600">
                      I agree to the{" "}
                      <a href="#" className="text-cyan-600 hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of my school's data.
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                    />
                    <label className="text-sm text-slate-600">
                      I would like to receive updates about new features and
                      educational resources (optional).
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 border border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to="/student-login"
                  className="text-slate-600 hover:underline"
                >
                  Already have an account? Sign in
                </Link>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 rounded-xl font-semibold text-white shadow-md bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 transition-all"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-semibold text-white shadow-md bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Creating Account..." : "Create School Account"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Register;
