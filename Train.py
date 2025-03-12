import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import os


TRAIN_DIR = r"C:\APP_\face_sentiment\data\train"

IMG_SIZE = 48  
BATCH_SIZE = 32

#Liste des émotions 
emotions = sorted(os.listdir(TRAIN_DIR))

#Prétraitement des images (normalisation + augmentation de données)
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_generator = datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

val_generator = datagen.flow_from_directory(
    TRAIN_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

#Définition du modèle CNN
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMG_SIZE, IMG_SIZE, 3)),
    MaxPooling2D(2, 2),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Flatten(),
    Dense(128, activation='relu'),
    Dropout(0.5),
    Dense(len(emotions), activation='softmax')  # Nombre de classes basé sur `train/`
])

#Compilation du modèle
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

#Entraînement du modèle
history = model.fit(train_generator, validation_data=val_generator, epochs=20)

#Sauvegarde du modèle et des labels des émotions
model.save("model/emotion_model.h5")

#Sauvegarder les catégories d’émotions
with open("model/emotions_labels.txt", "w") as f:
    f.write("\n".join(emotions))

print("Modèle entraîné et sauvegardé dans `model/emotion_model.h5`")

