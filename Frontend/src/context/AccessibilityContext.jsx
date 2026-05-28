import React, { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(
    () => localStorage.getItem("railAid-highContrast") === "true"
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => localStorage.getItem("railAid-reducedMotion") === "true"
  );

  useEffect(() => {
    localStorage.setItem("railAid-highContrast", String(highContrast));
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("railAid-reducedMotion", String(reducedMotion));
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        reducedMotion,
        toggleHighContrast: () => setHighContrast((value) => !value),
        toggleReducedMotion: () => setReducedMotion((value) => !value)
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
