import { z } from "zod";

export const passwordUpdateSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
});

export type PasswordUpdateSchema = z.infer<typeof passwordUpdateSchema>;
