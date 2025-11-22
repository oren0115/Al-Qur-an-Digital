import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSurahList } from "@/services/api";
import { useEffect } from "react";
import type { Surah } from "@/types/api";

const JUZ_AYAT_MAP: { [key: number]: { start: number; end: number } } = {
  1: { start: 1, end: 148 },
  2: { start: 149, end: 259 },
  3: { start: 260, end: 385 },
  4: { start: 386, end: 516 },
  5: { start: 517, end: 640 },
  6: { start: 641, end: 750 },
  7: { start: 751, end: 899 },
  8: { start: 900, end: 1041 },
  9: { start: 1042, end: 1200 },
  10: { start: 1201, end: 1327 },
  11: { start: 1328, end: 1478 },
  12: { start: 1479, end: 1648 },
  13: { start: 1649, end: 1802 },
  14: { start: 1803, end: 2029 },
  15: { start: 2030, end: 2214 },
  16: { start: 2215, end: 2483 },
  17: { start: 2484, end: 2673 },
  18: { start: 2674, end: 2875 },
  19: { start: 2876, end: 3214 },
  20: { start: 3215, end: 3385 },
  21: { start: 3386, end: 3563 },
  22: { start: 3564, end: 3732 },
  23: { start: 3733, end: 4089 },
  24: { start: 4090, end: 4264 },
  25: { start: 4265, end: 4510 },
  26: { start: 4511, end: 4705 },
  27: { start: 4706, end: 5104 },
  28: { start: 5105, end: 5241 },
  29: { start: 5242, end: 5672 },
  30: { start: 5673, end: 6236 },
};

export function JuzPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSurahs() {
      try {
        const data = await getSurahList();
        setSurahs(data);
      } catch (error) {
        console.error("Failed to load surahs:", error);
      }
    }
    loadSurahs();
  }, []);

  const getJuzSurahs = (juz: number) => {
    const range = JUZ_AYAT_MAP[juz];
    if (!range) return [];

    let currentAyat = 0;
    const result: Array<{ surah: Surah; startAyat: number; endAyat: number }> = [];

    for (const surah of surahs) {
      const surahStart = currentAyat + 1;
      const surahEnd = currentAyat + surah.jumlahAyat;

      if (surahEnd >= range.start && surahStart <= range.end) {
        result.push({
          surah,
          startAyat: Math.max(1, range.start - currentAyat),
          endAyat: Math.min(surah.jumlahAyat, range.end - currentAyat),
        });
      }

      currentAyat = surahEnd;
      if (currentAyat >= range.end) break;
    }

    return result;
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Juz</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
            const juzSurahs = getJuzSurahs(juz);
            return (
              <Card
                key={juz}
                className="cursor-pointer transition-colors hover:bg-accent"
                onClick={() => {
                  if (juzSurahs.length > 0) {
                    navigate(`/surah/${juzSurahs[0].surah.nomor}`);
                  }
                }}
              >
                <CardContent className="p-4 text-center">
                  <Badge variant="secondary" className="mb-2">
                    Juz {juz}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {juzSurahs.length} surah
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}

