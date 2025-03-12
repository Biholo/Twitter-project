import { Serialize } from "@domain/types/Serialize";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export type LoginDto = Serialize<LoginSchema>;
