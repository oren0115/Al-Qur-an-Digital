import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSurahDetail } from "@/services/api";
import { useHistory } from "@/contexts/HistoryContext";
import type { Ayat } from "@/types/api";

function getVerseOfTheDay(): { surah: number; ayat: number } {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const surah = ((dayOfYear % 114) + 1);
  const ayat = ((dayOfYear % 7) + 1);
  return { surah, ayat };
}

export function Home() {
  const [verseOfDay, setVerseOfDay] = useState<Ayat | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const { history, getLastRead } = useHistory();
  const navigate = useNavigate();
  const lastRead = getLastRead();

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

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Al-Qur'an Digital</h1>
            <Link to="/juz">
              <Button variant="outline" size="sm">
                <BookOpen className="mr-2 h-4 w-4" />
                Juz
              </Button>
            </Link>
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
        </div>
      </main>
    </div>
  );
}
