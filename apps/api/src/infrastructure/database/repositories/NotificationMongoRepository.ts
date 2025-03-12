import {
  Notification,
  NotificationWithSource,
} from "@/domain/entities/Notification";
import { NotificationRepository } from "@/domain/gateway/NotificationRepository";
import NotificationModel, {
  NotificationDocumentPopulated,
  NotificationSource,
} from "@/infrastructure/database/models/Notification";
import { UserMongoRepository } from "@/infrastructure/database/repositories/UserMongoRepository";
import { AsyncOption } from "@/types/AsyncOption";
import { None, Some } from "@thames/monads";
import { injectable } from "inversify";

@injectable()
export class NotificationMongoRepository implements NotificationRepository {
  async findOneById(id: string): AsyncOption<NotificationWithSource> {
    const foundNotification = await NotificationModel.findById(id)
      .populate<{ source: NotificationSource }>("source")
      .exec();

    if (!foundNotification) {
      return None;
    }

    const notification =
      NotificationMongoRepository.mapToDomain(foundNotification);

    return Some(notification);
  }

  async findAll(
    filters: Partial<Notification>
  ): Promise<NotificationWithSource[]> {
    const foundNotifications = await NotificationModel.find(filters)
      .populate<{ source: NotificationSource }>("source")
      .exec();

    return foundNotifications.map(NotificationMongoRepository.mapToDomain);
  }

  async deleteOneById(id: string): Promise<void> {
    await NotificationModel.findByIdAndDelete(id).exec();
  }

  async markAsRead(id: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(id, { read: true }).exec();
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { userId, read: false },
      { read: true }
    ).exec();
  }

  public static mapToDomain(
    notification: NotificationDocumentPopulated
  ): NotificationWithSource {
    const plainNotification =
      notification.toObject<NotificationDocumentPopulated>({
        flattenMaps: true,
        flattenObjectIds: true,
      });

    return {
      ...plainNotification,
      id: plainNotification._id.toString(),
      userId: plainNotification.userId.toString(),
      source:
        plainNotification.source &&
        UserMongoRepository.mapToDomain(plainNotification.source),
    };
  }
}
