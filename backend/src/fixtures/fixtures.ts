import Follow from '@/models/followModel';
import Hashtag from '@/models/hashtagModel';
import Notification from '@/models/notificationModel';
import TweetInteraction from '@/models/tweetInteractionModel';
import Tweet from "@/models/tweetModel";
import User from "@/models/userModel";
import TweetHashtag from '@/repositories/tweetHashtagModel';
import { hashtagFixtures } from './hashtagFixtures';
import { notifications } from './notificationFixtures';
import { tweetFixtures } from "./tweetFixtures";
import { tweetHashtagFixtures } from './tweetHashtagFixtures';
import { tweetInteractionFixtures } from "./tweetInteractionFixtures";
import { userFixtures } from "./userFixture";

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
      TweetInteraction.deleteMany({}),
      Hashtag.deleteMany({}),
      TweetHashtag.deleteMany({})
    ]);

    // 2. Insertion des utilisateurs en premier
    console.log("👤 Insertion des utilisateurs...");
    await User.insertMany(userFixtures);

    // 3. Insertion des tweets
    console.log("📝 Insertion des tweets...");
    await Tweet.insertMany(tweetFixtures);

    // 4. Insertion des hashtags
    console.log("🔖 Insertion des hashtags...");
    await Hashtag.insertMany(hashtagFixtures);

    // 5. Insertion des associations tweet-hashtag
    console.log("🔗 Insertion des associations tweet-hashtag...");
    await TweetHashtag.insertMany(tweetHashtagFixtures);

    // 6. Insertion des follows
    console.log("🤝 Insertion des follows...");
    // await Follow.insertMany(followFixtures);

    // 7. Insertion des notifications
    console.log("🔔 Insertion des notifications...");
    await Notification.insertMany(notifications);

    // 8. Insertion des interactions
    console.log("👍 Insertion des interactions...");
    await TweetInteraction.insertMany(tweetInteractionFixtures);

    console.log("✅ Toutes les fixtures ont été chargées avec succès");
  } catch (error) {
    // console.error("❌ Erreur lors du chargement des fixtures:", error);
    // Log plus détaillé de l'erreur
    if (error instanceof Error) {
      // console.error("Message d'erreur:", error.message);
      // console.error("Stack trace:", error.stack);
    }
    throw error;
  }
}