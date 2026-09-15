import { createContext, useContext, useEffect, useState } from "react";

const StoreSettingsContext = createContext();

const defaultSettings = {
  storeName: "LUXECART",
  currency: "GHS - Ghana Cedi",
  storeStatus: "Active",
  adminName: "Administrator",
  adminRole: "Store Manager",
};

export function StoreSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("luxecartSettings");

    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error("Unable to read store settings:", error);
      }
    }

    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(
      "luxecartSettings",
      JSON.stringify(settings)
    );
  }, [settings]);

  function updateSettings(newSettings) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...newSettings,
    }));
  }

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
}

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}