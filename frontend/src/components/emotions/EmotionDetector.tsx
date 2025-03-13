import { useRef, useState, useEffect, useCallback } from "react";
import { FaceDetection } from "./types";
import { fetchEmotionPrediction } from "@/components/emotions/utils";
import { Button } from "@/components/ui/Button";
import "./EmotionDetector.css";

// Composant principal
export function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedFaces, setDetectedFaces] = useState<FaceDetection[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  // Configuration de la webcam
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
    const imageData = captureImage();
    if (!imageData) return;

    setErrorMessage("");
    const response = await fetchEmotionPrediction(imageData);

    if (!response.success) {
      setErrorMessage("Erreur lors de la prédiction: " + response.error);
      return;
    }
    setDetectedFaces(response.data.faces);
  }, [captureImage]);

  useEffect(() => {
    const intervalId = setInterval(predictEmotion, 200);
    return () => {
      clearInterval(intervalId);
    };
  }, [predictEmotion]);

  const handleCaptureImage = () => {
    const imageData = captureImage();
    if (imageData) {
      setCapturedImages((prev) => [...prev, imageData]);
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
      joie: "#FFEB3B",
      colère: "#F44336",
      tristesse: "#2196F3",
      peur: "#9C27B0",
      dégoût: "#4CAF50",
      surprise: "#FF9800",
      neutre: "#FFFFFF",
    };
    return colors[emotion] || "#FFFFFF";
  };

  return (
    <div className="emotion-detector">
      <h2>Détecteur d'Émotions en Temps Réel</h2>

      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="video-element"
        />
        {/* Badge overlay pour l'émotion dominante */}
        {dominantFace && (
          <div
            className="emotion-badge"
            style={{ borderColor: getEmotionColor(dominantFace.emotion) }}
          >
            {dominantFace.emotion} - {Math.round(dominantFace.confidence * 100)}
            %
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="controls">
        <Button onClick={handleCaptureImage}>Capturer une image</Button>
      </div>

      {capturedImages.length > 0 && (
        <div className="captured-images-container">
          {capturedImages.map((imgSrc, index) => (
            <div key={index} className="captured-image-wrapper">
              <img
                src={imgSrc}
                alt={`Capture ${index + 1}`}
                className="captured-image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
