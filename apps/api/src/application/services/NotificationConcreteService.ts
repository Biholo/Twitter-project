import { inject, injectable } from "inversify";
import { Err, Ok } from "@thames/monads";
import { Repository } from "@/dependencies/constants";
import { GetNotificationQuery } from "@domain/dto/GetNotificationQuery";
import { Role } from "@domain/enum/Role";
import { NotificationError } from "@/domain/errors/NotificationError";
import { NotificationRepository } from "@/domain/gateway/NotificationRepository";
import { AsyncResult } from "@/types/AsyncResult";
import { UserJwtPayload } from "@/utils/jwt";

@injectable()
export class NotificationConcreteService {
  constructor(
    @inject(Repository.NotificationRepository)
    private readonly notificationRepository: NotificationRepository
  ) {}

  async findAll(user: UserJwtPayload, query: GetNotificationQuery) {
    const isAdmin = user.roles.includes(Role.Admin);

    if (!isAdmin && query.userId && query.userId !== user.id) {
      return Err(NotificationError.Unauthorized);
    }

    const targetUserId = isAdmin && query.userId ? query.userId : user.id;

    const notifications = await this.notificationRepository.findAll({
      userId: targetUserId,
      isRead: query.isRead ? query.isRead === "true" : undefined,
    });

    // TODO mapper dto

    return Ok(notifications);
  }

  async markAsRead(
    user: UserJwtPayload,
    id: string
  ): AsyncResult<true, NotificationError> {
    const foundNotification = await this.notificationRepository.findOneById(id);

    if (foundNotification.isNone()) {
      return Err(NotificationError.NotFound);
    }

    const notification = foundNotification.unwrap();

    if (notification.userId !== user.id) {
      return Err(NotificationError.Unauthorized);
    }

    await this.notificationRepository.markAsRead(id);

    return Ok(true);
  }

  async markAllAsRead(user: UserJwtPayload): Promise<void> {
    return this.notificationRepository.markAllAsRead(user.id);
  }

  async deleteOne(
    user: UserJwtPayload,
    id: string
  ): AsyncResult<true, NotificationError> {
    const foundNotification = await this.notificationRepository.findOneById(id);

    if (foundNotification.isNone()) {
      return Err(NotificationError.NotFound);
    }

    const notification = foundNotification.unwrap();

    if (notification.userId !== user.id) {
      return Err(NotificationError.Unauthorized);
    }

    await this.notificationRepository.deleteOneById(id);

    return Ok(true);
  }
}
