import { WebSocket } from 'ws';
import { Document, Types } from 'mongoose';
import Notification, { INotification } from '@/models/notificationModel';
import userRepository from '@/repositories/userRepository';
import tweetRepository from '@/repositories/tweetRepository';
import notificationRepository from '@/repositories/notificationRepository';

export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  LIKE = 'LIKE',
  RETWEET = 'RETWEET',
  REPLY = 'REPLY',
  MENTION = 'MENTION',
  QUOTE = 'QUOTE'
}

interface NotificationResponse {
  _id: string;
  type: NotificationType;
  created_at: Date;
  read: boolean;
  sender: {
    _id: string;
    username: string;
    identifier_name: string;
    avatar: string;
  };
  tweet?: {
    _id: string;
    content: string;
    media_url?: string;
  };
  content: string;
}

interface NotificationData {
  type: NotificationType;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  read: boolean;
  created_at: Date;
  tweet?: Types.ObjectId;
}

class NotificationService {
  private async createNotification(
    type: NotificationType,
    senderId: string,
    receiverId: string,
    tweetId?: string,
    customContent?: string
  ): Promise<NotificationResponse> {
    try {
      const sender = await userRepository.findById(senderId);
      if (!sender) {
        throw new Error('Utilisateur non trouvé');
      }

      let tweet;
      if (tweetId) {
        tweet = await tweetRepository.findById(tweetId);
        if (!tweet) {
          throw new Error('Tweet non trouvé');
        }
      }

      const content = customContent || this.getNotificationContent(type, sender.username);

      const notificationData: NotificationData = {
        type,
        sender: new Types.ObjectId(senderId),
        receiver: new Types.ObjectId(receiverId),
        content,
        read: false,
        created_at: new Date()
      };

      if (tweetId) {
        notificationData.tweet = new Types.ObjectId(tweetId);
      }

      const notification = await notificationRepository.create(notificationData);

      const response: NotificationResponse = {
        _id: notification._id.toString(),
        type,
        created_at: notification.created_at,
        read: false,
        sender: {
          _id: sender._id.toString(),
          username: sender.username,
          identifier_name: sender.identifier_name,
          avatar: sender.avatar || ''
        },
        content
      };

      if (tweet) {
        response.tweet = {
          _id: tweet._id.toString(),
          content: tweet.content,
          media_url: tweet.media_url
        };
      }

      return response;
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
      [NotificationType.QUOTE]: `@${username} a cité votre tweet`
    };
    return contents[type];
  }

  async notifyLike(senderId: string, receiverId: string, tweetId: string): Promise<NotificationResponse> {
    return this.createNotification(NotificationType.LIKE, senderId, receiverId, tweetId);
  }

  async notifyFollow(senderId: string, receiverId: string): Promise<NotificationResponse> {
    return this.createNotification(NotificationType.NEW_FOLLOWER, senderId, receiverId);
  }

  async notifyRetweet(senderId: string, receiverId: string, tweetId: string): Promise<NotificationResponse> {
    return this.createNotification(NotificationType.RETWEET, senderId, receiverId, tweetId);
  }

  async notifyReply(senderId: string, receiverId: string, tweetId: string, replyId: string): Promise<NotificationResponse> {
    return this.createNotification(NotificationType.REPLY, senderId, receiverId, replyId);
  }

  async notifyMention(senderId: string, receiverId: string, tweetId: string): Promise<NotificationResponse> {
    return this.createNotification(NotificationType.MENTION, senderId, receiverId, tweetId);
  }
}

const notificationService = new NotificationService();
export default notificationService;

