import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSurahList } from "@/services/api";
import type { Surah } from "@/types/api";

export function SurahListPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSurahs() {
      try {
        const data = await getSurahList();
        setSurahs(data);
        setFilteredSurahs(data);
      } catch (error) {
        console.error("Failed to load surahs:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSurahs();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredSurahs(surahs);
      return;
    }
    const query = search.toLowerCase();
    const filtered = surahs.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(query) ||
        s.nama.toLowerCase().includes(query) ||
        s.arti.toLowerCase().includes(query) ||
        s.nomor.toString().includes(query)
    );
    setFilteredSurahs(filtered);
  }, [search, surahs]);

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
          <h1 className="mb-3 text-2xl font-bold">Daftar Surah</h1>
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
        {filteredSurahs.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Tidak ada surah yang ditemukan
          </div>
        )}
      </main>
    </div>
  );
}

