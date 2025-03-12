import { User } from "@/types/userType";


export interface Tweet {
    _id: string;
    content: string;
    parent_tweet_id: string | null;
    tweet_type: "tweet" | "reply" | "retweet";
    retweets_count: number;
    created_at: string;
    author: Author
    likes_count: number; 
    saves_count: number;
    is_liked: boolean;
    is_saved: boolean;
    media_url: string | null;
    replies_count: number;
    replies: Tweet[];
}

export interface Author {
    _id: string;
    username: string;
    identifier_name: string;
    avatar: string;
}


export interface TweetQueryParams {
    page?: number;
    limit?: number;
    user_id?: string;
    search?: string;
    hashtag?: string;
    start_date?: string;
    end_date?: string;
    include_liked?: boolean;
    include_saved?: boolean;
    tweet_type?: 'tweet' | 'reply' | 'retweet';
}

