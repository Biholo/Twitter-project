import { z } from 'zod';

export const createTweetSchema = z.object({
  content: z.string().min(1).max(280),
  parent_tweet_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide").optional(),
  media_url: z.string().url().optional(),
  tweet_type: z.enum(['tweet', 'reply', 'retweet']).default('tweet')
});

export const getTweetsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide").optional(),
  search: z.string().optional(),
  hashtag: z.string().optional(),
  mentions: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  parent_tweet_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide").optional(),
  include_liked: z.boolean().optional(),
  include_saved: z.boolean().optional(),
  tweet_type: z.enum(['tweet', 'reply', 'retweet']).optional(),
});

export const getFeedQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(['all', 'following', 'liked']).optional(),
});

export const tweetIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide")
});

export const getUserTweetCollectionQuerySchema = z.object({
  type: z.enum(['liked', 'saved', 'retweet']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide").optional(),
});

export const updateTweetSchema = z.object({
  content: z.string().min(1).max(280)
});
export type CreateTweetData = z.infer<typeof createTweetSchema>;
export type GetTweetsQueryData = z.infer<typeof getTweetsQuerySchema>;
export type GetFeedQueryData = z.infer<typeof getFeedQuerySchema>;
export type TweetIdData = z.infer<typeof tweetIdSchema>;
export type UpdateTweetData = z.infer<typeof updateTweetSchema>;
