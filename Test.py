import tensorflow as tf
import cv2
import numpy as np
import os

#Définition des chemins
TEST_DIR = "C:\\APP_\\face_sentiment\\data\\test"
MODEL_PATH = "model/emotion_model.h5"
LABELS_PATH = "model/emotions_labels.txt"
IMG_SIZE = 48

#Vérification des chemins
if not os.path.exists(TEST_DIR):
    print(f"Erreur : Le dossier {TEST_DIR} n'existe pas.")
    exit()
if not os.path.exists(MODEL_PATH):
    print(f" Erreur : Le modèle {MODEL_PATH} n'existe pas.")
    exit()
if not os.path.exists(LABELS_PATH):
    print(f" Erreur : Le fichier des labels {LABELS_PATH} n'existe pas.")
    exit()

model = tf.keras.models.load_model(MODEL_PATH)
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])


with open(LABELS_PATH, "r") as f:
    categories = f.read().splitlines()

test_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=32,
    class_mode='categorical'
)

#Calcul de la précision
loss, accuracy = model.evaluate(test_generator)
print(f" Précision du modèle sur les données de test : {accuracy * 100:.2f}%")

#Tester individuellement les images de test
for emotion in os.listdir(TEST_DIR):
    emotion_dir = os.path.join(TEST_DIR, emotion)

    if os.path.isdir(emotion_dir):  # Vérifier que c'est un dossier
        for img_name in os.listdir(emotion_dir):
            img_path = os.path.join(emotion_dir, img_name)

            # Charger l'image et la convertir
            img = cv2.imread(img_path)
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
            img = np.expand_dims(img, axis=0) / 255.0  # Normalisation

            #Prédiction du modèle
            prediction = model.predict(img)
            detected_emotion = categories[np.argmax(prediction)]

            print(f"Image : {img_name} ({emotion}) → Prédiction : {detected_emotion}")

