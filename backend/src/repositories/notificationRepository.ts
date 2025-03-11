import { BaseRepository } from "./baseRepository";
import { INotification } from "@/models/notificationModel";
import Notification from "@/models/notificationModel";
import mongoose from "mongoose";

class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(Notification);
  }

  async getUnreadNotifications(userId: mongoose.Types.ObjectId) {
    return this.model.find({ receiver: userId, read: false })
      .sort({ created_at: -1 })
      .populate('sender', 'username avatar')
      .populate('tweet', 'content');
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

  async findWithPagination(filter: any, page: number, limit: number, options: any = {}) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find(filter)
        .populate('sender', 'username avatar')
        .populate('tweet', 'content')
        .sort(options.sort || { created_at: -1 })
        .skip(skip)
        .limit(limit),
      this.model.countDocuments(filter)
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

const notificationRepository = new NotificationRepository();
export default notificationRepository;

