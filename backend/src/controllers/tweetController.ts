import { ITweet } from '@/models/tweetModel';
import tweetInteractionRepository from '@/repositories/tweetInteractionRepository';
import tweetRepository from '@/repositories/tweetRepository';
import parsingService from '@/services/parsingService';
import { AuthenticatedRequest, TweetFilters } from '@/types';
import { handleError } from '@/utils/responseFormatter';
import { Response } from 'express';
import { Types } from 'mongoose';
import notificationService from '@/services/notificationService';
import minioService from '@/services/minioService';

export const createTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        // Récupérer les données du FormData
        const content = req.body.content || '';
        const parent_tweet_id = req.body.parent_tweet_id;
        const tweet_type = req.body.tweet_type || 'tweet';

        console.log(req.body);
        console.log(req.files);

        // Vérifier que l'utilisateur est authentifié
        if (!userId) {
            handleError(res, new Error("Utilisateur non authentifié"), "Vous devez être connecté pour créer un tweet");
            return;
        }

        // Vérifier le contenu seulement s'il n'est pas vide
        if (content && !parsingService.isContentAppropriate(content)) {
            handleError(res, new Error("Contenu inapproprié"), "Contenu inapproprié");
            return;
        }

        let media_urls = [];
        if (req.files && Array.isArray(req.files)) {
            // Traiter chaque fichier
            for (const file of req.files) {
                try {
                    const media_url = await minioService.uploadFile(file);
                    media_urls.push(media_url);
                } catch (error) {
                    console.error("Erreur lors de l'upload du fichier:", error);
                    handleError(res, error, "Erreur lors de l'upload d'un fichier");
                    return;
                }
            }
        }

        // Vérifier qu'il y a au moins du contenu ou des médias
        if (!content && media_urls.length === 0) {
            handleError(res, new Error("Le tweet doit contenir du texte ou au moins un média"), "Le tweet doit contenir du texte ou au moins un média");
            return;
        }

        const tweet = await tweetRepository.create({ 
            content, 
            parent_tweet_id, 
            media_urls, 
            tweet_type, 
            author_id: userId 
        });

        await parsingService.createMentions(tweet);
        await parsingService.createHashtags(tweet);

        if(parent_tweet_id) {
            const parentTweet = await tweetRepository.findById(parent_tweet_id.toString());
            if(parentTweet && userId && parentTweet.author_id.toString() !== userId.toString()) {
                await notificationService.notifyReply(userId.toString() , parentTweet.author_id.toString(), tweet._id.toString());
            }
        }

        res.status(201).json({
            message: "Tweet créé avec succès",
            tweet
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la création du tweet.");
        console.error("Erreur complète:", error);
    }
};

export const likeTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;
        
        // Vérifier que l'utilisateur est authentifié
        if (!user_id) {
            res.status(401).json({ message: "Vous devez être connecté pour liker un tweet" });
            return;
        }
        
        // Convertir les IDs en ObjectId
        const tweetObjectId = new Types.ObjectId(id);
        const userObjectId = new Types.ObjectId(user_id);

        // Vérifier que le tweet existe
        const tweetExists = await tweetRepository.findById(tweetObjectId.toString());
        if (!tweetExists) {
            res.status(404).json({ message: "Tweet non trouvé" });
            return;
        }
        
        // Utiliser une requête explicite avec tous les critères
        const existingLike = await tweetInteractionRepository.findOne({
            tweet_id: tweetObjectId,
            user_id: userObjectId,
            action_type: 'like'
        }, true);
        
        if (existingLike) {
            res.status(400).json({ message: "Vous avez déjà liké ce tweet" });
            return;
        }
        
        // Créer l'interaction de like
        const newLike = await tweetInteractionRepository.create({ 
            tweet_id: tweetObjectId, 
            user_id: userObjectId, 
            action_type: 'like',
            action_date: new Date()
        });

        await notificationService.notifyLike(userObjectId.toString(), tweetExists.author_id.toString(), tweetObjectId.toString());
        
        
        // Incrémenter le compteur de likes
        const updatedTweet = await tweetRepository.update(
            { _id: tweetObjectId }, 
            { $inc: { likes_count: 1 } }
        );
        
        res.status(200).json({
            message: "Tweet liké avec succès",
            tweet: updatedTweet
        });
    } catch (error) {
        console.error("Erreur détaillée:", error);
        handleError(res, error, "Erreur lors du like du tweet.");
    }
};

export const unlikeTweet = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;

        // Vérifier que l'utilisateur est authentifié
        if (!user_id) {
            res.status(401).json({ message: "Vous devez être connecté pour unliker un tweet" });
            return;
        }
        
        // Convertir les IDs en ObjectId
        const tweetObjectId = new Types.ObjectId(id);
        const userObjectId = new Types.ObjectId(user_id);

        // Vérifier que le tweet existe
        const tweetExists = await tweetRepository.findById(tweetObjectId.toString());
        if (!tweetExists) {
            res.status(404).json({ message: "Tweet non trouvé" });
            return;
        }
        
        // Vérifier si l'utilisateur a bien liké ce tweet
        const existingLike = await tweetInteractionRepository.findOne({
            tweet_id: tweetObjectId,
            user_id: userObjectId,
            action_type: 'like'
        }, true);
        
        if (!existingLike) {
            res.status(400).json({ message: "Vous n'avez pas liké ce tweet" });
            return;
        }
        
        // Supprimer l'interaction de like
        await tweetInteractionRepository.delete({ 
            tweet_id: tweetObjectId, 
            user_id: userObjectId, 
            action_type: 'like'
        });
        
        // Décrémenter le compteur de likes
        const updatedTweet = await tweetRepository.update(
            { _id: tweetObjectId }, 
            { $inc: { likes_count: -1 } }
        );
        
        res.status(200).json({
            message: "Tweet unliké avec succès",
            tweet: updatedTweet
        });
    } catch (error) {
        console.error("Erreur détaillée:", error);
        handleError(res, error, "Erreur lors de l'unlike du tweet.");
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
      
      const result = await tweetRepository.findTweetsWithFilters({
        filters,
        authenticatedUserId: req.user?.id.toString()
      });
      
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

/**
 * Récupère les tweets favoris ou sauvegardés d'un utilisateur
 * @param req.params.id - L'ID du tweet
 * @param req.query.type - Le type de tweets à récupérer ('liked', 'saved' ou 'retweet')
 * @param req.query.page - Numéro de page (default: 1)
 * @param req.query.limit - Nombre d'éléments par page (default: 10)
 */
export const getUserTweetCollection = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { type = 'liked', page = '1', limit = '10', user_id } = req.query;
        const authenticatedUserId = req.user?.id;

        // Vérification du type
        if (type !== 'liked' && type !== 'saved' && type !== 'retweet') {
            res.status(400).json({
                message: "Le type doit être 'liked', 'saved' ou 'retweet'"
            });
            return;
        }

        // Protection des tweets sauvegardés
        if (type === 'saved' && (!authenticatedUserId || id !== authenticatedUserId.toString())) {
            res.status(403).json({
                message: "Vous ne pouvez pas accéder aux tweets sauvegardés d'un autre utilisateur"
            });
            return;
        }

        const filters: TweetFilters = {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            user_id: id
        };

        // Configuration des filtres selon le type
        switch(type) {
            case 'liked':
                filters.include_liked = true;
                break;
            case 'saved':
                filters.include_saved = true;
                break;
            case 'retweet':
                filters.tweet_type = 'retweet';
                break;
        }

        const result = await tweetRepository.findTweetsWithFilters({
            filters,
            authenticatedUserId: user_id as string
        });

        res.status(200).json({
            message: `Tweets ${type === 'liked' ? 'favoris' : type === 'saved' ? 'sauvegardés' : 'retweetés'} récupérés avec succès`,
            data: result.tweets,
            pagination: result.pagination
        });

    } catch (error) {
        handleError(res, error, `Erreur lors de la récupération des tweets ${req.query.type === 'liked' ? 'favoris' : req.query.type === 'saved' ? 'sauvegardés' : 'retweetés'}.`);
    }
};