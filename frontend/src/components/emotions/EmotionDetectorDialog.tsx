import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { EmotionDetector } from "@/components/emotions/EmotionDetector";

interface EmotionDetectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmotionDetectorDialog({
  open,
  onOpenChange,
}: EmotionDetectorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="DialogContent">
        <DialogHeader>
          <DialogTitle>Détecteur d'Émotions en Temps Réel</DialogTitle>
        </DialogHeader>

        <EmotionDetector />
      </DialogContent>
    </Dialog>
  );
}
