import { NotificationType } from "@domain/enum/NotificationType";
import { Querify } from "@domain/types/Querify";
import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NotificationType),
  message: z.string(),
  isRead: z.coerce.boolean(),
  notificationDate: z.coerce.date(),
  userId: z.string(),
  source: z.string().optional(),
  sourceType: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;

export type NotificationDto = Serialize<NotificationSchema>;

export type NotificationQuery = Querify<NotificationDto>;
