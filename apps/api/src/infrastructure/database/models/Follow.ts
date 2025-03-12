import { Collection } from "@/domain/enum/Collection";
import mongoose, { Schema, Document } from "mongoose";

export interface FollowDocument extends Document {
  followerId: Schema.Types.ObjectId;
  followingId: Schema.Types.ObjectId;
  followDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FollowSchema = new Schema<FollowDocument>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    followDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index composé pour éviter qu'un utilisateur suive plusieurs fois la même personne
// @SOFIANE et si les deux se suivent mutuellement ?
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const FollowModel = mongoose.model<FollowDocument>(
  Collection.Follow,
  FollowSchema
);

export default FollowModel;
