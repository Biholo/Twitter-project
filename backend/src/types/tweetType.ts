export interface TweetFilters {
    user_id?: string;
    hashtag?: string;
    search?: string;
    start_date?: Date;
    end_date?: Date;
    parent_tweet_id?: string;
    page?: number;
    limit?: number;
  }