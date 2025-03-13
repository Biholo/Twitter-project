import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détecteur d'Émotions en Temps Réel</DialogTitle>
          {/* <DialogDescription className={socketConnectionClassname}>
            Status de la connexion: {socketConnectionStatus}
          </DialogDescription> */}
        </DialogHeader>

        <EmotionDetector />
      </DialogContent>
    </Dialog>
  );
}
