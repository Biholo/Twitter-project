import { NotificationType } from '@/models/notificationModel';
import { z } from 'zod';

export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
});

export const getNotificationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  read: z.string()
    .optional()
    .transform(val => val === 'true'),
  user_id: z.string().optional(),
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;
export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>;