import { Router } from 'express';
import { getTrendingHashtags, getTrendingTweets } from '@/controllers/trendingController';
import { validateZod } from '@/middlewares/validateZod';
import { trendingHashtagsSchema, trendingTweetsSchema } from '@/validators/trendingValidator';

export function trendingRoutes() {
    const router = Router();

    router.get('/hashtags', validateZod(trendingHashtagsSchema, "query"), getTrendingHashtags);
    router.get('/tweets', validateZod(trendingTweetsSchema, "query"), getTrendingTweets);
    return router;
}
