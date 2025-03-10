import { ITweet } from "@/models/tweetModel";
import mentionRepository from "@/repositories/mentionRepository";
import hashtagRepository from "@/repositories/hashtagRepository";
import tweetHashtagRepository from "@/repositories/tweetHashtagRepository";

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
    const matches = content.match(this.HASHTAG_REGEX) || [];
    return matches.map(tag => tag.slice(1)); // Enlève le # du début
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
      const mentionExists = await mentionRepository.findOne({ where: { mention: mention, tweet_id: tweet.id } });
      if (!mentionExists) {
        await mentionRepository.create({ tweet_id: tweet.id, user_id: mention, mention_type: 'mention' });
      }
    }
  }

  public async createHashtags(tweet: ITweet) {
    const { hashtags } = this.parseContent(tweet.content || '');
    for (const hashtag of hashtags) {
      const hashtagExists = await hashtagRepository.findOne({ where: { label: hashtag } });
      if (!hashtagExists) {
        const newHashtag = await hashtagRepository.create({ label: hashtag });
        await tweetHashtagRepository.create({ tweet_id: tweet.id, hashtag_id: newHashtag.id });
      } else {
        await tweetHashtagRepository.create({ tweet_id: tweet.id, hashtag_id: hashtagExists.id });
      }
    }
  }
}

const parsingService = new ParsingService();
export default parsingService;
