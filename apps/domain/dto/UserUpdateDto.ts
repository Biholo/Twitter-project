import { Role } from "@domain/enum/Role";
import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const userUpdateSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
    roles: z.array(z.nativeEnum(Role)),
    isEmailConfirmed: z.boolean(),
    lastLoginAt: z.coerce.date(),
    username: z.string(),
    bio: z.string(),
    acceptNotifications: z.coerce.boolean(),
    profilePhoto: z.string(),
    bannerPhoto: z.string(),
    registrationDate: z.coerce.date(),
    confirmedAt: z.coerce.date(),
  })
  .partial();

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;

export type UserUpdateDto = Serialize<UserUpdateSchema>;