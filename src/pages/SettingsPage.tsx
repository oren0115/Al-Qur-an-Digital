import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/contexts/SettingsContext";

const QARI_OPTIONS = [
  { value: "01", label: "Abdullah Al-Juhany" },
  { value: "02", label: "Abdul Muhsin Al-Qasim" },
  { value: "03", label: "Abdurrahman As-Sudais" },
  { value: "04", label: "Ibrahim Al-Dossari" },
  { value: "05", label: "Misyari Rasyid Al-Afasy" },
];

export function SettingsPage() {
  const { settings, updateSettings, toggleTheme } = useSettings();

  return (
    <div className="mx-auto min-h-screen max-w-md bg-background pb-20">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-5 py-4">
          <h1 className="text-2xl font-bold">Pengaturan</h1>
        </div>
      </header>

      <main className="px-5 py-6">
        <div className="space-y-8">
          {/* Section: Tema */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Tema</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih tema terang atau gelap untuk kenyamanan membaca
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div className="flex items-center gap-3">
                {settings.theme === "dark" ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-primary" />
                )}
                <div>
                  <Label className="text-base font-medium">
                    {settings.theme === "dark" ? "Mode Gelap" : "Mode Terang"}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {settings.theme === "dark"
                      ? "Tema gelap untuk membaca malam"
                      : "Tema terang untuk membaca siang"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="shrink-0 cursor-pointer"
                aria-label="Toggle theme"
              >
                {settings.theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </section>

          <Separator />

          {/* Section: Qari Audio */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Qari Audio</h2>
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

          {/* Section: Ukuran Font */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Ukuran Font</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Sesuaikan ukuran font untuk kenyamanan membaca
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="arab-font" className="text-base font-medium">
                    Font Arab
                  </Label>
                  <span className="text-sm font-semibold text-primary">
                    {settings.arabFontSize}px
                  </span>
                </div>
                <Slider
                  id="arab-font"
                  value={[settings.arabFontSize]}
                  min={16}
                  max={32}
                  step={1}
                  onValueChange={(value: number[]) =>
                    updateSettings({ arabFontSize: value[0] })
                  }
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Ukuran font untuk teks Arab (16px - 32px)
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="latin-font" className="text-base font-medium">
                    Font Latin
                  </Label>
                  <span className="text-sm font-semibold text-primary">
                    {settings.latinFontSize}px
                  </span>
                </div>
                <Slider
                  id="latin-font"
                  value={[settings.latinFontSize]}
                  min={12}
                  max={20}
                  step={1}
                  onValueChange={(value: number[]) =>
                    updateSettings({ latinFontSize: value[0] })
                  }
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Ukuran font untuk teks Latin (12px - 20px)
                </p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Section: Audio */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Pengaturan Audio</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Kontrol pemutaran audio
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
                  <option value="off">Tidak</option>
                  <option value="ayat">Repeat Ayat</option>
                  <option value="surah">Repeat Surah</option>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Section: Terjemahan */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Terjemahan</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tampilkan atau sembunyikan terjemahan Indonesia
              </p>
            </div>
            <div className="flex items-center justify-between rounded-lg border bg-card p-4">
              <div className="flex-1">
                <Label htmlFor="translation-toggle" className="text-base font-medium">
                  Tampilkan Terjemahan
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {settings.showTranslation
                    ? "Terjemahan ditampilkan di bawah setiap ayat"
                    : "Terjemahan disembunyikan"}
                </p>
              </div>
              <Switch
                id="translation-toggle"
                checked={settings.showTranslation}
                onCheckedChange={(checked: boolean) =>
                  updateSettings({ showTranslation: checked })
                }
                className="shrink-0"
              />
            </div>
          </section>

          <Separator />

          {/* Section: Night Mode Timer */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Night Mode Timer</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Otomatis beralih ke dark mode pada waktu tertentu
              </p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Waktu Mulai</Label>
                <Input
                  type="time"
                  value={settings.nightModeStart}
                  onChange={(e) => updateSettings({ nightModeStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Waktu Berakhir</Label>
                <Input
                  type="time"
                  value={settings.nightModeEnd}
                  onChange={(e) => updateSettings({ nightModeEnd: e.target.value })}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* Section: Daily Reminder */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Daily Reminder</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Notifikasi harian untuk membaca Al-Qur'an
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <Label className="text-base font-medium">Aktifkan Reminder</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {settings.dailyReminder
                        ? "Reminder aktif"
                        : "Reminder tidak aktif"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.dailyReminder}
                  onCheckedChange={(checked: boolean) => {
                    updateSettings({ dailyReminder: checked });
                    if (checked && "Notification" in window && Notification.permission === "default") {
                      Notification.requestPermission();
                    }
                  }}
                />
              </div>
              {settings.dailyReminder && (
                <div className="space-y-2">
                  <Label>Waktu Reminder</Label>
                  <Input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
