import { Collection } from "@/domain/enum/Collection";
import { TweetInteractionType } from "@/domain/enum/TweetInteractionType";
import mongoose, { Schema, Document } from "mongoose";

export interface TweetInteractionDocument extends Document {
  userId: Schema.Types.ObjectId;
  tweetId: Schema.Types.ObjectId;
  actionType: TweetInteractionType;
  actionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TweetInteractionSchema = new Schema<TweetInteractionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: Collection.Tweet,
      required: true,
    },
    actionType: {
      type: String,
      enum: TweetInteractionType,
      required: true,
    },
    actionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index composé pour éviter les doublons d'interactions du même type par le même utilisateur sur le même tweet
TweetInteractionSchema.index(
  { userId: 1, tweetId: 1, actionType: 1 },
  { unique: true }
);

const TweetInteractionModel = mongoose.model<TweetInteractionDocument>(
  Collection.TweetInteraction,
  TweetInteractionSchema
);

export default TweetInteractionModel;
