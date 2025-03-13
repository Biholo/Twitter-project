import mongoose from 'mongoose';
import UserModel from '../models/userModel';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createTestUser() {
  try {
    // Connexion à MongoDB en utilisant l'URI du fichier .env
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/twitter-db';
    console.log('Tentative de connexion à:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('Connexion à MongoDB réussie');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('L\'utilisateur test@example.com existe déjà');
    } else {
      // Créer un nouvel utilisateur
      const hashedPassword = await bcrypt.hash('Password123', 10);
      const newUser = new UserModel({
        username: 'TestUser',
        identifier_name: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        roles: ['ROLE_USER']
      });
      await newUser.save();
      console.log('Utilisateur test@example.com créé avec succès');
    }

    // Lister tous les utilisateurs pour vérification
    const users = await UserModel.find({});
    console.log('Utilisateurs dans la base de données:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.username})`);
    });

    // Déconnexion de MongoDB
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB réussie');
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exécuter la fonction
createTestUser();
