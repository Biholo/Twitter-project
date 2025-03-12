import { Collection } from "@/domain/enum/Collection";
import mongoose, { Schema, Document } from "mongoose";

export interface TweetHashtagDocument extends Document {
  tweetId: Schema.Types.ObjectId;
  hashtagId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TweetHashtagSchema = new Schema<TweetHashtagDocument>(
  {
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: Collection.Tweet,
      required: true,
    },
    hashtagId: {
      type: Schema.Types.ObjectId,
      ref: Collection.Hashtag,
      required: true,
    },
  },
  { timestamps: true }
);

// Index composé pour éviter les doublons de hashtags dans un même tweet
// @SOFIANE trop strict
TweetHashtagSchema.index({ tweetId: 1, hashtagId: 1 }, { unique: true });

const TweetHashtagModel = mongoose.model<TweetHashtagDocument>(
  Collection.TweetHashtag,
  TweetHashtagSchema
);

export default TweetHashtagModel;
