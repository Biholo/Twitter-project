import { GetTrendingQuerySchema } from "@domain/dto/GetTrendingQuery";
import { z } from "zod";

export const GetTrendingHashtagQuerySchema = GetTrendingQuerySchema.extend({
  timeframe: z.enum(["daily", "weekly"]).default("daily").optional(),
});

export type GetTrendingHashtagQuery = z.infer<
  typeof GetTrendingHashtagQuerySchema
>;
