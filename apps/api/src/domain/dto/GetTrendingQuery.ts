import { Notification } from "@/domain/entities/Notification";
import { Querify } from "@/types/Querify";
import { z } from "zod";

export const trendingHashtagsSchema = z.object({
  limit: z.coerce.number().min(1).max(50).optional(),
  timeframe: z.enum(["daily", "weekly"]).default("daily"),
});

export interface GetNotificationQuery extends Querify<Notification> {
  userId: string;
}
