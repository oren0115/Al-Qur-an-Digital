import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface Note {
  surahNomor: number;
  ayatNomor: number;
  text: string;
  timestamp: number;
}

interface NotesContextType {
  notes: Note[];
  addNote: (surahNomor: number, ayatNomor: number, text: string) => void;
  updateNote: (surahNomor: number, ayatNomor: number, text: string) => void;
  deleteNote: (surahNomor: number, ayatNomor: number) => void;
  getNote: (surahNomor: number, ayatNomor: number) => Note | undefined;
  hasNote: (surahNomor: number, ayatNomor: number) => boolean;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("quran-notes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quran-notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (surahNomor: number, ayatNomor: number, text: string) => {
    setNotes((prev) => {
      const exists = prev.some(
        (n) => n.surahNomor === surahNomor && n.ayatNomor === ayatNomor
      );
      if (exists) return prev;
      return [...prev, { surahNomor, ayatNomor, text, timestamp: Date.now() }];
    });
  };

  const updateNote = (surahNomor: number, ayatNomor: number, text: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.surahNomor === surahNomor && n.ayatNomor === ayatNomor
          ? { ...n, text, timestamp: Date.now() }
          : n
      )
    );
  };

  const deleteNote = (surahNomor: number, ayatNomor: number) => {
    setNotes((prev) =>
      prev.filter((n) => !(n.surahNomor === surahNomor && n.ayatNomor === ayatNomor))
    );
  };

  const getNote = (surahNomor: number, ayatNomor: number) => {
    return notes.find((n) => n.surahNomor === surahNomor && n.ayatNomor === ayatNomor);
  };

  const hasNote = (surahNomor: number, ayatNomor: number) => {
    return notes.some((n) => n.surahNomor === surahNomor && n.ayatNomor === ayatNomor);
  };

  return (
    <NotesContext.Provider
      value={{ notes, addNote, updateNote, deleteNote, getNote, hasNote }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
}

