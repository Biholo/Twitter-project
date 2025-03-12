import { z } from "zod";

export const GetTrendingQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional(),
});

export type GetTrendingQuery = z.infer<typeof GetTrendingQuerySchema>;
