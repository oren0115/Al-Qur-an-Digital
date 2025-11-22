import { useNavigate } from "react-router-dom";
import { Trash2, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookmark } from "@/contexts/BookmarkContext";
import { useSettings } from "@/contexts/SettingsContext";

export function BookmarkPage() {
  const { bookmarks, removeBookmark } = useBookmark();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const handleRemove = (surahNomor: number, ayatNomor: number) => {
    removeBookmark(surahNomor, ayatNomor);
  };

  const handleShare = async (bookmark: typeof bookmarks[0]) => {
    if (navigator.share) {
      await navigator.share({
        title: `${bookmark.surahNama} - Ayat ${bookmark.ayatNomor}`,
        text: `${bookmark.teksArab}\n\n${bookmark.teksIndonesia}`,
      });
    }
  };

  const handleNavigate = (surahNomor: number) => {
    navigate(`/surah/${surahNomor}`);
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Bookmark</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {bookmarks.length} ayat tersimpan
          </p>
        </div>
      </header>

      <main className="p-4">
        {bookmarks.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Belum ada bookmark
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((bookmark) => (
                <Card key={`${bookmark.surahNomor}-${bookmark.ayatNomor}`}>
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div
                        className="cursor-pointer flex-1"
                        onClick={() => handleNavigate(bookmark.surahNomor)}
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <Badge variant="secondary">{bookmark.surahNomor}</Badge>
                          <h3 className="font-semibold">{bookmark.surahNama}</h3>
                          <Badge variant="outline">Ayat {bookmark.ayatNomor}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          onClick={() => handleShare(bookmark)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer"
                          onClick={() => handleRemove(bookmark.surahNomor, bookmark.ayatNomor)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p
                      className="mb-2 text-right leading-loose"
                      style={{ fontSize: `${settings.arabFontSize}px` }}
                    >
                      {bookmark.teksArab}
                    </p>
                    {settings.showTranslation && (
                      <p className="text-sm leading-relaxed">{bookmark.teksIndonesia}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

