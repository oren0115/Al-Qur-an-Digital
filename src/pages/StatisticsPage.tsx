import { useProgress } from "@/contexts/ProgressContext";
import { useBookmark } from "@/contexts/BookmarkContext";
import { useHistory } from "@/contexts/HistoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Bookmark, TrendingUp, Clock } from "lucide-react";

export function StatisticsPage() {
  const { getTotalStats, progress } = useProgress();
  const { bookmarks } = useBookmark();
  const { history } = useHistory();
  const stats = getTotalStats();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Statistik</h1>
        </div>
      </header>

      <main className="p-4">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Ayat Dibaca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats.totalAyatRead}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Surah Dibaca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{stats.surahCompleted}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Bookmark
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{bookmarks.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Riwayat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{history.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {progress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Progress Surah</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progress.slice(0, 10).map((p) => (
                    <div key={p.surahNomor} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Surah {p.surahNomor}</p>
                        <p className="text-sm text-muted-foreground">
                          {p.totalAyatRead} ayat dibaca
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {Math.round((p.totalAyatRead / 1) * 100)}%
                      </Badge>
                    </div>
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

