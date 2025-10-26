import React, { createContext, useContext, useState, useEffect } from "react";

const BrandingContext = createContext();
const DEFAULT_BRAND_COLOR = "#365b6d";

export function BrandingProvider({ children }) {
  // Global branding for landing page (always UNICON)
  const [globalBranding] = useState({
    name: "UNICON",
    color: DEFAULT_BRAND_COLOR,
    logoData: "/UNICON.png",
    plan: "Basic",
    features: {
      customLogo: false,
      customColors: false,
      advancedAnalytics: false,
      prioritySupport: false,
      whiteLabel: false,
    },
  });

  // School-specific branding for authenticated pages
  const [schoolBranding, setSchoolBranding] = useState({
    name: "UNICON",
    color: DEFAULT_BRAND_COLOR,
    logoData: "/UNICON.png",
    plan: "Basic",
    schoolId: null,
    subscription: {
      plan: "Basic",
      features: {
        customLogo: false,
        customColors: false,
        advancedAnalytics: false,
        prioritySupport: false,
        whiteLabel: false,
        customDomain: false,
        unlimitedUsers: false,
        apiAccess: false,
      },
      expiresAt: null,
    },
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
      } else {
        applySchoolBranding(schoolBranding);
      }
    } catch (error) {
      console.error("Failed to load school branding:", error);
    }
  }, []);

  const applySchoolBranding = (brandData = {}) => {
    const baseColor = (brandData.color || DEFAULT_BRAND_COLOR).toLowerCase();
    document.documentElement.style.setProperty(
      "--school-brand-color",
      baseColor
    );
    document.documentElement.style.setProperty("--brand-color", baseColor);

    // Generate darker variant
    const hex = baseColor.replace("#", "");
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const darkR = Math.max(0, Math.floor(r * 0.78));
    const darkG = Math.max(0, Math.floor(g * 0.78));
    const darkB = Math.max(0, Math.floor(b * 0.78));

    const darkColor = `#${darkR.toString(16).padStart(2, "0")}${darkG
      .toString(16)
      .padStart(2, "0")}${darkB.toString(16).padStart(2, "0")}`;
    document.documentElement.style.setProperty(
      "--school-brand-color-700",
      darkColor
    );
    document.documentElement.style.setProperty("--brand-color-700", darkColor);
  };

  const updateSchoolBranding = (newBranding) => {
    const updatedBranding = { ...schoolBranding, ...newBranding };
    setSchoolBranding(updatedBranding);
    localStorage.setItem("schoolBranding", JSON.stringify(updatedBranding));
    applySchoolBranding(updatedBranding);
  };

  const updateSubscription = (subscriptionData) => {
    const updatedBranding = {
      ...schoolBranding,
      subscription: { ...schoolBranding.subscription, ...subscriptionData },
    };
    setSchoolBranding(updatedBranding);
    localStorage.setItem("schoolBranding", JSON.stringify(updatedBranding));
    applySchoolBranding(updatedBranding);
  };

  const upgradeToPremium = (planType = "Premium") => {
    const premiumFeatures = {
      Basic: {
        customLogo: false,
        customColors: false,
        advancedAnalytics: false,
        prioritySupport: false,
        whiteLabel: false,
        customDomain: false,
        unlimitedUsers: false,
        apiAccess: false,
      },
      Premium: {
        customLogo: true,
        customColors: true,
        advancedAnalytics: true,
        prioritySupport: true,
        whiteLabel: false,
        customDomain: false,
        unlimitedUsers: false,
        apiAccess: false,
      },
      Enterprise: {
        customLogo: true,
        customColors: true,
        advancedAnalytics: true,
        prioritySupport: true,
        whiteLabel: true,
        customDomain: true,
        unlimitedUsers: true,
        apiAccess: true,
      },
    };

    updateSubscription({
      plan: planType,
      features: premiumFeatures[planType],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    });
  };

  const clearSchoolBranding = () => {
    setSchoolBranding({
      name: "UNICON",
      color: DEFAULT_BRAND_COLOR,
      logoData: "/UNICON.png",
      plan: "Basic",
      schoolId: null,
      subscription: {
        plan: "Basic",
        features: {
          customLogo: false,
          customColors: false,
          advancedAnalytics: false,
          prioritySupport: false,
          whiteLabel: false,
          customDomain: false,
          unlimitedUsers: false,
          apiAccess: false,
        },
        expiresAt: null,
      },
    });
    localStorage.removeItem("schoolBranding");
    applySchoolBranding({ color: DEFAULT_BRAND_COLOR });
  };

  const getEffectiveLogo = () => {
    // If school has premium and custom logo, use school logo
    if (
      schoolBranding.subscription?.features?.customLogo &&
      schoolBranding.customLogoData
    ) {
      return schoolBranding.customLogoData;
    }
    // Otherwise use UNICON logo
    return "/UNICON.png";
  };

  const getEffectiveBranding = () => {
    return {
      ...schoolBranding,
      logoData: getEffectiveLogo(),
    };
  };

  const value = {
    globalBranding,
    schoolBranding,
    updateSchoolBranding,
    applySchoolBranding,
    clearSchoolBranding,
    updateSubscription,
    upgradeToPremium,
    getEffectiveLogo,
    getEffectiveBranding,
    // For backward compatibility
    branding: getEffectiveBranding(),
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
