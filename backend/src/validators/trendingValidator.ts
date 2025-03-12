import { z } from 'zod';

export const trendingHashtagsSchema = z.object({
        limit: z.string()
            .optional()
            .transform(val => parseInt(val || '10'))
            .pipe(z.number().min(1).max(50)),
        timeframe: z.enum(['daily', 'weekly'])
            .optional()
            .default('daily')
});

export const trendingTweetsSchema = z.object({
        limit: z.string()
            .optional()
            .transform(val => parseInt(val || '10'))
            .pipe(z.number().min(1).max(50)),
        date: z.string()
            .optional()
            .transform(val => {
                if (!val) return new Date();
                const date = new Date(val);
                if (isNaN(date.getTime())) {
                    throw new Error('Date invalide');
                }
                return date;
            })
});

export const trendingSuggestionsSchema = z.object({
    limit: z.string()
        .optional()
        .transform(val => parseInt(val || '10'))
        .pipe(z.number().min(1).max(50)),
});

export type TrendingHashtagsQuery = z.infer<typeof trendingHashtagsSchema>;
export type TrendingTweetsQuery = z.infer<typeof trendingTweetsSchema>; 
export type TrendingSuggestionsQuery = z.infer<typeof trendingSuggestionsSchema>;