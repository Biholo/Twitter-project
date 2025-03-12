import TrendingService from "@/api/trendingService";
import { useQuery } from "@tanstack/react-query";
const trendingService = new TrendingService();

export const useTrendingTweets = (queries: {
    limit?: number;
    date?: string;
} = {}) => {
    return useQuery({ queryKey: ["trendingTweets", queries], queryFn: () => trendingService.getTrendingTweets(queries).then(response => response.data) });
}

export const useTrendingHashtags = (queries: {
    limit?: number;
    timeframe?: 'daily' | 'weekly';
} = {}) => {
    return useQuery({ queryKey: ["trendingHashtags", queries], queryFn: () => trendingService.getTrendingHashtags(queries).then(response => response.data) });
}

export const useTrendingSuggestions = (queries: {
    limit?: number;
} = {}) => {
    return useQuery({ queryKey: ["trendingSuggestions", queries], queryFn: () => trendingService.getFollowSuggestions(queries).then(response => response.data) });
}
