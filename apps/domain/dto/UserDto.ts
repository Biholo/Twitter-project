import { Role } from "@domain/enum/Role";
import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.nativeEnum(Role)),
  isEmailConfirmed: z.coerce.boolean(),
  confirmedAt: z.coerce.date().optional(),
  lastLoginAt: z.coerce.date().optional(),
  username: z.string(),
  bio: z.string().optional(),
  acceptNotifications: z.coerce.boolean(),
  profilePhoto: z.string().optional(),
  bannerPhoto: z.string().optional(),
  registrationDate: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserSchema = z.infer<typeof userSchema>;

export type UserDto = Serialize<UserSchema>;
