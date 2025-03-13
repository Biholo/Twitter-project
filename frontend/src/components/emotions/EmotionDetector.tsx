import { useRef, useState, useEffect, useCallback } from "react";
import { FaceDetection, EmotionResponse } from "./types";
import { fetchEmotionPrediction } from "@/components/emotions/utils";
import "./EmotionDetector.css";

export function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detectedFaces, setDetectedFaces] = useState<FaceDetection[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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
      // Nettoyer le flux vidéo quand le composant est démonté
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Fonction pour capturer une image de la vidéo
  const captureImage = useCallback((): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir le canvas en base64
    return canvas.toDataURL("image/jpeg", 0.8);
  }, []);

  // Fonction pour prédire l'émotion via HTTP POST (capture unique)
  const predictEmotion = useCallback(async (): Promise<void> => {
    const imageData = captureImage();
    if (!imageData) return;

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

  // Fonction pour démarrer/arrêter la détection continue
  // const toggleDetection = (): void => {
  //   setIsRunning((isRunning) => !isRunning);
  // };

  // Obtenir une couleur en fonction de l'émotion
  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joie: "#FFEB3B", // jaune
      colère: "#F44336", // rouge
      tristesse: "#2196F3", // bleu
      peur: "#9C27B0", // violet
      dégoût: "#4CAF50", // vert
      surprise: "#FF9800", // orange
      neutre: "#FFFFFF", // blanc
    };

    return colors[emotion] || "#FFFFFF";
  };

  return (
    <div className="emotion-detector">
      <h2>Détecteur d'Émotions en Temps Réel</h2>

      {/* <div className="connection-status">
        État de la connexion:
        <span className={socketConnected ? "connected" : "disconnected"}>
          {socketConnected ? "Connecté" : "Déconnecté"}
        </span>
      </div> */}

      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} />
        {/* <canvas ref={canvasRef} className="detection-overlay" /> */}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="controls">
        {/* <button
          onClick={toggleDetection}
          className={isRunning ? "stop" : "start"}
          disabled={!socketConnected}
        >
          {isRunning ? "Arrêter la détection" : "Démarrer la détection"}
        </button> */}

        <button onClick={predictEmotion} disabled={isRunning}>
          Capturer une image
        </button>
      </div>

      <div className="detection-summary">
        <h3>Visages détectés: {detectedFaces.length}</h3>

        {detectedFaces.length > 0 && (
          <div className="faces-list">
            {detectedFaces.map((face, index) => (
              <div
                key={index}
                className="face-item"
                style={{ borderColor: getEmotionColor(face.emotion) }}
              >
                <div className="face-header">Visage #{index + 1}</div>
                <div className="face-emotion">Émotion: {face.emotion}</div>
                <div className="confidence-bar">
                  <div
                    className="confidence-level"
                    style={{
                      width: `${face.confidence * 100}%`,
                      backgroundColor: getEmotionColor(face.emotion),
                    }}
                  />
                </div>
                <div className="face-confidence">
                  Confiance: {Math.round(face.confidence * 100)}%
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
