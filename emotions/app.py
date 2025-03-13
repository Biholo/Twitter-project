from flask import Flask
from flask_socketio import SocketIO, emit
import cv2
import numpy as np
import base64

# load model keras
from  keras._tf_keras.keras.models import load_model
model = load_model('models/emotion_detection_model.h5')

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
    
@socketio.on('connect')
def handle_connect():
    print('Client connecté')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client déconnecté')

@socketio.on('frame')
def handle_frame(data):
    """
    Reçoit une frame encodée en base64, la décode, la convertit en image OpenCV,
    applique la détection d'émotion et renvoie le résultat.
    """
    image_data = data.get('image')
    if not image_data:
        return

    try:
        # Suppression de l'en-tête "data:image/jpeg;base64,"
        header, encoded = image_data.split(',', 1)
        img_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(img_bytes, np.uint8)
        
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.resize(img, (48, 48))
        img = img / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Emotion detection
        labels = ["anger", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"]
        prediction = model.predict(img)
        emotion = np.argmax(prediction)
        emotion = labels[emotion]
        
        print('Emotion détectée :', emotion)
        
        # Renvoie l'émotion détectée au client
        emit('emotion', {'emotion': emotion})
    except Exception as e:
        print("Erreur lors du traitement de la frame :", e)
        emit('emotion', {'emotion': 'erreur'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
