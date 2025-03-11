import { Request, Response } from 'express';
import { handleError } from '@/utils/responseFormatter';
import hashtagRepository from '@/repositories/hashtagRepository';
import tweetRepository from '@/repositories/tweetRepository';
import { TrendingHashtagsQuery, TrendingTweetsQuery } from '@/validators/trendingValidator';

type RequestWithValidatedQuery<T> = Request & { query: T };

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

        const trendingTweets = await tweetRepository.getTrendingTweets({
            limit,
            date
        });

        res.status(200).json({
            message: "Tweets tendances récupérés avec succès",
            data: trendingTweets
        });
    } catch (error) {
        handleError(res, error, "Erreur lors de la récupération des tweets tendances");
    }
};
