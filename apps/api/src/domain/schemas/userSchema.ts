import { Role } from "@/domain/enum/Role";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.nativeEnum(Role)),
  isEmailConfirmed: z.boolean(),
  confirmedAt: z.date().optional(),
  lastLoginAt: z.date().optional(),
  username: z.string(),
  bio: z.string().optional(),
  acceptNotifications: z.boolean(),
  profilePhoto: z.string().optional(),
  bannerPhoto: z.string().optional(),
  registrationDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSchema = z.infer<typeof userSchema>;
