import { api } from "@/api/interceptor";
import { Tweet, ApiResponse } from "@/types";

class TweetApi {

    public async createTweet(tweet: Tweet): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest("/api/tweets", "POST", tweet, true);
        return response.data;
    }

    public async getTweets(queries: {
        page?: number | null,
        limit?: number | null,
        user_id?: string | null,
        search?: string | null,
        hashtag?: string | null,
        mentions?: string | null,
        from_date?: string | null,
        to_date?: string | null,
        start_date?: string | null,
        end_date?: string | null,
        parent_tweet_id?: string | null,
        include_liked?: boolean | null,
        include_saved?: boolean | null,
        tweet_type?: string | null
    } = {}): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest("/api/tweets", "GET", queries, true);
        return response.data;
    }

    public async likeTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/like`, "POST", null, true);
        return response.data;
    }

    public async unlikeTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/unlike`, "POST", null, true);
        return response.data;
    }

    public async bookmarkTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/save`, "POST", null, true);
        return response.data;
    }

    public async unbookmarkTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/unsave`, "POST", null, true);
        return response.data;
    }

    public async getTweetById(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}`, "GET", null, true);
        return response.data;
    }

    public async getUserTweetCollection(queries: {
        type?: 'liked' | 'saved' | 'retweet',
        page?: string,
        limit?: string,
        user_id?: string
    } = {}): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest('/api/tweets/collection', 'GET', queries, true);
        return response.data;
    }
    
        
}

export default TweetApi;
