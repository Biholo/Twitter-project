from flask import Flask, Response, jsonify, request, send_from_directory
from flask_cors import CORS
import cv2
import tensorflow as tf
import numpy as np
import os
import time
import random

app = Flask(__name__)
CORS(app)


MODEL_PATH = "model/emotion_model.h5"
LABELS_PATH = "model/emotions_labels.txt"
IMG_SIZE = 48
CAPTURE_FOLDER = "captures"


if not os.path.exists(CAPTURE_FOLDER):
    os.makedirs(CAPTURE_FOLDER)


model = tf.keras.models.load_model(MODEL_PATH)
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])


with open(LABELS_PATH, "r") as f:
    categories = f.read().splitlines()

#Détecteur de visages OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

#Variables globales
last_detected_emotion = "none"
temp_captured_emotion = None  
temp_image_path = None  

#Dictionnaire de Citations par Émotion
emotion_quotes = {
    "happy": [
        "“Le bonheur est la seule chose qui se double si on le partage.” - A. Schweitzer",
        "“Le bonheur dépend de nous-mêmes.” - Aristote",
        "“Faites ce qui vous rend heureux, soyez avec ceux qui vous font sourire.”"
    ],
    "sad": [
        "“Les larmes viennent du cœur, pas du cerveau.” - Léonard de Vinci",
        "“C'est dans la douleur que naissent les plus grandes leçons.”",
        "“Même les nuits les plus sombres donneront naissance à un matin.”"
    ],
    "angry": [
        "“La colère est une brève folie.” - Horace",
        "“Celui qui est maître de lui-même est plus puissant que celui qui est maître du monde.” - Bouddha",
        "“Ne laisse pas ta colère durer plus qu'un jour.” - Sénèque"
    ],
    "surprise": [
        "“La vie est pleine de surprises, certaines sont bonnes, d'autres non.”",
        "“L'étonnement est la base de toute connaissance.” - Aristote",
        "“Les meilleures choses dans la vie sont souvent inattendues.”"
    ],
    "neutral": [
        "“L'équilibre est la clé du bonheur.”",
        "“La sérénité vient lorsque nous acceptons les choses comme elles sont.”",
        "“La paix intérieure commence dès que tu choisis de ne pas permettre à une autre personne ou événement de contrôler tes émotions.”"
    ]
}

#Fonction pour générer le flux vidéo avec la détection des visages
def generate_frames():
    global last_detected_emotion

    video_capture = cv2.VideoCapture(0)

    if not video_capture.isOpened():
        print(" Erreur : Impossible d'ouvrir la webcam.")
        return

    while True:
        success, frame = video_capture.read()
        if not success:
            break

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

        for (x, y, w, h) in faces:
            roi = frame[y:y+h, x:x+w]
            roi = cv2.resize(roi, (IMG_SIZE, IMG_SIZE))
            roi = np.expand_dims(roi, axis=0) / 255.0  

            prediction = model.predict(roi)
            emotion = categories[np.argmax(prediction)]
            last_detected_emotion = emotion  

            # Dessiner un rectangle autour du visage et afficher l'émotion
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    video_capture.release()

#Route pour récupérer le flux vidéo
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route pour capturer une émotion et renvoyer une citation aléatoire
@app.route('/capture_emotion', methods=['POST'])
def capture_emotion():
    global temp_captured_emotion, temp_image_path

    temp_captured_emotion = last_detected_emotion  
    temp_image_path = f"captures/temp_capture.png"

    cap = cv2.VideoCapture(0)
    success, frame = cap.read()
    cap.release()

    if success:
        cv2.putText(frame, temp_captured_emotion, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 255, 0), 3)
        cv2.imwrite(temp_image_path, frame)

    #  Sélection d'une citation aléatoire
    quote = random.choice(emotion_quotes.get(temp_captured_emotion, ["Aucune citation disponible."]))

    return jsonify({
        "captured_emotion": temp_captured_emotion,
        "temp_image_path": f"/captures/temp_capture.png",
        "quote": quote
    })

# Route pour servir les images capturées
@app.route('/captures/<filename>')
def get_captured_image(filename):
    return send_from_directory("captures", filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
