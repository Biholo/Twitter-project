import { Collection } from "@/domain/enum/Collection";
import mongoose, { Document, Schema } from "mongoose";

export interface ResetPasswordDocument extends Document {
  _id: Schema.Types.ObjectId;
  token: string;
  user: Schema.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResetPasswordSchema = new Schema<ResetPasswordDocument>(
  {
    token: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const ResetPasswordModel = mongoose.model<ResetPasswordDocument>(
  Collection.ResetPassword,
  ResetPasswordSchema
);

export default ResetPasswordModel;
