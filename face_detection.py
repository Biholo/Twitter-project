import cv2

#Charger le modèle de détection de visages d’OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")

#Ouvrir la webcam 
video_capture = cv2.VideoCapture(0)

if not video_capture.isOpened():
    print("Erreur : Impossible d'ouvrir la webcam.")
    exit()

while True:
    #Capturer une image depuis la webcam
    ret, frame = video_capture.read()
    if not ret:
        print("Erreur : Impossible de lire l’image.")
        break

    #Convertir en niveaux de gris (meilleure performance)
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    #Détecter les visages dans l’image
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5, minSize=(30, 30))

    #Dessiner un rectangle autour des visages détectés
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)

    #Afficher l’image avec les détections
    cv2.imshow("Détection de Visage", frame)

    #Quitter avec la touche "q"
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

#Libérer la caméra et fermer les fenêtres
video_capture.release()
cv2.destroyAllWindows()
