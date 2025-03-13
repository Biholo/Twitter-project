// import { DetectEmotion } from "@/features/emotion/DetectEmotion";

// export default function DetectPage() {
//   return (
//     <div>
//       <h1>Detect</h1>
//       <DetectEmotion />
//     </div>
//   );
// }
// import { EmotionDetector } from "@/components/emotions/EmotionDetector";
import { useState } from "react";
import { EmotionDetectorDialog } from "@/components/emotions/EmotionDetectorDialog";
import { Button } from "@/components/ui/Button";

export default function DetectPage() {
  const [open, setOpen] = useState<boolean>(false);

  const onOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const toggleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Application de Reconnaissance d'Émotions</h1>
      </div>
      <div>
        <Button onClick={toggleDialogOpen}>Démarrer la détection</Button>
        <EmotionDetectorDialog open={open} onOpenChange={onOpenChange} />
      </div>
    </div>
  );
}
