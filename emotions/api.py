from flask import Flask, request, jsonify
from flask_cors import CORS
from  keras._tf_keras.keras.models import load_model
import numpy as np
import cv2
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Charger le modèle MobileNetV2 pour la reconnaissance d'émotions
model = load_model('models/emotion_detection_model.h5')

# Définir les classes d'émotions (à ajuster selon votre modèle)
EMOTIONS = ["colère", "dégoût", "peur", "joie", "tristesse", "surprise", "neutre"]

def preprocess_image(image):
    # Redimensionner l'image pour correspondre à l'entrée du modèle MobileNetV2
    # Généralement 224x224 pour MobileNetV2, mais à ajuster selon votre modèle
    image = cv2.resize(image, (48, 48))
    
    # Normaliser les valeurs des pixels
    image = image / 255.0
    
    # Ajouter une dimension de batch
    return np.expand_dims(image, axis=0)

@app.route('/predict', methods=['POST'])
def predict_emotion():
    try:
        # Récupérer l'image depuis la requête
        data = request.json
        image_b64 = data['image'].split(',')[1] if ',' in data['image'] else data['image']
        
        # Décoder l'image base64
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convertir en format numpy adapté pour OpenCV
        image_np = np.array(image)
        
        # Si l'image est en RGBA, convertir en RGB
        if image_np.shape[2] == 4:
            image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)
        
        # Prétraiter l'image
        processed_image = preprocess_image(image_np)
        
        # Faire la prédiction
        prediction = model.predict(processed_image)[0]
        
        # Obtenir l'émotion prédite et sa probabilité
        emotion_idx = np.argmax(prediction)
        emotion = EMOTIONS[emotion_idx]
        confidence = float(prediction[emotion_idx])
        
        return jsonify({
            'emotion': emotion,
            'confidence': confidence,
            'allProbabilities': {emotion: float(prob) for emotion, prob in zip(EMOTIONS, prediction)}
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)