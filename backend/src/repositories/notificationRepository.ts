import { BaseRepository } from "./baseRepository";
import { INotification } from "@/models/notificationModel";
import Notification from "@/models/notificationModel";
import mongoose from "mongoose";

class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }

  async findNotifications(filter: any): Promise<any[]> {
    return this.model.find(filter)
      .populate('sender', 'username identifier_name avatar')
      .populate('tweet', 'content media_url')
      .sort({ created_at: -1 });
  }

  async markAllAsRead(userId: mongoose.Types.ObjectId) {
    return this.model.updateMany(
      { receiver: userId, read: false },
      { read: true }
    );
  }

  async markAsRead(id: mongoose.Types.ObjectId) {
    return this.model.findByIdAndUpdate(id, { read: true });
  }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;

