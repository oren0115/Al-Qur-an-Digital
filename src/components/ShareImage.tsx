import { useRef } from "react";
import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareImageProps {
  surahNama: string;
  ayatNomor: number;
  teksArab: string;
  teksIndonesia: string;
}

export function ShareImage({ surahNama, ayatNomor, teksArab, teksIndonesia }: ShareImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 32px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${surahNama} - Ayat ${ayatNomor}`, canvas.width / 2, 60);

    ctx.font = "48px 'Arabic Typesetting', 'Traditional Arabic', serif";
    ctx.textAlign = "right";
    ctx.fillText(teksArab, canvas.width - 40, 200);

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText(teksIndonesia, canvas.width / 2, 400);

    ctx.fillStyle = "#64748b";
    ctx.font = "14px Arial";
    ctx.fillText("Al-Qur'an Digital", canvas.width / 2, canvas.height - 20);

    return canvas.toDataURL("image/png");
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `${surahNama}-${ayatNomor}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const dataUrl = await generateImage();
    if (!dataUrl) return;

    const blob = await fetch(dataUrl).then((r) => r.blob());
    const file = new File([blob], `${surahNama}-${ayatNomor}.png`, { type: "image/png" });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: `${surahNama} - Ayat ${ayatNomor}`,
      });
    } else {
      handleDownload();
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </>
  );
}

