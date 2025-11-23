import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, MessageCircle, Facebook, Twitter, Send, Link2, Copy, Instagram } from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahNama: string;
  ayatNomor: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  surahNama,
  ayatNomor,
  teksArab,
  teksLatin,
  teksIndonesia,
}: ShareDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  const generateImage = async (): Promise<string | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = 1080;
    canvas.height = 1080;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${surahNama} - Ayat ${ayatNomor}`, canvas.width / 2, 100);

    const maxWidth = canvas.width - 80;
    const arabFontSize = 64;
    ctx.font = `${arabFontSize}px 'Arabic Typesetting', 'Traditional Arabic', serif`;
    ctx.textAlign = "right";
    
    const arabWords = teksArab.split(" ");
    let arabY = 300;
    let currentLine = "";
    
    for (const word of arabWords) {
      const testLine = currentLine ? `${word} ${currentLine}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        ctx.fillText(currentLine, canvas.width - 40, arabY);
        arabY += arabFontSize + 20;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      ctx.fillText(currentLine, canvas.width - 40, arabY);
      arabY += arabFontSize + 20;
    }

    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    const indoWords = teksIndonesia.split(" ");
    let indoY = arabY + 40;
    let indoLine = "";
    
    for (const word of indoWords) {
      const testLine = indoLine ? `${indoLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && indoLine) {
        ctx.fillText(indoLine, canvas.width / 2, indoY);
        indoY += 40;
        indoLine = word;
      } else {
        indoLine = testLine;
      }
    }
    if (indoLine) {
      ctx.fillText(indoLine, canvas.width / 2, indoY);
    }

    ctx.fillStyle = "#64748b";
    ctx.font = "24px Arial";
    ctx.fillText("Al-Qur'an Digital", canvas.width / 2, canvas.height - 40);

    return canvas.toDataURL("image/png");
  };

  const shareText = `${teksArab}\n\n${teksLatin ? `${teksLatin}\n\n` : ""}${teksIndonesia}\n\n${surahNama} - Ayat ${ayatNomor}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleWhatsApp = async () => {
    const imageUrl = await generateImage();
    if (imageUrl && navigator.share) {
      try {
        const blob = await fetch(imageUrl).then((r) => r.blob());
        const file = new File([blob], `${surahNama}-${ayatNomor}.png`, { type: "image/png" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            text: shareText,
          });
          return;
        }
      } catch (error) {
        console.log("Native share failed, using web fallback");
      }
    }
    
    const text = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`${surahNama} - Ayat ${ayatNomor}\n${teksArab.substring(0, 100)}...`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, "_blank");
  };

  const handleInstagram = async () => {
    const imageUrl = await generateImage();
    if (imageUrl) {
      const blob = await fetch(imageUrl).then((r) => r.blob());
      const file = new File([blob], `${surahNama}-${ayatNomor}.png`, { type: "image/png" });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
        });
      } else {
        handleDownload();
        alert("Gambar telah diunduh. Silakan buka Instagram dan unggah gambar tersebut.");
      }
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `${surahNama}-${ayatNomor}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleNativeShare = async () => {
    const imageUrl = await generateImage();
    if (!imageUrl) return;

    const blob = await fetch(imageUrl).then((r) => r.blob());
    const file = new File([blob], `${surahNama}-${ayatNomor}.png`, { type: "image/png" });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${surahNama} - Ayat ${ayatNomor}`,
          text: shareText,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      handleDownload();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="no-default-close max-w-[calc(100vw-1rem)] sm:max-w-md max-h-[85vh] flex flex-col p-0 gap-0 rounded-t-2xl sm:rounded-lg">
          <DialogHeader className="px-5 pt-5 pb-3 border-b">
            <DialogTitle className="text-xl font-bold">Bagikan Ayat</DialogTitle>
            <DialogDescription className="text-sm mt-1">
              Pilih platform untuk membagikan ayat ini
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <Button
                  variant="outline"
                  className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                  onClick={handleNativeShare}
                >
                  <Share2 className="h-6 w-6" />
                  <span className="text-xs">Native Share</span>
                </Button>
              )}

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-6 w-6 text-green-600" />
                <span className="text-xs">WhatsApp</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleInstagram}
              >
                <Instagram className="h-6 w-6 text-pink-600" />
                <span className="text-xs">Instagram</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleFacebook}
              >
                <Facebook className="h-6 w-6 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleTwitter}
              >
                <Twitter className="h-6 w-6 text-blue-400" />
                <span className="text-xs">Twitter</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleTelegram}
              >
                <Send className="h-6 w-6 text-blue-500" />
                <span className="text-xs">Telegram</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleCopyText}
              >
                <Copy className="h-6 w-6" />
                <span className="text-xs">{copied ? "Tersalin!" : "Copy Teks"}</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleCopyLink}
              >
                <Link2 className="h-6 w-6" />
                <span className="text-xs">{copied ? "Tersalin!" : "Copy Link"}</span>
              </Button>

              <Button
                variant="outline"
                className="flex cursor-pointer flex-col items-center gap-2 h-auto py-4"
                onClick={handleDownload}
              >
                <Download className="h-6 w-6" />
                <span className="text-xs">Download</span>
              </Button>
            </div>

            <div className="mt-4 p-3 rounded-lg border bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <p className="text-sm font-medium mb-1">{surahNama} - Ayat {ayatNomor}</p>
              <p className="text-sm text-right leading-relaxed mb-2">{teksArab}</p>
              <p className="text-xs text-muted-foreground">{teksIndonesia}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
