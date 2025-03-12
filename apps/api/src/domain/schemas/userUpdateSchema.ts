import { Role } from "@/domain/enum/Role";
import { z } from "zod";

export const userUpdateSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    roles: z.array(z.nativeEnum(Role)),
    isEmailConfirmed: z.boolean(),
    lastLoginAt: z.date(),
    username: z.string(),
    bio: z.string(),
    acceptNotifications: z.boolean(),
    profilePhoto: z.string(),
    bannerPhoto: z.string(),
    registrationDate: z.date(),
    confirmedAt: z.date(),
  })
  .partial();

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
