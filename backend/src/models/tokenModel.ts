import mongoose, { Schema, Document } from 'mongoose';

export enum TokenType {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
}

export interface IToken extends Document {
  _id: mongoose.Types.ObjectId;
  ownedBy: mongoose.Types.ObjectId;
  token: string;
  type: TokenType;
  scopes: string[];
  deviceName: string;
  deviceIp: string;

  created_at: Date;
  updated_at: Date;
  expiresAt: Date;
}


const TokenSchema = new Schema({
  ownedBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  type: { type: String, enum: TokenType, required: true },
  scopes: { type: [String], required: true },
  deviceName: { type: String, required: true },
  deviceIp: { type: String, required: true },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },

});

TokenSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});




export default mongoose.model<IToken>('Token', TokenSchema);
