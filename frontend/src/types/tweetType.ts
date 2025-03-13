export interface Tweet {
  _id: string;
  content: string;
  parent_tweet_id: string | null;
  tweet_type: "tweet" | "reply" | "retweet";
  created_at: string;
  author: Author;
  likes_count: number;
  saves_count: number;
  retweets_count: number;
  is_retweeted: boolean;
  is_liked: boolean;
  is_saved: boolean;
  media_url: string | null;
  replies_count: number;
  replies: Tweet[];
  retweeted_by?: Author; // Utilisateur qui a retweeté ce tweet (optionnel)
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
  tweet_type?: "tweet" | "reply" | "retweet";
}

export interface InteractionResponse {
  message: string;
  tweet: {
    user_id: string;
    tweet_id: string;
    action_type: "like" | "bookmark" | "retweet";
    _id: string;
    action_date: string;
    created_at: string;
    updated_at: string;
    __v: number;
  };
}

export interface CreateTweet {
  content: string;
  tweet_type: "tweet" | "reply" | "retweet";
  parent_tweet_id?: string;
  media?: File[];
  
}
