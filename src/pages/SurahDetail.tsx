import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, Copy, Share2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/AudioPlayer";
import { getSurahDetail } from "@/services/api";
import { useSettings } from "@/contexts/SettingsContext";
import { useBookmark } from "@/contexts/BookmarkContext";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { SurahDetail as SurahDetailType, Ayat } from "@/types/api";

export function SurahDetail() {
  const { nomor } = useParams<{ nomor: string }>();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmark();
  const [surah, setSurah] = useState<SurahDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    async function loadSurah() {
      if (!nomor) return;
      try {
        const data = await getSurahDetail(Number(nomor));
        setSurah(data);
      } catch (error) {
        console.error("Failed to load surah:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSurah();
  }, [nomor]);

  const handlePlayAudio = (ayat: Ayat) => {
    const audioUrl = ayat.audio["01"] || ayat.audio["02"] || Object.values(ayat.audio)[0];
    if (audioUrl) setCurrentAudio(audioUrl);
  };

  const handleBookmark = (ayat: Ayat) => {
    if (!surah) return;
    if (isBookmarked(surah.nomor, ayat.nomorAyat)) {
      removeBookmark(surah.nomor, ayat.nomorAyat);
    } else {
      addBookmark({
        surahNomor: surah.nomor,
        surahNama: surah.namaLatin,
        ayatNomor: ayat.nomorAyat,
        teksArab: ayat.teksArab,
        teksIndonesia: ayat.teksIndonesia,
      });
    }
  };

  const handleCopy = async (ayat: Ayat) => {
    const text = `${ayat.teksArab}\n\n${ayat.teksLatin}\n\n${ayat.teksIndonesia}`;
    await navigator.clipboard.writeText(text);
  };

  const handleShare = async (ayat: Ayat) => {
    if (navigator.share) {
      await navigator.share({
        title: `${surah?.namaLatin} - Ayat ${ayat.nomorAyat}`,
        text: `${ayat.teksArab}\n\n${ayat.teksIndonesia}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Surah tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-32">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Button variant="ghost" className="cursor-pointer" size="icon-sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {/* <div className="flex gap-2">
              <Button variant="ghost" className="cursor-pointer" size="icon-sm" onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
          <h1 className="mb-1 text-2xl font-bold">{surah.namaLatin}</h1>
          <p className="mb-2 text-xl font-medium leading-relaxed">{surah.nama}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{surah.jumlahAyat} ayat</Badge>
            <Badge variant="outline">{surah.tempatTurun}</Badge>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-6">
          {surah.ayat.map((ayat) => (
            <Card key={ayat.nomorAyat} className="relative">
              <CardContent className="p-4">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Badge
                    variant="secondary"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  >
                    {ayat.nomorAyat}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() => handlePlayAudio(ayat)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="cursor-pointer"
                      onClick={() => handleBookmark(ayat)}
                    >
                      {isBookmarked(surah.nomor, ayat.nomorAyat) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" className="cursor-pointer" size="icon-sm" onClick={() => handleCopy(ayat)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" className="cursor-pointer" size="icon-sm" onClick={() => handleShare(ayat)}>
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
                  <p className="text-sm leading-relaxed">{ayat.teksIndonesia}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio}
          onEnded={() => setCurrentAudio("")}
        />
      )}

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Pengaturan Tampilan</DialogTitle>
            <DialogDescription>
              Sesuaikan tampilan ayat sesuai preferensi Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Section: Ukuran Font */}
            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Ukuran Font</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sesuaikan ukuran font untuk kenyamanan membaca
                </p>
              </div>

              <div className="space-y-5">
                {/* Font Arab */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="arab-font-dialog" className="text-base font-medium">
                      Font Arab
                    </Label>
                    <span className="text-sm font-semibold text-primary">
                      {settings.arabFontSize}px
                    </span>
                  </div>
                  <Slider
                    id="arab-font-dialog"
                    value={[settings.arabFontSize]}
                    min={16}
                    max={32}
                    step={1}
                    onValueChange={(value: number[]) =>
                      updateSettings({ arabFontSize: value[0] })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ukuran font untuk teks Arab (16px - 32px)
                  </p>
                </div>

                {/* Font Latin */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="latin-font-dialog" className="text-base font-medium">
                      Font Latin
                    </Label>
                    <span className="text-sm font-semibold text-primary">
                      {settings.latinFontSize}px
                    </span>
                  </div>
                  <Slider
                    id="latin-font-dialog"
                    value={[settings.latinFontSize]}
                    min={12}
                    max={20}
                    step={1}
                    onValueChange={(value: number[]) =>
                      updateSettings({ latinFontSize: value[0] })
                    }
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ukuran font untuk teks Latin (12px - 20px)
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Section: Terjemahan */}
            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Terjemahan</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Tampilkan atau sembunyikan terjemahan Indonesia
                </p>
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="flex-1">
                  <Label htmlFor="translation-toggle-dialog" className="text-base font-medium">
                    Tampilkan Terjemahan
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {settings.showTranslation
                      ? "Terjemahan ditampilkan di bawah setiap ayat"
                      : "Terjemahan disembunyikan"}
                  </p>
                </div>
                <Switch
                  id="translation-toggle-dialog"
                  checked={settings.showTranslation}
                  onCheckedChange={(checked: boolean) =>
                    updateSettings({ showTranslation: checked })
                  }
                  className="shrink-0"
                />
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

