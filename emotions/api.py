from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from  keras._tf_keras.keras.models import load_model
import numpy as np
import cv2
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Charger le modèle MobileNetV2 pour la reconnaissance d'émotions
model = load_model('models/emotion_detection_model.h5')

# Charger le détecteur de visages Haar Cascade d'OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Définir les classes d'émotions (à ajuster selon votre modèle)
EMOTIONS = ["colère", "dégoût", "peur", "joie", "tristesse", "surprise", "neutre"]

def preprocess_image_for_model(face_img):
    # Redimensionner l'image pour correspondre à l'entrée du modèle MobileNetV2
    # Généralement 224x224 pour MobileNetV2, mais à ajuster selon votre modèle
    face_img = cv2.resize(face_img, (48, 48))
    
    # Normaliser les valeurs des pixels
    face_img = face_img / 255.0
    
    # Ajouter une dimension de batch
    return np.expand_dims(face_img, axis=0)

def detect_faces_and_emotions(image_np):
    # Convertir en niveaux de gris pour la détection de visage
    gray = cv2.cvtColor(image_np, cv2.COLOR_RGB2GRAY)
    
    # Détecter les visages
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )
    
    results = []
    
    # Pour chaque visage détecté
    for (x, y, w, h) in faces:
        # Extraire la région du visage
        face_roi = image_np[y:y+h, x:x+w]
        
        # Prétraiter pour le modèle
        processed_face = preprocess_image_for_model(face_roi)
        
        # Prédire l'émotion
        prediction = model.predict(processed_face)[0]
        
        # Obtenir l'émotion prédite et sa probabilité
        emotion_idx = np.argmax(prediction)
        emotion = EMOTIONS[emotion_idx]
        confidence = float(prediction[emotion_idx])
        
        # Ajouter le résultat
        results.append({
            'emotion': emotion,
            'confidence': confidence,
            'bbox': {
                'x': int(x),
                'y': int(y),
                'width': int(w),
                'height': int(h)
            },
            'allProbabilities': {emotion: float(prob) for emotion, prob in zip(EMOTIONS, prediction)}
        })
    
    return results

def process_image_data(image_data):
    # Récupérer l'image base64
    image_b64 = image_data.split(',')[1] if ',' in image_data else image_data
    
    # Décoder l'image base64
    image_bytes = base64.b64decode(image_b64)
    image = Image.open(io.BytesIO(image_bytes))
    
    # Convertir en format numpy adapté pour OpenCV
    image_np = np.array(image)
    
    # Si l'image est en RGBA, convertir en RGB
    if len(image_np.shape) > 2 and image_np.shape[2] == 4:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGBA2RGB)
    
    return image_np

@app.route('/predict', methods=['POST'])
def predict_emotion():
    try:
        # Récupérer l'image depuis la requête
        data = request.json
        image_np = process_image_data(data['image'])
        
        # Détecter les visages et leurs émotions
        results = detect_faces_and_emotions(image_np)
        
        return jsonify({
            'faces': results,
            'count': len(results)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('frame')
def handle_frame(data: dict):
    try:
        # Récupérer l'image depuis la requête
        image_np = process_image_data(data['image'])
        
        # Détecter les visages et leurs émotions
        results = detect_faces_and_emotions(image_np)
        
        # Émettre les résultats au client
        socketio.emit('emotion_results', {
            'faces': results,
            'count': len(results),
            'frameId': data.get('frameId', None)  # Renvoyer l'ID du frame si fourni
        })
    
    except Exception as e:
        socketio.emit('error', {'message': str(e)})

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000)