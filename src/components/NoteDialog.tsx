import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Save, X } from "lucide-react";
import { useNotes } from "@/contexts/NotesContext";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  surahNomor: number;
  ayatNomor: number;
}

export function NoteDialog({ open, onOpenChange, surahNomor, ayatNomor }: NoteDialogProps) {
  const { getNote, addNote, updateNote, deleteNote } = useNotes();
  const existingNote = getNote(surahNomor, ayatNomor);
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText(existingNote?.text || "");
    }
  }, [open, existingNote]);

  const handleSave = () => {
    if (text.trim()) {
      if (existingNote) {
        updateNote(surahNomor, ayatNomor, text);
      } else {
        addNote(surahNomor, ayatNomor, text);
      }
    } else if (existingNote) {
      deleteNote(surahNomor, ayatNomor);
    }
    onOpenChange(false);
  };

  const handleDelete = () => {
    deleteNote(surahNomor, ayatNomor);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="no-default-close max-w-[calc(100vw-1rem)] sm:max-w-md max-h-[75vh] sm:max-h-[80vh] flex flex-col p-0 gap-0 rounded-t-2xl sm:rounded-lg !top-auto !bottom-4 sm:!top-[50%] sm:!bottom-auto !translate-y-0 sm:!translate-y-[-50%]">
        {/* Header dengan close button */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute cursor-pointer right-4 top-4 rounded-full p-2 hover:bg-accent transition-colors z-10"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogTitle className="text-xl font-bold pr-12">Catatan Ayat {ayatNomor}</DialogTitle>
          <DialogDescription className="text-sm mt-1">
            Tambahkan catatan pribadi untuk ayat ini
          </DialogDescription>
        </DialogHeader>
        
        {/* Content area dengan textarea */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis catatan Anda di sini..."
            className="min-h-[200px] sm:min-h-[250px] w-full resize-none text-base leading-relaxed focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {text.length} karakter
            </p>
            {existingNote && (
              <p className="text-xs text-muted-foreground">
                Catatan tersimpan
              </p>
            )}
          </div>
        </div>

        {/* Footer dengan action buttons */}
        <DialogFooter className="px-5 py-4 border-t bg-muted/30 gap-2 sm:gap-0">
          <div className="flex w-full gap-3">
            {existingNote && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1 cursor-pointer sm:flex-initial min-h-[44px]"
                size="lg"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Hapus
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="flex-1 cursor-pointer sm:flex-initial min-h-[44px]"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Simpan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
