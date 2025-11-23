import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { BottomNav } from "@/components/BottomNav";
import { Home } from "@/pages/Home";
import { SurahDetail } from "@/pages/SurahDetail";
import { BookmarkPage } from "@/pages/BookmarkPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { JuzPage } from "@/pages/JuzPage";
import { SurahListPage } from "@/pages/SurahListPage";
import "./css/index.css";

function App() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  return (
    <SettingsProvider>
      <BookmarkProvider>
        <HistoryProvider>
          <NotesProvider>
            <ProgressProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/surah/:nomor" element={<SurahDetail />} />
                  <Route path="/surah-list" element={<SurahListPage />} />
                  <Route path="/bookmark" element={<BookmarkPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/juz" element={<JuzPage />} />
                </Routes>
                <BottomNav />
              </BrowserRouter>
            </ProgressProvider>
          </NotesProvider>
        </HistoryProvider>
      </BookmarkProvider>
    </SettingsProvider>
  );
}

export default App;
