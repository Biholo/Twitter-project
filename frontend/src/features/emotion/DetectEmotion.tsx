import { socket } from "@/lib/socket";
import { useRef, useEffect, useState, useCallback } from "react";
import { Slider } from "@/components/ui/Slider";

type Emotion =
  | "anger"
  | "disgust"
  | "fear"
  | "happiness"
  | "neutral"
  | "sadness"
  | "surprise";

type EmotionResponse = {
  [key in Emotion]: number;
};

export function DetectEmotion() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState<EmotionResponse | null>(null);
  const [capturedEmotion, setCapturedEmotion] = useState<Emotion | null>(null);

  const probableEmotion = emotion && Object.keys(emotion).reduce((acc, key) =>
    emotion[key as Emotion] > emotion[acc as Emotion] ? key : acc
  ) as Emotion;

  useEffect(() => {
    socket.on("emotion", onEmotion);

    return () => {
      socket.off("emotion", onEmotion);
    };
  }, [emotion]);

  const onEmotion = (data: EmotionResponse) => {
    setEmotion(data);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Erreur lors de l'accès à la caméra :", error);
    }
  };

  const captureAndSendFrame = () => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;

    const context = canvas.getContext("2d");
    // Dessiner le flux vidéo sur le canvas
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // Convertir le canvas en Data URI (format JPEG)
    const imageDataURL = canvas.toDataURL("image/jpeg");

    // Envoyer la frame au backend via SocketIO
    socket.emit("frame", { image: imageDataURL });
  };

  // Redessine la frame et superpose le texte de l'émotion
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !videoRef.current) return;

    const context = canvas.getContext("2d")!;
    // Efface le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Dessine la frame vidéo
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    // Superpose le texte de l'émotion
    context.font = "30px Arial";
    context.fillStyle = "red";
    context.fillText(`Emotion: ${emotion}`, 10, 40);
  }, [emotion]);

  // Fonction pour figer l'émotion détectée au clic du bouton
  const handleCaptureEmotion = () => {
    setCapturedEmotion(probableEmotion);
  };

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();

    // Démarrage de la caméra
    startCamera();

    // Capture des frames en continu
    const interval = setInterval(() => {
      captureAndSendFrame();
      drawFrame();
    }, 500); // environ 20 fps

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [drawFrame]);

  return (
    <div>
      <h1>Détection d'émotion en temps réel</h1>
      <video
        ref={videoRef}
        autoPlay
        width="640"
        height="480"
        style={{ border: "1px solid #000" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      />
      <div>
        <p>
          Emotion détectée en temps réel : <strong>{probableEmotion}</strong>
        </p>
        <button onClick={handleCaptureEmotion}>Capturer l'émotion</button>
        {capturedEmotion && (
          <p>
            Emotion capturée : <strong>{capturedEmotion}</strong>
          </p>
        )}
      </div>

      <div>
        {emotion && (
          <div>
        {Object.entries(emotion).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label>{key}: {Math.round(value * 100)}%</label>
            <Slider defaultValue={[value * 100]} max={100} />
          </div>
        ))}
          </div>
        )}
      </div>
    </div>
  );
}
