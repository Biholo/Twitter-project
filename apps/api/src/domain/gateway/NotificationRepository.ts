import {
  Notification,
  NotificationWithSource,
} from "@/domain/entities/Notification";
import { AsyncOption } from "@/types/AsyncOption";

export interface NotificationRepository {
  findOneById(id: string): AsyncOption<NotificationWithSource>;
  findAll(filters: Partial<Notification>): Promise<NotificationWithSource[]>;
  deleteOneById(id: string): Promise<void>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
