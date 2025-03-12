import { Types } from 'mongoose';
import { NotificationType } from '@/models/notificationModel';
import userRepository from '@/repositories/userRepository';
import tweetRepository from '@/repositories/tweetRepository';
import notificationRepository from '@/repositories/notificationRepository';
import websocketManager from './websocketManager';

class NotificationService {
  private async createNotification(
    type: NotificationType,
    senderId: string,
    receiverId: string,
    tweetId?: string
  ): Promise<void> {
    try {
      const sender = await userRepository.findById(senderId);
      if (!sender) throw new Error('Utilisateur non trouvé');

      const message = this.getNotificationContent(type, sender.username);

      const notificationData = {
        type,
        user_id: new Types.ObjectId(receiverId),
        sender_id: new Types.ObjectId(senderId),
        message,
        is_read: false,
        created_at: new Date(),
        ...(tweetId && { tweet_id: new Types.ObjectId(tweetId) })
      };

      await notificationRepository.create(notificationData);
      websocketManager.notifyUser(receiverId);
    } catch (error) {
      console.error(`Erreur lors de la création de la notification ${type}:`, error);
      throw error;
    }
  }

  private getNotificationContent(type: NotificationType, username: string): string {
    const contents = {
      [NotificationType.LIKE]: `@${username} a aimé votre tweet`,
      [NotificationType.NEW_FOLLOWER]: `@${username} vous suit maintenant`,
      [NotificationType.RETWEET]: `@${username} a retweeté votre tweet`,
      [NotificationType.REPLY]: `@${username} a répondu à votre tweet`,
      [NotificationType.MENTION]: `@${username} vous a mentionné dans un tweet`,
    };
    return contents[type];
  }

  async notifyLike(senderId: string, receiverId: string, tweetId: string): Promise<void> {
    return this.createNotification(NotificationType.LIKE, senderId, receiverId, tweetId);
  }

  async notifyFollow(senderId: string, receiverId: string): Promise<void> {
    return this.createNotification(NotificationType.NEW_FOLLOWER, senderId, receiverId);
  }

  async notifyRetweet(senderId: string, receiverId: string, tweetId: string): Promise<void> {
    return this.createNotification(NotificationType.RETWEET, senderId, receiverId, tweetId);
  }

  async notifyReply(senderId: string, receiverId: string, tweetId: string): Promise<void> {
    return this.createNotification(NotificationType.REPLY, senderId, receiverId, tweetId);
  }

  async notifyMention(senderId: string, receiverId: string, tweetId: string): Promise<void> {
    return this.createNotification(NotificationType.MENTION, senderId, receiverId, tweetId);
  }
}

const notificationService = new NotificationService();
export default notificationService;

