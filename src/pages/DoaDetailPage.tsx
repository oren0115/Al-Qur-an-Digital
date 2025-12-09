import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDoaList } from "@/services/api";
import type { Doa } from "@/types/api";

export function DoaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doa, setDoa] = useState<Doa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoa() {
      if (!id) return;
      try {
        const doas = await getDoaList();
        const foundDoa = doas.find((d) => d.id === Number(id));
        setDoa(foundDoa || null);
      } catch (error) {
        console.error("Failed to load doa:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDoa();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Memuat data...</p>
      </div>
    );
  }

  if (!doa) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Doa tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <Button variant="ghost" size="icon-sm" className="cursor-pointer" onClick={() => navigate("/doa")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="mb-1 text-xl font-bold">{doa.nama}</h1>
          <p className="mb-2 text-sm text-muted-foreground">{doa.grup}</p>
          {doa.tag.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {doa.tag.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Doa Arab</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-right text-2xl leading-loose">{doa.ar}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transliterasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-muted-foreground">{doa.tr}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Terjemahan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed">{doa.idn}</p>
            </CardContent>
          </Card>

          {doa.tentang && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tentang Doa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doa.tentang.split("\n").map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

