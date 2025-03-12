import { NotificationQuery } from "@domain/dto/NotificationDto";

export interface GetNotificationQuery extends NotificationQuery {
  userId: string;
}
