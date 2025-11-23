import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ReadingProgress {
  surahNomor: number;
  lastAyatRead: number;
  totalAyatRead: number;
  timestamp: number;
}

interface ProgressContextType {
  progress: ReadingProgress[];
  markAyatRead: (surahNomor: number, ayatNomor: number, totalAyat: number) => void;
  getProgress: (surahNomor: number) => ReadingProgress | undefined;
  getTotalStats: () => { totalAyatRead: number; surahCompleted: number };
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ReadingProgress[]>(() => {
    const saved = localStorage.getItem("quran-progress");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quran-progress", JSON.stringify(progress));
  }, [progress]);

  const markAyatRead = (surahNomor: number, ayatNomor: number, totalAyat: number) => {
    setProgress((prev) => {
      const existing = prev.find((p) => p.surahNomor === surahNomor);
      if (existing) {
        return prev.map((p) =>
          p.surahNomor === surahNomor
            ? {
                ...p,
                lastAyatRead: Math.max(p.lastAyatRead, ayatNomor),
                totalAyatRead: Math.max(p.totalAyatRead, ayatNomor),
                timestamp: Date.now(),
              }
            : p
        );
      }
      return [
        ...prev,
        { surahNomor, lastAyatRead: ayatNomor, totalAyatRead: ayatNomor, timestamp: Date.now() },
      ];
    });
  };

  const getProgress = (surahNomor: number) => {
    return progress.find((p) => p.surahNomor === surahNomor);
  };

  const getTotalStats = () => {
    const totalAyatRead = progress.reduce((sum, p) => sum + p.totalAyatRead, 0);
    const surahCompleted = progress.filter((p) => p.totalAyatRead >= 1).length;
    return { totalAyatRead, surahCompleted };
  };

  const clearProgress = () => {
    setProgress([]);
  };

  return (
    <ProgressContext.Provider
      value={{ progress, markAyatRead, getProgress, getTotalStats, clearProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within ProgressProvider");
  }
  return context;
}

