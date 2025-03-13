import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2).max(255),
  lastName: z.string().min(2).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export type RegisterDto = Serialize<RegisterSchema>;