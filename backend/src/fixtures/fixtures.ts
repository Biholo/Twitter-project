import User from "@/models/userModel";
import Tweet from "@/models/tweetModel";
import { notifications } from './notificationFixtures';
import Notification from '@/models/notificationModel';
import Follow from '@/models/followModel';
import TweetInteraction from '@/models/tweetInteractionModel';

import { userFixtures } from "./userFixture";
import { tweetFixtures } from "./tweetFixtures";
import { followFixtures } from "./followFixtures";
import { tweetInteractionFixtures } from "./tweetInteractionFixtures";

/**
 * Charge l'ensemble des fixtures dans la base de données.
 * Cette fonction peut être appelée au démarrage en environnement de développement ou lors des tests.
 */
export async function loadFixtures(): Promise<void> {
  try {
    // 1. Nettoyage de toutes les collections d'abord
    console.log("🧹 Nettoyage des collections...");
    await Promise.all([
      User.deleteMany({}),
      Tweet.deleteMany({}),
      Notification.deleteMany({}),
      Follow.deleteMany({}),
      TweetInteraction.deleteMany({})
    ]);

    // 2. Insertion des utilisateurs en premier
    console.log("👤 Insertion des utilisateurs...");
    await User.insertMany(userFixtures);

    // 3. Insertion des tweets
    console.log("📝 Insertion des tweets...");
    const insertedTweets = await Tweet.insertMany(tweetFixtures);

    // 4. Mise à jour des IDs de tweets dans les interactions
    console.log("🔄 Mise à jour des références de tweets...");
    const updatedInteractions = tweetInteractionFixtures.map((interaction, index) => ({
      ...interaction,
      tweet_id: insertedTweets[index % insertedTweets.length]?._id.toString() // Conversion en string
    }));

    // 5. Insertion des follows
    console.log("🤝 Insertion des follows...");
    // await Follow.insertMany(followFixtures);

    // 6. Insertion des notifications
    console.log("🔔 Insertion des notifications...");
    await Notification.insertMany(notifications);

    // 7. Insertion des interactions
    console.log("👍 Insertion des interactions...");
    await TweetInteraction.insertMany(updatedInteractions);

    console.log("✅ Toutes les fixtures ont été chargées avec succès");
  } catch (error) {
    console.error("❌ Erreur lors du chargement des fixtures:", error);
    // Log plus détaillé de l'erreur
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}