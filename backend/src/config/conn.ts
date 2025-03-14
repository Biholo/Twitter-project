import mongoose from 'mongoose';

// Fonction pour se connecter à MongoDB
const connect = async (): Promise<void> => {
  try {
    
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/twitter-db";

    // Connexion à MongoDB
    await mongoose.connect(mongoURI, {
    });

    console.log('✅ Connexion à MongoDB réussie !');
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à MongoDB :', error);
    process.exit(1); // Arrêter l'application en cas d'échec critique
  }
};

// Export de la fonction de connexion
export default connect;
