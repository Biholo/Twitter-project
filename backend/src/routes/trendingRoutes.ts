import { Router } from 'express';
import { getTrendingHashtags, getTrendingTweets, getFollowSuggestions } from '@/controllers/trendingController';
import { validateZod } from '@/middlewares/validateZod';
import { trendingHashtagsSchema, trendingTweetsSchema, trendingSuggestionsSchema } from '@/validators/trendingValidator';
import { isAuthenticated } from "@/middlewares/auth";

export function trendingRoutes() {
    const router = Router();

    router.get('/hashtags',isAuthenticated, validateZod(trendingHashtagsSchema, "query"), getTrendingHashtags);
    router.get('/tweets', isAuthenticated, validateZod(trendingTweetsSchema, "query"), getTrendingTweets);
    router.get('/suggestions', isAuthenticated, getFollowSuggestions);
    return router;
}
