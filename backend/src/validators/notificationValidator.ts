import { z } from 'zod';
import { NotificationType } from '@/services/notificationService';

export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
});

export const getNotificationsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.nativeEnum(NotificationType).optional(),
  read: z.boolean().optional(),
});