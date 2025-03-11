export interface TweetFilters {
    user_id?: string;
    hashtag?: string;
    search?: string;
    start_date?: Date;
    end_date?: Date;
    parent_tweet_id?: string;
    tweet_type?: 'tweet' | 'reply' | 'retweet';
    include_liked?: boolean;
    include_saved?: boolean;
    page?: number;
    limit?: number;
  }

export interface TweetFilterOptions {
    filters: TweetFilters;
    authenticatedUserId?: string;
  }

export interface TweetDetailsOptions {
    tweetId: string;
    authenticatedUserId?: string;
  }