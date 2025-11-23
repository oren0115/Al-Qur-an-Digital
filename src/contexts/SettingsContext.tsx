import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Settings {
  theme: "light" | "dark";
  arabFontSize: number;
  latinFontSize: number;
  showTranslation: boolean;
  selectedQari: string;
  autoPlayNext: boolean;
  repeatMode: "off" | "ayat" | "surah";
  nightModeStart: string;
  nightModeEnd: string;
  dailyReminder: boolean;
  reminderTime: string;
}

const defaultSettings: Settings = {
  theme: "light",
  arabFontSize: 24,
  latinFontSize: 16,
  showTranslation: true,
  selectedQari: "01",
  autoPlayNext: false,
  repeatMode: "off",
  nightModeStart: "18:00",
  nightModeEnd: "06:00",
  dailyReminder: false,
  reminderTime: "05:00",
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

  useEffect(() => {
    if (settings.nightModeStart && settings.nightModeEnd) {
      const checkNightMode = () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const [startH, startM] = settings.nightModeStart.split(":").map(Number);
        const [endH, endM] = settings.nightModeEnd.split(":").map(Number);
        const startTime = startH * 60 + startM;
        const endTime = endH * 60 + endM;
        const current = now.getHours() * 60 + now.getMinutes();

        let shouldBeDark = false;
        if (startTime > endTime) {
          shouldBeDark = current >= startTime || current < endTime;
        } else {
          shouldBeDark = current >= startTime && current < endTime;
        }

        if (shouldBeDark && settings.theme !== "dark") {
          updateSettings({ theme: "dark" });
        } else if (!shouldBeDark && settings.theme === "dark" && !document.documentElement.classList.contains("dark")) {
          updateSettings({ theme: "light" });
        }
      };

      checkNightMode();
      const interval = setInterval(checkNightMode, 60000);
      return () => clearInterval(interval);
    }
  }, [settings.nightModeStart, settings.nightModeEnd]);

  useEffect(() => {
    if (settings.dailyReminder && settings.reminderTime) {
      const [hours, minutes] = settings.reminderTime.split(":").map(Number);
      const now = new Date();
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      const timeout = setTimeout(() => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Al-Qur'an Digital", {
            body: "Waktunya membaca Al-Qur'an hari ini",
            icon: "/vite.svg",
          });
        }
      }, timeUntilReminder);

      return () => clearTimeout(timeout);
    }
  }, [settings.dailyReminder, settings.reminderTime]);

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

