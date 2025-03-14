import { Request, Response } from 'express';
import { handleError } from '@/utils/responseFormatter';
import hashtagRepository from '@/repositories/hashtagRepository';
import tweetRepository from '@/repositories/tweetRepository';
import { TrendingHashtagsQuery, TrendingTweetsQuery, TrendingSuggestionsQuery } from '@/validators/trendingValidator';
import { AuthenticatedRequest } from '@/types';
import userRepository from '@/repositories/userRepository';

type RequestWithValidatedQuery<T> = AuthenticatedRequest & { query: T };

export const getTrendingHashtags = async (
    req: RequestWithValidatedQuery<TrendingHashtagsQuery>,
    res: Response
): Promise<void> => {
    try {
        const { limit, timeframe } = req.query;

        const trendingHashtags = await hashtagRepository.getTrendingHashtags({
            limit,
            timeframe
        });

        res.status(200).json({
            message: "Hashtags tendances récupérés avec succès",
            data: trendingHashtags
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la récupération des hashtags tendances");
    }
};

export const getTrendingTweets = async (
    req: RequestWithValidatedQuery<TrendingTweetsQuery>,
    res: Response
): Promise<void> => {
    try {
        const { limit, date } = req.query;
        const userId = req.user?.id;

        // Si aucune date n'est fournie, on utilise la date du jour
        const searchDate = date ? new Date(date) : new Date();

        // Vérification que la date est valide
        if (isNaN(searchDate.getTime())) {
            res.status(400).json({
                message: "La date fournie n'est pas valide"
            });
            return;
        }

        const result = await tweetRepository.findTrendingTweets({
            limit,
            date: searchDate,
            authenticatedUserId: userId?.toString()
        });

        res.status(200).json({
            message: "Tweets tendances récupérés avec succès",
            data: result.tweets,
            pagination: result.pagination
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la récupération des tweets tendances");
    }
};

export const getFollowSuggestions = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;
        console.log("userId", userId);
        
        if (!userId) {
            res.status(401).json({
                message: "Utilisateur non authentifié"
            });
            return;
        }

        const suggestions = await userRepository.getFollowSuggestions({
            userId: userId.toString(),
            minSuggestions: 3
        });

        res.status(200).json({
            message: "Suggestions d'abonnement récupérées avec succès",
            data: suggestions
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la récupération des suggestions d'abonnement");
    }
};
