import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog"
import { EmotionDetector } from "@/components/emotions/EmotionDetector"

interface EmotionDetectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmotionDetectorDialog({ open, onOpenChange }: EmotionDetectorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-md w-full overflow-hidden bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-none rounded-xl p-0">
        <DialogHeader className="p-4 border-b border-gray-100 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Détecteur d'Émotions en Temps Réel
          </DialogTitle>
        </DialogHeader>

        <EmotionDetector />
      </DialogContent>
    </Dialog>
  )
}