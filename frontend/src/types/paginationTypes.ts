export interface Pagination {
    has_more: boolean;
    page: number;
    pages: number;
    total: number;
}
  
export interface TweetWithAuthor {
    _id: string;
    content: string;
    parent_tweet_id: string | null;
    tweet_type: string;
    created_at: string;
    likes_count: number;
    retweets_count: number;
    saves_count: number;
    replies_count: number;
    is_retweeted: boolean;
    is_liked: boolean;
    is_saved: boolean;
    media_url?: string;
    replies: TweetWithAuthor[];
    author: {
        _id: string;
        username: string;
        identifier_name: string;
        avatar: string | null;
        display_name?: string;
    };
}
  
export interface TweetPage {
    data: TweetWithAuthor[];
    message: string;
    pagination: Pagination;
}
  
export interface PaginatedData<T> {
    pages: T[];
    pageParams: number[];
}

  export type PaginatedTweets = PaginatedData<TweetPage>;