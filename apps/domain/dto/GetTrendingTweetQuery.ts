import { GetTrendingQuerySchema } from "@domain/dto/GetTrendingQuery";
import { z } from "zod";

export const GetTrendingTweetQuerySchema = GetTrendingQuerySchema.extend({
  date: z.coerce.date().optional(),
});

export type GetTrendingTweetQuery = z.infer<typeof GetTrendingTweetQuerySchema>;
