import { User } from "@/types/userType";

export interface Tweet {
    _id: string;
    content: string;
    parent_tweet_id?: string;
    tweet_type: "tweet" | "reply" | "retweet";
    retweets_count: number;
    likes_count: number;
    media_url: string;
    comments_count: number;
    saves_count: number;
    created_at: Date;
    updated_at: Date;
    author: User;
    is_liked: boolean;
    is_saved: boolean;
    replies: Tweet[];
}