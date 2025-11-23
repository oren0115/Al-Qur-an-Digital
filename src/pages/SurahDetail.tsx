import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AudioPlayer } from "@/components/AudioPlayer";
import { AyatCard } from "@/components/AyatCard";
import { NoteDialog } from "@/components/NoteDialog";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { getSurahDetail, getTafsir } from "@/services/api";
import { useSettings } from "@/contexts/SettingsContext";
import { useHistory } from "@/contexts/HistoryContext";
import type { SurahDetail as SurahDetailType } from "@/types/api";
import type { Tafsir } from "@/types/api";

const QARI_OPTIONS = [
  { value: "01", label: "Abdullah Al-Juhany" },
  { value: "02", label: "Abdul Muhsin Al-Qasim" },
  { value: "03", label: "Abdurrahman As-Sudais" },
  { value: "04", label: "Ibrahim Al-Dossari" },
  { value: "05", label: "Misyari Rasyid Al-Afasy" },
];

export function SurahDetail() {
  const { nomor } = useParams<{ nomor: string }>();
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { addHistory } = useHistory();
  const [surah, setSurah] = useState<SurahDetailType | null>(null);
  const [tafsir, setTafsir] = useState<Tafsir | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<string>("");
  const [currentAyatIndex, setCurrentAyatIndex] = useState<number>(-1);
  const [showSettings, setShowSettings] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [selectedAyatForNote, setSelectedAyatForNote] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function loadData() {
      if (!nomor) return;
      try {
        const surahData = await getSurahDetail(Number(nomor));
        if (!isMounted) return;
        
        setSurah(surahData);
        addHistory(surahData.nomor, surahData.nama, surahData.namaLatin);
        
        try {
          const tafsirData = await getTafsir(Number(nomor));
          if (!isMounted) return;
          setTafsir(tafsirData);
        } catch (tafsirError) {
          console.warn("Failed to load tafsir:", tafsirError);
          if (isMounted) {
            setTafsir(null);
          }
        }
      } catch (error) {
        console.error("Failed to load surah:", error);
        if (isMounted) {
          setLoading(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    loadData();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomor]);

  const handlePlayAudio = (audioUrl: string, ayatIndex: number) => {
    setCurrentAudio(audioUrl);
    setCurrentAyatIndex(ayatIndex);
  };

  const handleAudioEnded = () => {
    if (settings.autoPlayNext && surah && currentAyatIndex >= 0) {
      const nextIndex = currentAyatIndex + 1;
      if (nextIndex < surah.ayat.length) {
        const nextAyat = surah.ayat[nextIndex];
        const audioUrl =
          nextAyat.audio[settings.selectedQari] ||
          nextAyat.audio["01"] ||
          Object.values(nextAyat.audio)[0];
        if (audioUrl) {
          setTimeout(() => {
            setCurrentAudio(audioUrl);
            setCurrentAyatIndex(nextIndex);
            audioRef.current?.play();
          }, 500);
          return;
        }
      }
    }
    if (settings.repeatMode === "ayat" && currentAyatIndex >= 0) {
      const ayat = surah?.ayat[currentAyatIndex];
      if (ayat) {
        const audioUrl =
          ayat.audio[settings.selectedQari] ||
          ayat.audio["01"] ||
          Object.values(ayat.audio)[0];
        if (audioUrl) {
          setTimeout(() => {
            setCurrentAudio(audioUrl);
            audioRef.current?.play();
          }, 500);
          return;
        }
      }
    }
    if (settings.repeatMode === "surah" && surah) {
      const firstAyat = surah.ayat[0];
      const audioUrl =
        firstAyat.audio[settings.selectedQari] ||
        firstAyat.audio["01"] ||
        Object.values(firstAyat.audio)[0];
      if (audioUrl) {
        setTimeout(() => {
          setCurrentAudio(audioUrl);
          setCurrentAyatIndex(0);
          audioRef.current?.play();
        }, 500);
        return;
      }
    }
    setCurrentAudio("");
    setCurrentAyatIndex(-1);
  };

  const handleNoteClick = (ayatNomor: number) => {
    setSelectedAyatForNote(ayatNomor);
    setShowNoteDialog(true);
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
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
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
          {surah.ayat.map((ayat, index) => (
            <AyatCard
              key={ayat.nomorAyat}
              ayat={ayat}
              surahNomor={surah.nomor}
              surahNama={surah.namaLatin}
              tafsir={tafsir?.ayat?.find((a) => a.nomorAyat === ayat.nomorAyat)}
              onPlay={(audioUrl) => handlePlayAudio(audioUrl, index)}
              onNoteClick={() => handleNoteClick(ayat.nomorAyat)}
            />
          ))}
        </div>
      </main>

      {currentAudio && (
        <AudioPlayer
          audioUrl={currentAudio}
          onEnded={handleAudioEnded}
          audioRef={audioRef}
        />
      )}

      <NoteDialog
        open={showNoteDialog}
        onOpenChange={setShowNoteDialog}
        surahNomor={surah.nomor}
        ayatNomor={selectedAyatForNote}
      />

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Pengaturan Tampilan</DialogTitle>
            <DialogDescription>
              Sesuaikan tampilan dan audio sesuai preferensi Anda
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Qari Audio</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pilih qari untuk audio ayat
                </p>
              </div>
              <Select
                value={settings.selectedQari}
                onChange={(e) => updateSettings({ selectedQari: e.target.value })}
                className="cursor-pointer"
              >
                {QARI_OPTIONS.map((qari) => (
                  <option key={qari.value} value={qari.value}>
                    {qari.label}
                  </option>
                ))}
              </Select>
            </section>

            <Separator />

            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Ukuran Font</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sesuaikan ukuran font untuk kenyamanan membaca
                </p>
              </div>
              <div className="space-y-5">
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
                    className="w-full cursor-pointer"
                  />
                </div>
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
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Audio</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pengaturan pemutaran audio
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex-1">
                    <Label className="text-base font-medium">Auto-play Ayat Berikutnya</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Otomatis memutar ayat berikutnya setelah selesai
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoPlayNext}
                    onCheckedChange={(checked: boolean) =>
                      updateSettings({ autoPlayNext: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-medium">Mode Repeat</Label>
                  <Select
                    value={settings.repeatMode}
                    onChange={(e) =>
                      updateSettings({
                        repeatMode: e.target.value as "off" | "ayat" | "surah",
                      })
                    }
                    className="cursor-pointer"
                  >
                    <option value="off" className="cursor-pointer">Tidak</option>
                    <option value="ayat" className="cursor-pointer">Repeat Ayat</option>
                    <option value="surah" className="cursor-pointer">Repeat Surah</option>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
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
                />
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
