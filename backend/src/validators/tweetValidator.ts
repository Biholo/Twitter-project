import { z } from 'zod';

export const createTweetSchema = z.object({
  content: z.string().min(1).max(280),
  media: z.array(z.string()).optional(),
  parent_tweet: z.string().optional(),
});

export const getTweetsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  user: z.string().optional(),
  hashtag: z.string().optional(),
  mentions: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export const getFeedQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(['all', 'following', 'liked']).optional(),
});