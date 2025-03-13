# 🚀 Twitter Project

## 📌 Description

Ce projet est une plateforme de type Twitter qui permet aux utilisateurs de s'inscrire, de se connecter, de publier des tweets, de suivre d'autres utilisateurs et d'intéragir avec le contenu via des mentions "J'aime" et des commentaires.

## 🛠️ Technologies utilisées

### **M1 :**

- **Frontend :** React.js
- **Backend :** Node.js, Express
- **Base de données :** MongoDB Atlas
- **Déploiement :** Docker

### **M2 :**

- **Deep Learning :** Modèle CNN
- **Indice :** Reconnaissance d'expressions faciales
- **Backend Integration IA :** API Flask (éventuellement Django)

---

## 🚀 Installation et lancement du projet en local

### 1. **Cloner le projet**

```bash
git clone https://github.com/Biholo/Twitter-project.git
```

### 2. **Configurer les variables d'environnement**

Copiez les fichiers `.env.exemple` des dossiers `backend` et `frontend`

### 3. **Installer les dépendances**

#### **Docker**

Lancer docker, puis les services docker du projet :

```bash
docker compose -f compose.production.yml up -d
```

#### **Backend**

```bash
cd backend
npm i
```

#### **Frontend**

```bash
cd frontend
npm i
```

### 4. **Lancer MinIO (en Docker)**

```bash
docker run -p 9000:9000 -p 9001:9001 \
-e MINIO_ROOT_USER=miniouser \
-e MINIO_ROOT_PASSWORD=miniopassword \
minio/minio server /data --console-address ":9001"
```

### 5. **Démarrer le serveur backend**

```bash
cd backend
npm run dev
```

### 6. **Démarrer le frontend**

```bash
cd frontend
npm start
```

---

## 🌐 **Accès à MinIO**

- **Console MinIO :** [http://localhost:9001](http://localhost:9001)
- **API MinIO :** [http://localhost:9000](http://localhost:9000)

---

## 🎯 **Trello**

👉 Lien vers le Trello : [https://trello.com/b/EaZE3d3Y/projet-twitter](https://trello.com/b/EaZE3d3Y/projet-twitter)

---

## ✅ **Fonctionnalités principales**

👉 Inscription et connexion des utilisateurs\
👉 Publication de tweets\
👉 Suivi et désabonnement d'autres utilisateurs\
👉 Mention "J'aime" et commentaires\
👉 Upload d'images avec MinIO\
👉 Reconnaissance d'expressions faciales avec CNN via Flask

---

## 👨‍💻 **Contributeurs**

- **Beji SOUHIR** - Frontend

- **Damien LORTIE THIBAUT** - Frontend

- **Slimane DERGUINI** - Intégration IA

- **Sofiane MSATFA** - Intégration IA

- **Killian TROUET** - Backend

- **Moussa BAKAYOKO** - Backend

- **Thomas Yalap** - Backend
