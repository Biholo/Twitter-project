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
}

export default TweetApi;
