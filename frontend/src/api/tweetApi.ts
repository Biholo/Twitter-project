import { api } from "@/api/interceptor";
import { Tweet, ApiResponse } from "@/types";

class TweetApi {
    private baseUrl = "/api/tweets";

    public async createTweet(tweet: Tweet): Promise<ApiResponse<Tweet>> {
        const response = await api.fetchRequest(this.baseUrl, "POST", tweet, true);
        return response.data;
    }

    public async getTweets(): Promise<ApiResponse<Tweet[]>> {
        const response = await api.fetchRequest(this.baseUrl, "GET", null, true);
        return response.data;
    }

    public async likeTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/like`, "POST", null, true);
    }

    public async unlikeTweet(tweetId: string): Promise<ApiResponse<Tweet>> {
        return api.fetchRequest(`${this.baseUrl}/${tweetId}/unlike`, "POST", null, true);
    }
}

export default TweetApi;
