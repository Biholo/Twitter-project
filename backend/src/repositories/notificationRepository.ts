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
      .populate('sender_id', 'username identifier_name avatar')
      .populate('source_id', 'content media_url')
      .sort({ notification_date: -1 });
  }

  async markAllAsRead(userId: mongoose.Types.ObjectId) {
    return this.model.updateMany(
      { user_id: userId, is_read: false },
      { is_read: true }
    );
  }

  async markAsRead(id: mongoose.Types.ObjectId) {
    return this.model.findByIdAndUpdate(id, { is_read: true });
  }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;

