import { z } from 'zod';

export const createTweetSchema = z.object({
  content: z.string().min(1).max(280).optional(),
  parent_tweet_id: z.string().regex(/^[0-9a-fA-F]{24}$/, "L'ID doit être un ObjectId MongoDB valide").optional(),
  files: z.array(z.object({
    buffer: z.any(),
    originalname: z.string(),
    mimetype: z.string().refine((val) => 
      val.startsWith('image/'),
      "Le fichier doit être une image"
    ),
    size: z.number().max(5 * 1024 * 1024, "La taille maximale est de 5MB")
  })).max(4, "Maximum 4 médias par tweet").optional(),
  tweet_type: z.enum(['tweet', 'reply', 'retweet']).default('tweet')
}).refine((data) => {
  // Au moins un contenu ou un média doit être présent
  return data.content || (data.files && data.files.length > 0);
}, {
  message: "Le tweet doit contenir du texte ou au moins un média",
  path: ["content"]
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
