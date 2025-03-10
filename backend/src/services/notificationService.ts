import { WebSocket } from 'ws';
import { Document } from 'mongoose';
import Notification, { INotification } from '@/models/notificationModel';
import mongoose from 'mongoose';
export enum NotificationType {
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  LIKE = 'LIKE',
  RETWEET = 'RETWEET',
  REPLY = 'REPLY',
  MENTION = 'MENTION',
  QUOTE = 'QUOTE'
}

interface NotificationPayload {
  type: NotificationType;
  senderId: string;
  receiverId: string;
  tweetId?: string;
  content?: string;
}

class NotificationService {
  private clients: Map<string, WebSocket[]> = new Map();

  public addClient(userId: string, ws: WebSocket): void {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)?.push(ws);
  }

  public removeClient(userId: string, ws: WebSocket): void {
    const userClients = this.clients.get(userId) || [];
    this.clients.set(userId, userClients.filter(client => client !== ws));
  }

  public async createAndSendNotification(payload: NotificationPayload): Promise<INotification> {
    try {
      // Créer la notification dans la base de données
      const notification = await Notification.create({
        type: payload.type,
        sender: payload.senderId,
        receiver: payload.receiverId,
        tweet: payload.tweetId,
        content: payload.content,
        read: false,
        created_at: new Date()
      });

      // Envoyer la notification via WebSocket
      this.sendToUser(payload.receiverId, {
        type: 'NOTIFICATION',
        data: notification
      });

      return notification;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      throw error;
    }
  }

  private sendToUser(userId: string, message: any): void {
    const userClients = this.clients.get(userId) || [];
    userClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  public async markAsRead(notificationId: string): Promise<void> {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  }

  public async getUserNotifications(userId: mongoose.Types.ObjectId): Promise<INotification[]> {
    return Notification.find({ receiver: userId })
      .sort({ created_at: -1 })
      .populate('sender', 'username avatar')
      .populate('tweet', 'content');
  }
}
const notificationService = new NotificationService();
export default notificationService;

