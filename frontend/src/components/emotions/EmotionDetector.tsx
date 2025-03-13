import { useRef, useState, useEffect } from "react";
import "./EmotionDetector.css";

export function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Configuration de la webcam
  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    const setupCamera = async () => {
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
        console.error("Erreur d'accès à la webcam:", err);

        if (err instanceof DOMException && err.name === "NotAllowedError") {
          setErrorMessage(
            "Accès à la webcam refusé. Veuillez autoriser l'accès à la webcam pour utiliser cette application."
          );
          return;
        }

        if (err instanceof DOMException && err.name === "NotFoundError") {
          setErrorMessage(
            "Aucune webcam détectée. Veuillez vous assurer que votre webcam est connectée et réessayez."
          );
          return;
        }

        if (err instanceof DOMException && err.name === "NotReadableError") {
          setErrorMessage(
            "Impossible d'accéder à la webcam. Veuillez vous assurer qu'aucune autre application n'utilise la webcam et réessayez."
          );
          return;
        }

        if (
          err instanceof DOMException &&
          err.name === "OverconstrainedError"
        ) {
          setErrorMessage(
            "Les contraintes de la webcam ne peuvent pas être satisfaites. Veuillez réessayer sans contraintes."
          );
          return;
        }

        if (err instanceof Error) {
          setErrorMessage("Erreur d'accès à la webcam: " + err.message);
          return;
        }

        setErrorMessage("Erreur d'accès à la webcam.");
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
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");

    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessiner l'image de la vidéo sur le canvas
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir le canvas en base64
    return canvas.toDataURL("image/jpeg");
  };

  // Fonction pour prédire l'émotion
  const predictEmotion = async () => {
    try {
      const imageData = captureImage();
      if (!imageData) return;

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setEmotion(result.emotion);
      setConfidence(result.confidence);
    } catch (err) {
      console.error("Erreur lors de la prédiction:", err);
      if (err instanceof Error) {
        setErrorMessage("Erreur lors de la prédiction: " + err.message);
        return;
      }

      setErrorMessage("Erreur lors de la prédiction.");
    }
  };

  // Fonction pour démarrer/arrêter la détection continue
  const toggleDetection = () => {
    setIsRunning((isRunning) => !isRunning);
  };

  // Exécuter la détection d'émotion à intervalles réguliers si isRunning est vrai
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRunning) {
      intervalId = setInterval(predictEmotion, 1000); // Prédiction toutes les secondes
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]);

  // Fonction pour dessiner le rectangle de détection
  const drawFaceBox = () => {
    if (!canvasRef.current || !emotion) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Dessiner un rectangle autour du visage (simulation simple)
    // Dans une implémentation réelle, vous utiliseriez les coordonnées
    // de détection de visage retournées par votre API
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const boxWidth = canvas.width / 2;
    const boxHeight = canvas.height / 2;

    if (ctx) {
      ctx.strokeStyle = getEmotionColor(emotion);
      ctx.lineWidth = 3;
      ctx.strokeRect(
        centerX - boxWidth / 2,
        centerY - boxHeight / 2,
        boxWidth,
        boxHeight
      );

      // Afficher l'émotion au-dessus du rectangle
      ctx.font = "20px Arial";
      ctx.fillStyle = getEmotionColor(emotion);
      ctx.fillText(
        `${emotion} (${Math.round(confidence * 100)}%)`,
        centerX - boxWidth / 2,
        centerY - boxHeight / 2 - 10
      );
    }
  };

  // Obtenir une couleur en fonction de l'émotion
  const getEmotionColor = (emotion) => {
    const colors = {
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

  // Dessiner le rectangle quand l'émotion change
  useEffect(() => {
    if (emotion) {
      drawFaceBox();
    }
  }, [emotion, confidence]);

  return (
    <div className="emotion-detector">
      <h2>Détecteur d'Émotions en Temps Réel</h2>

      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline muted />
        <canvas ref={canvasRef} className="detection-overlay" />
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <div className="controls">
        <button
          onClick={toggleDetection}
          className={isRunning ? "stop" : "start"}
        >
          {isRunning ? "Arrêter la détection" : "Démarrer la détection"}
        </button>

        <button onClick={predictEmotion} disabled={isRunning}>
          Capturer une image
        </button>
      </div>

      {emotion && (
        <div className="result">
          <h3>
            Émotion détectée:{" "}
            <span style={{ color: getEmotionColor(emotion) }}>{emotion}</span>
          </h3>
          <div className="confidence-bar">
            <div
              className="confidence-level"
              style={{
                width: `${confidence * 100}%`,
                backgroundColor: getEmotionColor(emotion),
              }}
            />
          </div>
          <p>Confiance: {Math.round(confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
}
