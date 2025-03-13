import { EmotionResponse } from "@/components/emotions/types";

interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

interface ApiResponseError<E = string> {
  success: false;
  error: E;
}

type ApiResponse<T, E> = ApiResponseSuccess<T> | ApiResponseError<E>;

// Fonction pour prédire l'émotion via HTTP POST (capture unique)
export async function fetchEmotionPrediction(
  imageBase64: string
): Promise<ApiResponse<EmotionResponse, string>> {
  try {
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();

    if ("error" in result) {
      return { success: false, error: result.error };
    }

    return { success: true, data: result };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("Erreur lors de la prédiction:", err);
    return { success: false, error };
  }
}
