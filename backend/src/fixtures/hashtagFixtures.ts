import { IHashtag } from "@/models/hashtagModel";
import mongoose from 'mongoose';

// Définir d'abord les catégories de hashtags
const hashtagsByCategory = {
  tech: ["#javascript", "#typescript", "#react", "#angular", "#vue", "#nodejs", "#mongodb", "#postgres", "#aws", "#azure", "#gcp", "#docker", "#kubernetes", "#devops", "#frontend", "#backend", "#fullstack", "#webdev", "#coding", "#programming", "#developer", "#softwareengineering", "#tech", "#ai", "#ml"],
  cinema: ["#film", "#cinema", "#movie", "#director", "#actor", "#actress", "#hollywood", "#blockbuster", "#indiefilm", "#oscars", "#netflix", "#streaming", "#marvel", "#dc", "#starwars", "#scifi", "#drama", "#comedy", "#thriller", "#horror"],
  sport: ["#football", "#soccer", "#nba", "#tennis", "#rugby", "#f1", "#running", "#fitness", "#olympics", "#worldcup", "#champion", "#athlete", "#sports", "#training", "#marathon", "#cycling", "#golf", "#skiing", "#climbing", "#swimming"],
  architecture: ["#architecture", "#design", "#building", "#urban", "#city", "#construction", "#interior", "#exterior", "#sustainable", "#modern", "#classic", "#brutalism", "#minimalist", "#skyscraper", "#house", "#apartment", "#renovation", "#heritage", "#landscape", "#urbanplanning"],
  graphisme: ["#design", "#graphic", "#illustration", "#art", "#creative", "#logo", "#branding", "#typography", "#color", "#vector", "#digital", "#print", "#poster", "#packaging", "#webdesign", "#ux", "#ui", "#userinterface", "#photoshop", "#illustrator"],
  politique: ["#politics", "#government", "#democracy", "#election", "#vote", "#policy", "#law", "#rights", "#freedom", "#justice", "#parliament", "#congress", "#president", "#minister", "#campaign", "#party", "#left", "#right", "#center", "#reform"],
  actualité: ["#news", "#current", "#today", "#breaking", "#headline", "#report", "#journalist", "#media", "#press", "#broadcast", "#live", "#update", "#world", "#national", "#local", "#global", "#crisis", "#event", "#analysis", "#investigation"]
};

// Ensuite, utiliser cette variable dans la fonction
export function extractUniqueHashtags(): string[] {
  // Ensemble pour stocker les hashtags uniques (sans le #)
  const uniqueHashtags = new Set<string>();
  
  // Parcourir toutes les catégories de hashtags
  Object.values(hashtagsByCategory).forEach(categoryHashtags => {
    categoryHashtags.forEach(hashtag => {
      // Enlever le # et ajouter au set
      uniqueHashtags.add(hashtag.substring(1));
    });
  });
  
  return Array.from(uniqueHashtags);
}

// Création des objets hashtag avec IDs
export const hashtagFixtures: Partial<IHashtag>[] = extractUniqueHashtags().map(label => ({
  _id: new mongoose.Types.ObjectId(),
  label,
  created_at: new Date(),
  updated_at: new Date()
}));

// Map pour accéder facilement aux IDs des hashtags par leur label
export const hashtagIdsByLabel = new Map<string, mongoose.Types.ObjectId>();
hashtagFixtures.forEach(hashtag => {
  if (hashtag.label && hashtag._id) {
    hashtagIdsByLabel.set(hashtag.label, hashtag._id as mongoose.Types.ObjectId);
  }
});