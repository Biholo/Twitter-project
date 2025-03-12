import { ITweet } from "@/models/tweetModel";
import mentionRepository from "@/repositories/mentionRepository";
import hashtagRepository from "@/repositories/hashtagRepository";
import tweetHashtagRepository from "@/repositories/tweetHashtagRepository";
import userRepository from "@/repositories/userRepository";
import notificationService from "@/services/notificationService";

interface ParsedContent {
  mentions: string[];
  hashtags: string[];
  cleanContent: string;
}

class ParsingService {
  private readonly MENTION_REGEX = /@[\w]+/g;
  private readonly HASHTAG_REGEX = /#[\w]+/g;

  /**
   * Parse le contenu d'un tweet pour extraire les mentions et hashtags
   */
  public parseContent(content: string): ParsedContent {
    const mentions = this.extractMentions(content);
    const hashtags = this.extractHashtags(content);
    const cleanContent = this.sanitizeContent(content);

    return {
      mentions,
      hashtags,
      cleanContent
    };
  }

  /**
   * Extrait les mentions (@user) du contenu
   */
  private extractMentions(content: string): string[] {
    const matches = content.match(this.MENTION_REGEX) || [];
    return matches.map(mention => mention.slice(1)); // Enlève le @ du début
  }

  /**
   * Extrait les hashtags (#tag) du contenu
   */
  private extractHashtags(content: string): string[] {
    const matches = content.matchAll(this.HASHTAG_REGEX);
    const hashtags = Array.from(matches).map(match => match[0].slice(1)); // Enlève le # du début
    return [...new Set(hashtags)]; // Élimine les doublons
  }

  /**
   * Nettoie le contenu des caractères spéciaux indésirables
   */
  private sanitizeContent(content: string): string {
    return content
      .replace(/[<>]/g, '') // Supprime les balises HTML
      .trim();
  }

  /**
   * Vérifie si un mot est une mention valide
   */
  public isValidMention(word: string): boolean {
    return word.startsWith('@') && word.length > 1 && /^@[\w]+$/.test(word);
  }

  /**
   * Vérifie si un mot est un hashtag valide
   */
  public isValidHashtag(word: string): boolean {
    return word.startsWith('#') && word.length > 1 && /^#[\w]+$/.test(word);
  }


  /**
   * Analyse un tweet et retourne les utilisateurs à notifier
   */
  public getNotifiableUsers(tweet: ITweet): {
    mentionedUsers: string[];
    hashtagFollowers?: string[];
  } {
    const { mentions, hashtags } = this.parseContent(tweet.content || '');

    return {
      mentionedUsers: mentions,
      // Vous pouvez ajouter ici la logique pour trouver les utilisateurs
      // qui suivent les hashtags mentionnés
      hashtagFollowers: []
    };
  }

  /**
   * Vérifie si un tweet contient des mots interdits ou du contenu inapproprié
   */
  public isContentAppropriate(content: string): boolean {
    // Implémentez ici votre logique de modération
    // Par exemple, vérifier une liste de mots interdits
    const forbiddenWords = ['spam', 'inappropriate', 'offensive'];
    return !forbiddenWords.some(word => 
      content.toLowerCase().includes(word)
    );
  }

  public async createMentions(tweet: ITweet) {
    const { mentions } = this.parseContent(tweet.content || '');
    for (const mention of mentions) {
      const mentionedUser = await userRepository.findOne({ where: { identifier_name: mention } });
      if (!mentionedUser) {
        throw new Error(`Utilisateur mentionné ${mention} non trouvé`);
      }
      const mentionExists = await mentionRepository.findOne({ where: { mentioned_user_id: mentionedUser.id, tweet_id: tweet.id } });
      if (!mentionExists) {
        await mentionRepository.create({ tweet_id: tweet.id, mentioned_user_id: mentionedUser.id });
        await notificationService.notifyMention(tweet.author_id.toString(), mentionedUser.id.toString(), tweet.id.toString());
      }
    }
  }

  public async createHashtags(tweet: ITweet) {
    if (!tweet || !tweet.id) {
      throw new Error("Tweet invalide ou ID manquant");
    }

    const { hashtags } = this.parseContent(tweet.content || '');
    for (const hashtag of hashtags) {
      try {
        let hashtagDoc = await hashtagRepository.findOne({ where: { label: hashtag } });
        if (!hashtagDoc) {
          hashtagDoc = await hashtagRepository.create({ label: hashtag });
        }
        await tweetHashtagRepository.create({ 
          tweet_id: tweet.id, 
          hashtag_id: hashtagDoc.id 
        });
      } catch (error) {
        if ((error as any).code !== 11000) { // Ignore les erreurs de doublon
          throw error;
        }
      }
    }
  }

  public async updateTweetAssociations(tweet: ITweet) {
    // Suppression des anciennes associations
    await Promise.all([
        tweetHashtagRepository.deleteMany({ tweet_id: tweet.id }),
        mentionRepository.deleteMany({ tweet_id: tweet.id })
    ]);

    // Création des nouvelles associations
    await Promise.all([
        this.createHashtags(tweet),
        this.createMentions(tweet)
    ]);
}
}

const parsingService = new ParsingService();
export default parsingService;
