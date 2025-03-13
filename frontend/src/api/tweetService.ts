import { api } from "@/api/interceptor";
import { Tweet, ApiResponse, CreateTweet } from "@/types";

class TweetApi {

    public async createTweet(tweet: CreateTweet): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest("/api/tweets", "POST", tweet, true);
        return response;
    }

    public async getTweets(page: number): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest(`/api/tweets?page=${page}`, "GET", null, true);
        return response;
    }

    public async likeTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        console.log(tweet_id);
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/like`, "POST", null, true);
        return response;
    }

    public async unlikeTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        console.log(tweet_id);
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/unlike`, "POST", null, true);
        return response;
    }

    public async bookmarkTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/save`, "POST", null, true);
        return response;
    }

    public async unbookmarkTweet(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}/unsave`, "POST", null, true);
        return response;
    }

    public async getTweetById(tweet_id: string): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(`/api/tweets/${tweet_id}`, "GET", null, true);
        return response;
    }

    public async getUserTweetCollection(userId: string, queries: {
        type?: 'liked' | 'saved' | 'retweet',
        page?: number,
        limit?: number,
    } = {}): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest(`/api/tweets/${userId}/interactions`, 'GET', queries, true);
        return response;
    }
    
        
}

export default TweetApi;
