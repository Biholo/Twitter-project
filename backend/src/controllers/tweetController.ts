import { Request, Response } from 'express';
import tweetRepository from '@/repositories/tweetRepository';
import { createTweetSchema, getTweetsQuerySchema, getFeedQuerySchema } from '@/validators/tweetValidator';
import { AuthenticatedRequest } from '@/types';
import { handleError } from '@/utils/responseFormatter';
import tweetInteractionRepository from '@/repositories/tweetInteractionRepository';
import parsingService from '@/services/parsingService';
import { TweetFilters } from '@/types';

export const createTweet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { content, parent_tweet_id, media_url, tweet_type } = req.body;

        if (!parsingService.isContentAppropriate(content)) {
            return handleError(res, new Error("Contenu inapproprié"), "Contenu inapproprié");
        }

        const tweet = await tweetRepository.create({ content, parent_tweet_id, media_url, tweet_type });

        await parsingService.createMentions(tweet);
        await parsingService.createHashtags(tweet);

        res.status(201).json({
            message: "Tweet créé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la création du tweet.");
    }
}


export const likeTweet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.create({ tweet_id, user_id: req.user?.id, interaction_type: 'like' } );
        res.status(200).json({
            message: "Tweet liké avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la like du tweet.");
    }
}

export const unlikeTweet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.delete({ tweet_id, user_id: req.user?.id, interaction_type: 'like' });
        res.status(200).json({
            message: "Tweet liké avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la like du tweet.");
    }
}

export const saveTweet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.create({ tweet_id, user_id: req.user?.id, interaction_type: 'save' });
        res.status(200).json({
            message: "Tweet sauvegardé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la sauvegarde du tweet.");
    }
}

export const unsaveTweet = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.delete({ tweet_id, user_id: req.user?.id, interaction_type: 'save' });
        res.status(200).json({
            message: "Tweet sauvegardé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la sauvegarde du tweet.");
    }
}


export const getTweets = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        user_id,
        hashtag,
        search,
        start_date,
        end_date,
        parent_tweet_id,
        page,
        limit
      } = req.query;
  
      const filters: TweetFilters = {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10
      };
  
      // Ajout des filtres optionnels
      if (user_id) filters.user_id = user_id as string;
      if (hashtag) filters.hashtag = hashtag as string;
      if (search) filters.search = search as string;
      if (start_date) filters.start_date = new Date(start_date as string);
      if (end_date) filters.end_date = new Date(end_date as string);
      if (parent_tweet_id) filters.parent_tweet_id = parent_tweet_id as string;
  
      const result = await tweetRepository.findTweetsWithFilters(filters);
  
      res.status(200).json({
        message: "Tweets récupérés avec succès",
        data: result
      });
    } catch (error) {
      handleError(res, error, "Erreur lors de la récupération des tweets.");
    }
  };


  export const getTweetDetails = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
  
      if (!id) {
        return handleError(res, new Error("ID de tweet manquant"), "ID de tweet manquant");
      }
  
      const tweet = await tweetRepository.getTweetDetails(id, userId);
  
      if (!tweet) {
        return res.status(404).json({
          message: "Tweet non trouvé"
        });
      }
  
      res.status(200).json({
        message: "Détails du tweet récupérés avec succès",
        tweet: tweet
      });
    } catch (error) {
      handleError(res, error, "Erreur lors de la récupération des détails du tweet.");
    }
  };

