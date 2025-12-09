import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDoaList } from "@/services/api";
import type { Doa } from "@/types/api";

export function DoaListPage() {
  const [doas, setDoas] = useState<Doa[]>([]);
  const [filteredDoas, setFilteredDoas] = useState<Doa[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDoas() {
      try {
        const data = await getDoaList();
        setDoas(data);
        setFilteredDoas(data);
      } catch (error) {
        console.error("Failed to load doas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDoas();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredDoas(doas);
      return;
    }
    const query = search.toLowerCase();
    const filtered = doas.filter(
      (d) =>
        d.nama.toLowerCase().includes(query) ||
        d.grup.toLowerCase().includes(query) ||
        d.idn.toLowerCase().includes(query) ||
        d.tr.toLowerCase().includes(query) ||
        d.tag.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredDoas(filtered);
  }, [search, doas]);

  // Group doas by grup
  const groupedDoas = filteredDoas.reduce((acc, doa) => {
    if (!acc[doa.grup]) {
      acc[doa.grup] = [];
    }
    acc[doa.grup].push(doa);
    return acc;
  }, {} as Record<string, Doa[]>);

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
          <h1 className="mb-3 text-2xl font-bold">Kumpulan Doa</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari doa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-6">
          {Object.entries(groupedDoas).map(([grup, doaList]) => (
            <div key={grup}>
              <h2 className="mb-3 text-lg font-semibold text-primary">{grup}</h2>
              <div className="space-y-2">
                {doaList.map((doa) => (
                  <Card
                    key={doa.id}
                    className="cursor-pointer transition-colors hover:bg-accent"
                    onClick={() => navigate(`/doa/${doa.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="mb-2 font-semibold">{doa.nama}</h3>
                          <p className="mb-2 text-right text-lg leading-loose">{doa.ar}</p>
                          <p className="mb-2 text-sm text-muted-foreground">{doa.tr}</p>
                          <p className="mb-2 text-sm leading-relaxed line-clamp-2">{doa.idn}</p>
                          {doa.tag.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {doa.tag.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        {filteredDoas.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            Tidak ada doa yang ditemukan
          </div>
        )}
      </main>
    </div>
  );
}

