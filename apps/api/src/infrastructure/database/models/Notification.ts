import { Collection } from "@/domain/enum/Collection";
import { NotificationSourceCollection } from "@/domain/enum/NotificationSourceCollection";
import { NotificationType } from "@/domain/enum/NotificationType";
import { UserDocument } from "@/infrastructure/database/models/User";
import { Modify } from "@/types/Modify";
import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
  _id: Schema.Types.ObjectId;
  type: NotificationType;
  message: string;
  isRead: boolean;
  // @SOFIANE redondant avec le champ created_at
  notificationDate: Date;
  userId: Schema.Types.ObjectId;
  source?: Schema.Types.ObjectId; // ID de l'élément source (tweet, utilisateur, etc.)
  sourceType?: string; // Type de la source (Tweet, User, etc.)
  createdAt: Date;
  updatedAt: Date;
}

export type NotificationSource = UserDocument; /* | TweetDocument; */

export type NotificationDocumentPopulated = Modify<
  NotificationDocument,
  { source?: NotificationSource }
>;

const NotificationSchema = new Schema<NotificationDocument>(
  {
    type: {
      type: String,
      enum: NotificationType,
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    notificationDate: { type: Date, default: Date.now },
    userId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    }, // Destinataire de la notification
    source: { type: Schema.Types.ObjectId, refPath: "sourceType" },
    sourceType: { type: String, enum: NotificationSourceCollection },
  },
  { timestamps: true }
);

// Index pour optimiser les requêtes par utilisateur et par statut de lecture
NotificationSchema.index({ userId: 1, isRead: 1 });

const NotificationModel = mongoose.model<NotificationDocument>(
  Collection.Notification,
  NotificationSchema
);

export default NotificationModel;
