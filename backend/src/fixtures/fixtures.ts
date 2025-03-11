import User from "@/models/userModel";
import Tweet from "@/models/tweetModel";
import { notifications } from './notificationFixtures';
import Notification from '@/models/notificationModel';

import { userFixtures } from "./userFixture";
import { tweetFixtures } from "./tweetFixtures";
/**
 * Charge l'ensemble des fixtures dans la base de données.
 * Cette fonction peut être appelée au démarrage en environnement de développement ou lors des tests.
 */
export async function loadFixtures(): Promise<void> {
  try {
    // Ici on peut nettoyer les collections avant d'insérer des données de test.
    await User.deleteMany({});
    await User.insertMany(userFixtures);
    await Tweet.deleteMany({});
    await Tweet.insertMany(tweetFixtures);

    // Notifications
    await Notification.deleteMany({});
    await Notification.insertMany(notifications);

    console.log("✅ Toutes les fixtures ont été chargées avec succès");
  } catch (error) {
    console.error("❌ Erreur lors du chargement des fixtures:", error);
    throw error;
  }
}