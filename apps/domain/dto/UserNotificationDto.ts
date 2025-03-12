import { NotificationDto } from "@domain/dto/NotificationDto";
import { UserDto } from "@domain/dto/UserDto";
import { Modify } from "@domain/types/Modify";

export type UserNotificationDto = Modify<NotificationDto, { source?: UserDto }>;
