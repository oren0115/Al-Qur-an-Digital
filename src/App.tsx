import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import { BottomNav } from "@/components/BottomNav";
import { Home } from "@/pages/Home";
import { SurahDetail } from "@/pages/SurahDetail";
import { BookmarkPage } from "@/pages/BookmarkPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { JuzPage } from "@/pages/JuzPage";
import "./css/index.css";

function App() {
  return (
    <SettingsProvider>
      <BookmarkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/surah/:nomor" element={<SurahDetail />} />
            <Route path="/bookmark" element={<BookmarkPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/juz" element={<JuzPage />} />
          </Routes>
          <BottomNav />
        </BrowserRouter>
      </BookmarkProvider>
    </SettingsProvider>
  );
}

export default App;
