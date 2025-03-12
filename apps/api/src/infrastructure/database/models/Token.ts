import { Collection } from "@/domain/enum/Collection";
import { TokenType } from "@/domain/enum/TokenType";
import mongoose, { Schema, Document } from "mongoose";

export interface TokenDocument extends Document {
  _id: Schema.Types.ObjectId;
  ownedBy: Schema.Types.ObjectId;
  token: string;
  type: TokenType;
  scopes: string[];
  deviceName?: string;
  deviceIp?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const TokenSchema = new Schema<TokenDocument>(
  {
    ownedBy: {
      type: Schema.Types.ObjectId,
      ref: Collection.User,
      required: true,
    },
    token: { type: String, required: true },
    type: { type: String, enum: TokenType, required: true },
    scopes: { type: [String], required: true },
    deviceName: { type: String },
    deviceIp: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const TokenModel = mongoose.model<TokenDocument>(Collection.Token, TokenSchema);

export default TokenModel;
