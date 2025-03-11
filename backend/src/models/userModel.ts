import mongoose, { Schema, Document } from 'mongoose';
import { roles } from '@/config/role';

export interface IUser extends Document {
  // Champs originaux

  email: string;
  password: string;
  roles: string[];
  refresh_token?: string;
  is_email_confirmed: boolean;
  confirmed_at?: Date;
  last_login_at?: Date;
  
  // Nouveaux champs pour Twitter
  username: string;
  identifier_name: string;
  bio?: string;
  accept_notifications: boolean;
  profile_photo?: string;
  banner_photo?: string;
  registration_date: Date;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema({

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: roles, required: true },
  refresh_token: { type: String },
  is_email_confirmed: { type: Boolean, default: false },
  confirmed_at: { type: Date },
  last_login_at: { type: Date },
  
  // Nouveaux champs pour Twitter
  username: { type: String, required: true, unique: true },
  identifier_name: { type: String, required: true, unique: true },
  bio: { type: String, maxlength: 160 },
  accept_notifications: { type: Boolean, default: true },
  profile_photo: { type: String, default: null },
  banner_photo: { type: String, default: null },
  registration_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

UserSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
