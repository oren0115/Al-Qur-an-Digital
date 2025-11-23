import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

interface ReadingHistory {
  surahNomor: number;
  surahNama: string;
  surahNamaLatin: string;
  timestamp: number;
}

interface HistoryContextType {
  history: ReadingHistory[];
  addHistory: (surahNomor: number, surahNama: string, surahNamaLatin: string) => void;
  clearHistory: () => void;
  getLastRead: () => ReadingHistory | null;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<ReadingHistory[]>(() => {
    const saved = localStorage.getItem("quran-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quran-history", JSON.stringify(history));
  }, [history]);

  const addHistory = useCallback((surahNomor: number, surahNama: string, surahNamaLatin: string) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.surahNomor !== surahNomor);
      return [
        { surahNomor, surahNama, surahNamaLatin, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 10);
    });
  }, []);

  const clearHistory = () => {
    setHistory([]);
  };

  const getLastRead = () => {
    return history.length > 0 ? history[0] : null;
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory, getLastRead }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within HistoryProvider");
  }
  return context;
}

