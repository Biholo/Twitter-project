import { ITweetHashtag } from "@/repositories/tweetHashtagModel";
import mongoose from 'mongoose';
import { hashtagIdsByLabel } from "./hashtagFixtures";
import { tweetFixtures } from "./tweetFixtures";

// Fonction pour extraire les hashtags d'un contenu de tweet
function extractHashtagsFromContent(content: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  
  if (!matches) return [];
  
  // Enlever le # pour obtenir juste le label
  return matches.map(match => match.substring(1));
}

// Génération des associations tweet-hashtag
export const tweetHashtagFixtures: Partial<ITweetHashtag>[] = [];

// Ensemble pour suivre les associations déjà créées et éviter les doublons
const existingAssociations = new Set<string>();

// Parcourir tous les tweets
tweetFixtures.forEach(tweet => {
  if (tweet.content && tweet._id) {
    // Extraire les hashtags du contenu
    const hashtagLabels = extractHashtagsFromContent(tweet.content);
    
    // Créer une association pour chaque hashtag trouvé
    hashtagLabels.forEach(label => {
      const hashtagId = hashtagIdsByLabel.get(label);
      
      // Vérifier si le hashtag existe dans notre map
      if (hashtagId) {
        // Créer une clé unique pour cette association
        const associationKey = `${tweet._id?.toString()}_${hashtagId.toString()}`;
        
        // Vérifier si cette association existe déjà
        if (!existingAssociations.has(associationKey)) {
          // Ajouter l'association à l'ensemble pour éviter les doublons futurs
          existingAssociations.add(associationKey);
          
          // Créer l'association
          tweetHashtagFixtures.push({
            _id: new mongoose.Types.ObjectId(),
            tweet_id: tweet._id,
            hashtag_id: hashtagId,
            created_at: tweet.created_at || new Date(),
            updated_at: tweet.updated_at || new Date()
          });
        }
      }
    });
  }
});