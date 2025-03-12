import { NotificationDto } from "@domain/dto/NotificationDto";
import { Modify } from "@domain/types/Modify";


export type TweetNotificationDto = Modify<NotificationDto, { source?: string }>;
