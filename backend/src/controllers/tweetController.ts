import { Request, Response } from 'express';
import tweetRepository from '@/repositories/tweetRepository';
import { createTweetSchema, getTweetsQuerySchema, getFeedQuerySchema } from '@/validators/tweetValidator';
import { AuthenticatedRequest } from '@/types';
import { handleError } from '@/utils/responseFormatter';
import tweetInteractionRepository from '@/repositories/tweetInteractionRepository';
import parsingService from '@/services/parsingService';
import { TweetFilters } from '@/types';
import { ITweet } from '@/models/tweetModel';
import { Types } from 'mongoose';
import { ITweetInteraction } from '@/models/tweetInteractionModel';

export const createTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { content, parent_tweet_id, media_url, tweet_type } = req.body;
        const userId = req.user?.id;

        if (!parsingService.isContentAppropriate(content)) {
            handleError(res, new Error("Contenu inapproprié"), "Contenu inapproprié");
            return;
        }

        const tweet = await tweetRepository.create({ content, parent_tweet_id, media_url, tweet_type, author_id: userId });

        await parsingService.createMentions(tweet);
        await parsingService.createHashtags(tweet);

        res.status(201).json({
            message: "Tweet créé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la création du tweet.");
        console.log(error);
    }
};

export const likeTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.create({ 
            tweet_id: new Types.ObjectId(tweet_id), 
            user_id: req.user?.id ? new Types.ObjectId(req.user.id) : undefined, 
            action_type: 'like' 
        });
        res.status(200).json({
            message: "Tweet liké avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la like du tweet.");
    }
};

export const unlikeTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.delete({ tweet_id, user_id: req.user?.id, action_type: 'like' });
        res.status(200).json({
            message: "Tweet liké avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la like du tweet.");
    }
};

export const saveTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.create({ 
            tweet_id: new Types.ObjectId(tweet_id), 
            user_id: req.user?.id ? new Types.ObjectId(req.user.id) : undefined, 
            action_type: 'bookmark' 
        });
        res.status(200).json({
            message: "Tweet sauvegardé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la sauvegarde du tweet.");
    }
};

export const unsaveTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { tweet_id } = req.params;
        const tweet = await tweetInteractionRepository.delete({ tweet_id, user_id: req.user?.id, action_type: 'bookmark' });
        res.status(200).json({
            message: "Tweet sauvegardé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la sauvegarde du tweet.");
    }
};

export const getTweets = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const {
        user_id,
        hashtag,
        search,
        start_date,
        end_date,
        parent_tweet_id,
        tweet_type,
        include_liked,
        include_saved,
        page,
        limit
      } = req.query;

      // Vérification des droits pour les tweets sauvegardés
      if (include_saved === 'true' && (!req.user || (user_id as string) !== req.user.id.toString())) {
        handleError(res, new Error("Accès non autorisé"), "Vous ne pouvez pas voir les tweets sauvegardés d'autres utilisateurs");
        return;
      }

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
      if (tweet_type) filters.tweet_type = tweet_type as 'tweet' | 'reply' | 'retweet';
      if (include_liked === 'true') filters.include_liked = true;
      if (include_saved === 'true') filters.include_saved = true;

      console.log("Filtres appliqués:", filters);
      
      const result = await tweetRepository.findTweetsWithFilters({
        filters,
        authenticatedUserId: req.user?.id.toString()
      });
      
      console.log("Résultat de la requête:", JSON.stringify(result, null, 2));
      
      res.status(200).json({
        message: "Tweets récupérés avec succès",
        data: result.tweets,
        pagination: result.pagination
      });
    } catch (error) {
      console.error("Erreur complète:", error);
      handleError(res, error, "Erreur lors de la récupération des tweets.");
    }
  };

export const getTweetDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
  
      if (!id) {
        handleError(res, new Error("ID de tweet manquant"), "ID de tweet manquant");
        return;
      }

      if (!userId) {
        handleError(res, new Error("Utilisateur non authentifié"), "Utilisateur non authentifié");
        return;
      }
  
      const tweet = await tweetRepository.getTweetDetails({
        tweetId: id,
        authenticatedUserId: userId.toString()
      });
  
      if (!tweet) {
        res.status(404).json({
          message: "Tweet non trouvé"
        });
        return;
      }
  
      res.status(200).json({
        message: "Détails du tweet récupérés avec succès",
        data: tweet
      });
    } catch (error) {
      handleError(res, error, "Erreur lors de la récupération des détails du tweet.");
    }
  };

export const updateTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user?.id;

        if (!id || !userId) {
            res.status(400).json({
                message: "ID du tweet ou utilisateur manquant"
            });
            return;
        }

        // Vérification du contenu
        if (!parsingService.isContentAppropriate(content)) {
            handleError(res, new Error("Contenu inapproprié"), "Contenu inapproprié");
            return;
        }

        // Récupération du tweet
        const tweet = await tweetRepository.findById(id);

        // Vérifications
        if (!tweet) {
            res.status(404).json({
                message: "Tweet non trouvé"
            });
            return;
        }

        if (tweet.author_id.toString() !== userId.toString()) {
            res.status(403).json({
                message: "Vous ne pouvez pas modifier ce tweet"
            });
            return;
        }

        // Mise à jour du tweet
        const updatedTweet = await tweetRepository.findByIdAndUpdate(
            id,
            { content },
            { new: true }
        );

        if (!updatedTweet) {
            res.status(404).json({
                message: "Tweet non trouvé après la mise à jour"
            });
            return;
        }

        // Mise à jour des hashtags et mentions
        await parsingService.updateTweetAssociations(updatedTweet as ITweet);

        res.status(200).json({
            message: "Tweet modifié avec succès",   
            data: updatedTweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la modification du tweet.");
    }
};