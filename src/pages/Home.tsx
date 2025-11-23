import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, BookOpen, Clock, Sparkles, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSurahList, getSurahDetail } from "@/services/api";
import { useHistory } from "@/contexts/HistoryContext";
import type { Surah, Ayat } from "@/types/api";

function getVerseOfTheDay(): { surah: number; ayat: number } {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const surah = ((dayOfYear % 114) + 1);
  const ayat = ((dayOfYear % 7) + 1);
  return { surah, ayat };
}

export function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [verseOfDay, setVerseOfDay] = useState<Ayat | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const { history, getLastRead } = useHistory();
  const navigate = useNavigate();
  const lastRead = getLastRead();

  useEffect(() => {
    async function loadSurahs() {
      try {
        const data = await getSurahList();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to load surahs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  useEffect(() => {
    async function loadVerseOfDay() {
      try {
        const { surah, ayat } = getVerseOfTheDay();
        const surahData = await getSurahDetail(surah);
        setVerseOfDay(surahData.ayat[ayat - 1] || surahData.ayat[0]);
      } catch (error) {
        console.error("Failed to load verse of day:", error);
      } finally {
        setVerseLoading(false);
      }
    }
    loadVerseOfDay();
  }, []);

  const filteredSurahs = search.trim()
    ? surahs.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
          s.nama.toLowerCase().includes(search.toLowerCase()) ||
          s.arti.toLowerCase().includes(search.toLowerCase()) ||
          s.nomor.toString().includes(search)
      )
    : surahs.slice(0, 10);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Al-Qur'an Digital</h1>
            <div className="flex gap-2">
              <Link to="/juz">
                <Button variant="outline" size="sm">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Juz
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari surah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-6">
          {verseOfDay && !verseLoading && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Ayat Hari Ini</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-right text-lg leading-loose">{verseOfDay.teksArab}</p>
                <p className="mb-2 text-sm text-muted-foreground">{verseOfDay.teksLatin}</p>
                <p className="mb-3 text-sm leading-relaxed">{verseOfDay.teksIndonesia}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/surah/${getVerseOfTheDay().surah}`)}
                >
                  Baca Surah
                </Button>
              </CardContent>
            </Card>
          )}

          {lastRead && (
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Terakhir Dibaca</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/surah/${lastRead.surahNomor}`)}
                >
                  <h3 className="font-semibold">{lastRead.surahNamaLatin}</h3>
                  <p className="text-sm text-muted-foreground">{lastRead.surahNama}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {history.length > 0 && (
            <>
              <div>
                <h2 className="mb-2 text-lg font-semibold">Riwayat</h2>
                <div className="space-y-2">
                  {history.slice(0, 5).map((h) => (
                    <Card
                      key={h.surahNomor}
                      className="cursor-pointer transition-colors hover:bg-accent"
                      onClick={() => navigate(`/surah/${h.surahNomor}`)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{h.surahNamaLatin}</p>
                            <p className="text-xs text-muted-foreground">{h.surahNama}</p>
                          </div>
                          <Badge variant="secondary">{h.surahNomor}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Daftar Surah</h2>
              <Link to="/surah-list">
                <Button variant="ghost" size="sm">
                  <List className="mr-2 h-4 w-4" />
                  Lihat Semua
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {filteredSurahs.map((surah) => (
                <Card
                  key={surah.nomor}
                  className="cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => navigate(`/surah/${surah.nomor}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {surah.nomor}
                          </span>
                          <h3 className="font-semibold">{surah.namaLatin}</h3>
                        </div>
                        <p className="mb-2 text-lg font-medium leading-relaxed">{surah.nama}</p>
                        <p className="mb-2 text-sm text-muted-foreground">{surah.arti}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {surah.jumlahAyat} ayat
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {surah.tempatTurun}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {!search.trim() && surahs.length > 10 && (
              <div className="mt-4 text-center">
                <Link to="/surah-list">
                  <Button variant="outline" className="w-full">
                    Lihat Semua {surahs.length} Surah
                  </Button>
                </Link>
              </div>
            )}
            {search.trim() && filteredSurahs.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                Tidak ada surah yang ditemukan
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
