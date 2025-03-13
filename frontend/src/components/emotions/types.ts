export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EmotionProbabilities {
  [emotion: string]: number;
}

export interface FaceDetection {
  emotion: string;
  confidence: number;
  bbox: BoundingBox;
  allProbabilities: EmotionProbabilities;
}

export interface EmotionResponse {
  faces: FaceDetection[];
  count: number;
  frameId?: number;
}
