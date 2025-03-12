import { Role } from "@/domain/enum/Role";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: Role[];
  refreshToken?: string;
  isEmailConfirmed: boolean;
  confirmedAt?: Date;
  lastLoginAt?: Date;
  username: string;
  bio?: string;
  acceptNotifications: boolean;
  profilePhoto?: string;
  bannerPhoto?: string;
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
