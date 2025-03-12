import { Collection } from "@/domain/enum/Collection";
import mongoose, { Schema, Document } from "mongoose";

// @SOFIANE c'est quoi une mention ?

export interface MentionDocument extends Document {
  tweetId: Schema.Types.ObjectId;
  mentionedUserId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MentionSchema = new Schema<MentionDocument>(
  {
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: Collection.Tweet,
      required: true,
    },
    mentionedUserId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
  },
  { timestamps: true }
);

// Index composé pour éviter les doublons de mentions d'un même utilisateur dans un même tweet
MentionSchema.index({ tweetId: 1, mentionedUserId: 1 }, { unique: true });

const MentionModel = mongoose.model<MentionDocument>(
  Collection.Mention,
  MentionSchema
);

export default MentionModel;
