import React, { createContext, useContext, useState, useEffect } from "react";

const BrandingContext = createContext();

export function BrandingProvider({ children }) {
  // Global branding for landing page (always UNICON)
  const [globalBranding] = useState({
    name: "UNICON",
    color: "#1a237e",
    logoData: "/UNICON.png",
    plan: "Basic",
  });

  // School-specific branding for authenticated pages
  const [schoolBranding, setSchoolBranding] = useState({
    name: "UNICON",
    color: "#1a237e",
    logoData: "/UNICON.png",
    plan: "Basic",
    schoolId: null,
  });

  useEffect(() => {
    // Load school branding from localStorage
    try {
      const savedSchoolBranding = JSON.parse(
        localStorage.getItem("schoolBranding") || "null"
      );
      if (savedSchoolBranding) {
        setSchoolBranding(savedSchoolBranding);
        applySchoolBranding(savedSchoolBranding);
      }
    } catch (error) {
      console.error("Failed to load school branding:", error);
    }
  }, []);

  const applySchoolBranding = (brandData) => {
    if (brandData?.color) {
      document.documentElement.style.setProperty(
        "--school-brand-color",
        brandData.color
      );

      // Generate darker variant
      const hex = brandData.color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);

      const darkR = Math.max(0, Math.floor(r * 0.8));
      const darkG = Math.max(0, Math.floor(g * 0.8));
      const darkB = Math.max(0, Math.floor(b * 0.8));

      const darkColor = `#${darkR.toString(16).padStart(2, "0")}${darkG
        .toString(16)
        .padStart(2, "0")}${darkB.toString(16).padStart(2, "0")}`;
      document.documentElement.style.setProperty(
        "--school-brand-color-700",
        darkColor
      );
    }
  };

  const updateSchoolBranding = (newBranding) => {
    const updatedBranding = { ...schoolBranding, ...newBranding };
    setSchoolBranding(updatedBranding);
    localStorage.setItem("schoolBranding", JSON.stringify(updatedBranding));
    applySchoolBranding(updatedBranding);
  };

  const clearSchoolBranding = () => {
    setSchoolBranding({
      name: "UNICON",
      color: "#1a237e",
      logoData: "/UNICON.png",
      plan: "Basic",
      schoolId: null,
    });
    localStorage.removeItem("schoolBranding");
  };

  const value = {
    globalBranding,
    schoolBranding,
    updateSchoolBranding,
    applySchoolBranding,
    clearSchoolBranding,
    // For backward compatibility
    branding: schoolBranding,
    updateBranding: updateSchoolBranding,
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
