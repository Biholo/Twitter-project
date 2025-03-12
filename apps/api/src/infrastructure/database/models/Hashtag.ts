import { Collection } from "@/domain/enum/Collection";
import mongoose, { Schema, Document } from "mongoose";

export interface HashtagDocument extends Document {
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

const HashtagSchema = new Schema<HashtagDocument>(
  {
    label: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const HashtagModel = mongoose.model<HashtagDocument>(
  Collection.Hashtag,
  HashtagSchema
);

export default HashtagModel;
