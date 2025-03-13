import { useRef, useState, useEffect, useCallback } from "react";
import type { FaceDetection } from "./types";
import { fetchEmotionPrediction } from "@/components/emotions/utils";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw } from "lucide-react";

export function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedFaces, setDetectedFaces] = useState<FaceDetection[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    let mediaStream: MediaStream | null = null;

    const setupCamera = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStream = stream;
        }
        setErrorMessage("");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
        setErrorMessage("Erreur d'accès à la webcam: " + errorMsg);
        console.error("Erreur d'accès à la webcam:", err);
      }
    };

    setupCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Fonction pour capturer une image depuis la vidéo
  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  const predictEmotion = useCallback(async (): Promise<void> => {
    if (isProcessing) return;

    setIsProcessing(true);
    const imageData = captureImage();
    if (!imageData) {
      setIsProcessing(false);
      return;
    }

    setErrorMessage("");
    try {
      const response = await fetchEmotionPrediction(imageData);

      if (!response.success) {
        setErrorMessage("Erreur lors de la prédiction: " + response.error);
        return;
      }
      setDetectedFaces(response.data.faces);
    } catch (_error) {
      setErrorMessage("Erreur de connexion au service d'analyse");
    } finally {
      setIsProcessing(false);
    }
  }, [captureImage, isProcessing]);

  useEffect(() => {
    const intervalId = setInterval(predictEmotion, 500);
    return () => {
      clearInterval(intervalId);
    };
  }, [predictEmotion]);

  const handleCaptureImage = () => {
    const imageData = captureImage();
    if (imageData) {
      setCapturedImages((prev) => [imageData, ...prev]);
    }
  };

  const getDominantFace = (): FaceDetection | null => {
    if (detectedFaces.length === 0) return null;
    return detectedFaces.reduce((prev, current) =>
      current.confidence > prev.confidence ? current : prev
    );
  };

  const dominantFace = getDominantFace();

  // Obtention d'une couleur en fonction de l'émotion
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joie: "from-yellow-400 to-yellow-300",
      colère: "from-red-500 to-red-400",
      tristesse: "from-blue-500 to-blue-400",
      peur: "from-purple-500 to-purple-400",
      dégoût: "from-green-500 to-green-400",
      surprise: "from-orange-500 to-orange-400",
      neutre: "from-gray-400 to-gray-300",
    };
    return colors[emotion] || "from-gray-400 to-gray-300";
  };

  // Obtention d'une icône en fonction de l'émotion
  const getEmotionIcon = (emotion: string): string => {
    const icons: Record<string, string> = {
      joie: "😊",
      colère: "😠",
      tristesse: "😢",
      peur: "😨",
      dégoût: "🤢",
      surprise: "😲",
      neutre: "😐",
    };
    return icons[emotion] || "😐";
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Badge overlay pour l'émotion dominante */}
        {dominantFace && (
          <div
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full bg-gradient-to-r ${getEmotionColor(
              dominantFace.emotion
            )} text-white font-medium text-sm shadow-md flex items-center gap-1.5 backdrop-blur-sm`}
          >
            <span>{getEmotionIcon(dominantFace.emotion)}</span>
            <span>{dominantFace.emotion}</span>
            <span className="opacity-75">
              {Math.round(dominantFace.confidence * 100)}%
            </span>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-300 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          onClick={handleCaptureImage}
          className="bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:from-pink-600 hover:to-blue-600 transition-all"
        >
          <Camera className="w-4 h-4 mr-2" />
          Capturer une image
        </Button>
      </div>

      {capturedImages.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Images capturées
          </h3>
          <div className="relative h-32 w-full">
            <div className="absolute inset-0 flex overflow-x-auto pb-2 space-x-3 snap-x scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {capturedImages.map((imgSrc, index) => (
                <div
                  key={index}
                  className="flex-none w-32 h-full relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 snap-start"
                >
                  <img
                    src={imgSrc || "/placeholder.svg"}
                    alt={`Capture ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {capturedImages.length > 3 && (
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
