import { User } from "@/domain/entities/User";
import { NotificationType } from "@/domain/enum/NotificationType";
import { Modify } from "@/types/Modify";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  notificationDate: Date;
  userId: string;
  source?: string;
  sourceType?: string;
  createdAt: Date;
  updatedAt: Date;
}

type NotificationSource = User;

export type NotificationWithSource = Modify<
  Notification,
  { source?: NotificationSource }
>;
