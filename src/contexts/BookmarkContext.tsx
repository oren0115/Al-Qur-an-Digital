import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Bookmark } from "@/types/api";

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, "timestamp">) => void;
  removeBookmark: (surahNomor: number, ayatNomor: number) => void;
  isBookmarked: (surahNomor: number, ayatNomor: number) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem("quran-bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quran-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Omit<Bookmark, "timestamp">) => {
    setBookmarks((prev) => {
      const exists = prev.some(
        (b) => b.surahNomor === bookmark.surahNomor && b.ayatNomor === bookmark.ayatNomor
      );
      if (exists) return prev;
      return [...prev, { ...bookmark, timestamp: Date.now() }];
    });
  };

  const removeBookmark = (surahNomor: number, ayatNomor: number) => {
    setBookmarks((prev) =>
      prev.filter((b) => !(b.surahNomor === surahNomor && b.ayatNomor === ayatNomor))
    );
  };

  const isBookmarked = (surahNomor: number, ayatNomor: number) => {
    return bookmarks.some(
      (b) => b.surahNomor === surahNomor && b.ayatNomor === ayatNomor
    );
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmark must be used within BookmarkProvider");
  }
  return context;
}

