import { api } from "./interceptor";
import { ApiResponse, Tweet, Hashtag, UserSuggestion } from "@/types";
class TrendingService {
    public async getTrendingTweets(queries: {
        limit?: number;
        date?: string;
    } = {}): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest("/api/trending/tweets", "GET", queries, true);
        return response;
    }

    public async getTrendingHashtags(queries: {
        limit?: number;
        timeframe?: 'daily' | 'weekly';
    } = {}): Promise<ApiResponse<Hashtag[]>> {
        const response = await api.fetchRequest("/api/trending/hashtags", "GET", queries, true);
        return response;
    }

    public async getFollowSuggestions(queries: {
        limit?: number;
    } = {}): Promise<ApiResponse<UserSuggestion[]>> {
        const response = await api.fetchRequest("/api/trending/suggestions", "GET", queries, true);
        return response;
    }
}

export default TrendingService;
