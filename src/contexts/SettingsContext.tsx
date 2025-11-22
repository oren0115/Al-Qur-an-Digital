import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Settings {
  theme: "light" | "dark";
  arabFontSize: number;
  latinFontSize: number;
  showTranslation: boolean;
}

const defaultSettings: Settings = {
  theme: "light",
  arabFontSize: 24,
  latinFontSize: 16,
  showTranslation: true,
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("quran-settings");
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("quran-settings", JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}

