import mongoose, { Schema, Document } from "mongoose";
import { Collection } from "@/domain/enum/Collection";
import { Role } from "@/domain/enum/Role";

export interface UserDocument extends Document {
  // Champs originaux
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: Role[];
  refreshToken?: string;
  isEmailConfirmed: boolean;
  confirmedAt?: Date;
  lastLoginAt?: Date;

  // Nouveaux champs pour Twitter
  username: string;
  bio?: string;
  acceptNotifications: boolean;
  profilePhoto?: string;
  bannerPhoto?: string;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    // Champs originaux
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: Role, required: true },
    refreshToken: { type: String },
    isEmailConfirmed: { type: Boolean, default: false },
    confirmedAt: { type: Date },
    lastLoginAt: { type: Date },

    // Nouveaux champs pour Twitter
    username: { type: String, required: true, unique: true },
    bio: { type: String, maxlength: 160 },
    acceptNotifications: { type: Boolean, default: true },
    profilePhoto: { type: String, default: null },
    bannerPhoto: { type: String, default: null },
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<UserDocument>(Collection.User, UserSchema);

export default UserModel;
