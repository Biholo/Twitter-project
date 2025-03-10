import mongoose, { Schema, Document } from 'mongoose';
import { roles } from '@/config/role';

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  roles: string[];
  profile_picture_url?: string;
  refresh_token?: string;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  is_email_confirmed: boolean;
  confirmed_at?: Date;
}

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: roles, required: true },
  profile_picture_url: { type: String },
  refresh_token: { type: String },
  created_at: { type: Date, default: Date.now },
  last_login_at: { type: Date },
  updated_at: { type: Date, default: Date.now },
  is_email_confirmed: { type: Boolean, default: false },
  confirmed_at: { type: Date },
});

UserSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
