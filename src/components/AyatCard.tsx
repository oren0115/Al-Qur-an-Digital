import { useState } from "react";
import { Bookmark, BookmarkCheck, Copy, Share2, Play, FileText, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSettings } from "@/contexts/SettingsContext";
import { useBookmark } from "@/contexts/BookmarkContext";
import { useNotes } from "@/contexts/NotesContext";
import { useProgress } from "@/contexts/ProgressContext";
import { ShareDialog } from "@/components/ShareDialog";
import type { Ayat, Tafsir } from "@/types/api";

interface AyatCardProps {
  ayat: Ayat;
  surahNomor: number;
  surahNama: string;
  tafsir?: Tafsir["ayat"][0];
  onPlay: (audioUrl: string) => void;
  onNoteClick: () => void;
}

export function AyatCard({ ayat, surahNomor, surahNama, tafsir, onPlay, onNoteClick }: AyatCardProps) {
  const { settings } = useSettings();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark();
  const { hasNote } = useNotes();
  const { markAyatRead } = useProgress();
  const [showTafsir, setShowTafsir] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleBookmark = () => {
    if (isBookmarked(surahNomor, ayat.nomorAyat)) {
      removeBookmark(surahNomor, ayat.nomorAyat);
    } else {
      addBookmark({
        surahNomor,
        surahNama,
        ayatNomor: ayat.nomorAyat,
        teksArab: ayat.teksArab,
        teksLatin: ayat.teksLatin,
        teksIndonesia: ayat.teksIndonesia,
      });
    }
  };

  const handleCopy = async () => {
    const text = `${ayat.teksArab}\n\n${ayat.teksLatin}\n\n${ayat.teksIndonesia}`;
    await navigator.clipboard.writeText(text);
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handlePlay = () => {
    const audioUrl = ayat.audio[settings.selectedQari] || ayat.audio["01"] || Object.values(ayat.audio)[0];
    if (audioUrl) {
      onPlay(audioUrl);
      markAyatRead(surahNomor, ayat.nomorAyat, 1);
    }
  };

  return (
    <Card className="relative" onMouseEnter={() => markAyatRead(surahNomor, ayat.nomorAyat, 1)}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <Badge
            variant="secondary"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          >
            {ayat.nomorAyat}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={handlePlay}>
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={handleBookmark}>
              {isBookmarked(surahNomor, ayat.nomorAyat) ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={onNoteClick}>
              {hasNote(surahNomor, ayat.nomorAyat) ? (
                <StickyNote className="h-4 w-4 text-primary" />
              ) : (
                <StickyNote className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p
          className="mb-3 text-right leading-loose"
          style={{ fontSize: `${settings.arabFontSize}px` }}
        >
          {ayat.teksArab}
        </p>
        <p
          className="mb-2 text-muted-foreground"
          style={{ fontSize: `${settings.latinFontSize}px` }}
        >
          {ayat.teksLatin}
        </p>
        {settings.showTranslation && (
          <p className="mb-3 text-sm leading-relaxed">{ayat.teksIndonesia}</p>
        )}
        {tafsir && (
          <Collapsible open={showTafsir} onOpenChange={setShowTafsir}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                {showTafsir ? "Sembunyikan" : "Tampilkan"} Tafsir
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="rounded-lg border bg-muted/50 p-3 text-sm leading-relaxed">
                {tafsir.tafsir.teks}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
        <ShareDialog
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          surahNama={surahNama}
          ayatNomor={ayat.nomorAyat}
          teksArab={ayat.teksArab}
          teksLatin={ayat.teksLatin}
          teksIndonesia={ayat.teksIndonesia}
        />
      </CardContent>
    </Card>
  );
}

