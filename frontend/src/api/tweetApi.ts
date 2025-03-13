import { api } from "@/api/interceptor";
import { ApiResponse, CreateTweet, Tweet, TweetPage } from "@/types";

class TweetApi {
    private baseUrl = "/api/tweets";

    public async createTweet(tweet: CreateTweet): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(this.baseUrl, "POST", tweet, true);
        return response.data;
    }

    public async getTweets(page: number): Promise<TweetPage> {        
        const url = `${this.baseUrl}?page=${page}`;
        const response = await api.fetchRequest(url, "GET", null, true);
        return response;
    }

    public async likeTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/like`, "POST", null, true);
    }

    public async unlikeTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        console.log(tweetId);
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/unlike`, "POST", null, true);
    }

    public async bookmarkTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/save`, "POST", null, true);
    }

    public async unbookmarkTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/unsave`, "POST", null, true);
    }

    public async getTweetById(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}`, "GET", null, true);
    }

    public async getUserTweetCollection(userId: string, params: {
        type?: 'liked' | 'saved' | 'retweet',
        page?: number,
        limit?: number,
    } = {}): Promise<ApiResponse<Tweet[]>> {
        const queryParams = new URLSearchParams();
        
        if (params.type) queryParams.append('type', params.type);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        const queryString = queryParams.toString();
        const url = queryString ? `${this.baseUrl}/${userId}/interactions?${queryString}` : `${this.baseUrl}/${userId}/interactions`;
        
        const response = await api.fetchRequest(url, "GET", null, true);
        return response;
    }
}

export default TweetApi;
