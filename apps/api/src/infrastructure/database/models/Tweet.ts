import { Collection } from "@/domain/enum/Collection";
import { TweetType } from "@/domain/enum/TweetType";
import mongoose, { Schema, Document } from "mongoose";

export interface TweetDocument extends Document {
  content?: string;
  // @SOFIANE redondant
  postDate: Date;
  authorId: Schema.Types.ObjectId;
  parentTweetId?: Schema.Types.ObjectId;
  type: TweetType;
  totalLike: number;
  totalRetweet: number;
  totalBookMark: number;
  mediaUrl?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TweetSchema = new Schema<TweetDocument>(
  {
    // @SOFIANE changer le type, le contenu vient de l'éditeur WYSIWYG
    content: { type: String, maxlength: 280 },
    postDate: { type: Date, default: Date.now },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    parentTweetId: {
      type: Schema.Types.ObjectId,
      ref: Collection.Tweet,
      default: null,
    },
    type: {
      type: String,
      enum: TweetType,
      required: true,
      default: TweetType.Tweet,
    },
    totalLike: { type: Number, default: 0 },
    totalRetweet: { type: Number, default: 0 },
    totalBookMark: { type: Number, default: 0 },
    mediaUrl: { type: String },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TweetModel = mongoose.model<TweetDocument>(Collection.Tweet, TweetSchema);

export default TweetModel;
